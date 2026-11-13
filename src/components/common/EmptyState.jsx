import { PackageOpen } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function EmptyState({
  title = 'No items found',
  message = 'There are no items matching your criteria at this time.',
  icon: Icon = PackageOpen,
  actionLabel,
  actionTo,
  onActionClick,
  className = '',
}) {
  return (
    <div className={`card p-10 text-center max-w-md mx-auto my-8 flex flex-col items-center justify-center ${className}`}>
      <div className="w-14 h-14 rounded-2xl bg-[#F8EBDD] text-[#F36B0A] flex items-center justify-center mb-4">
        <Icon className="w-7 h-7" />
      </div>
      <h3 className="text-lg font-bold text-[#24150F] mb-1.5">{title}</h3>
      <p className="text-sm text-[#82746B] mb-6 max-w-sm">{message}</p>

      {actionLabel && actionTo && (
        <Link to={actionTo} className="btn-primary text-sm py-2 px-5">
          {actionLabel}
        </Link>
      )}

      {actionLabel && onActionClick && !actionTo && (
        <button type="button" onClick={onActionClick} className="btn-primary text-sm py-2 px-5">
          {actionLabel}
        </button>
      )}
    </div>
  );
}
