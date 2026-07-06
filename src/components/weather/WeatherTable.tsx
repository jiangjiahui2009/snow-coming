import type { DailyWeather } from '../../types';
import { getConditionEmoji, getConditionLabel } from '../../data/weather';
import { formatDate, formatWeekday, formatTemp } from '../../utils/formatters';

interface WeatherTableProps {
  forecast: DailyWeather[];
}

export default function WeatherTable({ forecast }: WeatherTableProps) {
  return (
    <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
      <div className="px-4 py-3 border-b border-slate-100">
        <h2 className="text-lg font-semibold text-slate-800">7日详细预报</h2>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-slate-50">
              <th scope="col" className="text-left px-4 py-2.5 text-xs font-medium text-slate-500 whitespace-nowrap sticky left-0 bg-slate-50 z-10">
                日期
              </th>
              <th scope="col" className="text-center px-3 py-2.5 text-xs font-medium text-slate-500 whitespace-nowrap">
                天气
              </th>
              <th scope="col" className="text-center px-3 py-2.5 text-xs font-medium text-slate-500 whitespace-nowrap">
                最高温
              </th>
              <th scope="col" className="text-center px-3 py-2.5 text-xs font-medium text-slate-500 whitespace-nowrap">
                最低温
              </th>
              <th scope="col" className="text-center px-3 py-2.5 text-xs font-medium text-slate-500 whitespace-nowrap">
                降雪量
              </th>
              <th scope="col" className="text-center px-3 py-2.5 text-xs font-medium text-slate-500 whitespace-nowrap">
                积雪深度
              </th>
              <th scope="col" className="text-center px-3 py-2.5 text-xs font-medium text-slate-500 whitespace-nowrap">
                风速
              </th>
            </tr>
          </thead>
          <tbody>
            {forecast.map((day, i) => (
              <tr key={day.date} className={i % 2 === 0 ? 'bg-white' : 'bg-slate-50/50'}>
                <td className="px-4 py-2.5 whitespace-nowrap sticky left-0 bg-inherit z-10">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-slate-700">
                      {formatDate(day.date)}
                    </span>
                    <span className="text-xs text-slate-400">
                      {formatWeekday(day.date)}
                    </span>
                  </div>
                </td>
                <td className="text-center px-3 py-2.5 whitespace-nowrap">
                  <span className="mr-1">{getConditionEmoji(day.condition)}</span>
                  <span className="text-slate-600">{getConditionLabel(day.condition)}</span>
                </td>
                <td className="text-center px-3 py-2.5 whitespace-nowrap">
                  <span className="text-red-500 font-medium">{formatTemp(day.tempHigh)}</span>
                </td>
                <td className="text-center px-3 py-2.5 whitespace-nowrap">
                  <span className="text-blue-500 font-medium">{formatTemp(day.tempLow)}</span>
                </td>
                <td className="text-center px-3 py-2.5 whitespace-nowrap">
                  {day.snowfall > 0 ? (
                    <span className="text-sky-600 font-semibold">{day.snowfall} cm</span>
                  ) : (
                    <span className="text-slate-300">—</span>
                  )}
                </td>
                <td className="text-center px-3 py-2.5 whitespace-nowrap">
                  <span className="text-slate-600">{day.snowDepth} cm</span>
                </td>
                <td className="text-center px-3 py-2.5 whitespace-nowrap">
                  <span className="text-slate-600">{day.windSpeed} km/h</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
