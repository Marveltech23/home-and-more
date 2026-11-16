import { Link } from 'react-router-dom';
import { MapPin, Building2, Phone, Mail, ArrowUpRight } from 'lucide-react';
import Logo from '../common/Logo';
import { FacebookIcon, InstagramIcon, YouTubeIcon, WhatsAppIcon } from '../common/BrandIcons';
import { useStore } from '../../context/StoreContext';
import { buildWhatsAppLink } from '../../utils/whatsapp';

const quickLinks = [
  { label: 'Home', to: '/' },
  { label: 'Shop All Products', to: '/shop' },
  { label: 'About Us', to: '/about' },
  { label: 'Interior Blog', to: '/blog' },
  { label: 'Contact Us', to: '/contact' },
];

const featuredCategories = [
  { label: 'Sofa sets', to: '/category/sofa-sets' },
  { label: 'Office furniture', to: '/category/office-furniture' },
  { label: 'Dining sets', to: '/category/dining-sets' },
  { label: 'Bedroom sets', to: '/category/bedroom-sets' },
  { label: 'Kitchen cabinets', to: '/category/kitchen-cabinets' },
  { label: 'Tiles', to: '/category/tiles' },
];

export default function Footer({ settings: propSettings }) {
  const { settings: contextSettings } = useStore();
  const settings = propSettings || contextSettings;

  const phoneDisplay = settings.phone || '+234 803 351 3144';
  const whatsappNum = settings.whatsappNumber || '+2348033513144';
  const emailDisplay = settings.email || 'Homeandmorefurnitures@gmail.com';
  const showroomAddr =
    settings.showroomAddress ||
    settings.address ||
    '204 Pa Michael Imoudu Ave, 32 Cres, 3rd Avenue Gwarinpa, 900108, Abuja, Nigeria';
  const factoryAddr = settings.factoryAddress || 'Plot D10 Zauda Pazeri Dei-Dei, Abuja';

  const whatsAppLink = buildWhatsAppLink(
    whatsappNum,
    'Hello Home & More Furniture, I am browsing your website and would like to make an enquiry.'
  );

  const social = [
    { label: 'Facebook', href: settings.social?.facebook || 'https://facebook.com/homeandmorefurniture', Icon: FacebookIcon },
    { label: 'Instagram', href: settings.social?.instagram || 'https://instagram.com/homeandmorefurniture', Icon: InstagramIcon },
    { label: 'YouTube', href: settings.social?.youtube || 'https://youtube.com/@homeandmorefurniture', Icon: YouTubeIcon },
    {
      label: 'WhatsApp',
      href: whatsAppLink,
      Icon: WhatsAppIcon,
    },
  ];

  return (
    <footer className="relative overflow-hidden bg-[#24130A] text-white pt-16">
      {/* Top subtle border/accent */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[#F36B0A]/40 to-transparent" />

      {/* Decorative ambient glowing radial gradients */}
      <div
        className="pointer-events-none absolute -bottom-24 -left-24 h-80 w-80 rounded-full bg-[#F36B0A]/15 blur-3xl"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute -right-20 -top-10 h-72 w-56 rounded-full bg-[#F36B0A]/20 blur-3xl"
        aria-hidden="true"
      />

      <div className="container-page relative z-10 grid gap-10 pb-14 sm:grid-cols-2 lg:grid-cols-12">
        {/* Brand identity column (4 cols) */}
        <div className="lg:col-span-4 space-y-4">
          <Logo variant="light" size="lg" />
          <p className="text-white/80 text-sm font-light leading-relaxed max-w-sm">
            {settings.slogan || 'Modern Living. Better You.'}
          </p>
          <p className="text-xs text-white/60 leading-relaxed max-w-sm">
            Handcrafted luxury furniture, executive office suites, modular kitchen cabinets, and premium vitrified tiles tailored for contemporary Nigerian homes and businesses.
          </p>

          <div className="pt-2">
            <a
              href={whatsAppLink}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full bg-[#25D366] hover:bg-[#20ba59] text-white text-xs font-bold transition-all shadow-md hover:scale-105"
            >
              <WhatsAppIcon className="w-4 h-4 fill-white" />
              <span>Chat with us on WhatsApp</span>
            </a>
          </div>
        </div>

        {/* Quick Links & Categories (3 cols) */}
        <div className="lg:col-span-3 grid grid-cols-2 gap-4">
          <div>
            <h3 className="text-sm font-bold text-white mb-4 tracking-wide uppercase">Quick Links</h3>
            <ul className="space-y-2.5">
              {quickLinks.map((l) => (
                <li key={l.to}>
                  <Link
                    to={l.to}
                    className="text-xs sm:text-sm text-white/75 hover:text-[#F36B0A] hover:translate-x-1 inline-block transition-all"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-bold text-white mb-4 tracking-wide uppercase">Categories</h3>
            <ul className="space-y-2.5">
              {featuredCategories.map((c) => (
                <li key={c.to}>
                  <Link
                    to={c.to}
                    className="text-xs sm:text-sm text-white/75 hover:text-[#F36B0A] hover:translate-x-1 inline-block transition-all"
                  >
                    {c.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Showroom & Factory Locations (3 cols) */}
        <div className="lg:col-span-3 space-y-4">
          <h3 className="text-sm font-bold text-white mb-4 tracking-wide uppercase">Our Locations</h3>

          {/* Showroom */}
          <div className="flex items-start gap-3">
            <div className="w-7 h-7 rounded-lg bg-white/10 text-[#F36B0A] flex items-center justify-center shrink-0 mt-0.5">
              <MapPin className="w-4 h-4" />
            </div>
            <div>
              <p className="text-xs font-bold text-[#F36B0A] uppercase tracking-wider">Showroom Address</p>
              <p className="text-xs text-white/80 leading-relaxed mt-0.5">
                {showroomAddr}
              </p>
            </div>
          </div>

          {/* Factory */}
          <div className="flex items-start gap-3 pt-1">
            <div className="w-7 h-7 rounded-lg bg-white/10 text-[#F36B0A] flex items-center justify-center shrink-0 mt-0.5">
              <Building2 className="w-4 h-4" />
            </div>
            <div>
              <p className="text-xs font-bold text-[#F36B0A] uppercase tracking-wider">Factory Address</p>
              <p className="text-xs text-white/80 leading-relaxed mt-0.5">
                {factoryAddr}
              </p>
            </div>
          </div>
        </div>

        {/* Contact Info & Socials (2 cols) */}
        <div className="lg:col-span-2 space-y-4">
          <h3 className="text-sm font-bold text-white mb-4 tracking-wide uppercase">Get In Touch</h3>

          {/* Phone / WhatsApp */}
          <div className="space-y-1">
            <p className="text-xs text-white/60">Phone &amp; WhatsApp</p>
            <a
              href={whatsAppLink}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm font-bold text-white hover:text-[#25D366] transition-colors flex items-center gap-1.5"
            >
              <span>{phoneDisplay}</span>
              <ArrowUpRight className="w-3.5 h-3.5 opacity-70" />
            </a>
          </div>

          {/* Email */}
          <div className="space-y-1">
            <p className="text-xs text-white/60">Email Inquiries</p>
            <a
              href={`mailto:${emailDisplay}`}
              className="text-xs font-medium text-white/90 hover:text-[#F36B0A] transition-colors break-all"
            >
              {emailDisplay}
            </a>
          </div>

          {/* Social Icons */}
          <div className="pt-2">
            <p className="text-xs text-white/60 mb-2.5">Follow Our Designs</p>
            <ul className="flex items-center gap-2.5">
              {social.map(({ label, href, Icon }) => (
                <li key={label}>
                  <a
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={label}
                    className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 text-white transition-all hover:bg-[#F36B0A] hover:text-white hover:scale-110 shadow-sm"
                  >
                    <Icon className="h-4 w-4 fill-current" />
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="relative z-10 border-t border-white/10 bg-black/40 py-5">
        <div className="container-page flex flex-col items-center justify-between gap-3 text-xs text-white/70 sm:flex-row">
          <p>© 2026 {settings.businessName || 'Home & More Furniture'}. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <Link to="/about" className="hover:text-[#F36B0A] transition-colors">
              About Us
            </Link>
            <span className="h-3 w-px bg-white/30" />
            <Link to="/contact" className="hover:text-[#F36B0A] transition-colors">
              Contact &amp; Showroom
            </Link>
            <span className="h-3 w-px bg-white/30" />
            <a href={whatsAppLink} target="_blank" rel="noopener noreferrer" className="hover:text-[#25D366] transition-colors">
              WhatsApp: {phoneDisplay}
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
