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
    location: 'Guzape, Abuja',
    scope: '14 Modern 2-Bedroom Serviced Units',
    description:
      'Standardized production of contemporary slate sofas, fluted TV consoles, storage beds, and durable wipe-clean dining sets delivered and assembled on a rapid 3-week timeline.',
    image: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=800&q=80',
    tags: ['Turnkey Fit-Out', 'Storage Beds', 'Rapid Deployment'],
  },
];

export default function AboutPage() {
  const { settings } = useStore();

  const whatsAppLink = buildWhatsAppLink(
    settings.whatsappNumber,
    'Hello Home & More Furniture, I would like to enquire about your commercial and turnkey project services.'
  );

  return (
    <div className="py-8 sm:py-14 space-y-20">
      <SEO
        title="About Us | Craftsmanship, Heritage & Turnkey Projects"
        description="Learn about Home & More Furniture, our timber craftsmanship, Abuja showroom, and bespoke residential & commercial interior design projects."
        canonical="/about"
      />

      {/* 1. HERO SECTION */}
      <section className="container-page">
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <span className="text-xs sm:text-sm font-bold uppercase tracking-widest text-[#F36B0A]">
            About Home &amp; More Furniture
          </span>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-[#24150F] tracking-tight leading-tight">
            Crafting Timeless Furniture For Modern Nigerian Homes &amp; Spaces
          </h1>
          <p className="text-base sm:text-lg text-[#82746B] font-medium leading-relaxed">
            We believe that a well-furnished space elevates every moment of life. Our mission is to blend international design sensibility with authentic local craftsmanship for private homes, luxury hotels, and corporate offices.
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
      <section className="bg-gradient-to-r from-[#29160D] via-[#3a1a0c] to-[#29160D] text-white py-14">
        <div className="container-page grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          <div className="space-y-1">
            <div className="text-3xl sm:text-5xl font-extrabold text-[#F36B0A]">2,800+</div>
            <p className="text-xs sm:text-sm text-white/80 font-medium">Homes &amp; Offices Furnished</p>
          </div>
          <div className="space-y-1">
            <div className="text-3xl sm:text-5xl font-extrabold text-[#F36B0A]">65+</div>
            <p className="text-xs sm:text-sm text-white/80 font-medium">Turnkey Hotel &amp; Office Projects</p>
          </div>
          <div className="space-y-1">
            <div className="text-3xl sm:text-5xl font-extrabold text-[#F36B0A]">100%</div>
            <p className="text-xs sm:text-sm text-white/80 font-medium">Kiln-Dried Hardwoods</p>
          </div>
          <div className="space-y-1">
            <div className="text-3xl sm:text-5xl font-extrabold text-[#F36B0A]">Abuja</div>
            <p className="text-xs sm:text-sm text-white/80 font-medium">Central Showroom &amp; Workshop</p>
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
              Founded in Abuja, Home &amp; More Furniture was born from a desire to solve a common dilemma: clients shouldn't have to choose between exorbitant imported luxury or flimsy local alternatives.
            </p>
            <p className="text-sm sm:text-base text-[#24150F]/90 leading-relaxed font-normal">
              Every sofa frame, dining table, and upholstered bed is constructed using kiln-dried solid teak, treated mahogany, and reinforced steel. We source top-tier fabrics and high-resilience memory foams that withstand daily life while maintaining sculptural beauty.
            </p>

            <ul className="space-y-2.5 pt-2">
              <li className="flex items-center gap-2.5 text-sm font-semibold text-[#24150F]">
                <CheckCircle2 className="w-5 h-5 text-[#F36B0A] shrink-0" />
                <span>Bespoke customization for room sizes, finishes, and fabrics</span>
              </li>
              <li className="flex items-center gap-2.5 text-sm font-semibold text-[#24150F]">
                <CheckCircle2 className="w-5 h-5 text-[#F36B0A] shrink-0" />
                <span>Direct-from-workshop pricing in Nigerian Naira with no middleman markups</span>
              </li>
              <li className="flex items-center gap-2.5 text-sm font-semibold text-[#24150F]">
                <CheckCircle2 className="w-5 h-5 text-[#F36B0A] shrink-0" />
                <span>White-glove delivery, room placement, and expert installation</span>
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

      {/* 4. COMMERCIAL, HOTEL & CORPORATE PROJECTS SECTION */}
      <section className="container-page space-y-10">
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[#F36B0A] bg-[#FFF3EA] px-3 py-1 rounded-full border border-[#F36B0A]/30 mb-3">
            <Building2 className="w-3.5 h-3.5" />
            <span>Commercial &amp; Contract Manufacturing</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#24150F] tracking-tight">
            Turnkey Projects: Hotels, Corporate Offices &amp; Developments
          </h2>
          <p className="text-sm sm:text-base text-[#82746B] mt-2 leading-relaxed">
            Beyond private residences, Home &amp; More Furniture is the chosen manufacturing and fit-out partner for top Nigerian hospitality groups, corporate headquarters, and luxury property developers.
          </p>
        </div>

        {/* 3 Pillar Capabilities Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="card p-6 bg-white border border-[#F0DFD1] rounded-3xl space-y-3 hover:shadow-card-hover transition-all">
            <div className="w-12 h-12 rounded-2xl bg-[#FFF3EA] text-[#F36B0A] flex items-center justify-center border border-[#F36B0A]/20">
              <Hotel className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-lg text-[#24150F]">Hotels &amp; Hospitality</h3>
            <p className="text-xs sm:text-sm text-[#82746B] leading-relaxed">
              Complete guest room packages, oversized acoustic headboards, lobby banquette pods, restaurant dining, and weather-resistant outdoor lounge furniture built to contract-grade durability.
            </p>
          </div>

          <div className="card p-6 bg-white border border-[#F0DFD1] rounded-3xl space-y-3 hover:shadow-card-hover transition-all">
            <div className="w-12 h-12 rounded-2xl bg-[#FFF3EA] text-[#F36B0A] flex items-center justify-center border border-[#F36B0A]/20">
              <Briefcase className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-lg text-[#24150F]">Corporate &amp; Offices</h3>
            <p className="text-xs sm:text-sm text-[#82746B] leading-relaxed">
              Custom solid teak and walnut conference boardroom tables, ergonomic executive workstations, acoustic breakout booths, and reception visitor seating engineered with clean cable management.
            </p>
          </div>

          <div className="card p-6 bg-white border border-[#F0DFD1] rounded-3xl space-y-3 hover:shadow-card-hover transition-all">
            <div className="w-12 h-12 rounded-2xl bg-[#FFF3EA] text-[#F36B0A] flex items-center justify-center border border-[#F36B0A]/20">
              <Layers className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-lg text-[#24150F]">Architect &amp; Developer Fit-Outs</h3>
            <p className="text-xs sm:text-sm text-[#82746B] leading-relaxed">
              We collaborate closely with architectural firms and interior designers, providing 3D CAD visualization review, custom wood staining, material specification, and rapid batch manufacturing.
            </p>
          </div>
        </div>

        {/* Featured Projects Portfolio Grid */}
        <div className="space-y-6 pt-4">
          <SectionHeading
            title="Featured Turnkey Case Studies"
            subtitle="A glimpse into recent spaces furnished by our Abuja project division"
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {commercialProjects.map((proj) => (
              <div
                key={proj.id}
                className="card overflow-hidden rounded-3xl bg-white border border-[#F0DFD1] flex flex-col justify-between hover:shadow-card-hover group transition-all duration-300"
              >
                <div className="aspect-[16/10] overflow-hidden relative">
                  <img
                    src={proj.image}
                    alt={proj.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute top-4 left-4">
                    <span className="bg-[#29160D]/85 backdrop-blur-sm text-white text-[11px] font-bold px-3 py-1 rounded-full border border-white/20">
                      {proj.category}
                    </span>
                  </div>
                </div>

                <div className="p-6 sm:p-7 flex-1 flex flex-col justify-between space-y-4">
                  <div className="space-y-2">
                    <div className="text-xs font-semibold text-[#F36B0A]">
                      {proj.location} • {proj.scope}
                    </div>
                    <h3 className="text-xl font-bold text-[#24150F] group-hover:text-[#F36B0A] transition-colors">
                      {proj.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-[#82746B] leading-relaxed">
                      {proj.description}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-[#F0DFD1] flex flex-wrap gap-1.5">
                    {proj.tags.map((tag) => (
                      <span
                        key={tag}
                        className="bg-[#FFFAF5] text-[#24150F] text-[10px] font-semibold px-2.5 py-1 rounded-md border border-[#F0DFD1]"
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
        <div className="rounded-3xl bg-gradient-to-br from-[#29160D] via-[#3a1a0c] to-[#29160D] text-white p-8 sm:p-12 shadow-xl border border-orange-500/20 flex flex-col lg:flex-row items-center justify-between gap-8">
          <div className="space-y-2 text-center lg:text-left max-w-xl">
            <span className="text-xs font-bold uppercase tracking-widest text-[#F36B0A]">
              Commercial Inquiries &amp; Tenders
            </span>
            <h3 className="text-2xl sm:text-3xl font-extrabold text-white">
              Planning a Hotel, Office or Turnkey Residential Project?
            </h3>
            <p className="text-sm text-white/80 leading-relaxed">
              Our project directors provide commercial quantity pricing, customized finish samples, and dedicated on-site installation timelines in Abuja and nationwide.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-4 shrink-0">
            <a
              href={whatsAppLink}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-whatsapp text-sm py-3 px-6 shadow-md"
            >
              <WhatsAppIcon className="w-5 h-5 fill-white" />
              <span>Discuss Commercial Project</span>
            </a>
            <Link
              to="/contact"
              className="px-6 py-3 rounded-full border border-white/20 bg-white/10 hover:bg-white hover:text-[#29160D] text-sm font-semibold text-white transition-all"
            >
              Submit Project Tender
            </Link>
          </div>
        </div>
      </section>

      {/* 6. ABUJA SHOWROOM LOCATION */}
      <section className="container-page">
        <div className="rounded-3xl bg-gradient-to-br from-[#FFF3EA] via-white to-[#F8EBDD] border border-[#F0DFD1] p-8 sm:p-12 text-center max-w-3xl mx-auto shadow-sm space-y-5">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#24150F]">
            Visit Our Abuja Showroom
          </h2>
          <p className="text-sm sm:text-base text-[#82746B] max-w-xl mx-auto">
            Experience our craftsmanship in person. Test cushion resilience, review timber wood finishes, inspect upholstery swatches, and consult directly with our design architects.
          </p>
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-4">
            <a
              href={buildWhatsAppLink(settings.whatsappNumber, 'Hello Home & More, I would like to book an in-person showroom consultation.')}
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
