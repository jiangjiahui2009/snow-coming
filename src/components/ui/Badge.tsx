interface BadgeProps {
  label: string;
  className?: string;
}

export default function Badge({ label, className = 'bg-slate-100 text-slate-600' }: BadgeProps) {
  return (
    <span className={`inline-block px-2 py-0.5 text-xs font-medium rounded-full ${className}`}>
      {label}
    </span>
  );
}
