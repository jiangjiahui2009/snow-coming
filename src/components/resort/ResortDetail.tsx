import type { SkiResort } from '../../types';
import { REGION_COLORS } from '../../utils/constants';
import Badge from '../ui/Badge';

interface ResortDetailProps {
  resort: SkiResort;
}

export default function ResortDetail({ resort }: ResortDetailProps) {
  const verticalDrop = resort.altitude.peak - resort.altitude.base;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-800">{resort.name}</h1>
        <p className="text-slate-400 text-sm mt-0.5">{resort.nameEn}</p>
        <div className="flex items-center gap-2 mt-2">
          <Badge label={resort.province} className={REGION_COLORS[resort.region]} />
          <Badge label={resort.region} />
        </div>
        <p className="text-slate-600 text-sm mt-4 leading-relaxed">
          {resort.description}
        </p>
        {resort.website && (
          <a
            href={resort.website}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 mt-3 text-xs text-sky-500 hover:text-sky-600 transition-colors"
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
            官方网站
          </a>
        )}
      </div>
      <div className="grid grid-cols-2 gap-3 content-start">
        <Stat label="海拔" value={`${resort.altitude.base}m - ${resort.altitude.peak}m`} />
        <Stat label="垂直落差" value={`${verticalDrop}m`} />
        <Stat label="雪道数量" value={`${resort.totalSlopes} 条`} />
        <Stat label="缆车数量" value={`${resort.totalLifts} 条`} />
      </div>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-slate-50 rounded-xl p-3">
      <p className="text-xs text-slate-400">{label}</p>
      <p className="text-sm font-semibold text-slate-700 mt-0.5">{value}</p>
    </div>
  );
}
