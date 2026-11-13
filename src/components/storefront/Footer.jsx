import { Link } from 'react-router-dom';
import Logo from '../common/Logo';
import { FacebookIcon, InstagramIcon, YouTubeIcon, WhatsAppIcon } from '../common/BrandIcons';
import { useStore } from '../../context/StoreContext';
import { buildWhatsAppLink } from '../../utils/whatsapp';

const quickLinks = [
  { label: 'Home', to: '/' },
  { label: 'Shop', to: '/shop' },
  { label: 'About', to: '/about' },
  { label: 'Blog', to: '/blog' },
  { label: 'Contact', to: '/contact' },
];

const services = [
  { label: 'Delivery Information', to: '/contact' },
  { label: 'Returns & Exchanges', to: '/contact' },
  { label: 'Dedicated Support', to: '/contact' },
  { label: 'Frequently Asked Questions', to: '/contact' },
];

export default function Footer({ settings: propSettings }) {
  const { settings: contextSettings } = useStore();
  const settings = propSettings || contextSettings;

  const social = [
    { label: 'Facebook', href: settings.social?.facebook || '#', Icon: FacebookIcon },
    { label: 'Instagram', href: settings.social?.instagram || '#', Icon: InstagramIcon },
    { label: 'YouTube', href: settings.social?.youtube || '#', Icon: YouTubeIcon },
    {
      label: 'WhatsApp',
      href: buildWhatsAppLink(settings.whatsappNumber, 'Hello Home & More Furniture'),
      Icon: WhatsAppIcon,
    },
  ];

  return (
    <footer className="relative overflow-hidden bg-[#29160D] text-white pt-16">
      {/* Top curved wave decoration */}
      <div className="absolute top-0 left-0 right-0 h-10 bg-gradient-to-b from-[#FFFAF5] to-transparent pointer-events-none opacity-10" />

      {/* Decorative ambient glowing radial gradients */}
      <div
        className="pointer-events-none absolute -bottom-24 -left-24 h-80 w-80 rounded-full bg-[#F36B0A]/20 blur-3xl"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute -right-20 -top-10 h-72 w-56 rounded-full bg-gradient-to-b from-[#F36B0A]/25 to-[#D94D00]/20 blur-3xl"
        aria-hidden="true"
      />

      <div className="container-page relative z-10 grid gap-10 pb-14 sm:grid-cols-2 lg:grid-cols-4">
        {/* Brand identity column */}
        <div className="space-y-4">
          <Logo variant="light" size="lg" />
          <p className="text-white/75 text-sm font-light leading-relaxed max-w-sm">
            {settings.slogan}
          </p>
          <p className="text-xs text-white/50 leading-relaxed">
            Abuja showroom &amp; nationwide delivery across Nigeria. Handcrafted luxury living designed to inspire.
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="text-base font-bold text-white mb-4 tracking-wide">Quick Links</h3>
          <ul className="space-y-2.5">
            {quickLinks.map((l) => (
              <li key={l.to}>
                <Link
                  to={l.to}
                  className="text-sm text-white/80 hover:text-[#F36B0A] hover:translate-x-1 inline-block transition-all"
                >
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Our Services */}
        <div>
          <h3 className="text-base font-bold text-white mb-4 tracking-wide">Our Services</h3>
          <ul className="space-y-2.5">
            {services.map((s) => (
              <li key={s.label}>
                <Link
                  to={s.to}
                  className="text-sm text-white/80 hover:text-[#F36B0A] hover:translate-x-1 inline-block transition-all"
                >
                  {s.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Follow Us */}
        <div>
          <h3 className="text-base font-bold text-white mb-4 tracking-wide">Follow Us</h3>
          <p className="text-xs text-white/70 mb-4">
            Join our community for styling inspirations and exclusive promotions.
          </p>
          <ul className="flex items-center gap-3">
            {social.map(({ label, href, Icon }) => (
              <li key={label}>
                <a
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white transition-all hover:bg-[#F36B0A] hover:text-white hover:scale-110 shadow-sm"
                >
                  <Icon className="h-5 w-5 fill-current" />
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="relative z-10 border-t border-white/10 bg-black/30 py-5">
        <div className="container-page flex flex-col items-center justify-between gap-3 text-xs text-white/70 sm:flex-row">
          <p>© 2026 {settings.businessName}. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <Link to="/about" className="hover:text-[#F36B0A] transition-colors">
              Privacy Policy
            </Link>
            <span className="h-3 w-px bg-white/30" />
            <Link to="/contact" className="hover:text-[#F36B0A] transition-colors">
              Terms &amp; Conditions
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
