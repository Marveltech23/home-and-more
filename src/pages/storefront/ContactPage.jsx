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
    a: 'For in-stock items, delivery within Abuja (Maitama, Asokoro, Wuse 2, Gwarinpa, Jabi, Central Area) takes 24 to 48 hours. Our logistics team handles transport, unboxing, and room placement.',
  },
  {
    q: 'Do you deliver outside of Abuja?',
    a: 'Yes! We deliver across Nigeria (Lagos, Port Harcourt, Kano, Ibadan, Kaduna, etc.) via verified freight partners with wooden crating for protection.',
  },
  {
    q: 'Can I customize dimensions, colors, and upholstery?',
    a: 'Absolutely. We offer full bespoke customization. You can choose from over 60+ fabric swatches (linen, velvet, bouclé, leatherette) and adjust length, depth, and timber stains.',
  },
  {
    q: 'What is your warranty policy?',
    a: 'All our solid wood furniture pieces come with a 12-month structural craftsmanship warranty covering joint integrity, timber stability, and foam resilience.',
  },
  {
    q: 'What payment methods do you accept?',
    a: 'We accept bank transfers, POS card payments at our Abuja showroom, and verified online payments. For custom orders, a 70% production deposit is required.',
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
      message: 'Your message has been received! We will reach out within a few hours.',
      type: 'success',
    });
    setName('');
    setPhone('');
    setEmail('');
    setMessage('');
  };

  const whatsAppLink = buildWhatsAppLink(
    settings.whatsappNumber,
    'Hello Home & More Furniture, I would like to get in touch with your team.'
  );

  return (
    <div className="py-8 sm:py-14 space-y-16">
      <SEO
        title="Contact Us & Showroom Location | Abuja, Nigeria"
        description="Visit Home & More Furniture showroom at 204 Pa Michael Imoudu Ave, 3rd Avenue Gwarinpa, Abuja, or our factory at Plot D10 Zauda Pazeri Dei-Dei. Call or WhatsApp +234 803 351 3144."
        canonical="/contact"
      />

      {/* 1. HEADER */}
      <section className="container-page text-center max-w-2xl mx-auto space-y-3">
        <span className="text-xs sm:text-sm font-bold uppercase tracking-widest text-[#F36B0A]">
          Get In Touch
        </span>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-[#24150F] tracking-tight">
          We'd Love To Hear From You
        </h1>
        <p className="text-sm sm:text-base text-[#82746B]">
          Have questions about our pieces, custom sizing, or showroom visits? Our Abuja consultants are ready to assist.
        </p>
      </section>

      {/* 2. CONTACT CHANNELS & FORM */}
      <section className="container-page">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
          {/* Left Column: Contact Cards */}
          <div className="lg:col-span-5 space-y-4">
            {/* Showroom Address */}
            <div className="card p-6 flex items-start gap-4">
              <div className="w-12 h-12 rounded-2xl bg-[#FFF3EA] text-[#F36B0A] flex items-center justify-center shrink-0 border border-[#F36B0A]/20">
                <MapPin className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-bold text-base text-[#24150F]">Abuja Showroom</h3>
                <p className="text-sm text-[#82746B] mt-1 leading-relaxed">
                  {settings.showroomAddress || settings.address || '204 Pa Michael Imoudu Ave, 32 Cres, 3rd Avenue Gwarinpa, 900108, Abuja, Nigeria'}
                </p>
              </div>
            </div>

            {/* Factory Address */}
            <div className="card p-6 flex items-start gap-4">
              <div className="w-12 h-12 rounded-2xl bg-[#FFF3EA] text-[#F36B0A] flex items-center justify-center shrink-0 border border-[#F36B0A]/20">
                <Building2 className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-bold text-base text-[#24150F]">Factory &amp; Production Workshop</h3>
                <p className="text-sm text-[#82746B] mt-1 leading-relaxed">
                  {settings.factoryAddress || 'Plot D10 Zauda Pazeri Dei-Dei, Abuja'}
                </p>
              </div>
            </div>

            {/* Direct Phone & WhatsApp */}
            <div className="card p-6 flex items-start gap-4">
              <div className="w-12 h-12 rounded-2xl bg-[#FFF3EA] text-[#F36B0A] flex items-center justify-center shrink-0 border border-[#F36B0A]/20">
                <Phone className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-bold text-base text-[#24150F]">Phone Consultation</h3>
                <p className="text-sm text-[#82746B] mt-1">{settings.phone || '+234 803 351 3144'}</p>
                <a
                  href={`tel:${(settings.phone || '+2348033513144').replace(/\s+/g, '')}`}
                  className="text-xs font-semibold text-[#F36B0A] hover:underline mt-1 inline-block"
                >
                  Call Now &rarr;
                </a>
              </div>
            </div>

            {/* Email Address */}
            <div className="card p-6 flex items-start gap-4">
              <div className="w-12 h-12 rounded-2xl bg-[#FFF3EA] text-[#F36B0A] flex items-center justify-center shrink-0 border border-[#F36B0A]/20">
                <Mail className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-bold text-base text-[#24150F]">Email Inquiries</h3>
                <p className="text-sm text-[#82746B] mt-1 break-all">{settings.email || 'Homeandmorefurnitures@gmail.com'}</p>
                <a
                  href={`mailto:${settings.email || 'Homeandmorefurnitures@gmail.com'}`}
                  className="text-xs font-semibold text-[#F36B0A] hover:underline mt-1 inline-block"
                >
                  Send Email &rarr;
                </a>
              </div>
            </div>

            {/* WhatsApp Chat */}
            <div className="card p-6 flex items-start gap-4 border-emerald-200 bg-gradient-to-br from-white to-emerald-50/30">
              <div className="w-12 h-12 rounded-2xl bg-[#25D366]/10 text-[#25D366] flex items-center justify-center shrink-0 border border-[#25D366]/30">
                <WhatsAppIcon className="w-6 h-6 fill-current" />
              </div>
              <div>
                <h3 className="font-bold text-base text-[#24150F]">Instant WhatsApp Support</h3>
                <p className="text-sm text-[#82746B] mt-1">
                  Chat directly with our design consultants for immediate quotes and photos ({settings.phone || '+234 803 351 3144'}).
                </p>
                <a
                  href={whatsAppLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs font-semibold text-[#25D366] hover:underline mt-1.5 inline-block"
                >
                  Start WhatsApp Chat &rarr;
                </a>
              </div>
            </div>

            {/* Opening Hours */}
            <div className="card p-6 flex items-start gap-4">
              <div className="w-12 h-12 rounded-2xl bg-[#FFF3EA] text-[#F36B0A] flex items-center justify-center shrink-0 border border-[#F36B0A]/20">
                <Clock className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-bold text-base text-[#24150F]">Operating Hours</h3>
                <p className="text-sm text-[#82746B] mt-1">Monday – Saturday: 9:00 AM – 7:00 PM</p>
                <p className="text-sm text-[#82746B]">Sunday: 12:00 PM – 5:00 PM</p>
              </div>
            </div>
          </div>

          {/* Right Column: Contact Enquiry Form */}
          <div className="lg:col-span-7">
            <div className="card p-6 sm:p-8 bg-white">
              <h2 className="text-xl font-bold text-[#24150F] mb-1">Send Us a Message</h2>
              <p className="text-xs sm:text-sm text-[#82746B] mb-6">
                Fill in the form below and we will get back to you promptly.
              </p>

              {submitted ? (
                <div className="p-8 rounded-2xl bg-emerald-50 border border-emerald-200 text-center space-y-3">
                  <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>
                  <h3 className="text-lg font-bold text-emerald-900">Message Received!</h3>
                  <p className="text-sm text-emerald-700 max-w-sm mx-auto">
                    Thank you for reaching out to Home &amp; More Furniture. A sales representative will contact you via WhatsApp or phone shortly.
                  </p>
                  <button
                    type="button"
                    onClick={() => setSubmitted(false)}
                    className="btn-primary text-xs py-2 px-5 mt-2"
                  >
                    Send Another Message
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-[#24150F] uppercase mb-1">
                        Full Name *
                      </label>
                      <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="e.g. Tunde Balogun"
                        className="w-full px-4 py-2.5 rounded-xl border border-[#F0DFD1] text-sm focus:outline-none focus:border-[#F36B0A]"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-[#24150F] uppercase mb-1">
                        Phone (WhatsApp) *
                      </label>
                      <input
                        type="tel"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="+234 803 351 3144"
                        className="w-full px-4 py-2.5 rounded-xl border border-[#F0DFD1] text-sm focus:outline-none focus:border-[#F36B0A]"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-[#24150F] uppercase mb-1">
                        Email Address
                      </label>
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="name@example.com"
                        className="w-full px-4 py-2.5 rounded-xl border border-[#F0DFD1] text-sm focus:outline-none focus:border-[#F36B0A]"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-[#24150F] uppercase mb-1">
                        Subject
                      </label>
                      <select
                        value={subject}
                        onChange={(e) => setSubject(e.target.value)}
                        className="w-full px-4 py-2.5 rounded-xl border border-[#F0DFD1] text-sm focus:outline-none focus:border-[#F36B0A] bg-white"
                      >
                        <option value="General Enquiry">General Enquiry</option>
                        <option value="Custom Order / Sizing">Custom Order / Sizing</option>
                        <option value="Showroom Appointment">Showroom Appointment</option>
                        <option value="Interior Design Project">Interior Design Project</option>
                        <option value="Delivery Status">Delivery Status</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#24150F] uppercase mb-1">
                      How can we help? *
                    </label>
                    <textarea
                      rows={4}
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="Tell us about the furniture piece you're interested in or your room requirements..."
                      className="w-full px-4 py-2.5 rounded-xl border border-[#F0DFD1] text-sm focus:outline-none focus:border-[#F36B0A]"
                      required
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full btn-primary text-sm py-3.5 flex items-center justify-center gap-2 shadow-md"
                  >
                    <Send className="w-4 h-4" />
                    <span>Send Message</span>
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* 3. FREQUENTLY ASKED QUESTIONS */}
      <section className="container-page max-w-3xl mx-auto">
        <SectionHeading
          title="Frequently Asked Questions"
          subtitle="Answers to common questions regarding delivery, custom orders and quality"
          className="text-center"
        />

        <div className="space-y-3">
          {faqs.map((faq, index) => {
            const isOpen = openFaq === index;
            return (
              <div
                key={index}
                className="card overflow-hidden border border-[#F0DFD1] transition-all"
              >
                <button
                  type="button"
                  onClick={() => setOpenFaq(isOpen ? -1 : index)}
                  className="w-full flex items-center justify-between p-5 text-left font-bold text-sm sm:text-base text-[#24150F] hover:text-[#F36B0A] transition-colors"
                >
                  <span>{faq.q}</span>
                  <ChevronDown
                    className={`w-4 h-4 text-[#F36B0A] transition-transform duration-200 shrink-0 ${
                      isOpen ? 'rotate-180' : ''
                    }`}
                  />
                </button>
                {isOpen && (
                  <div className="px-5 pb-5 text-xs sm:text-sm text-[#82746B] leading-relaxed border-t border-[#F0DFD1]/50 pt-3">
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
