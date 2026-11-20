import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

export default function SectionHeading({
  eyebrow,
  title,
  subtitle,
  actionLabel,
  actionTo,
  onActionClick,
  children,
  className = '',
}) {
  return (
    <div className={`border-b border-[#E8E3DA] pb-5 mb-8 sm:mb-10 flex flex-col md:flex-row md:items-end justify-between gap-4 ${className}`}>
      <div className="space-y-1.5 max-w-2xl">
        {eyebrow && (
          <span className="text-[10px] sm:text-[11px] uppercase tracking-ultra-caps text-[#B89358] font-semibold block">
            {eyebrow}
          </span>
        )}
        <h2 className="font-luxury-serif text-2xl sm:text-4xl font-light text-[#1C1815] tracking-tight">
          {title}
        </h2>
        {subtitle && (
          <p className="text-xs sm:text-sm text-[#7A7268] font-light leading-relaxed">
            {subtitle}
          </p>
        )}
      </div>

      <div className="flex items-center gap-3 self-start md:self-auto shrink-0">
        {children}

        {actionLabel && actionTo && (
          <Link
            to={actionTo}
            className="group inline-flex items-center gap-2 text-xs uppercase tracking-wide-caps font-semibold text-[#1C1815] hover:text-[#B89358] border-b border-[#1C1815] hover:border-[#B89358] pb-0.5 transition-all"
          >
            <span>{actionLabel}</span>
            <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
          </Link>
        )}

        {actionLabel && onActionClick && !actionTo && (
          <button
            type="button"
            onClick={onActionClick}
            className="group inline-flex items-center gap-2 text-xs uppercase tracking-wide-caps font-semibold text-[#1C1815] hover:text-[#B89358] border-b border-[#1C1815] hover:border-[#B89358] pb-0.5 transition-all"
          >
            <span>{actionLabel}</span>
            <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
          </button>
        )}
      </div>
    </div>
  );
}
