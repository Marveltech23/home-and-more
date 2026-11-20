import { Award, Truck, ShieldCheck, Compass } from 'lucide-react';

const credentials = [
  {
    icon: Award,
    label: 'Kiln-Dried Hardwood Joinery',
    desc: 'Grade-A seasoned teak & birch engineered for Nigeria’s climate.',
  },
  {
    icon: Truck,
    label: 'White-Glove Delivery & Placement',
    desc: 'Unboxing and room placement by our trained logistics team.',
  },
  {
    icon: ShieldCheck,
    label: '10-Year Structural Guarantee',
    desc: 'Every joint is mortise-and-tenoned for generational longevity.',
  },
  {
    icon: Compass,
    label: 'Private Showroom Consultations',
    desc: 'Direct consultation with our architects in Gwarinpa, Abuja.',
  },
];

export default function BenefitsStrip() {
  return (
    <section aria-label="Our Craftsmanship Standards" className="container-page mt-16 sm:mt-24">
      <div className="bg-[#1C1815] text-[#FBF9F5] p-8 sm:p-12 border border-white/10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 divide-y sm:divide-y-0 sm:divide-x divide-white/15">
          {credentials.map(({ icon: Icon, label, desc }, i) => (
            <div
              key={label}
              className={`space-y-3 ${i > 0 ? 'pt-6 sm:pt-0 sm:pl-8' : ''}`}
            >
              <div className="w-10 h-10 flex items-center justify-center text-[#B89358] border border-[#B89358]/30 bg-[#25201B]">
                <Icon className="w-5 h-5" strokeWidth={1.5} />
              </div>
              <h4 className="font-luxury-serif text-lg font-normal tracking-wide text-white">
                {label}
              </h4>
              <p className="text-xs text-white/65 font-light leading-relaxed">
                {desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
