import type { DailyWeather, WeatherCondition } from '../types';

const CONDITION_EMOJI: Record<WeatherCondition, string> = {
  sunny: '☀️',
  partly_cloudy: '⛅',
  cloudy: '☁️',
  rain: '🌧️',
  light_snow: '🌨️',
  heavy_snow: '❄️',
  sleet: '🌧️',
  fog: '🌫️',
};

const CONDITION_LABEL: Record<WeatherCondition, string> = {
  sunny: '晴',
  partly_cloudy: '多云',
  cloudy: '阴',
  rain: '雨',
  light_snow: '小雪',
  heavy_snow: '大雪',
  sleet: '雨夹雪',
  fog: '雾',
};

export function getConditionEmoji(condition: WeatherCondition): string {
  return CONDITION_EMOJI[condition];
}

export function getConditionLabel(condition: WeatherCondition): string {
  return CONDITION_LABEL[condition];
}

// ---- QWeather response mapping ----

interface QWeatherDay {
  fxDate: string;
  tempMax: string;
  tempMin: string;
  iconDay: string;
  textDay: string;
  windDirDay: string;
  windScaleDay: string;
  windSpeedDay: string;
  humidity: string;
  precip: string;
  vis: string;
}

interface QWeatherResponse {
  code: string;
  daily: QWeatherDay[];
}

// Map QWeather icon codes to our WeatherCondition
function iconToCondition(iconCode: string, precip: number, tempLow: number): WeatherCondition {
  const code = parseInt(iconCode, 10);
  if (code === 100 || code === 150) return 'sunny';
  if (code === 101 || code === 102 || code === 103 || code === 151 || code === 152 || code === 153) {
    return 'partly_cloudy';
  }
  if (code === 104 || code === 154) return 'cloudy';
  if (code === 404 || code === 405 || code === 456 || code === 457) return 'sleet';
  if (code === 400 || code === 401 || code === 402 || code === 403 ||
      code === 406 || code === 407 || code === 408 || code === 409 ||
      code === 410 || code === 456 || code === 457) {
    return precip > 5 ? 'heavy_snow' : 'light_snow';
  }
  if (code >= 300 && code < 400) {
    return tempLow <= 0 ? 'sleet' : 'rain';
  }
  if (code >= 500 && code < 600) return 'fog';
  return 'partly_cloudy';
}

// Estimate snowfall from precipitation when temperature is below freezing
function estimateSnowfall(precip: number, tempLow: number): number {
  if (tempLow > 0) return 0;
  return Math.round(precip * 1.3 * 10) / 10;
}

export function mapQWeatherResponse(
  data: QWeatherResponse,
  _resortId: string,
): DailyWeather[] {
  if (!data.daily) return [];

  return data.daily.map((day) => {
    const tempHigh = parseInt(day.tempMax, 10);
    const tempLow = parseInt(day.tempMin, 10);
    const precip = parseFloat(day.precip) || 0;
    const snowfall = estimateSnowfall(precip, tempLow);
    const condition = iconToCondition(day.iconDay, precip, tempLow);

    return {
      date: day.fxDate,
      condition,
      tempHigh,
      tempLow,
      snowfall,
      snowDepth: 0,
      windSpeed: parseInt(day.windSpeedDay, 10) || 0,
      precipitation: precip,
      humidity: parseInt(day.humidity, 10) || 50,
      visibility: parseInt(day.vis, 10) || 10,
    };
  });
}
