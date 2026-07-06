interface EmptyStateProps {
  message?: string;
  suggestion?: string;
  onReset?: () => void;
}

export default function EmptyState({
  message = '没有找到匹配的滑雪场',
  suggestion = '试试调整筛选条件或搜索关键词',
  onReset,
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <span className="text-5xl mb-4">🏔️</span>
      <p className="text-lg text-slate-600 font-medium">{message}</p>
      <p className="text-sm text-slate-400 mt-1">{suggestion}</p>
      {onReset && (
        <button
          onClick={onReset}
          className="mt-4 px-4 py-2 text-sm bg-sky-500 text-white rounded-lg hover:bg-sky-600 transition-colors cursor-pointer"
        >
          重置筛选
        </button>
      )}
    </div>
  );
}
