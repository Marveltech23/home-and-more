import { Outlet } from 'react-router-dom';
import Header from '../components/storefront/Header';
import Footer from '../components/storefront/Footer';
import CartDrawer from '../components/storefront/CartDrawer';
import { WhatsAppIcon } from '../components/common/BrandIcons';
import { useStore } from '../context/StoreContext';
import { buildWhatsAppLink } from '../utils/whatsapp';

export default function StorefrontLayout() {
  const { settings } = useStore();

  const whatsAppLink = buildWhatsAppLink(
    settings.whatsappNumber,
    `${settings.whatsappGreeting} your furniture showroom pieces.`
  );

  return (
    <div className="min-h-screen flex flex-col bg-[#FBF9F5] text-[#1C1815] selection:bg-[#1C1815] selection:text-white">
      <Header />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />

      {/* Slide-out Bag Drawer */}
      <CartDrawer />

      {/* Floating Concierge Action */}
      <a
        href={whatsAppLink}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Direct WhatsApp Concierge"
        className="fixed bottom-6 right-6 z-40 flex items-center gap-2.5 bg-[#1C1815] text-[#FBF9F5] hover:bg-[#B89358] border border-white/20 px-4 py-3 shadow-2xl transition-all duration-300 group hover:-translate-y-1"
      >
        <WhatsAppIcon className="w-5 h-5 fill-current text-[#25D366] group-hover:text-white transition-colors" />
        <span className="hidden sm:inline text-xs font-semibold uppercase tracking-wide-caps pr-1">Showroom Concierge</span>
      </a>
    </div>
  );
}
