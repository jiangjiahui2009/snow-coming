import { useState, useEffect } from 'react';
import type { ResortWeatherResponse } from '../types';
import { fetchAllWeather } from '../api/weatherApi';

interface UseAllWeatherResult {
  weatherMap: Map<string, ResortWeatherResponse>;
  loading: boolean;
  error: string | null;
}

export function useAllWeather(): UseAllWeatherResult {
  const [weatherMap, setWeatherMap] = useState<Map<string, ResortWeatherResponse>>(new Map());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    fetchAllWeather()
      .then((data) => {
        if (cancelled) return;
        const map = new Map<string, ResortWeatherResponse>();
        for (const item of data) {
          map.set(item.resortId, item);
        }
        setWeatherMap(map);
        setLoading(false);
      })
      .catch((err) => {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : '加载失败');
          setLoading(false);
        }
      });

    return () => { cancelled = true; };
  }, []);

  return { weatherMap, loading, error };
}
