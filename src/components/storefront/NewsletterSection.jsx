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
    <section className="container-page mt-14 sm:mt-16 mb-16" aria-label="Newsletter Subscription">
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#F8EBDD] via-[#FFF3EA] to-[#F8EBDD] border border-[#F0DFD1] p-6 sm:p-10 shadow-sm">
        {/* Subtle decorative circles */}
        <div className="absolute -right-16 -top-16 w-48 h-48 rounded-full bg-[#F36B0A]/10 blur-2xl pointer-events-none" />
        <div className="absolute -left-16 -bottom-16 w-48 h-48 rounded-full bg-[#D94D00]/10 blur-2xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-8">
          {/* Left: Graphic and Text */}
          <div className="flex flex-col sm:flex-row items-center gap-5 text-center sm:text-left">
            <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl overflow-hidden shrink-0 shadow-md border-2 border-white">
              <img
                src="/images/stock/photo-1555041469-a586c61ea9bc.jpg"
                alt="Comfortable furniture"
                className="w-full h-full object-cover"
                loading="lazy"
              />
            </div>
            <div>
              <h3 className="text-xl sm:text-2xl font-bold text-[#24150F]">
                Stay Updated with Our Latest Offers
              </h3>
              <p className="text-sm text-[#82746B] mt-1 max-w-md">
                Get exclusive deals, new collection arrivals, and interior décor inspirations.
              </p>
            </div>
          </div>

          {/* Right: Email Input Form */}
          <div className="w-full lg:max-w-md">
            {submitted ? (
              <div className="flex items-center gap-2 text-emerald-700 bg-white/90 backdrop-blur-sm px-5 py-3 rounded-full border border-emerald-200">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                <span className="text-sm font-semibold">You're on the list! Welcome to Home &amp; More.</span>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row items-center gap-2 bg-white rounded-full p-1.5 border border-[#F0DFD1] shadow-sm">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email address"
                  className="w-full px-5 py-2.5 text-sm text-[#24150F] placeholder-[#82746B]/70 bg-transparent rounded-full focus:outline-none"
                  required
                />
                <button
                  type="submit"
                  className="w-full sm:w-auto shrink-0 flex items-center justify-center gap-2 bg-[#F36B0A] hover:bg-[#D94D00] text-white px-6 py-2.5 rounded-full text-sm font-semibold shadow-sm transition-all hover:shadow"
                >
                  <span>Subscribe</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
