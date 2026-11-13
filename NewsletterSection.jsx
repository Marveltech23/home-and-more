import { useState } from 'react';
import { ArrowRight } from 'lucide-react';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * UI only. No newsletter provider or Supabase table is connected yet, so submitting does NOT store the email.
 * To connect: add features/newsletter/newsletter.service.js and call it from onSubmit.
 */
export default function NewsletterSection() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState(null);

  const onSubmit = (e) => {
    e.preventDefault();
    if (!EMAIL_RE.test(email.trim())) {
      setMessage({ tone: 'error', text: 'Please enter a valid email address.' });
      return;
    }
    setMessage({ tone: 'info', text: 'Newsletter sign-up is not connected yet, so your email was not saved.' });
  };

  return (
    <section className="mt-12 bg-gradient-to-r from-[#fbe4cc] via-beige to-[#fbeee0]">
      <div className="container-page flex flex-col items-center gap-5 py-8 lg:flex-row lg:justify-between">
        <div className="text-center lg:text-left">
          <h2 className="text-xl font-semibold text-ink sm:text-2xl">Stay Updated with Our Latest Offers</h2>
          <p className="mt-1 text-sm text-ink/80">Get exclusive deals and home décor inspirations.</p>
        </div>
        <div className="w-full max-w-xl">
          <form onSubmit={onSubmit} noValidate className="flex rounded-full border border-line bg-white p-1.5 shadow-card">
            <label htmlFor="newsletter-email" className="sr-only">Email address</label>
            <input
              id="newsletter-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email address"
              className="min-w-0 flex-1 bg-transparent px-4 text-sm text-ink placeholder:text-ink/50 focus:outline-none"
            />
            <button type="submit" className="flex items-center gap-2 rounded-full bg-gradient-to-r from-brand to-brand-deep px-5 py-2.5 text-sm font-semibold text-white hover:brightness-110">
              Subscribe <ArrowRight className="h-4 w-4" />
            </button>
          </form>
          {message && (
            <p role="status" className={`mt-2 px-4 text-xs ${message.tone === 'error' ? 'text-red-600' : 'text-ink/70'}`}>
              {message.text}
            </p>
          )}
        </div>
      </div>
    </section>
  );
}
