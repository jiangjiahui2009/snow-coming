import { Link, useLocation } from 'react-router-dom';

export default function Header() {
  const { pathname } = useLocation();

  const navLink = (to: string, label: string) => {
    const active = pathname === to || (to === '/' && pathname.startsWith('/resort'));
    return (
      <Link
        to={to}
        className={`text-sm transition-colors no-underline pb-1 border-b-2 ${
          active
            ? 'text-sky-600 font-semibold border-sky-500'
            : 'text-slate-400 hover:text-sky-500 border-transparent'
        }`}
      >
        {label}
      </Link>
    );
  };

  return (
    <header className="sticky top-0 z-50 backdrop-blur-md bg-white/80 border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 h-14 flex items-center gap-6">
        <Link to="/" className="flex items-center gap-2 text-lg font-bold text-slate-800 no-underline shrink-0">
          <img src="/icon.png" alt="snow coming" className="w-7 h-7 object-contain" />
          <span className="text-sm sm:text-lg">snow coming</span>
        </Link>
        <nav className="flex items-center gap-4 ml-[10px] mt-1">
          {navLink('/', '天气')}
          {navLink('/map', '云图')}
        </nav>
      </div>
    </header>
  );
}