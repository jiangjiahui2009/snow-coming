import { Link } from 'react-router-dom';

export default function Header() {
  return (
    <header className="sticky top-0 z-50 backdrop-blur-md bg-white/80 border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 h-14 flex items-center">
        <Link to="/" className="flex items-center gap-2 text-lg font-bold text-slate-800 no-underline shrink-0">
          <img src="/icon.png" alt="snow coming" className="w-7 h-7 object-contain" />
          <span className="text-sm sm:text-lg">snow coming</span>
        </Link>
      </div>
    </header>
  );
}