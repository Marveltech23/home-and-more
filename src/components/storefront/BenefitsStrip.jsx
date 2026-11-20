import { Gem, Truck, ShieldCheck, Handshake } from 'lucide-react';

const benefits = [
  { icon: Gem, label: 'Premium Quality', desc: 'Crafted with kiln-dried hardwoods & luxury fabrics' },
  { icon: Truck, label: 'Fast Delivery in Abuja', desc: 'Careful white-glove setup and delivery' },
  { icon: ShieldCheck, label: 'Dedicated Support', desc: 'Real furniture consultants on WhatsApp' },
  { icon: Handshake, label: 'Trusted by Customers', desc: 'Over 2,800+ homes furnished in Nigeria' },
];

export default function BenefitsStrip() {
  return (
    <section aria-label="Why choose Home & More Furniture" className="container-page mt-14 sm:mt-16">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 rounded-2xl border border-[#F0DFD1] bg-gradient-to-r from-[#FFFBF7] via-[#F8EBDD]/60 to-[#FFFBF7] p-5 sm:p-6 shadow-sm">
        {benefits.map(({ icon: Icon, label, desc }, i) => (
          <div
            key={label}
            className={`flex items-center gap-4 px-3 py-2 ${
              i > 0 ? 'lg:border-l lg:border-[#F0DFD1]' : ''
            }`}
          >
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white shadow-sm border border-[#F0DFD1] text-[#F36B0A]">
              <Icon className="h-6 w-6" strokeWidth={1.75} />
            </div>
            <div>
              <h4 className="text-sm font-bold text-[#24150F]">{label}</h4>
              <p className="text-xs text-[#82746B] mt-0.5 line-clamp-1">{desc}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
