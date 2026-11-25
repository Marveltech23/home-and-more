import { Link } from 'react-router-dom';
import { MapPin, Building2, ArrowRight, CheckCircle2 } from 'lucide-react';
import { WhatsAppIcon } from '../common/BrandIcons';
import { useStore } from '../../context/StoreContext';
import { buildWhatsAppLink, DEFAULT_WHATSAPP_NUMBER } from '../../utils/whatsapp';

export default function ShowroomStoryBanner() {
  const { settings } = useStore();

  const showroomAddress =
    settings.showroomAddress ||
    '204 Pa Michael Imoudu Ave, 32 Cres, 3rd Avenue Gwarinpa, 900108, Abuja, Nigeria';
  const factoryAddress =
    settings.factoryAddress || 'Plot D10 Zauda Pazeri Dei-Dei, Abuja';

  const whatsAppLink = buildWhatsAppLink(
    settings.whatsappNumber || DEFAULT_WHATSAPP_NUMBER,
    'Hello Home & More Furniture, I would like to schedule a visit to your Gwarinpa showroom or discuss a custom furniture order.'
  );

  return (
    <section
      className="py-14 sm:py-16 bg-white border-y border-[#EAE2D9]"
      aria-label="Home & More Abuja Showroom and Craftsmanship"
    >
      <div className="container-page">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* Left: Architectural Showroom & Craftsmanship Visual */}
          <div className="lg:col-span-6 relative">
            <div className="relative rounded-2xl overflow-hidden border border-[#EAE2D9] aspect-[4/3] bg-[#24150F]">
              <img
                src="/images/catalog/oscar-sofa-set.jpeg"
                alt="Home & More Furniture Abuja Showroom"
                className="w-full h-full object-cover"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#1A0F0A]/80 via-transparent to-transparent" />
              <div className="absolute bottom-5 left-5 right-5 flex items-end justify-between gap-4">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#F36B0A]">
                    Abuja Flagship Gallery
                  </span>
                  <p className="font-editorial text-xl sm:text-2xl text-white font-semibold mt-0.5">
                    Home &amp; More in Real Life
                  </p>
                </div>
                <Link
                  to="/contact"
                  className="shrink-0 inline-flex items-center gap-1 text-xs font-semibold text-white bg-[#F36B0A] hover:bg-[#D94D00] px-4 py-2 rounded-full transition-colors"
                >
                  <span>Directions</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          </div>

          {/* Right: Editorial Brand Story & Abuja Showroom/Factory Details */}
          <div className="lg:col-span-6 space-y-5">
            <span className="inline-block text-[11px] font-semibold uppercase tracking-[0.2em] text-[#F36B0A]">
              Craftsmanship &amp; Showroom
            </span>

            <h2 className="font-editorial text-3xl sm:text-4xl font-semibold text-[#24150F] leading-tight">
              Experience Our Craftsmanship in Person in Abuja
            </h2>

            <p className="text-sm sm:text-base text-[#786B62] leading-relaxed">
              Every sofa frame, bed suite, and center table at Home &amp; More is engineered for lasting Nigerian living—combining kiln-dried hardwood structures, plush imported upholstery, and bespoke sizing crafted right in our Abuja workshop.
            </p>

            {/* Genuine Craft Highlights */}
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1 text-xs sm:text-sm text-[#24150F]">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#F36B0A] shrink-0" />
                <span>Kiln-dried solid hardwood frames</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#F36B0A] shrink-0" />
                <span>Custom colors, fabrics &amp; sizing</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#F36B0A] shrink-0" />
                <span>White-glove Abuja installation</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#F36B0A] shrink-0" />
                <span>Direct showroom &amp; factory pricing</span>
              </li>
            </ul>

            {/* Real Addresses */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              <div className="p-3.5 rounded-xl bg-[#FAF7F3] border border-[#EAE2D9] flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-[#F36B0A] shrink-0 mt-0.5" />
                <div className="text-xs">
                  <p className="font-bold text-[#24150F]">Gwarinpa Showroom</p>
                  <p className="text-[#786B62] mt-0.5 leading-snug">{showroomAddress}</p>
                </div>
              </div>
              <div className="p-3.5 rounded-xl bg-[#FAF7F3] border border-[#EAE2D9] flex items-start gap-2.5">
                <Building2 className="w-4 h-4 text-[#F36B0A] shrink-0 mt-0.5" />
                <div className="text-xs">
                  <p className="font-bold text-[#24150F]">Dei-Dei Factory</p>
                  <p className="text-[#786B62] mt-0.5 leading-snug">{factoryAddress}</p>
                </div>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3 pt-2">
              <a
                href={whatsAppLink}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-whatsapp text-xs sm:text-sm py-3 px-6"
              >
                <WhatsAppIcon className="w-4 h-4 fill-white" />
                <span>Book Showroom Visit</span>
              </a>
              <Link to="/about" className="btn-secondary text-xs sm:text-sm py-3 px-6">
                <span>Our Story &amp; Projects</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
