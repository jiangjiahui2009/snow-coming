import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useResortContext } from '../../context/ResortContext';
import { useAllWeather } from '../../hooks/useAllWeather';
import { getConditionEmoji } from '../../data/weather';
import { formatDate, formatWeekday, formatTemp } from '../../utils/formatters';
import { REGION_COLORS } from '../../utils/constants';
import Badge from '../ui/Badge';
import EmptyState from '../ui/EmptyState';

type ForecastDays = 7 | 15 | 30;

export default function ResortTable() {
  const { filteredResorts, provinces, selectedProvince, setSelectedProvince, loading: resortsLoading } = useResortContext();
  const { weatherMap, loading: weatherLoading, error } = useAllWeather();
  const [days, setDays] = useState<ForecastDays>(7);

  // Generate dates for selected range
  const dates = useMemo(() => {
    const result: string[] = [];
    const d = new Date();
    for (let i = 0; i < days; i++) {
      result.push(d.toISOString().split('T')[0]);
      d.setDate(d.getDate() + 1);
    }
    return result;
  }, [days]);

  if (resortsLoading || weatherLoading) {
    return (
      <div className="bg-white rounded-2xl shadow-sm overflow-hidden animate-pulse">
        <div className="h-96 bg-slate-100" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-2xl p-6 text-center">
        <p className="text-red-600 text-sm">{error}</p>
      </div>
    );
  }

  if (filteredResorts.length === 0) {
    return <EmptyState />;
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
      {/* Toggle */}
      <div className="px-4 py-3 border-b border-slate-100 flex items-center gap-1">
        <span className="text-xs text-slate-400 mr-2">预报天数</span>
        {([7, 15, 30] as const).map((n) => (
          <button
            key={n}
            onClick={() => setDays(n)}
            className={`px-3 py-1 text-xs rounded-md transition-colors cursor-pointer ${
              days === n
                ? 'bg-sky-500 text-white'
                : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
            }`}
          >
            {n}天
          </button>
        ))}
        {days > 7 && (
          <span className="ml-2 text-[11px] text-orange-500">
            开发者（雪友）会在雪季期间，购买15日、30日的天气查询接口
          </span>
        )}
      </div>

      <div className="overflow-x-auto">
        <table className="text-sm border-collapse table-fixed" style={{ width: 124 + dates.length * 52 + 56 + 56 + 56 + 56 }}>
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200">
              <th
                scope="col"
                className="text-left px-4 py-1.5 text-xs font-medium text-slate-500 sticky left-0 bg-slate-50 z-10 w-[124px]"
              >
                <select
                  value={selectedProvince || ''}
                  onChange={(e) => setSelectedProvince(e.target.value || null)}
                  className="w-full bg-transparent border border-transparent rounded pl-0 pr-1.5 py-0.5 text-xs text-slate-700 focus:outline-none focus:ring-0 cursor-pointer"
                >
                  <option value="">雪场</option>
                  {provinces.map((p) => (
                    <option key={p} value={p}>
                      {p}
                    </option>
                  ))}
                </select>
              </th>
              {dates.map((date) => {
                const dayOfWeek = new Date(date).getDay();
                const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
                return (
                <th
                  key={date}
                  scope="col"
                  className={`text-center px-0 py-1.5 text-[11px] w-[52px] ${
                    isWeekend ? 'bg-slate-100 font-semibold text-slate-700' : 'font-medium text-slate-500'
                  }`}
                >
                  <div>{formatDate(date, 'M/d')}</div>
                  <div className={`text-[10px] ${
                    isWeekend ? 'text-slate-600 font-medium' : 'text-slate-400 font-normal'
                  }`}>
                    {formatWeekday(date)}
                  </div>
                </th>
                );
              })}
              <th
                scope="col"
                className="text-center px-1 py-1.5 text-[11px] font-medium text-slate-500 w-[56px]"
              >
                <div>{days}日</div>
                <div className="text-[10px] text-slate-400 font-normal">平均气温</div>
              </th>
              <th
                scope="col"
                className="text-center px-1 py-1.5 text-[11px] font-medium text-slate-500 w-[56px]"
              >
                <div>{days}日</div>
                <div className="text-[10px] text-slate-400 font-normal">降雪量</div>
              </th>
              <th
                scope="col"
                className="text-center px-1 py-1.5 text-[11px] font-medium text-slate-500 w-[56px]"
              >
                <div className="text-[10px] text-slate-400 font-normal"><span className="font-semibold text-slate-600">开放</span><br/>雪道数</div>
              </th>
              <th
                scope="col"
                className="text-center px-1 py-1.5 text-[11px] font-medium text-slate-500 w-[56px]"
              >
                <div className="text-[10px] text-slate-400 font-normal"><span className="font-semibold text-slate-600">雪道</span><br/>积雪厚度</div>
              </th>
            </tr>
          </thead>
          <tbody>
            {filteredResorts.map((resort) => {
              const weather = weatherMap.get(resort.id);
              return (
                <tr
                  key={resort.id}
                  className="border-b border-slate-100 hover:bg-sky-50/30 transition-colors"
                >
                  <td className="px-4 py-1.5 sticky left-0 bg-white z-10">
                    <Link
                      to={`/resort/${resort.id}`}
                      className="no-underline"
                    >
                      <div className="font-medium text-slate-800 text-[13px]">
                        {resort.name}
                      </div>
                      <div className="flex items-center gap-1.5 mt-0.5">
                        <Badge
                          label={resort.province}
                          className={`text-[10px] px-1.5 py-0 ${REGION_COLORS[resort.region]}`}
                        />
                        <span className="text-[10px] text-slate-400">
                          {Math.round(resort.altitude.base)}m起
                        </span>
                      </div>
                    </Link>
                  </td>
                  {dates.map((date) => {
                    const day = weather?.forecast.find((d) => d.date === date);
                    const isWeekend = new Date(date).getDay() % 6 === 0;
                    if (!day) {
                      return (
                        <td key={date} className={`text-center px-0 py-1.5 ${isWeekend ? 'bg-slate-50' : ''}`}>
                          <div className="text-xl leading-none mb-1.5 text-slate-200">
                            —
                          </div>
                          <div className="text-[10px] text-slate-300 leading-tight">
                            —
                          </div>
                        </td>
                      );
                    }
                    return (
                      <td
                        key={day.date}
                        className={`text-center px-0 py-1.5 ${day.snowfall > 0 || day.condition === 'sleet' ? 'bg-amber-100' : isWeekend ? 'bg-slate-50' : ''}`}
                      >
                        <div className="text-xl leading-none mb-1.5">
                          {getConditionEmoji(day.condition)}
                        </div>
                        <div className="text-[10px] text-slate-400 leading-tight">
                          {formatTemp(Math.round((day.tempHigh + day.tempLow) / 2))}
                        </div>
                      </td>
                    );
                  })}
                  {weather && (() => {
                    const f = weather.forecast;
                    const avgHigh = Math.round(f.reduce((s, d) => s + d.tempHigh, 0) / f.length);
                    const avgLow = Math.round(f.reduce((s, d) => s + d.tempLow, 0) / f.length);
                    const totalSnow = Math.round(f.reduce((s, d) => s + d.snowfall, 0) * 10) / 10;
                    return (
                      <>
                        <td className="text-center px-1 py-1.5 bg-slate-50">
                          <div className="text-[11px] font-medium text-slate-700 leading-tight">
                            H {avgHigh}°
                          </div>
                          <div className="text-[11px] text-slate-400 leading-tight">
                            L {avgLow}°
                          </div>
                        </td>
                        <td className="text-center px-1 py-1.5 bg-slate-50">
                          <div className="text-[11px] font-medium text-slate-700 leading-tight">
                            {totalSnow > 0 ? `${totalSnow}cm` : '—'}
                          </div>
                        </td>
                        <td className="text-center px-1 py-1.5 bg-slate-50">
                          <div className="text-[11px] font-medium text-slate-700 leading-tight">
                            -/-
                          </div>
                        </td>
                        <td className="text-center px-1 py-1.5 bg-slate-50">
                          <div className="text-[11px] font-medium text-slate-700 leading-tight">
                            {(() => {
                              const maxDepth = Math.max(...f.map(d => d.snowDepth));
                              return maxDepth > 0 ? `${maxDepth}cm` : '—';
                            })()}
                          </div>
                        </td>
                      </>
                    );
                  })()}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
