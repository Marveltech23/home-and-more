import { Gem, Truck, ShieldCheck, Handshake } from 'lucide-react';

const benefits = [
  { icon: Gem, label: 'Kiln-Dried Hardwoods', desc: 'Crafted with treated teak & high-density foam' },
  { icon: Truck, label: 'White-Glove Abuja Delivery', desc: 'Careful room placement and assembly' },
  { icon: ShieldCheck, label: 'Dedicated Support', desc: 'Real furniture consultants on WhatsApp' },
  { icon: Handshake, label: 'Trusted by Customers', desc: 'Over 2,800+ homes furnished in Nigeria' },
];

export default function BenefitsStrip() {
  return (
    <section aria-label="Why choose Home & More Furniture" className="container-page mt-16 sm:mt-20">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 rounded-2xl border border-[#EDE5DC] bg-white/95 backdrop-blur-sm p-6 sm:p-7 shadow-card">
        {benefits.map(({ icon: Icon, label, desc }, i) => (
          <div
            key={label}
            className={`flex items-center gap-4 px-2 py-1.5 ${
              i > 0 ? 'lg:border-l lg:border-[#EDE5DC]' : ''
            }`}
          >
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#FDF5EF] border border-[#E05A00]/20 text-[#E05A00] shadow-xs">
              <Icon className="h-5 w-5" strokeWidth={1.8} />
            </div>
            <div>
              <h4 className="text-sm font-bold text-[#1F1612]">{label}</h4>
              <p className="text-xs text-[#7A6E65] mt-0.5 line-clamp-1">{desc}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
