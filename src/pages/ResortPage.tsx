import { useParams, Link } from 'react-router-dom';
import { useResortContext } from '../context/ResortContext';
import { useWeather } from '../hooks/useWeather';
import { DetailSkeleton } from '../components/ui/Loading';
import ResortDetail from '../components/resort/ResortDetail';
import WeatherChart from '../components/weather/WeatherChart';
import WeatherTable from '../components/weather/WeatherTable';

export default function ResortPage() {
  const { id } = useParams<{ id: string }>();
  const { resorts, loading: resortsLoading } = useResortContext();
  const { weather, loading: weatherLoading, error: weatherError } = useWeather(id);

  if (resortsLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <DetailSkeleton />
      </div>
    );
  }

  const resort = resorts.find((r) => r.id === id);

  if (!resort) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8 text-center">
        <span className="text-5xl block mb-4">🏔️</span>
        <h1 className="text-xl font-bold text-slate-700">雪场不存在</h1>
        <p className="text-slate-400 text-sm mt-1">未找到该雪场的信息</p>
        <Link
          to="/"
          className="inline-block mt-4 text-sky-500 hover:text-sky-600 text-sm font-medium"
        >
          ← 返回列表
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Back link */}
      <Link
        to="/"
        className="inline-flex items-center gap-1 text-sm text-slate-400 hover:text-sky-500 transition-colors mb-6"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        返回列表
      </Link>

      {/* Resort info */}
      <ResortDetail resort={resort} />

      {/* Weather section */}
      <div className="mt-8 space-y-6">
        {weatherLoading ? (
          <div className="bg-white rounded-2xl p-4 animate-pulse">
            <div className="h-64 bg-slate-100 rounded-xl" />
          </div>
        ) : weatherError ? (
          <div className="bg-red-50 border border-red-200 rounded-2xl p-6 text-center">
            <p className="text-red-600 text-sm">{weatherError}</p>
            <button
              onClick={() => window.location.reload()}
              className="mt-2 px-4 py-1.5 text-sm bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors cursor-pointer"
            >
              重新加载
            </button>
          </div>
        ) : weather ? (
          <>
            <WeatherChart forecast={weather.forecast} />
            <WeatherTable forecast={weather.forecast} />
          </>
        ) : null}
      </div>
    </div>
  );
}
