import { Link } from 'react-router-dom';
import { MapPin, Building2, ArrowUpRight } from 'lucide-react';
import Logo from '../common/Logo';
import { FacebookIcon, InstagramIcon, YouTubeIcon, WhatsAppIcon } from '../common/BrandIcons';
import { useStore } from '../../context/StoreContext';
import { categories as initialCategories } from '../../data/categories';
import { buildWhatsAppLink, DEFAULT_WHATSAPP_NUMBER } from '../../utils/whatsapp';

const quickLinks = [
  { label: 'Home', to: '/' },
  { label: 'Shop All Furniture', to: '/shop' },
  { label: 'About & Showroom', to: '/about' },
  { label: 'Design Journal', to: '/blog' },
  { label: 'Saved Wishlist', to: '/wishlist' },
  { label: 'Contact Us', to: '/contact' },
];

export default function Footer({ settings: propSettings }) {
  const { settings: contextSettings, categories } = useStore();
  const settings = propSettings || contextSettings;

  const activeCategories = (categories && categories.length > 0 ? categories : initialCategories)
    .filter((c) => c.isActive !== false)
    .sort((a, b) => (Number(a.displayOrder) || 99) - (Number(b.displayOrder) || 99))
    .slice(0, 8);

  const phoneDisplay = settings.phone || '+234 803 351 3144';
  const whatsappNum = settings.whatsappNumber || DEFAULT_WHATSAPP_NUMBER;
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
    { label: 'WhatsApp', href: whatsAppLink, Icon: WhatsAppIcon },
  ];

  return (
    <footer className="bg-[#1D120C] text-white border-t border-[#F36B0A]/30">
      <div className="container-page py-16 grid gap-10 sm:grid-cols-2 lg:grid-cols-12">
        {/* Brand Identity (4 cols) */}
        <div className="lg:col-span-4 space-y-4">
          <Logo variant="light" size="lg" />
          <p className="font-editorial text-lg text-[#F8EBDD] italic">
            {settings.slogan || 'Modern Living. Better You.'}
          </p>
          <p className="text-xs text-white/65 leading-relaxed max-w-sm">
            Abuja’s premier furniture showroom and joinery workshop—crafting signature sofa sets, bedroom suites, center tables, executive offices, modular kitchens, and porcelain tiles.
          </p>

          <div className="pt-2">
            <a
              href={whatsAppLink}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#1EAA52] hover:bg-[#179045] text-white text-xs font-semibold transition-all shadow-sm"
            >
              <WhatsAppIcon className="w-4 h-4 fill-white" />
              <span>Chat on WhatsApp</span>
            </a>
          </div>
        </div>

        {/* Navigation & Departments (3 cols) */}
        <div className="lg:col-span-3 grid grid-cols-2 gap-6">
          <div>
            <h3 className="text-[11px] font-bold text-[#F36B0A] mb-4 tracking-[0.18em] uppercase">
              Showroom
            </h3>
            <ul className="space-y-2.5">
              {quickLinks.map((l) => (
                <li key={l.to}>
                  <Link
                    to={l.to}
                    className="text-xs text-white/75 hover:text-[#F36B0A] transition-colors"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="text-[11px] font-bold text-[#F36B0A] mb-4 tracking-[0.18em] uppercase">
              Departments
            </h3>
            <ul className="space-y-2.5">
              {activeCategories.map((c) => (
                <li key={c.slug}>
                  <Link
                    to={`/category/${c.slug}`}
                    className="text-xs text-white/75 hover:text-[#F36B0A] transition-colors"
                  >
                    {c.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Showroom & Factory Locations (3 cols) */}
        <div className="lg:col-span-3 space-y-4">
          <h3 className="text-[11px] font-bold text-[#F36B0A] mb-4 tracking-[0.18em] uppercase">
            Abuja Locations
          </h3>

          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 text-[#F36B0A] flex items-center justify-center shrink-0 mt-0.5">
              <MapPin className="w-4 h-4" />
            </div>
            <div>
              <p className="text-[11px] font-semibold text-white uppercase tracking-wider">Showroom Address</p>
              <p className="text-xs text-white/70 leading-relaxed mt-0.5">{showroomAddr}</p>
            </div>
          </div>

          <div className="flex items-start gap-3 pt-1">
            <div className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 text-[#F36B0A] flex items-center justify-center shrink-0 mt-0.5">
              <Building2 className="w-4 h-4" />
            </div>
            <div>
              <p className="text-[11px] font-semibold text-white uppercase tracking-wider">Factory Address</p>
              <p className="text-xs text-white/70 leading-relaxed mt-0.5">{factoryAddr}</p>
            </div>
          </div>
        </div>

        {/* Contact & Social (2 cols) */}
        <div className="lg:col-span-2 space-y-4">
          <h3 className="text-[11px] font-bold text-[#F36B0A] mb-4 tracking-[0.18em] uppercase">
            Concierge
          </h3>

          <div className="space-y-1">
            <p className="text-[11px] text-white/50">Phone &amp; WhatsApp</p>
            <a
              href={whatsAppLink}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm font-semibold text-white hover:text-[#4ADE80] transition-colors inline-flex items-center gap-1"
            >
              <span>{phoneDisplay}</span>
              <ArrowUpRight className="w-3.5 h-3.5 opacity-60" />
            </a>
          </div>

          <div className="space-y-1">
            <p className="text-[11px] text-white/50">Email</p>
            <a
              href={`mailto:${emailDisplay}`}
              className="text-xs text-white/80 hover:text-[#F36B0A] transition-colors break-all"
            >
              {emailDisplay}
            </a>
          </div>

          <div className="pt-2">
            <p className="text-[11px] text-white/50 mb-2.5">Follow Us</p>
            <ul className="flex items-center gap-2">
              {social.map(({ label, href, Icon }) => (
                <li key={label}>
                  <a
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={label}
                    className="flex h-8 w-8 items-center justify-center rounded-full bg-white/8 border border-white/10 text-white/85 transition-all hover:bg-[#F36B0A] hover:border-[#F36B0A] hover:text-white"
                  >
                    <Icon className="h-3.5 w-3.5 fill-current" />
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Legal Bar */}
      <div className="border-t border-white/10 bg-black/30 py-5">
        <div className="container-page flex flex-col items-center justify-between gap-3 text-xs text-white/60 sm:flex-row">
          <p>© 2026 {settings.businessName || 'Home & More Furniture'}. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <Link to="/about" className="hover:text-[#F36B0A] transition-colors">
              About Us
            </Link>
            <span className="h-3 w-px bg-white/20" />
            <Link to="/contact" className="hover:text-[#F36B0A] transition-colors">
              Showroom &amp; Factory
            </Link>
            <span className="h-3 w-px bg-white/20" />
            <a
              href={whatsAppLink}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-[#4ADE80] transition-colors"
            >
              WhatsApp: {phoneDisplay}
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
