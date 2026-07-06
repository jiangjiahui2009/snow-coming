import { useState, useEffect } from 'react';
import type { ResortWeatherResponse } from '../types';
import { fetchWeather } from '../api/weatherApi';

interface UseWeatherResult {
  weather: ResortWeatherResponse | null;
  loading: boolean;
  error: string | null;
}

export function useWeather(resortId: string | undefined): UseWeatherResult {
  const [weather, setWeather] = useState<ResortWeatherResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!resortId) {
      setLoading(false);
      setError('无效的雪场ID');
      return;
    }

    let cancelled = false;
    setLoading(true);
    setError(null);

    fetchWeather(resortId)
      .then((data) => {
        if (!cancelled) {
          setWeather(data);
          setLoading(false);
        }
      })
      .catch((err) => {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : '加载失败');
          setLoading(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [resortId]);

  return { weather, loading, error };
}
