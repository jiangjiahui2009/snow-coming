import { upsertWeather, getAllResorts } from './db.js';
import { mapQWeatherResponse } from '../src/data/weather.js';

const QWEATHER_KEY = process.env.VITE_QWEATHER_KEY!;
const QWEATHER_HOST = process.env.VITE_QWEATHER_HOST || 'devapi.qweather.com';

export async function syncAllResorts(): Promise<number> {
  const resorts = getAllResorts() as Array<{
    id: string;
    lat: number;
    lng: number;
    name: string;
  }>;

  let total = 0;

  for (const resort of resorts) {
    try {
      const url = `https://${QWEATHER_HOST}/v7/weather/7d?location=${resort.lng},${resort.lat}&key=${QWEATHER_KEY}`;
      const res = await fetch(url);

      if (!res.ok) {
        console.error(`[Sync] ${resort.name} HTTP ${res.status}`);
        continue;
      }

      const data = await res.json();

      if (data.code !== '200') {
        console.error(`[Sync] ${resort.name} API error: ${data.code}`);
        continue;
      }

      const forecast = mapQWeatherResponse(data, resort.id);

      for (const day of forecast) {
        upsertWeather(
          resort.id,
          day.date,
          day.condition,
          day.tempHigh,
          day.tempLow,
          day.snowfall,
          day.snowDepth,
          day.windSpeed,
          day.precipitation,
          day.humidity,
          day.visibility,
        );
      }

      total += 1;
      console.log(`[Sync] ${resort.name} 完成`);
    } catch (err) {
      console.error(`[Sync] ${resort.name} 失败:`, err);
    }
  }

  console.log(`[Sync] 全部完成: ${total}/${resorts.length} 个雪场`);
  return total;
}
