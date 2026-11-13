import { Link } from 'react-router-dom';

export default function Logo({ variant = 'dark', className = '', size = 'md' }) {
  const isLight = variant === 'light'; // Light text for dark backgrounds (footer, admin sidebar)

  const iconSizes = {
    sm: 'w-7 h-7',
    md: 'w-9 h-9',
    lg: 'w-11 h-11',
  };

  const textSizes = {
    sm: { main: 'text-base', sub: 'text-[9px]' },
    md: { main: 'text-xl', sub: 'text-[11px]' },
    lg: { main: 'text-2xl', sub: 'text-[13px]' },
  };

  return (
    <Link to="/" className={`inline-flex items-center gap-2.5 group select-none ${className}`}>
      {/* Brand House Icon */}
      <div className={`${iconSizes[size]} shrink-0 relative flex items-center justify-center rounded-xl bg-gradient-to-br from-[#F36B0A] to-[#D94D00] shadow-sm text-white`}>
        <svg viewBox="0 0 24 24" fill="currentColor" className="w-5/6 h-5/6">
          {/* Stylized Roof and Chimney */}
          <path d="M12 2.5L2 10.5h3v9.5c0 .55.45 1 1 1h4v-6h4v6h4c.55 0 1-.45 1-1v-9.5h3L12 2.5z" />
        </svg>
      </div>

      <div className="flex flex-col leading-none">
        <span
          className={`font-bold tracking-tight transition-colors ${
            textSizes[size].main
          } ${isLight ? 'text-white' : 'text-[#29160D]'}`}
        >
          Home &amp; More
        </span>
        <span
          className={`font-semibold tracking-[0.28em] uppercase ${
            textSizes[size].sub
          } ${isLight ? 'text-white/70' : 'text-[#82746B]'}`}
        >
          FURNITURE
        </span>
      </div>
    </Link>
  );
}
