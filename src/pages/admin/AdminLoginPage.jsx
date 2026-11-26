import { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { Lock, Mail, Eye, EyeOff, ShieldAlert, ArrowLeft, ArrowRight, ShieldCheck } from 'lucide-react';
import Logo from '../../components/common/Logo';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../components/common/Toast';
import { sanitizeAdminRedirect } from '../../utils/security';

export default function AdminLoginPage() {
  const { login, authError, isAuthenticated } = useAuth();
  const { addToast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const from = sanitizeAdminRedirect(location.state?.from?.pathname, '/admin');

  // Add noindex meta so search engines never index the admin login route
  useEffect(() => {
    const meta = document.createElement('meta');
    meta.name = 'robots';
    meta.content = 'noindex, nofollow';
    document.head.appendChild(meta);
    return () => {
      document.head.removeChild(meta);
    };
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, navigate, from]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email.trim() || !password) {
      return;
    }

    setIsLoading(true);
    const result = await login(email, password);
    setIsLoading(false);

    if (result.success) {
      addToast({ message: 'Signed in to Admin Portal.', type: 'success' });
      navigate(from, { replace: true });
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF7F3] flex flex-col justify-center items-center p-4 sm:p-6 relative overflow-hidden">
      {/* Top return link */}
      <div className="w-full max-w-md mb-6 flex items-center justify-between">
        <Link
          to="/"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#786B62] hover:text-[#F36B0A] transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Return to Storefront</span>
        </Link>
        <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-[#786B62] bg-white px-2.5 py-1 rounded-full border border-[#EAE2D9]">
          <ShieldCheck className="w-3.5 h-3.5 text-[#1EAA52]" />
          Protected Area
        </span>
      </div>

      {/* Login Card */}
      <div className="w-full max-w-md p-8 sm:p-10 bg-white border border-[#EAE2D9] shadow-xl rounded-2xl relative z-10 space-y-6">
        {/* Brand Header */}
        <div className="text-center space-y-3">
          <div className="inline-block">
            <Logo variant="dark" size="lg" />
          </div>
          <div>
            <h1 className="font-editorial text-2xl font-semibold text-[#24150F] tracking-tight">
              Admin Portal
            </h1>
            <p className="text-xs text-[#786B62] mt-1">
              Sign in with your authorized store manager account to manage catalog, ads, and enquiries.
            </p>
          </div>
        </div>

        {/* Error message */}
        {authError && (
          <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-start gap-2.5">
            <ShieldAlert className="w-4 h-4 shrink-0 text-rose-600 mt-0.5" />
            <span>{authError}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="admin-email"
              className="block text-xs font-bold uppercase text-[#24150F] mb-1"
            >
              Admin Email Address
            </label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#786B62]" />
              <input
                id="admin-email"
                type="email"
                autoComplete="username"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your admin email"
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-[#EAE2D9] text-sm focus:outline-none focus:border-[#F36B0A] transition-colors"
                required
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="admin-password"
              className="block text-xs font-bold uppercase text-[#24150F] mb-1"
            >
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#786B62]" />
              <input
                id="admin-password"
                type={showPassword ? 'text' : 'password'}
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                className="w-full pl-10 pr-12 py-3 rounded-xl border border-[#EAE2D9] text-sm focus:outline-none focus:border-[#F36B0A] transition-colors"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-[#786B62] hover:text-[#24150F]"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl bg-[#F36B0A] hover:bg-[#D94D00] text-white font-semibold text-sm shadow-sm transition-all disabled:opacity-60"
          >
            <span>{isLoading ? 'Verifying...' : 'Sign In to Dashboard'}</span>
            {!isLoading && <ArrowRight className="w-4 h-4" />}
          </button>
        </form>
      </div>
    </div>
  );
}
