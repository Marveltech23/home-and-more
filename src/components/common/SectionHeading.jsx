import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

export default function SectionHeading({
  title,
  subtitle,
  actionLabel,
  actionTo,
  onActionClick,
  children,
  className = '',
}) {
  return (
    <div className={`flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6 sm:mb-8 ${className}`}>
      <div className="flex items-center gap-3">
        {/* Orange Accent Bar */}
        <span className="w-1.5 h-6 sm:h-7 rounded-full bg-[#F36B0A] shrink-0" />
        <div>
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-[#24150F]">
            {title}
          </h2>
          {subtitle && (
            <p className="text-sm text-[#82746B] mt-0.5">{subtitle}</p>
          )}
        </div>
      </div>

      <div className="flex items-center gap-2 self-start sm:self-auto pl-4 sm:pl-0">
        {children}

        {actionLabel && actionTo && (
          <Link
            to={actionTo}
            className="group inline-flex items-center gap-1.5 text-sm font-semibold text-[#F36B0A] hover:text-[#D94D00] transition-colors"
          >
            <span>{actionLabel}</span>
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </Link>
        )}

        {actionLabel && onActionClick && !actionTo && (
          <button
            type="button"
            onClick={onActionClick}
            className="group inline-flex items-center gap-1.5 text-sm font-semibold text-[#F36B0A] hover:text-[#D94D00] transition-colors"
          >
            <span>{actionLabel}</span>
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </button>
        )}
      </div>
    </div>
  );
}
