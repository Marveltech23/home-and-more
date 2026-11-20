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
      message: 'You have been enrolled in the private atelier lookbook.',
      type: 'success',
    });
    setEmail('');
  };

  return (
    <section className="container-page mt-16 sm:mt-24 mb-20" aria-label="Atelier Gazette">
      <div className="bg-[#EFECE6] border border-[#E8E3DA] p-8 sm:p-14 text-[#1C1815]">
        <div className="max-w-4xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8">
          
          {/* Narrative */}
          <div className="space-y-2 text-center md:text-left max-w-lg">
            <span className="text-[10px] uppercase tracking-ultra-caps text-[#B89358] font-bold block">
              PRIVATE LOOKBOOK SUBSCRIPTION
            </span>
            <h3 className="font-luxury-serif text-2xl sm:text-4xl font-light tracking-tight">
              The Seasonal Atelier Gazette
            </h3>
            <p className="text-xs text-[#7A7268] font-light leading-relaxed">
              Receive private previews of new joinery arrivals, material swatch releases, and invitations to private showroom exhibitions in Gwarinpa, Abuja.
            </p>
          </div>

          {/* Form */}
          <div className="w-full md:max-w-sm">
            {submitted ? (
              <div className="flex items-center gap-2.5 p-4 bg-white border border-[#E8E3DA] text-xs">
                <CheckCircle2 className="w-4 h-4 text-[#2e7d32] shrink-0" />
                <span className="font-medium">Welcome to the Home &amp; More private client registry.</span>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-2">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email address"
                  className="flex-1 px-4 py-3 bg-white border border-[#E8E3DA] text-xs focus:outline-none focus:border-[#1C1815] placeholder-[#9A9185]"
                  required
                />
                <button
                  type="submit"
                  className="btn-primary text-xs tracking-wide-caps py-3 px-5 shrink-0"
                >
                  <span>Subscribe</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </form>
            )}
          </div>

        </div>
      </div>
    </section>
  );
}
