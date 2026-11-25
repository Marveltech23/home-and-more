import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

export default function SectionHeading({
  title,
  subtitle,
  eyebrow,
  actionLabel,
  actionTo,
  onActionClick,
  align = 'left', // 'left' | 'center'
  children,
  className = '',
}) {
  if (align === 'center') {
    return (
      <div className={`text-center max-w-2xl mx-auto mb-8 sm:mb-10 space-y-2 ${className}`}>
        {eyebrow && (
          <span className="inline-block text-[11px] font-semibold uppercase tracking-[0.2em] text-[#F36B0A]">
            {eyebrow}
          </span>
        )}
        <h2 className="font-editorial text-2xl sm:text-3xl lg:text-4xl font-semibold tracking-tight text-[#24150F]">
          {title}
        </h2>
        {subtitle && (
          <p className="text-sm text-[#786B62] leading-relaxed">{subtitle}</p>
        )}
        {(actionLabel || children) && (
          <div className="pt-2 flex items-center justify-center gap-3 flex-wrap">
            {children}
            {actionLabel && actionTo && (
              <Link
                to={actionTo}
                className="group inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-[#F36B0A] hover:text-[#D94D00] underline underline-offset-4 decoration-[#F36B0A]/40 hover:decoration-[#D94D00] transition-colors"
              >
                <span>{actionLabel}</span>
                <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
              </Link>
            )}
            {actionLabel && onActionClick && !actionTo && (
              <button
                type="button"
                onClick={onActionClick}
                className="group inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-[#F36B0A] hover:text-[#D94D00] underline underline-offset-4 decoration-[#F36B0A]/40 hover:decoration-[#D94D00] transition-colors"
              >
                <span>{actionLabel}</span>
                <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
              </button>
            )}
          </div>
        )}
      </div>
    );
  }

  return (
    <div className={`flex flex-col sm:flex-row sm:items-end justify-between gap-3 mb-7 sm:mb-9 ${className}`}>
      <div className="space-y-1">
        {eyebrow && (
          <span className="inline-block text-[11px] font-semibold uppercase tracking-[0.2em] text-[#F36B0A]">
            {eyebrow}
          </span>
        )}
        <div className="flex items-center gap-3">
          <span className="w-1 h-6 sm:h-7 rounded-full bg-[#F36B0A] shrink-0" />
          <h2 className="font-editorial text-2xl sm:text-3xl font-semibold tracking-tight text-[#24150F]">
            {title}
          </h2>
        </div>
        {subtitle && (
          <p className="text-sm text-[#786B62] pl-4">{subtitle}</p>
        )}
      </div>

      <div className="flex items-center gap-3 self-start sm:self-auto pl-4 sm:pl-0">
        {children}

        {actionLabel && actionTo && (
          <Link
            to={actionTo}
            className="group inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-[#F36B0A] hover:text-[#D94D00] underline underline-offset-4 decoration-[#F36B0A]/40 hover:decoration-[#D94D00] transition-colors"
          >
            <span>{actionLabel}</span>
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </Link>
        )}

        {actionLabel && onActionClick && !actionTo && (
          <button
            type="button"
            onClick={onActionClick}
            className="group inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-[#F36B0A] hover:text-[#D94D00] underline underline-offset-4 decoration-[#F36B0A]/40 hover:decoration-[#D94D00] transition-colors"
          >
            <span>{actionLabel}</span>
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </button>
        )}
      </div>
    </div>
  );
}
