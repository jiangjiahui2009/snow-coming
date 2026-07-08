import { useState, useRef, useEffect } from 'react';
import { resorts } from '../data/resorts';

const LAYERS: { key: string; label: string }[] = [
  { key: 'snowAccu', label: '新雪' },
  { key: 'clouds', label: '云图' },
  { key: 'rain', label: '降水' },
  { key: 'fog', label: '雾' },
  { key: 'wind', label: '风' },
];

export default function MapPage() {
  const [layer, setLayer] = useState('snowAccu');
  const [resortId, setResortId] = useState(resorts[0].id);
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const resort = resorts.find((r) => r.id === resortId) || resorts[0];
  const iframeKey = `${resort.coordinates.lat}-${resort.coordinates.lng}-${layer}`;

  return (
    <div className="max-w-7xl mx-auto px-4 py-4">
      {/* Top bar */}
      <div className="flex items-center gap-2 mb-3">
        <div className="relative" ref={ref}>
          <button
            onClick={() => setOpen(!open)}
            className="bg-slate-100 rounded-full px-3 py-1.5 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-sky-400 cursor-pointer flex items-center gap-1"
          >
            {resort.province} · {resort.name}
            <svg className={`w-3 h-3 text-slate-400 transition-transform ${open ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
          {open && (
            <div className="absolute top-full left-0 mt-1 bg-white rounded-xl shadow-lg border border-slate-200 py-1 max-h-64 overflow-auto z-50 min-w-[200px]">
              {resorts.map((r) => (
                <button
                  key={r.id}
                  onClick={() => { setResortId(r.id); setOpen(false); }}
                  className={`block w-full text-left px-4 py-2 text-sm transition-colors cursor-pointer ${
                    r.id === resortId
                      ? 'bg-sky-50 text-sky-600 font-medium'
                      : 'text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  {r.province} · {r.name}
                </button>
              ))}
            </div>
          )}
        </div>

        <span className="text-[11px] text-slate-300">|</span>

        {LAYERS.map(({ key, label }) => (
          <button
            key={key}
            onClick={() => setLayer(key)}
            className={`px-3 py-1 text-xs rounded-full transition-colors cursor-pointer shrink-0 ${
              layer === key
                ? 'bg-sky-500 text-white'
                : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Map */}
      <div className="bg-white rounded-2xl shadow-sm overflow-hidden" style={{ height: 'calc(100vh - 120px)' }}>
        <iframe
          key={iframeKey}
          title="Windy 天气地图"
          src={`https://embed.windy.com/embed2.html?lat=${resort.coordinates.lat}&lon=${resort.coordinates.lng}&zoom=10&level=surface&overlay=${layer}&menu=&message=&marker=&calendar=&pressure=&type=map&location=coordinates&metricWind=default&metricTemp=default&radarRange=-1`}
          className="w-full h-full border-0"
        />
      </div>
    </div>
  );
}