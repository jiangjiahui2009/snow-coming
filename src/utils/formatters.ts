import { format, parseISO } from 'date-fns';
import { zhCN } from 'date-fns/locale';

export function formatDate(dateStr: string, fmt: string = 'M月d日'): string {
  return format(parseISO(dateStr), fmt, { locale: zhCN });
}

export function formatWeekday(dateStr: string): string {
  return format(parseISO(dateStr), 'EEE', { locale: zhCN });
}

export function formatTemp(temp: number): string {
  return `${temp > 0 ? '+' : ''}${temp}°C`;
}

