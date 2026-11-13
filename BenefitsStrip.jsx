import { Gem, Truck, ShieldCheck, Handshake } from 'lucide-react';

// Static brand copy (not CMS-managed).
const benefits = [
  { icon: Gem, label: 'Premium Quality' },
  { icon: Truck, label: 'Fast Delivery in Abuja' },
  { icon: ShieldCheck, label: 'Dedicated Support' },
  { icon: Handshake, label: 'Trusted by Customers' },
];

export default function BenefitsStrip() {
  return (
    <section aria-label="Why choose us" className="container-page mt-10">
      <ul className="grid grid-cols-2 gap-y-5 rounded-2xl border border-line bg-gradient-to-r from-beige to-[#fbeee0] px-4 py-5 shadow-card lg:grid-cols-4">
        {benefits.map(({ icon: Icon, label }, i) => (
          <li
            key={label}
            className={`flex items-center justify-center gap-3 px-2 ${i > 0 ? 'lg:border-l lg:border-brand/30' : ''}`}
          >
            <Icon className="h-9 w-9 shrink-0 text-brand" strokeWidth={1.5} />
            <span className="max-w-[8rem] text-sm font-semibold leading-tight text-ink sm:text-base">{label}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}
