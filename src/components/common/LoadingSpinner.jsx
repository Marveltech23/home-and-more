import { Loader2 } from 'lucide-react';

export default function LoadingSpinner({ label = 'Loading...', size = 'md', className = '' }) {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
  };

  return (
    <div className={`flex flex-col items-center justify-center py-12 gap-3 text-center ${className}`}>
      <Loader2 className={`${sizeClasses[size]} animate-spin text-[#F36B0A]`} />
      {label && <p className="text-sm font-medium text-[#82746B]">{label}</p>}
    </div>
  );
}
