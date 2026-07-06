// ---- Enums ----

export enum Region {
  Northeast = '东北',
  North = '华北',
  Northwest = '西北',
}

export type WeatherCondition =
  | 'sunny'
  | 'partly_cloudy'
  | 'cloudy'
  | 'rain'
  | 'light_snow'
  | 'heavy_snow'
  | 'sleet'
  | 'fog';

// ---- Resort Model ----

export interface SkiResort {
  id: string;
  name: string;
  nameEn: string;
  province: string;
  region: Region;
  altitude: {
    base: number;
    peak: number;
  };
  totalSlopes: number;
  totalLifts: number;
  description: string;
  website?: string;
  coordinates: {
    lat: number;
    lng: number;
  };
}

// ---- Weather Models ----

export interface DailyWeather {
  date: string;
  condition: WeatherCondition;
  tempHigh: number;
  tempLow: number;
  snowfall: number;
  snowDepth: number;
  windSpeed: number;
  precipitation: number;
  humidity: number;
  visibility: number;
}

export interface ResortWeatherResponse {
  resortId: string;
  forecast: DailyWeather[];
  generatedAt: string;
}
