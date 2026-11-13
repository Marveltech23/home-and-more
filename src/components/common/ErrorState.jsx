import { AlertCircle, RefreshCw } from 'lucide-react';

export default function ErrorState({
  title = 'Something went wrong',
  message = 'We encountered an error loading this section. Please try again.',
  onRetry,
  className = '',
}) {
  return (
    <div className={`card p-8 text-center max-w-md mx-auto my-8 flex flex-col items-center justify-center ${className}`}>
      <div className="w-12 h-12 rounded-full bg-red-50 text-red-500 flex items-center justify-center mb-4">
        <AlertCircle className="w-6 h-6" />
      </div>
      <h3 className="text-lg font-bold text-[#24150F] mb-1">{title}</h3>
      <p className="text-sm text-[#82746B] mb-6">{message}</p>
      {onRetry && (
        <button
          type="button"
          onClick={onRetry}
          className="btn-primary text-sm py-2 px-5"
        >
          <RefreshCw className="w-4 h-4 mr-1.5" />
          Try Again
        </button>
      )}
    </div>
  );
}
