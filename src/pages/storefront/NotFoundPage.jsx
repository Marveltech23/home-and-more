import { Link } from 'react-router-dom';
import { Home, ArrowLeft } from 'lucide-react';
import SEO from '../../components/common/SEO';

export default function NotFoundPage() {
  return (
    <div className="container-page py-24 text-center">
      <SEO title="Page Not Found" description="The page you requested could not be found." />
      <div className="max-w-md mx-auto space-y-6">
        <div className="text-7xl font-extrabold text-[#F36B0A] tracking-tighter">
          404
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-[#24150F]">
          Page Not Found
        </h1>
        <p className="text-sm text-[#82746B] leading-relaxed">
          The page you are looking for may have been moved, renamed, or is temporarily unavailable. Let's get you back to modern living.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <Link to="/" className="btn-primary text-xs py-2.5 px-6 flex items-center gap-2">
            <Home className="w-4 h-4" />
            <span>Return Home</span>
          </Link>
          <Link to="/shop" className="btn-secondary text-xs py-2.5 px-6">
            Explore Furniture
          </Link>
        </div>
      </div>
    </div>
  );
}
