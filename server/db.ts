import Database from 'better-sqlite3';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { resorts as resortData } from '../src/data/resorts.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DB_PATH = path.join(__dirname, '..', 'data.db');

const db = new Database(DB_PATH);

// Enable WAL mode for better concurrent reads
db.pragma('journal_mode = WAL');

export function initDB(): void {
  db.exec(`
    CREATE TABLE IF NOT EXISTS resorts (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      name_en TEXT NOT NULL,
      province TEXT NOT NULL,
      region TEXT NOT NULL,
      altitude_base INTEGER NOT NULL,
      altitude_peak INTEGER NOT NULL,
      total_slopes INTEGER NOT NULL,
      total_lifts INTEGER NOT NULL,
      description TEXT NOT NULL,
      lat REAL NOT NULL,
      lng REAL NOT NULL
    );

    CREATE TABLE IF NOT EXISTS weather (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      resort_id TEXT NOT NULL REFERENCES resorts(id),
      date TEXT NOT NULL,
      condition TEXT NOT NULL,
      temp_high INTEGER NOT NULL,
      temp_low INTEGER NOT NULL,
      snowfall REAL NOT NULL DEFAULT 0,
      snow_depth INTEGER NOT NULL DEFAULT 0,
      wind_speed INTEGER NOT NULL,
      precipitation REAL NOT NULL DEFAULT 0,
      humidity INTEGER NOT NULL,
      visibility REAL NOT NULL DEFAULT 10,
      fetched_at TEXT NOT NULL,
      UNIQUE(resort_id, date)
    );
  `);

  // Seed resorts if empty
  const count = db.prepare('SELECT COUNT(*) as c FROM resorts').get() as { c: number };
  if (count.c === 0) {
    const insert = db.prepare(`
      INSERT OR IGNORE INTO resorts
        (id, name, name_en, province, region, altitude_base, altitude_peak,
         total_slopes, total_lifts, description, lat, lng)
      VALUES
        (@id, @name, @nameEn, @province, @region, @altitudeBase, @altitudePeak,
         @totalSlopes, @totalLifts, @description, @lat, @lng)
    `);

    const tx = db.transaction(() => {
      for (const r of resortData) {
        insert.run({
          id: r.id,
          name: r.name,
          nameEn: r.nameEn,
          province: r.province,
          region: r.region,
          altitudeBase: r.altitude.base,
          altitudePeak: r.altitude.peak,
          totalSlopes: r.totalSlopes,
          totalLifts: r.totalLifts,
          description: r.description,
          lat: r.coordinates.lat,
          lng: r.coordinates.lng,
        });
      }
    });
    tx();
    console.log(`[DB] 已导入 ${resortData.length} 个雪场`);
  }
}

// Export typed query helpers
export function getAllResorts() {
  return db.prepare('SELECT * FROM resorts').all();
}

export function getResortById(id: string) {
  return db.prepare('SELECT * FROM resorts WHERE id = ?').get(id);
}

export function getWeatherByResortId(resortId: string) {
  return db
    .prepare('SELECT * FROM weather WHERE resort_id = ? ORDER BY date ASC')
    .all(resortId);
}

export function getAllWeather() {
  return db.prepare('SELECT * FROM weather ORDER BY resort_id, date ASC').all();
}

export function upsertWeather(
  resortId: string,
  date: string,
  condition: string,
  tempHigh: number,
  tempLow: number,
  snowfall: number,
  snowDepth: number,
  windSpeed: number,
  precipitation: number,
  humidity: number,
  visibility: number,
): void {
  db.prepare(`
    INSERT INTO weather (resort_id, date, condition, temp_high, temp_low,
      snowfall, snow_depth, wind_speed, precipitation, humidity, visibility, fetched_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    ON CONFLICT(resort_id, date) DO UPDATE SET
      condition = excluded.condition,
      temp_high = excluded.temp_high,
      temp_low = excluded.temp_low,
      snowfall = excluded.snowfall,
      snow_depth = excluded.snow_depth,
      wind_speed = excluded.wind_speed,
      precipitation = excluded.precipitation,
      humidity = excluded.humidity,
      visibility = excluded.visibility,
      fetched_at = excluded.fetched_at
  `).run(
    resortId, date, condition, tempHigh, tempLow,
    snowfall, snowDepth, windSpeed, precipitation, humidity, visibility,
    new Date().toISOString(),
  );
}

export function getLastSyncTime(): string | null {
  const row = db.prepare(
    'SELECT MAX(fetched_at) as t FROM weather',
  ).get() as { t: string | null };
  return row?.t || null;
}

export default db;
