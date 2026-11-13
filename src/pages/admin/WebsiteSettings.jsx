import { useState } from 'react';
import { Save, RefreshCw, CheckCircle2, Shield, Phone, Mail, MapPin, Globe, Share2 } from 'lucide-react';
import Logo from '../../components/common/Logo';
import { useStore } from '../../context/StoreContext';
import { useToast } from '../../components/common/Toast';

export default function WebsiteSettings() {
  const { settings, updateSettings, resetToDefaults } = useStore();
  const { addToast } = useToast();

  const [businessName, setBusinessName] = useState(settings.businessName || 'Home & More Furniture');
  const [slogan, setSlogan] = useState(settings.slogan || 'Modern Living. Better You.');
  const [phone, setPhone] = useState(settings.phone || '+234 801 234 5678');
  const [whatsappNumber, setWhatsappNumber] = useState(settings.whatsappNumber || '+2348012345678');
  const [whatsappGreeting, setWhatsappGreeting] = useState(settings.whatsappGreeting || 'Hello Home & More Furniture, I would like to enquire about');
  const [email, setEmail] = useState(settings.email || 'hello@homeandmorefurniture.ng');
  const [address, setAddress] = useState(settings.address || 'Plot 1042 Ahmadu Bello Way, Central Business District, Abuja, Nigeria');

  // Social Links
  const [facebook, setFacebook] = useState(settings.social?.facebook || 'https://facebook.com');
  const [instagram, setInstagram] = useState(settings.social?.instagram || 'https://instagram.com');
  const [youtube, setYoutube] = useState(settings.social?.youtube || 'https://youtube.com');

  const handleSave = (e) => {
    e.preventDefault();
    updateSettings({
      businessName: businessName.trim(),
      slogan: slogan.trim(),
      phone: phone.trim(),
      whatsappNumber: whatsappNumber.trim(),
      whatsappGreeting: whatsappGreeting.trim(),
      email: email.trim(),
      address: address.trim(),
      social: {
        facebook: facebook.trim(),
        instagram: instagram.trim(),
        youtube: youtube.trim(),
      },
    });
  };

  return (
    <div className="space-y-8 max-w-4xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#24150F] tracking-tight">
            Website &amp; Store Settings
          </h1>
          <p className="text-xs sm:text-sm text-[#82746B] mt-0.5">
            Configure your brand identity, phone numbers, Abuja showroom address, and social channels.
          </p>
        </div>

        <button
          type="button"
          onClick={resetToDefaults}
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-2xl bg-white border border-[#F0DFD1] text-xs font-semibold text-[#82746B] hover:text-[#F36B0A] hover:border-[#F36B0A] transition-colors"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Reset Demo Data</span>
        </button>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* Card 1: Brand Identity */}
        <div className="card p-6 bg-white border border-[#F0DFD1] space-y-4">
          <h2 className="text-base font-bold text-[#24150F] pb-2 border-b border-[#F0DFD1]">
            Brand Identity &amp; Logo Preview
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase text-[#24150F] mb-1">
                Business Name *
              </label>
              <input
                type="text"
                value={businessName}
                onChange={(e) => setBusinessName(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-[#F0DFD1] text-xs sm:text-sm focus:outline-none focus:border-[#F36B0A]"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase text-[#24150F] mb-1">
                Brand Slogan *
              </label>
              <input
                type="text"
                value={slogan}
                onChange={(e) => setSlogan(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-[#F0DFD1] text-xs sm:text-sm focus:outline-none focus:border-[#F36B0A]"
                required
              />
            </div>
          </div>

          {/* Logo Live Preview Display */}
          <div className="pt-2">
            <span className="text-[11px] font-bold text-[#82746B] uppercase tracking-wider block mb-2">
              Live Logo Rendering:
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 rounded-2xl bg-white border border-[#F0DFD1] flex items-center justify-center">
                <Logo variant="dark" size="md" />
              </div>
              <div className="p-4 rounded-2xl bg-[#29160D] border border-white/10 flex items-center justify-center">
                <Logo variant="light" size="md" />
              </div>
            </div>
          </div>
        </div>

        {/* Card 2: Contact Details & WhatsApp Routing */}
        <div className="card p-6 bg-white border border-[#F0DFD1] space-y-4">
          <h2 className="text-base font-bold text-[#24150F] pb-2 border-b border-[#F0DFD1]">
            Contact Channels &amp; WhatsApp Integration
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase text-[#24150F] mb-1">
                Display Phone Number *
              </label>
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-[#F0DFD1] text-xs sm:text-sm focus:outline-none focus:border-[#F36B0A]"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase text-[#24150F] mb-1">
                WhatsApp Direct Number (Digits only with country code) *
              </label>
              <input
                type="text"
                value={whatsappNumber}
                onChange={(e) => setWhatsappNumber(e.target.value)}
                placeholder="+2348012345678"
                className="w-full px-4 py-2.5 rounded-xl border border-[#F0DFD1] text-xs sm:text-sm focus:outline-none focus:border-[#F36B0A]"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase text-[#24150F] mb-1">
              Default WhatsApp Greeting Prefix
            </label>
            <input
              type="text"
              value={whatsappGreeting}
              onChange={(e) => setWhatsappGreeting(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-[#F0DFD1] text-xs sm:text-sm focus:outline-none focus:border-[#F36B0A]"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase text-[#24150F] mb-1">
                Customer Support Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-[#F0DFD1] text-xs sm:text-sm focus:outline-none focus:border-[#F36B0A]"
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase text-[#24150F] mb-1">
                Abuja Showroom Address
              </label>
              <input
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-[#F0DFD1] text-xs sm:text-sm focus:outline-none focus:border-[#F36B0A]"
              />
            </div>
          </div>
        </div>

        {/* Card 3: Social Links */}
        <div className="card p-6 bg-white border border-[#F0DFD1] space-y-4">
          <h2 className="text-base font-bold text-[#24150F] pb-2 border-b border-[#F0DFD1]">
            Social Media Channels
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase text-[#24150F] mb-1">
                Facebook URL
              </label>
              <input
                type="url"
                value={facebook}
                onChange={(e) => setFacebook(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-[#F0DFD1] text-xs sm:text-sm focus:outline-none focus:border-[#F36B0A]"
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase text-[#24150F] mb-1">
                Instagram URL
              </label>
              <input
                type="url"
                value={instagram}
                onChange={(e) => setInstagram(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-[#F0DFD1] text-xs sm:text-sm focus:outline-none focus:border-[#F36B0A]"
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase text-[#24150F] mb-1">
                YouTube URL
              </label>
              <input
                type="url"
                value={youtube}
                onChange={(e) => setYoutube(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-[#F0DFD1] text-xs sm:text-sm focus:outline-none focus:border-[#F36B0A]"
              />
            </div>
          </div>
        </div>

        {/* Save Button */}
        <div className="flex items-center justify-end">
          <button type="submit" className="btn-primary text-xs sm:text-sm py-3 px-8 shadow-md">
            <Save className="w-4 h-4" />
            <span>Save All Settings</span>
          </button>
        </div>
      </form>
    </div>
  );
}
