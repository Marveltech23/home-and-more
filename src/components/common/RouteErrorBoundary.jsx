import { useRouteError, isRouteErrorResponse, Link } from 'react-router-dom';
import { AlertTriangle, RefreshCw, Home, ArrowLeft } from 'lucide-react';
import Logo from './Logo';

export default function RouteErrorBoundary() {
  const error = useRouteError();

  let errorMessage = 'An unexpected error occurred while loading this page.';
  let errorStatus = 500;

  if (isRouteErrorResponse(error)) {
    errorStatus = error.status;
    errorMessage = error.statusText || error.data?.message || errorMessage;
  } else if (error instanceof Error) {
    errorMessage = error.message;
  }

  const handleReload = () => {
    window.location.reload();
  };

  return (
    <div className="min-h-screen bg-[#FFFAF5] flex flex-col justify-between p-6">
      <div className="w-full max-w-5xl mx-auto py-4">
        <Logo size="md" />
      </div>

      <div className="flex-1 flex items-center justify-center py-12">
        <div className="w-full max-w-lg bg-white rounded-3xl p-8 sm:p-10 border border-[#F0DFD1] shadow-xl text-center space-y-6">
          <div className="w-16 h-16 rounded-2xl bg-amber-50 text-[#F36B0A] flex items-center justify-center mx-auto shadow-inner">
            <AlertTriangle className="w-8 h-8" />
          </div>

          <div className="space-y-2">
            <span className="text-xs font-bold uppercase tracking-widest text-[#F36B0A]">
              Application Notice ({errorStatus})
            </span>
            <h1 className="text-2xl font-extrabold text-[#24150F] tracking-tight">
              Oops! Something went wrong
            </h1>
            <p className="text-sm text-[#82746B] leading-relaxed max-w-md mx-auto">
              {errorMessage}
            </p>
          </div>

          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              type="button"
              onClick={handleReload}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-[#F36B0A] text-white font-bold text-xs uppercase tracking-wider hover:bg-[#D94D00] shadow-md transition-all"
            >
              <RefreshCw className="w-4 h-4" />
              <span>Refresh Page</span>
            </button>

            <Link
              to="/"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-[#FFFAF5] text-[#24150F] border border-[#F0DFD1] font-bold text-xs uppercase tracking-wider hover:border-[#F36B0A] hover:text-[#F36B0A] transition-all"
            >
              <Home className="w-4 h-4" />
              <span>Back to Storefront</span>
            </Link>
          </div>
        </div>
      </div>

      <div className="text-center text-xs text-[#82746B]/60 py-4">
        Home &amp; More Furniture • Abuja Showroom
      </div>
    </div>
  );
}
