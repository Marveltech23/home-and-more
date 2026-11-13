import { Link } from 'react-router-dom';
import { Award, Compass, HeartHandshake, ShieldCheck, Users, Sparkles, CheckCircle2 } from 'lucide-react';
import SectionHeading from '../../components/common/SectionHeading';
import { WhatsAppIcon } from '../../components/common/BrandIcons';
import { useStore } from '../../context/StoreContext';
import { buildWhatsAppLink } from '../../utils/whatsapp';

export default function AboutPage() {
  const { settings } = useStore();

  const whatsAppLink = buildWhatsAppLink(
    settings.whatsappNumber,
    'Hello Home & More Furniture, I would like to learn more about your showroom and bespoke furniture.'
  );

  return (
    <div className="py-8 sm:py-14 space-y-16">
      {/* 1. HERO SECTION */}
      <section className="container-page">
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <span className="text-xs sm:text-sm font-bold uppercase tracking-widest text-[#F36B0A]">
            About Home &amp; More Furniture
          </span>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-[#24150F] tracking-tight leading-tight">
            Crafting Timeless Furniture For Modern Nigerian Homes
          </h1>
          <p className="text-base sm:text-lg text-[#82746B] font-medium leading-relaxed">
            We believe that a well-furnished home elevates every moment of life. Our mission is to blend international design sensibility with authentic local craftsmanship.
          </p>
        </div>

        {/* Hero Banner Image */}
        <div className="mt-10 rounded-3xl overflow-hidden shadow-2xl border border-[#F0DFD1] aspect-[16/8]">
          <img
            src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1600&q=80"
            alt="Home and More Furniture Showroom"
            className="w-full h-full object-cover"
          />
        </div>
      </section>

      {/* 2. STATS SECTION */}
      <section className="bg-gradient-to-r from-[#29160D] via-[#3a1a0c] to-[#29160D] text-white py-12">
        <div className="container-page grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          <div className="space-y-1">
            <div className="text-3xl sm:text-4xl font-extrabold text-[#F36B0A]">2,800+</div>
            <p className="text-xs sm:text-sm text-white/80">Homes &amp; Offices Furnished</p>
          </div>
          <div className="space-y-1">
            <div className="text-3xl sm:text-4xl font-extrabold text-[#F36B0A]">100%</div>
            <p className="text-xs sm:text-sm text-white/80">Kiln-Dried Hardwoods</p>
          </div>
          <div className="space-y-1">
            <div className="text-3xl sm:text-4xl font-extrabold text-[#F36B0A]">12 Mo.</div>
            <p className="text-xs sm:text-sm text-white/80">Craftsmanship Warranty</p>
          </div>
          <div className="space-y-1">
            <div className="text-3xl sm:text-4xl font-extrabold text-[#F36B0A]">Abuja</div>
            <p className="text-xs sm:text-sm text-white/80">Central Showroom &amp; Studio</p>
          </div>
        </div>
      </section>

      {/* 3. OUR STORY */}
      <section className="container-page">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-5">
            <SectionHeading
              title="Modern Living. Better You."
              subtitle="The philosophy behind our craft"
            />
            <p className="text-sm sm:text-base text-[#24150F]/90 leading-relaxed font-normal">
              Founded in Abuja, Home &amp; More Furniture was born from a desire to solve a common dilemma: homeowners shouldn't have to choose between exorbitant imported luxury or flimsy local alternatives.
            </p>
            <p className="text-sm sm:text-base text-[#24150F]/90 leading-relaxed font-normal">
              Every sofa frame, dining table, and upholstered bed is constructed using kiln-dried solid teak, mahogany, and reinforced steel. We source top-tier fabrics and high-resilience memory foams that withstand daily family life while maintaining sculptural beauty.
            </p>

            <ul className="space-y-2.5 pt-2">
              <li className="flex items-center gap-2.5 text-sm font-semibold text-[#24150F]">
                <CheckCircle2 className="w-5 h-5 text-[#F36B0A] shrink-0" />
                <span>Bespoke customization for room sizes and fabrics</span>
              </li>
              <li className="flex items-center gap-2.5 text-sm font-semibold text-[#24150F]">
                <CheckCircle2 className="w-5 h-5 text-[#F36B0A] shrink-0" />
                <span>Transparent pricing in Nigerian Naira with no hidden fees</span>
              </li>
              <li className="flex items-center gap-2.5 text-sm font-semibold text-[#24150F]">
                <CheckCircle2 className="w-5 h-5 text-[#F36B0A] shrink-0" />
                <span>White-glove delivery, room placement, and packaging removal</span>
              </li>
            </ul>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="rounded-2xl overflow-hidden shadow-md aspect-[3/4]">
              <img
                src="https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=600&q=80"
                alt="Accent chair craftsmanship"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="rounded-2xl overflow-hidden shadow-md aspect-[3/4] translate-y-6">
              <img
                src="https://images.unsplash.com/photo-1617806118233-18e1de247200?auto=format&fit=crop&w=600&q=80"
                alt="Dining woodworking"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* 4. SHOWROOM & CONSULTATION CTA */}
      <section className="container-page">
        <div className="rounded-3xl bg-gradient-to-br from-[#FFF3EA] via-white to-[#F8EBDD] border border-[#F0DFD1] p-8 sm:p-12 text-center max-w-3xl mx-auto shadow-sm space-y-5">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#24150F]">
            Visit Our Abuja Showroom
          </h2>
          <p className="text-sm sm:text-base text-[#82746B] max-w-xl mx-auto">
            Experience our furniture in person. Feel the texture of our bouclés and linens, test the cushion firmness, and chat with our interior consultants.
          </p>
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-4">
            <a
              href={whatsAppLink}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-whatsapp text-sm py-3 px-6 shadow-md"
            >
              <WhatsAppIcon className="w-5 h-5 fill-white" />
              <span>Book Showroom Visit on WhatsApp</span>
            </a>
            <Link to="/contact" className="btn-secondary text-sm py-3 px-6">
              View Address &amp; Directions
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
