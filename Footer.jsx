import { Link } from 'react-router-dom';
import Logo from '../common/Logo';
import { FacebookIcon, InstagramIcon, YouTubeIcon, WhatsAppIcon } from '../common/BrandIcons';
import { buildWhatsAppLink } from '../../utils/whatsapp';

const quickLinks = [
  { label: 'Home', to: '/' },
  { label: 'Shop', to: '/shop' },
  { label: 'About', to: '/about' },
  { label: 'Blog', to: '/blog' },
  { label: 'Contact', to: '/contact' },
];
// All service topics point to Contact until dedicated pages exist.
const services = ['Delivery', 'Returns', 'Support', 'FAQs'];

export default function Footer({ settings }) {
  const social = [
    { label: 'Facebook', href: settings.social.facebook, Icon: FacebookIcon },
    { label: 'Instagram', href: settings.social.instagram, Icon: InstagramIcon },
    { label: 'YouTube', href: settings.social.youtube, Icon: YouTubeIcon },
    { label: 'WhatsApp', href: buildWhatsAppLink(settings.whatsappNumber, 'Hello Home & More Furniture'), Icon: WhatsAppIcon },
  ];
  const linkCls = 'text-sm text-white/85 hover:text-brand';

  return (
    <footer className="relative overflow-hidden bg-ink text-white">
      <div className="pointer-events-none absolute -bottom-24 -left-24 h-64 w-64 rounded-full bg-brand/40 blur-3xl" aria-hidden="true" />
      <div className="pointer-events-none absolute -right-20 -top-10 h-72 w-40 rotate-12 rounded-full bg-gradient-to-b from-brand to-brand-deep opacity-70 blur-2xl" aria-hidden="true" />

      <div className="container-page relative grid gap-10 py-12 sm:grid-cols-2 lg:grid-cols-[1.3fr_1fr_1fr_1fr]">
        <div>
          <Logo tone="light" />
          <p className="mt-3 text-sm">{settings.slogan}</p>
        </div>
        <nav aria-label="Quick links">
          <h3 className="mb-3 font-semibold">Quick Links</h3>
          <ul className="space-y-2">
            {quickLinks.map((l) => (
              <li key={l.to}><Link to={l.to} className={linkCls}>{l.label}</Link></li>
            ))}
          </ul>
        </nav>
        <nav aria-label="Our services">
          <h3 className="mb-3 font-semibold">Our Services</h3>
          <ul className="space-y-2">
            {services.map((s) => (
              <li key={s}><Link to="/contact" className={linkCls}>{s}</Link></li>
            ))}
          </ul>
        </nav>
        <div>
          <h3 className="mb-3 font-semibold">Follow Us</h3>
          <ul className="flex gap-3">
            {social.map(({ label, href, Icon }) => (
              <li key={label}>
                <a href={href} target="_blank" rel="noreferrer" aria-label={label} className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 transition hover:bg-brand">
                  <Icon className="h-5 w-5" />
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="relative border-t border-white/10 bg-black/25">
        <div className="container-page flex flex-col items-center justify-between gap-2 py-4 text-xs text-white/85 sm:flex-row">
          <p>© {new Date().getFullYear()} {settings.businessName}. All rights reserved.</p>
          <p className="flex items-center gap-3">
            <Link to="/privacy-policy" className="hover:text-brand">Privacy Policy</Link>
            <span className="h-3 w-px bg-white/40" />
            <Link to="/terms" className="hover:text-brand">Terms &amp; Conditions</Link>
          </p>
        </div>
      </div>
    </footer>
  );
}
