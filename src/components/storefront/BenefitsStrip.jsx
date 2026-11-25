import { Truck, Wrench, ShieldCheck, CreditCard } from 'lucide-react';

const benefits = [
  {
    icon: Truck,
    label: 'Fast Abuja Delivery',
    desc: 'Careful door-to-room delivery across Abuja & nationwide freight.',
  },
  {
    icon: Wrench,
    label: 'Expert Installation',
    desc: 'White-glove unboxing, room placement, and full assembly.',
  },
  {
    icon: ShieldCheck,
    label: 'Quality Guarantee',
    desc: 'Kiln-dried solid hardwoods with dedicated after-sales support.',
  },
  {
    icon: CreditCard,
    label: 'Trusted Payments',
    desc: 'Pay securely at our Abuja showroom or via verified bank transfer.',
  },
];

export default function BenefitsStrip() {
  return (
    <section
      aria-label="Home & More Service Guarantees"
      className="bg-[#F3ECE4] border-t border-[#EAE2D9] py-10 sm:py-12"
    >
      <div className="container-page">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          {benefits.map(({ icon: Icon, label, desc }) => (
            <div key={label} className="flex items-start gap-4">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white border border-[#EAE2D9] text-[#F36B0A]">
                <Icon className="h-5 w-5" strokeWidth={1.75} />
              </div>
              <div>
                <h4 className="text-sm font-bold text-[#24150F]">{label}</h4>
                <p className="text-xs text-[#786B62] mt-1 leading-relaxed">{desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
