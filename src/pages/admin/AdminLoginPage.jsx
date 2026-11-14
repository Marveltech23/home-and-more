import { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { Lock, Mail, Eye, EyeOff, ShieldAlert, ArrowLeft, ArrowRight, KeyRound } from 'lucide-react';
import Logo from '../../components/common/Logo';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../components/common/Toast';

export default function AdminLoginPage() {
  const { login, authError, defaultAdminEmail, defaultAdminPassword } = useAuth();
  const { addToast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const from = location.state?.from?.pathname || '/admin';

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) {
      return;
    }

    setIsLoading(true);
    const result = await login(email, password);
    setIsLoading(false);

    if (result.success) {
      addToast({ message: 'Welcome back, Super Admin!', type: 'success' });
      navigate(from, { replace: true });
    }
  };

  const handleAutofill = () => {
    setEmail(defaultAdminEmail);
    setPassword(defaultAdminPassword);
  };

  return (
    <div className="min-h-screen bg-[#FFFAF5] flex flex-col justify-center items-center p-4 sm:p-6 relative overflow-hidden">
      {/* Ambient background glows */}
      <div className="absolute -top-32 -right-32 w-96 h-96 rounded-full bg-[#F36B0A]/10 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-32 -left-32 w-96 h-96 rounded-full bg-[#29160D]/10 blur-3xl pointer-events-none" />

      {/* Top return link */}
      <div className="w-full max-w-md mb-6 flex items-center justify-between">
        <Link
          to="/"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#82746B] hover:text-[#F36B0A] transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Return to Storefront</span>
        </Link>
        <span className="text-[11px] font-bold text-[#82746B] bg-white px-2.5 py-1 rounded-full border border-[#F0DFD1]">
          Protected Area
        </span>
      </div>

      {/* Login Card */}
      <div className="w-full max-w-md card p-8 sm:p-10 bg-white border border-[#F0DFD1] shadow-2xl rounded-3xl relative z-10 space-y-6">
        {/* Brand Header */}
        <div className="text-center space-y-3">
          <div className="inline-block">
            <Logo variant="dark" size="lg" />
          </div>
          <div>
            <h1 className="text-2xl font-extrabold text-[#24150F] tracking-tight">
              Admin Portal
            </h1>
            <p className="text-xs text-[#82746B] mt-1">
              Sign in with your authorized store manager credentials to manage catalog, ads, and orders.
            </p>
          </div>
        </div>

        {/* Demo Credentials Info Pill */}
        <div className="p-3.5 rounded-2xl bg-[#FFF3EA] border border-[#F36B0A]/25 space-y-1.5">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#F36B0A] flex items-center gap-1">
              <KeyRound className="w-3.5 h-3.5" />
              Admin Credentials:
            </span>
            <button
              type="button"
              onClick={handleAutofill}
              className="text-[11px] font-bold text-[#F36B0A] hover:underline"
            >
              Auto-fill demo
            </button>
          </div>
          <p className="text-xs text-[#24150F] font-mono">
            Email: <span className="font-semibold">{defaultAdminEmail}</span>
          </p>
          <p className="text-xs text-[#24150F] font-mono">
            Password: <span className="font-semibold">{defaultAdminPassword}</span>
          </p>
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
            <label className="block text-xs font-bold uppercase text-[#24150F] mb-1">
              Admin Email Address
            </label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#82746B]" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@homeandmore.ng"
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-[#F0DFD1] text-xs sm:text-sm focus:outline-none focus:border-[#F36B0A] bg-[#FFFAF5]/40"
                required
                autoComplete="email"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase text-[#24150F] mb-1">
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#82746B]" />
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-10 pr-10 py-3 rounded-xl border border-[#F0DFD1] text-xs sm:text-sm focus:outline-none focus:border-[#F36B0A] bg-[#FFFAF5]/40"
                required
                autoComplete="current-password"
              />
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#82746B] hover:text-[#24150F]"
                aria-label="Toggle password visibility"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full btn-primary text-sm py-3.5 flex items-center justify-center gap-2 shadow-lg shadow-orange-500/25 mt-2"
          >
            <span>{isLoading ? 'Verifying...' : 'Sign In to Dashboard'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="pt-4 border-t border-[#F0DFD1] text-center">
          <p className="text-[11px] text-[#82746B]">
            Only registered Home &amp; More administrators may access this portal. Customer storefront browsing does not require login.
          </p>
        </div>
      </div>
    </div>
  );
}
