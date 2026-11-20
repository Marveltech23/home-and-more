import { useState } from 'react';
import { Phone, Mail, MapPin, Clock, MessageSquare, Send, ChevronDown, CheckCircle2, Building2 } from 'lucide-react';
import SectionHeading from '../../components/common/SectionHeading';
import SEO from '../../components/common/SEO';
import { WhatsAppIcon } from '../../components/common/BrandIcons';
import { useStore } from '../../context/StoreContext';
import { useToast } from '../../components/common/Toast';
import { buildWhatsAppLink } from '../../utils/whatsapp';

const faqs = [
  {
    q: 'How fast is furniture delivery within Abuja?',
    a: 'For in-stock suites and catalog items, delivery within Abuja (Maitama, Asokoro, Wuse 2, Gwarinpa, Jabi, Central Area) is dispatched within 24 to 48 hours. Our dedicated logistics team handles white-glove transport, unboxing, and room placement.',
  },
  {
    q: 'Do you deliver outside of Abuja?',
    a: 'Yes. We deliver across Nigeria (Lagos, Port Harcourt, Kano, Ibadan, Kaduna, etc.) via verified freight partners using custom-built wooden protective crating.',
  },
  {
    q: 'Can I customize dimensions, finishes, and upholstery?',
    a: 'Absolutely. We offer complete bespoke customization. You can choose from over 80+ imported fabric swatches (Belgian linen, bouclé, Italian velvet, premium leatherette) and specify exact room dimensions and timber stains.',
  },
  {
    q: 'What is your warranty policy?',
    a: 'All our solid wood furniture pieces come with a 10-year structural integrity guarantee covering joint construction, kiln-dried timber stability, and internal framing.',
  },
  {
    q: 'What payment and commission methods do you accept?',
    a: 'We accept bank transfers, POS card payments at our Abuja showroom, and verified online payments. For bespoke architectural commissions, a 70% production deposit is standard.',
  },
];

export default function ContactPage() {
  const { settings, addEnquiry } = useStore();
  const { addToast } = useToast();

  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('General Enquiry');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [openFaq, setOpenFaq] = useState(0);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim() || !phone.trim() || !message.trim()) {
      addToast({ message: 'Please fill in all required fields', type: 'error' });
      return;
    }

    addEnquiry({
      customerName: name.trim(),
      phone: phone.trim(),
      email: email.trim() || 'Not provided',
      productName: subject,
      price: 0,
      message: message.trim(),
    });

    setSubmitted(true);
    addToast({
      message: 'Your inquiry has been received. Our concierge will reach out promptly.',
      type: 'success',
    });
    setName('');
    setPhone('');
    setEmail('');
    setMessage('');
  };

  const whatsAppLink = buildWhatsAppLink(
    settings.whatsappNumber || '+2348033513144',
    'Hello Home & More Concierge, I would like to schedule a private showroom consultation or inquire about a bespoke commission.'
  );

  return (
    <div className="bg-[#FBF9F5] min-h-screen py-10 sm:py-16 space-y-16">
      <SEO
        title="Contact & Showroom Atelier | Home & More Abuja"
        description="Visit Home & More Furniture flagship showroom at 204 Pa Michael Imoudu Ave, 3rd Avenue Gwarinpa, Abuja, or our Dei-Dei joinery factory. Call or WhatsApp +234 803 351 3144."
        canonical="/contact"
      />

      {/* 1. EDITORIAL HEADER */}
      <section className="container-page text-center max-w-2xl mx-auto space-y-3">
        <span className="text-[11px] font-semibold uppercase tracking-ultra-caps text-[#8C6D3B]">
          Private Consultations &amp; Concierge
        </span>
        <h1 className="text-3xl sm:text-5xl font-luxury-serif font-light text-[#1C1815] tracking-tight">
          Connect With Our Atelier
        </h1>
        <p className="text-xs sm:text-sm text-[#70685E] font-light leading-relaxed">
          Whether you are furnishing a private residence, planning a boutique hospitality fit-out, or scheduling a visit to our Gwarinpa showroom, our consultants are at your service.
        </p>
      </section>

      {/* 2. CONTACT CHANNELS & FORM */}
      <section className="container-page">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
          {/* Left Column: Contact Cards */}
          <div className="lg:col-span-5 space-y-4">
            {/* Showroom Address */}
            <div className="p-6 bg-[#EFECE6]/50 border border-[#E8E3DA] flex items-start gap-4">
              <div className="w-10 h-10 border border-[#8C6D3B]/30 text-[#8C6D3B] flex items-center justify-center shrink-0">
                <MapPin className="w-5 h-5 stroke-[1.2]" />
              </div>
              <div className="space-y-1">
                <span className="text-[10px] uppercase tracking-ultra-caps text-[#8C6D3B] font-semibold">
                  Flagship Showroom
                </span>
                <h3 className="font-luxury-serif text-base text-[#1C1815]">Abuja Experience Gallery</h3>
                <p className="text-xs text-[#70685E] leading-relaxed font-light">
                  {settings.showroomAddress || settings.address || '204 Pa Michael Imoudu Ave, 32 Cres, 3rd Avenue Gwarinpa, 900108, Abuja, Nigeria'}
                </p>
              </div>
            </div>

            {/* Factory Address */}
            <div className="p-6 bg-[#EFECE6]/50 border border-[#E8E3DA] flex items-start gap-4">
              <div className="w-10 h-10 border border-[#8C6D3B]/30 text-[#8C6D3B] flex items-center justify-center shrink-0">
                <Building2 className="w-5 h-5 stroke-[1.2]" />
              </div>
              <div className="space-y-1">
                <span className="text-[10px] uppercase tracking-ultra-caps text-[#8C6D3B] font-semibold">
                  Joinery Factory
                </span>
                <h3 className="font-luxury-serif text-base text-[#1C1815]">Dei-Dei Production Workshop</h3>
                <p className="text-xs text-[#70685E] leading-relaxed font-light">
                  {settings.factoryAddress || 'Plot D10 Zauda Pazeri Dei-Dei, Abuja, Nigeria'}
                </p>
              </div>
            </div>

            {/* Direct Phone & WhatsApp */}
            <div className="p-6 bg-[#EFECE6]/50 border border-[#E8E3DA] flex items-start gap-4">
              <div className="w-10 h-10 border border-[#8C6D3B]/30 text-[#8C6D3B] flex items-center justify-center shrink-0">
                <Phone className="w-5 h-5 stroke-[1.2]" />
              </div>
              <div className="space-y-1">
                <span className="text-[10px] uppercase tracking-ultra-caps text-[#8C6D3B] font-semibold">
                  Direct Line
                </span>
                <h3 className="font-luxury-serif text-base text-[#1C1815]">Telephone Consultation</h3>
                <p className="text-xs text-[#70685E]">{settings.phone || '+234 803 351 3144'}</p>
                <a
                  href={`tel:${(settings.phone || '+2348033513144').replace(/\s+/g, '')}`}
                  className="text-[11px] uppercase tracking-ultra-caps text-[#8C6D3B] hover:text-[#1C1815] transition-colors inline-block pt-1"
                >
                  Call Atelier &rarr;
                </a>
              </div>
            </div>

            {/* Email Address */}
            <div className="p-6 bg-[#EFECE6]/50 border border-[#E8E3DA] flex items-start gap-4">
              <div className="w-10 h-10 border border-[#8C6D3B]/30 text-[#8C6D3B] flex items-center justify-center shrink-0">
                <Mail className="w-5 h-5 stroke-[1.2]" />
              </div>
              <div className="space-y-1">
                <span className="text-[10px] uppercase tracking-ultra-caps text-[#8C6D3B] font-semibold">
                  Written Correspondence
                </span>
                <h3 className="font-luxury-serif text-base text-[#1C1815]">Email Enquiries</h3>
                <p className="text-xs text-[#70685E] break-all">{settings.email || 'Homeandmorefurnitures@gmail.com'}</p>
                <a
                  href={`mailto:${settings.email || 'Homeandmorefurnitures@gmail.com'}`}
                  className="text-[11px] uppercase tracking-ultra-caps text-[#8C6D3B] hover:text-[#1C1815] transition-colors inline-block pt-1"
                >
                  Send Dispatch &rarr;
                </a>
              </div>
            </div>

            {/* WhatsApp Chat Card */}
            <div className="p-6 bg-[#1C1815] text-[#FBF9F5] border border-[#35302B] flex items-start gap-4">
              <div className="w-10 h-10 bg-[#25D366]/20 text-[#25D366] flex items-center justify-center shrink-0">
                <WhatsAppIcon className="w-5 h-5 fill-[#25D366]" />
              </div>
              <div className="space-y-1.5">
                <span className="text-[10px] uppercase tracking-ultra-caps text-[#C4A470] font-semibold">
                  Instant Response
                </span>
                <h3 className="font-luxury-serif text-base text-[#FBF9F5]">WhatsApp Concierge</h3>
                <p className="text-xs text-[#A69E93] leading-relaxed font-light">
                  Speak directly with an interior advisor for fabric swatches, high-res photos, and instant estimates.
                </p>
                <a
                  href={whatsAppLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs text-[#25D366] hover:underline pt-1"
                >
                  <span>Open WhatsApp (+234 803 351 3144) &rarr;</span>
                </a>
              </div>
            </div>

            {/* Operating Hours */}
            <div className="p-6 bg-[#EFECE6]/50 border border-[#E8E3DA] flex items-start gap-4">
              <div className="w-10 h-10 border border-[#8C6D3B]/30 text-[#8C6D3B] flex items-center justify-center shrink-0">
                <Clock className="w-5 h-5 stroke-[1.2]" />
              </div>
              <div className="space-y-1">
                <span className="text-[10px] uppercase tracking-ultra-caps text-[#8C6D3B] font-semibold">
                  Showroom Schedule
                </span>
                <h3 className="font-luxury-serif text-base text-[#1C1815]">Hours of Reception</h3>
                <p className="text-xs text-[#70685E] font-light">Monday – Saturday: 9:00 AM – 7:00 PM</p>
                <p className="text-xs text-[#70685E] font-light">Sunday: 12:00 PM – 5:00 PM</p>
              </div>
            </div>
          </div>

          {/* Right Column: Contact Enquiry Form */}
          <div className="lg:col-span-7">
            <div className="p-8 sm:p-10 bg-white border border-[#E8E3DA]">
              <div className="space-y-2 mb-8">
                <span className="text-[10px] uppercase tracking-ultra-caps text-[#8C6D3B] font-semibold">
                  Direct Dispatch
                </span>
                <h2 className="text-2xl font-luxury-serif font-light text-[#1C1815]">
                  Initiate a Private Consultation
                </h2>
                <p className="text-xs text-[#70685E] font-light">
                  Provide your project details and a member of our senior interior team will get in touch.
                </p>
              </div>

              {submitted ? (
                <div className="p-10 bg-[#EFECE6]/50 border border-[#E8E3DA] text-center space-y-4">
                  <div className="w-12 h-12 rounded-full border border-[#8C6D3B] text-[#8C6D3B] flex items-center justify-center mx-auto">
                    <CheckCircle2 className="w-6 h-6 stroke-[1.2]" />
                  </div>
                  <h3 className="text-xl font-luxury-serif text-[#1C1815]">Inquiry Received</h3>
                  <p className="text-xs text-[#70685E] max-w-sm mx-auto font-light leading-relaxed">
                    Thank you for reaching out to Home &amp; More Furniture. Our concierge will review your requirements and reach out via WhatsApp or phone promptly.
                  </p>
                  <button
                    type="button"
                    onClick={() => setSubmitted(false)}
                    className="btn-luxury text-xs px-6 py-2.5 mt-2"
                  >
                    Submit Another Inquiry
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-[11px] font-semibold text-[#1C1815] uppercase tracking-wider mb-1.5">
                        Full Name *
                      </label>
                      <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="e.g. Dr. Aminu Ibrahim"
                        className="w-full px-4 py-3 bg-[#FBF9F5] border border-[#E8E3DA] text-xs text-[#1C1815] focus:outline-none focus:border-[#1C1815] transition-colors"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-[#1C1815] uppercase tracking-wider mb-1.5">
                        WhatsApp Phone *
                      </label>
                      <input
                        type="tel"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="+234 803 351 3144"
                        className="w-full px-4 py-3 bg-[#FBF9F5] border border-[#E8E3DA] text-xs text-[#1C1815] focus:outline-none focus:border-[#1C1815] transition-colors"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-[11px] font-semibold text-[#1C1815] uppercase tracking-wider mb-1.5">
                        Email Address
                      </label>
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="name@domain.com"
                        className="w-full px-4 py-3 bg-[#FBF9F5] border border-[#E8E3DA] text-xs text-[#1C1815] focus:outline-none focus:border-[#1C1815] transition-colors"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-[#1C1815] uppercase tracking-wider mb-1.5">
                        Area of Interest
                      </label>
                      <select
                        value={subject}
                        onChange={(e) => setSubject(e.target.value)}
                        className="w-full px-4 py-3 bg-[#FBF9F5] border border-[#E8E3DA] text-xs text-[#1C1815] focus:outline-none focus:border-[#1C1815] transition-colors"
                      >
                        <option value="General Enquiry">General Inquiry</option>
                        <option value="Living Room Suite / Sectional">Living Room Suite / Sectional</option>
                        <option value="Executive Office Joinery">Executive Office Joinery</option>
                        <option value="Private Showroom Appointment">Private Showroom Appointment</option>
                        <option value="Hotel / Commercial Fit-Out">Hotel / Commercial Fit-Out</option>
                        <option value="Kitchen Cabinetry & Tiles">Kitchen Cabinetry &amp; Tiles</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-[#1C1815] uppercase tracking-wider mb-1.5">
                      Your Requirements *
                    </label>
                    <textarea
                      rows={5}
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="Describe your room dimensions, desired upholstery, timber stains, or project scope..."
                      className="w-full px-4 py-3 bg-[#FBF9F5] border border-[#E8E3DA] text-xs text-[#1C1815] focus:outline-none focus:border-[#1C1815] transition-colors leading-relaxed"
                      required
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full btn-luxury text-xs py-3.5 flex items-center justify-center gap-2"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Transmit Dispatch to Concierge</span>
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* 3. FREQUENTLY ASKED QUESTIONS */}
      <section className="container-page max-w-3xl mx-auto space-y-8">
        <div className="text-center space-y-2">
          <span className="text-[11px] uppercase tracking-ultra-caps text-[#8C6D3B] font-semibold">
            Common Inquiries
          </span>
          <h2 className="text-2xl sm:text-3xl font-luxury-serif font-light text-[#1C1815]">
            Frequently Addressed Questions
          </h2>
          <p className="text-xs text-[#70685E] font-light">
            Details regarding delivery timelines, custom dimensions, timber durability, and guarantees.
          </p>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, index) => {
            const isOpen = openFaq === index;
            return (
              <div
                key={index}
                className="border border-[#E8E3DA] bg-white transition-all"
              >
                <button
                  type="button"
                  onClick={() => setOpenFaq(isOpen ? -1 : index)}
                  className="w-full flex items-center justify-between p-5 text-left font-luxury-serif text-base text-[#1C1815] hover:text-[#8C6D3B] transition-colors"
                >
                  <span>{faq.q}</span>
                  <ChevronDown
                    className={`w-4 h-4 text-[#8C6D3B] transition-transform duration-200 shrink-0 ${
                      isOpen ? 'rotate-180' : ''
                    }`}
                  />
                </button>
                {isOpen && (
                  <div className="px-5 pb-5 text-xs text-[#70685E] font-light leading-relaxed border-t border-[#E8E3DA] pt-3">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
