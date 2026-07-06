import type { SkiResort, ResortWeatherResponse } from '../types';
import { resorts } from '../data/resorts';

const API_BASE = '/api';

export async function fetchResortList(): Promise<SkiResort[]> {
  // Static data, no need for backend call
  return resorts;
}

export async function fetchWeather(
  resortId: string,
): Promise<ResortWeatherResponse> {
  const res = await fetch(`${API_BASE}/resorts/${resortId}/weather`);

  if (!res.ok) {
    throw new Error(`获取天气失败: ${res.status}`);
  }

  return res.json();
}

export async function fetchAllWeather(): Promise<ResortWeatherResponse[]> {
  const res = await fetch(`${API_BASE}/weather`);

  if (!res.ok) {
    throw new Error(`获取天气失败: ${res.status}`);
  }

  return res.json();
}