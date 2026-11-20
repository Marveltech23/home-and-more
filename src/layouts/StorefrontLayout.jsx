import { Outlet } from 'react-router-dom';
import Header from '../components/storefront/Header';
import Footer from '../components/storefront/Footer';
import { WhatsAppIcon } from '../components/common/BrandIcons';
import { useStore } from '../context/StoreContext';
import { buildWhatsAppLink } from '../utils/whatsapp';

export default function StorefrontLayout() {
  const { settings } = useStore();

  const whatsAppLink = buildWhatsAppLink(
    settings.whatsappNumber,
    `${settings.whatsappGreeting} your furniture catalog.`
  );

  return (
    <div className="min-h-screen flex flex-col bg-[#FFFAF5] text-[#24150F]">
      <Header />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />

      {/* Floating WhatsApp Action Button (Mobile & Desktop quick reach) */}
      <a
        href={whatsAppLink}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat with us on WhatsApp"
        className="fixed bottom-6 right-6 z-40 flex items-center gap-2.5 rounded-full bg-[#25D366] text-white px-4 py-3 shadow-2xl hover:bg-[#1eb956] hover:scale-105 transition-all duration-300 group"
      >
        <WhatsAppIcon className="w-6 h-6 fill-white" />
        <span className="hidden sm:inline text-sm font-semibold pr-1">Need help? Chat with us</span>
      </a>
    </div>
  );
}
