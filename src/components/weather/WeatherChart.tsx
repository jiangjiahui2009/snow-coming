import {
  ComposedChart,
  Line,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Legend,
} from 'recharts';
import type { DailyWeather } from '../../types';
import { formatDate, formatTemp } from '../../utils/formatters';
import { getConditionEmoji } from '../../data/weather';

interface WeatherChartProps {
  forecast: DailyWeather[];
}

export default function WeatherChart({ forecast }: WeatherChartProps) {
  const data = forecast.map((d) => ({
    ...d,
    label: formatDate(d.date, 'M/d'),
    emoji: getConditionEmoji(d.condition),
  }));

  return (
    <div className="bg-white rounded-2xl p-4 shadow-sm">
      <h2 className="text-lg font-semibold text-slate-800 mb-4">7日天气趋势</h2>
      <ResponsiveContainer width="100%" height={300}>
        <ComposedChart data={data} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
          <XAxis
            dataKey="label"
            tick={{ fontSize: 11, fill: '#94a3b8' }}
            tickLine={false}
            axisLine={false}
          />
          <YAxis
            yAxisId="temp"
            orientation="left"
            tick={{ fontSize: 11, fill: '#94a3b8' }}
            tickLine={false}
            axisLine={false}
            tickFormatter={(v: number) => `${v}°`}
            domain={['dataMin - 5', 'dataMax + 5']}
          />
          <YAxis
            yAxisId="snow"
            orientation="right"
            tick={{ fontSize: 11, fill: '#94a3b8' }}
            tickLine={false}
            axisLine={false}
            tickFormatter={(v: number) => `${v}cm`}
          />
          <Tooltip
            contentStyle={{
              borderRadius: 12,
              border: '1px solid #e2e8f0',
              fontSize: 12,
            }}
            formatter={(value: number, name: string) => {
              if (name === '最高温' || name === '最低温') return [formatTemp(value), name];
              if (name === '降雪量') return [`${value} cm`, name];
              return [value, name];
            }}
            labelFormatter={(label, payload) => {
              const item = payload?.[0]?.payload;
              return item ? `${item.label} ${item.emoji || ''}` : label;
            }}
          />
          <Legend iconType="rect" wrapperStyle={{ fontSize: 12 }} />
          <Bar
            yAxisId="snow"
            dataKey="snowfall"
            name="降雪量"
            fill="#7dd3fc"
            radius={[4, 4, 0, 0]}
            barSize={16}
          />
          <Line
            yAxisId="temp"
            type="monotone"
            dataKey="tempHigh"
            name="最高温"
            stroke="#f87171"
            strokeWidth={2}
            dot={false}
          />
          <Line
            yAxisId="temp"
            type="monotone"
            dataKey="tempLow"
            name="最低温"
            stroke="#60a5fa"
            strokeWidth={2}
            dot={false}
          />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
}
