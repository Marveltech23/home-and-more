import { useState } from 'react';
import { ArrowRight, CheckCircle2 } from 'lucide-react';
import { useToast } from '../common/Toast';

export default function NewsletterSection() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const { addToast } = useToast();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email || !email.includes('@')) {
      addToast({ message: 'Please enter a valid email address', type: 'error' });
      return;
    }
    setSubmitted(true);
    addToast({
      message: 'Thank you for subscribing! Check your inbox soon.',
      type: 'success',
    });
    setEmail('');
  };

  return (
    <section className="container-page py-12 sm:py-14" aria-label="Newsletter Subscription">
      <div className="rounded-2xl bg-white border border-[#EAE2D9] p-7 sm:p-10 flex flex-col lg:flex-row items-center justify-between gap-6">
        <div className="text-center lg:text-left space-y-1.5 max-w-lg">
          <span className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#F36B0A]">
            Showroom Updates
          </span>
          <h3 className="font-editorial text-2xl sm:text-3xl font-semibold text-[#24150F]">
            New Arrivals &amp; Private Offers
          </h3>
          <p className="text-xs sm:text-sm text-[#786B62]">
            Receive seasonal furniture releases, showroom previews, and interior styling guides directly in your inbox.
          </p>
        </div>

        <div className="w-full lg:max-w-md">
          {submitted ? (
            <div className="flex items-center justify-center gap-2 text-emerald-700 bg-emerald-50 px-5 py-3.5 rounded-full border border-emerald-200">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
              <span className="text-sm font-semibold">Welcome to the Home &amp; More list!</span>
            </div>
          ) : (
            <form
              onSubmit={handleSubmit}
              className="flex flex-col sm:flex-row items-center gap-2 bg-[#FAF7F3] rounded-full p-1.5 border border-[#EAE2D9]"
            >
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email address"
                className="w-full px-5 py-2.5 text-sm text-[#24150F] placeholder-[#786B62] bg-transparent rounded-full focus:outline-none"
                required
              />
              <button
                type="submit"
                className="w-full sm:w-auto shrink-0 flex items-center justify-center gap-2 bg-[#F36B0A] hover:bg-[#D94D00] text-white px-6 py-2.5 rounded-full text-xs sm:text-sm font-semibold transition-all"
              >
                <span>Subscribe</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}
