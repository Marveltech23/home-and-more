import { Link } from 'react-router-dom';
import {
  Award,
  Compass,
  HeartHandshake,
  ShieldCheck,
  Users,
  Sparkles,
  CheckCircle2,
  Building2,
  Hotel,
  Briefcase,
  Home,
  Layers,
  ArrowRight
} from 'lucide-react';
import SectionHeading from '../../components/common/SectionHeading';
import SEO from '../../components/common/SEO';
import { WhatsAppIcon } from '../../components/common/BrandIcons';
import { useStore } from '../../context/StoreContext';
import { buildWhatsAppLink } from '../../utils/whatsapp';

const commercialProjects = [
  {
    id: 'proj-1',
    category: 'Hospitality & Hotels',
    title: 'The Carlton Luxury Suites Fit-Out',
    location: 'Abuja, Nigeria',
    scope: '32 Luxury Guest Suites & Penthouse Lounge',
    description:
      'Engineered and produced custom king channeled headboards, luggage credenzas, sound-dampening acoustic wall panels, and bespoke velvet armchairs for executive suites.',
    image: 'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=800&q=80',
    tags: ['Bespoke Headboards', 'Lounge Seating', 'Fire-Retardant Fabric'],
  },
  {
    id: 'proj-2',
    category: 'Corporate Headquarters',
    title: 'Apex Financial Services Boardroom & Offices',
    location: 'Central Business District, Abuja',
    scope: '18-Seater Boardroom, Executive Suites & Reception Pods',
    description:
      'Crafted a solid teak conference table with integrated pop-up data routing, ergonomic executive leather seating, and custom acoustic privacy dividers for open collaboration zones.',
    image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=800&q=80',
    tags: ['Teak Conference Table', 'Executive Desks', 'Acoustic Partitions'],
  },
  {
    id: 'proj-3',
    category: 'Luxury Residential',
    title: 'Maitama Hilltop Private Residence',
    location: 'Maitama, Abuja',
    scope: 'Turnkey 7-Bedroom Villa & Outdoor Terrace',
    description:
      'Complete contract manufacturing of custom walk-in architectural wardrobes, a 12-seater solid oak banquet dining table, curved bouclé sectionals, and weather-resistant patio loungers.',
    image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80',
    tags: ['Custom Wardrobes', '12-Seater Dining', 'Patio Daybeds'],
  },
  {
    id: 'proj-4',
    category: 'Serviced Apartments',
    title: 'The Terraces Short-Let Development',
    location: 'Jabi Lake District, Abuja',
    scope: '16 Boutique Waterfront Apartments',
    description:
      'Custom modular moisture-resistant kitchen cabinetry, minimalist TV entertainment consoles, dining suites, and heavy-wear contract bouclé sectionals with rapid delivery.',
    image: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=800&q=80',
    tags: ['Modular Kitchens', 'TV Consoles', 'High-Traffic Bouclé'],
  },
];

export default function AboutPage() {
  const { settings } = useStore();

  const whatsAppLink = buildWhatsAppLink(
    settings.whatsappNumber || '+2348033513144',
    'Hello Home & More Furniture, I am interested in discussing a commercial or bespoke residential fit-out.'
  );

  return (
    <div className="bg-[#FBF9F5] py-10 sm:py-16 space-y-20">
      <SEO
        title="About Us | Craftsmanship, Heritage & Turnkey Projects | Home & More"
        description="Discover the atelier philosophy behind Home & More Furniture: kiln-dried solid hardwoods, our Gwarinpa showroom, Dei-Dei joinery factory, and turnkey architectural fit-outs in Abuja."
        canonical="/about"
      />

      {/* 1. HERO SECTION */}
      <section className="container-page">
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <span className="text-[11px] font-semibold uppercase tracking-ultra-caps text-[#8C6D3B]">
            The Atelier Philosophy
          </span>
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-luxury-serif font-light text-[#1C1815] tracking-tight leading-[1.15]">
            Crafting Spaces of Repose, Dignity &amp; Enduring Distinction
          </h1>
          <p className="text-sm sm:text-base text-[#70685E] font-light leading-relaxed pt-2">
            Home &amp; More Furniture was established to bridge international architectural sensibility with generational Nigerian woodworking. We craft honest, enduring furniture for distinguished residences, executive boardrooms, and luxury hospitality destinations.
          </p>
        </div>

        {/* Hero Architectural Image */}
        <div className="mt-12 overflow-hidden border border-[#E8E3DA] aspect-[16/8] shadow-sm">
          <img
            src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1600&q=80"
            alt="Home and More Furniture Atelier Architecture"
            className="w-full h-full object-cover"
          />
        </div>
      </section>

      {/* 2. STATS SECTION (Architectural Espresso Strip) */}
      <section className="bg-[#1C1815] text-[#FBF9F5] py-14 border-y border-[#35302B]">
        <div className="container-page grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          <div className="space-y-1">
            <div className="text-3xl sm:text-4xl font-luxury-serif text-[#C4A470]">2,800+</div>
            <p className="text-[11px] text-[#A69E93] uppercase tracking-ultra-caps">Homes &amp; Suites Furnished</p>
          </div>
          <div className="space-y-1">
            <div className="text-3xl sm:text-4xl font-luxury-serif text-[#C4A470]">65+</div>
            <p className="text-[11px] text-[#A69E93] uppercase tracking-ultra-caps">Commercial &amp; Hotel Fit-Outs</p>
          </div>
          <div className="space-y-1">
            <div className="text-3xl sm:text-4xl font-luxury-serif text-[#C4A470]">100%</div>
            <p className="text-[11px] text-[#A69E93] uppercase tracking-ultra-caps">Kiln-Dried Solid Hardwood</p>
          </div>
          <div className="space-y-1">
            <div className="text-3xl sm:text-4xl font-luxury-serif text-[#C4A470]">Abuja</div>
            <p className="text-[11px] text-[#A69E93] uppercase tracking-ultra-caps">Showroom &amp; Joinery Factory</p>
          </div>
        </div>
      </section>

      {/* 3. OUR STORY */}
      <section className="container-page">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          <div className="space-y-6">
            <div className="space-y-2">
              <span className="text-[11px] uppercase tracking-ultra-caps text-[#8C6D3B] font-semibold">
                Heritage &amp; Material Integrity
              </span>
              <h2 className="text-3xl sm:text-4xl font-luxury-serif font-light text-[#1C1815]">
                Modern Living. Better You.
              </h2>
            </div>
            
            <p className="text-sm sm:text-base text-[#70685E] leading-relaxed font-light">
              Founded in Abuja, Home &amp; More Furniture was established to resolve an enduring frustration: discerning homeowners and architects were forced to choose between overpriced, fragile imports or generic local alternatives lacking structural discipline.
            </p>
            <p className="text-sm sm:text-base text-[#70685E] leading-relaxed font-light">
              Every sofa armature, banquette bench, and dining table begins with kiln-dried African teak, treated mahogany, and precision-welded internal steel bracing. We pair these timeless frameworks with water-repellent Belgian linens, Italian velvet, and high-density memory foams engineered for decade-long structural resilience.
            </p>

            <ul className="space-y-3 pt-2">
              <li className="flex items-start gap-3 text-sm text-[#1C1815]">
                <span className="w-1.5 h-1.5 rounded-full bg-[#8C6D3B] mt-2 shrink-0" />
                <span>Bespoke dimensional customization for private floorplans, custom stains, and curated textile swatches.</span>
              </li>
              <li className="flex items-start gap-3 text-sm text-[#1C1815]">
                <span className="w-1.5 h-1.5 rounded-full bg-[#8C6D3B] mt-2 shrink-0" />
                <span>Direct-from-workshop pricing in Nigerian Naira with absolute transparency and zero intermediary markups.</span>
              </li>
              <li className="flex items-start gap-3 text-sm text-[#1C1815]">
                <span className="w-1.5 h-1.5 rounded-full bg-[#8C6D3B] mt-2 shrink-0" />
                <span>Dedicated white-glove logistics: room placement, unboxing, architectural assembly, and debris removal across Abuja.</span>
              </li>
            </ul>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="border border-[#E8E3DA] overflow-hidden aspect-[3/4]">
              <img
                src="https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=600&q=80"
                alt="Accent chair craftsmanship"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="border border-[#E8E3DA] overflow-hidden aspect-[3/4] translate-y-6">
              <img
                src="https://images.unsplash.com/photo-1617806118233-18e1de247200?auto=format&fit=crop&w=600&q=80"
                alt="Dining woodworking"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* 4. COMMERCIAL, HOTEL & CORPORATE PROJECTS SECTION */}
      <section className="container-page space-y-12">
        <div className="max-w-2xl space-y-2">
          <span className="text-[11px] font-semibold uppercase tracking-ultra-caps text-[#8C6D3B]">
            Contract Manufacturing
          </span>
          <h2 className="text-3xl sm:text-4xl font-luxury-serif font-light text-[#1C1815]">
            Turnkey Suites: Hospitality &amp; Corporate Projects
          </h2>
          <p className="text-sm text-[#70685E] font-light leading-relaxed">
            Beyond private residences, Home &amp; More is the contract manufacturing and fit-out partner of choice for luxury boutique hotels, corporate headquarters, and high-end residential developments across Abuja.
          </p>
        </div>

        {/* 3 Pillar Capabilities Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-8 bg-[#EFECE6]/50 border border-[#E8E3DA] space-y-3">
            <div className="w-10 h-10 border border-[#8C6D3B]/40 text-[#8C6D3B] flex items-center justify-center">
              <Hotel className="w-5 h-5 stroke-[1.2]" />
            </div>
            <h3 className="font-luxury-serif text-lg text-[#1C1815]">Hotels &amp; Hospitality</h3>
            <p className="text-xs text-[#70685E] leading-relaxed font-light">
              Turnkey guest suite packages, oversized acoustic headboards, lobby banquettes, restaurant dining suites, and weather-resistant outdoor lounge pieces built to contract-grade durability.
            </p>
          </div>

          <div className="p-8 bg-[#EFECE6]/50 border border-[#E8E3DA] space-y-3">
            <div className="w-10 h-10 border border-[#8C6D3B]/40 text-[#8C6D3B] flex items-center justify-center">
              <Briefcase className="w-5 h-5 stroke-[1.2]" />
            </div>
            <h3 className="font-luxury-serif text-lg text-[#1C1815]">Corporate &amp; Executive</h3>
            <p className="text-xs text-[#70685E] leading-relaxed font-light">
              Solid teak and walnut conference tables with concealed power channeling, ergonomic director seating, acoustic breakout pods, and reception consoles tailored to corporate identities.
            </p>
          </div>

          <div className="p-8 bg-[#EFECE6]/50 border border-[#E8E3DA] space-y-3">
            <div className="w-10 h-10 border border-[#8C6D3B]/40 text-[#8C6D3B] flex items-center justify-center">
              <Layers className="w-5 h-5 stroke-[1.2]" />
            </div>
            <h3 className="font-luxury-serif text-lg text-[#1C1815]">Architectural Fit-Outs</h3>
            <p className="text-xs text-[#70685E] leading-relaxed font-light">
              Collaborating seamlessly with architectural practices and interior designers: full 3D CAD visualization reviews, custom timber staining, and rapid batch manufacturing in Dei-Dei.
            </p>
          </div>
        </div>

        {/* Featured Projects Portfolio Grid */}
        <div className="space-y-8 pt-6">
          <div className="border-b border-[#E8E3DA] pb-4">
            <h3 className="text-2xl font-luxury-serif text-[#1C1815]">
              Featured Turnkey Case Studies
            </h3>
            <p className="text-xs uppercase tracking-ultra-caps text-[#70685E] mt-1">
              Recent contract installations completed by our Abuja project atelier
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {commercialProjects.map((proj) => (
              <div
                key={proj.id}
                className="group border border-[#E8E3DA] bg-white flex flex-col justify-between transition-colors duration-300 hover:border-[#1C1815]"
              >
                <div className="aspect-[16/10] overflow-hidden relative bg-[#EFECE6]">
                  <img
                    src={proj.image}
                    alt={proj.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute top-4 left-4">
                    <span className="bg-[#1C1815]/85 text-[#FBF9F5] text-[10px] font-semibold px-3 py-1 uppercase tracking-ultra-caps">
                      {proj.category}
                    </span>
                  </div>
                </div>

                <div className="p-6 sm:p-8 flex-1 flex flex-col justify-between space-y-5">
                  <div className="space-y-2">
                    <div className="text-[11px] font-semibold text-[#8C6D3B] uppercase tracking-wider">
                      {proj.location} • {proj.scope}
                    </div>
                    <h4 className="text-xl font-luxury-serif text-[#1C1815]">
                      {proj.title}
                    </h4>
                    <p className="text-xs text-[#70685E] leading-relaxed font-light">
                      {proj.description}
                    </p>
                  </div>

                  <div className="pt-4 border-t border-[#E8E3DA] flex flex-wrap gap-2">
                    {proj.tags.map((tag) => (
                      <span
                        key={tag}
                        className="bg-[#FBF9F5] text-[#1C1815] text-[10px] uppercase tracking-wider px-2.5 py-1 border border-[#E8E3DA]"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. COMMERCIAL CONTRACT CONSULTATION CTA */}
      <section className="container-page">
        <div className="bg-[#1C1815] text-[#FBF9F5] p-8 sm:p-14 border border-[#35302B] flex flex-col lg:flex-row items-center justify-between gap-8">
          <div className="space-y-3 text-center lg:text-left max-w-xl">
            <span className="text-[10px] font-semibold uppercase tracking-ultra-caps text-[#C4A470]">
              Commercial Inquiries &amp; Tenders
            </span>
            <h3 className="text-2xl sm:text-3xl font-luxury-serif text-[#FBF9F5]">
              Furnishing a Hotel, Executive Boardroom, or Luxury Residence?
            </h3>
            <p className="text-xs sm:text-sm text-[#A69E93] leading-relaxed font-light">
              Our project directors provide commercial volume estimations, physical finish palettes, and guaranteed turnkey installation schedules across Nigeria.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-4 shrink-0">
            <a
              href={whatsAppLink}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-whatsapp text-xs py-3 px-6 shadow-none"
            >
              <WhatsAppIcon className="w-4 h-4 fill-white" />
              <span>Discuss Commercial Project</span>
            </a>
            <Link
              to="/contact"
              className="px-6 py-3 border border-[#E8E3DA]/30 text-xs font-semibold text-[#FBF9F5] tracking-ultra-caps uppercase hover:bg-white hover:text-[#1C1815] transition-all"
            >
              Submit Tender
            </Link>
          </div>
        </div>
      </section>

      {/* 6. ABUJA SHOWROOM & FACTORY LOCATION */}
      <section className="container-page">
        <div className="bg-[#EFECE6]/60 border border-[#E8E3DA] p-8 sm:p-14 text-center max-w-3xl mx-auto space-y-6">
          <span className="text-[11px] font-semibold uppercase tracking-ultra-caps text-[#8C6D3B]">
            Private Showroom &amp; Joinery Factory
          </span>
          <h2 className="text-2xl sm:text-4xl font-luxury-serif font-light text-[#1C1815]">
            Experience The Atelier In Person
          </h2>
          <p className="text-xs sm:text-sm text-[#70685E] max-w-xl mx-auto font-light leading-relaxed">
            Visit our flagship showroom at <strong className="text-[#1C1815] font-normal">204 Pa Michael Imoudu Ave, 32 Cres, 3rd Avenue Gwarinpa, Abuja</strong> or our state-of-the-art joinery production factory at <strong className="text-[#1C1815] font-normal">Plot D10 Zauda Pazeri Dei-Dei, Abuja</strong>. Inspect hand-finished hardwood joints, select from 80+ imported upholstery swatches, and review custom architectural floorplans.
          </p>
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-4">
            <a
              href={buildWhatsAppLink(settings.whatsappNumber || '+2348033513144', 'Hello Home & More, I would like to book a private showroom consultation.')}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-whatsapp text-xs py-3 px-6 shadow-none"
            >
              <WhatsAppIcon className="w-4 h-4 fill-white" />
              <span>Book Showroom Visit on WhatsApp</span>
            </a>
            <Link to="/contact" className="btn-luxury text-xs py-3 px-6">
              View Addresses &amp; Directions
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
