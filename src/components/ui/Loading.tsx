export function CardSkeleton() {
  return (
    <div className="bg-white rounded-2xl overflow-hidden shadow-sm animate-pulse">
      <div className="h-36 bg-slate-200" />
      <div className="p-4 space-y-3">
        <div className="h-5 bg-slate-200 rounded w-2/3" />
        <div className="h-4 bg-slate-100 rounded w-1/3" />
        <div className="flex gap-2 mt-3">
          <div className="h-4 w-10 bg-slate-100 rounded" />
          <div className="h-4 w-10 bg-slate-100 rounded" />
          <div className="h-4 w-10 bg-slate-100 rounded" />
        </div>
      </div>
    </div>
  );
}

export function CardGridSkeleton({ count = 8 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {Array.from({ length: count }, (_, i) => (
        <CardSkeleton key={i} />
      ))}
    </div>
  );
}

export function DetailSkeleton() {
  return (
    <div className="space-y-8 animate-pulse">
      <div className="h-6 bg-slate-200 rounded w-24" />
      <div className="space-y-3">
        <div className="h-8 bg-slate-200 rounded w-1/2" />
        <div className="h-4 bg-slate-100 rounded w-1/4" />
        <div className="h-4 bg-slate-100 rounded w-3/4" />
      </div>
      <div className="h-64 bg-slate-200 rounded-2xl" />
      <div className="h-48 bg-slate-100 rounded-2xl" />
    </div>
  );
}
