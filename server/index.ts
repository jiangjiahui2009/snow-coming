import express from 'express';
import cors from 'cors';
import { initDB, getResortById, getWeatherByResortId, getAllWeather, getLastSyncTime } from './db.js';
import { startScheduler } from './scheduler.js';
import { syncAllResorts } from './sync.js';

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// Helper: get today's date in local timezone
function getTodayStr(): string {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

// ---- API Routes ----

// Resort weather
app.get('/api/resorts/:id/weather', (req, res) => {
  const resort = getResortById(req.params.id);
  if (!resort) {
    res.status(404).json({ error: '雪场不存在' });
    return;
  }

  const weatherRows = getWeatherByResortId(req.params.id) as Array<Record<string, unknown>>;
  const today = getTodayStr();
  const futureRows = weatherRows.filter((row) => row.date as string >= today);
  const forecast = futureRows.map((row) => ({
    date: row.date,
    condition: row.condition,
    tempHigh: row.temp_high,
    tempLow: row.temp_low,
    snowfall: row.snowfall,
    snowDepth: row.snow_depth,
    windSpeed: row.wind_speed,
    precipitation: row.precipitation,
    humidity: row.humidity,
    visibility: row.visibility,
  }));

  res.json({
    resortId: req.params.id,
    forecast,
    generatedAt: getLastSyncTime(),
  });
});

// All weather (for homepage)
app.get('/api/weather', (_req, res) => {
  const rows = getAllWeather() as Array<Record<string, unknown>>;
  const today = getTodayStr();

  // Group by resort_id, filter out past dates
  const grouped: Record<string, Array<Record<string, unknown>>> = {};
  for (const row of rows) {
    if ((row.date as string) < today) continue;
    const rid = row.resort_id as string;
    if (!grouped[rid]) grouped[rid] = [];
    grouped[rid].push({
      date: row.date,
      condition: row.condition,
      tempHigh: row.temp_high,
      tempLow: row.temp_low,
      snowfall: row.snowfall,
      snowDepth: row.snow_depth,
      windSpeed: row.wind_speed,
      precipitation: row.precipitation,
      humidity: row.humidity,
      visibility: row.visibility,
    });
  }

  const result = Object.entries(grouped).map(([resortId, forecast]) => ({
    resortId,
    forecast,
    generatedAt: getLastSyncTime(),
  }));

  res.json(result);
});

// Manual sync trigger (waits for completion)
app.post('/api/sync', async (_req, res) => {
  try {
    const count = await syncAllResorts();
    console.log(`[API] 手动同步完成: ${count} 个雪场`);
    res.json({ status: 'ok', count });
  } catch (err) {
    console.error('[API] 手动同步失败:', err);
    res.status(500).json({ status: 'error', message: String(err) });
  }
});

// ---- Start ----

initDB();
startScheduler();

app.listen(PORT, () => {
  console.log(`[Server] snow coming 后端已启动: http://localhost:${PORT}`);
});
