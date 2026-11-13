export default function Badge({
  children,
  variant = 'default',
  size = 'md',
  className = '',
}) {
  const variants = {
    default: 'bg-[#F8EBDD] text-[#82746B] border-[#F0DFD1]',
    published: 'bg-emerald-50 text-emerald-700 border-emerald-200/70',
    success: 'bg-emerald-50 text-emerald-700 border-emerald-200/70',
    draft: 'bg-amber-50 text-amber-700 border-amber-200/70',
    warning: 'bg-amber-50 text-amber-700 border-amber-200/70',
    danger: 'bg-rose-50 text-rose-700 border-rose-200/70',
    inactive: 'bg-stone-100 text-stone-600 border-stone-200',
    brand: 'bg-[#FFF3EA] text-[#F36B0A] border-[#F36B0A]/30',
    orange: 'bg-[#F36B0A] text-white border-transparent',
  };

  const sizes = {
    sm: 'text-[11px] px-2 py-0.5',
    md: 'text-xs px-2.5 py-0.5',
    lg: 'text-sm px-3 py-1',
  };

  return (
    <span
      className={`inline-flex items-center font-medium rounded-full border ${
        variants[variant] || variants.default
      } ${sizes[size] || sizes.md} ${className}`}
    >
      {children}
    </span>
  );
}
