import { useState, useEffect } from 'react';
import {
  Save,
  RefreshCw,
  RotateCcw,
  Sparkles,
  Layers,
  Image as ImageIcon,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Globe,
} from 'lucide-react';
import Logo from '../../components/common/Logo';
import ImageUploadInput from '../../components/common/ImageUploadInput';
import { useStore } from '../../context/StoreContext';
import { useToast } from '../../components/common/Toast';
import { setBrowserFavicon } from '../../utils/dynamicFavicon';

const LOGO_PRESETS = [
  {
    label: 'Golden Chair Emblem',
    url: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><rect width="100" height="100" rx="20" fill="%2329160D"/><path d="M30 70V50c0-11 9-20 20-20s20 9 20 20v20M30 55h40M38 70v15M62 70v15" stroke="%23F36B0A" stroke-width="6" stroke-linecap="round" fill="none"/></svg>',
  },
  {
    label: 'Nordic House & Hearth',
    url: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><rect width="100" height="100" rx="20" fill="%23F36B0A"/><path d="M50 20L25 45h10v35h30V45h10L50 20z" fill="%23FFFFFF"/><circle cx="50" cy="55" r="8" fill="%2329160D"/></svg>',
  },
  {
    label: 'Modern Luxe Living Crest',
    url: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><circle cx="50" cy="50" r="48" fill="%231E120B" stroke="%23D94D00" stroke-width="4"/><path d="M32 35v30M68 35v30M32 50h36M50 35v30" stroke="%23F36B0A" stroke-width="5" stroke-linecap="round"/></svg>',
  },
];

export default function WebsiteSettings() {
  const { settings, updateSettings, resetToDefaults } = useStore();
  const { addToast } = useToast();

  // Brand & Logo State
  const [businessName, setBusinessName] = useState(settings.businessName || 'Home & More Furniture');
  const [slogan, setSlogan] = useState(settings.slogan || 'Modern Living. Better You.');
  const [logoSubtitle, setLogoSubtitle] = useState(
    settings.logoSubtitle !== undefined ? settings.logoSubtitle : 'FURNITURE'
  );
  const [logoUrl, setLogoUrl] = useState(settings.logoUrl || '');
  const [logoLightUrl, setLogoLightUrl] = useState(settings.logoLightUrl || '');
  const [logoDisplayMode, setLogoDisplayMode] = useState(settings.logoDisplayMode || 'both'); // 'both' | 'image_only'
  const [showLightLogoSection, setShowLightLogoSection] = useState(Boolean(settings.logoLightUrl));

  // Contact Channels
  const [phone, setPhone] = useState(settings.phone || '+234 803 351 3144');
  const [whatsappNumber, setWhatsappNumber] = useState(settings.whatsappNumber || '+2348033513144');
  const [whatsappGreeting, setWhatsappGreeting] = useState(
    settings.whatsappGreeting || 'Hello Home & More Furniture, I would like to enquire about'
  );
  const [email, setEmail] = useState(settings.email || 'Homeandmorefurnitures@gmail.com');
  const [address, setAddress] = useState(
    settings.address || '204 Pa Michael Imoudu Ave, 32 Cres, 3rd Avenue Gwarinpa, 900108, Abuja, Nigeria'
  );
  const [showroomAddress, setShowroomAddress] = useState(
    settings.showroomAddress || '204 Pa Michael Imoudu Ave, 32 Cres, 3rd Avenue Gwarinpa, 900108, Abuja, Nigeria'
  );
  const [factoryAddress, setFactoryAddress] = useState(
    settings.factoryAddress || 'Plot D10 Zauda Pazeri Dei-Dei, Abuja'
  );

  // Social Links
  const [facebook, setFacebook] = useState(settings.social?.facebook || 'https://facebook.com');
  const [instagram, setInstagram] = useState(settings.social?.instagram || 'https://instagram.com');
  const [youtube, setYoutube] = useState(settings.social?.youtube || 'https://youtube.com');

  // Sync form inputs when settings are hydrated from Supabase
  useEffect(() => {
    if (settings) {
      if (settings.businessName) setBusinessName(settings.businessName);
      if (settings.slogan) setSlogan(settings.slogan);
      if (settings.logoSubtitle !== undefined) setLogoSubtitle(settings.logoSubtitle);
      if (settings.logoUrl !== undefined) setLogoUrl(settings.logoUrl);
      if (settings.logoLightUrl !== undefined) setLogoLightUrl(settings.logoLightUrl);
      if (settings.logoDisplayMode) setLogoDisplayMode(settings.logoDisplayMode);
      if (settings.phone) setPhone(settings.phone);
      if (settings.whatsappNumber) setWhatsappNumber(settings.whatsappNumber);
      if (settings.whatsappGreeting) setWhatsappGreeting(settings.whatsappGreeting);
      if (settings.email) setEmail(settings.email);
      if (settings.address) setAddress(settings.address);
      if (settings.showroomAddress) setShowroomAddress(settings.showroomAddress);
      if (settings.factoryAddress) setFactoryAddress(settings.factoryAddress);
      if (settings.social?.facebook) setFacebook(settings.social.facebook);
      if (settings.social?.instagram) setInstagram(settings.social.instagram);
      if (settings.social?.youtube) setYoutube(settings.social.youtube);
    }
  }, [settings]);

  const handleResetLogo = () => {
    setLogoUrl('');
    setLogoLightUrl('');
    setLogoDisplayMode('both');
    setLogoSubtitle('FURNITURE');
    setBrowserFavicon('');
    addToast({ message: 'Logo and browser tab icon reset to default style', type: 'info' });
  };

  const handleLogoChange = (newUrl) => {
    setLogoUrl(newUrl);
    setBrowserFavicon(newUrl);
  };

  const handleSave = (e) => {
    e.preventDefault();
    updateSettings({
      businessName: businessName.trim(),
      slogan: slogan.trim(),
      logoSubtitle: logoSubtitle.trim(),
      logoUrl: logoUrl.trim(),
      logoLightUrl: logoLightUrl.trim(),
      logoDisplayMode,
      phone: phone.trim(),
      whatsappNumber: whatsappNumber.trim(),
      whatsappGreeting: whatsappGreeting.trim(),
      email: email.trim(),
      address: address.trim(),
      showroomAddress: showroomAddress.trim(),
      factoryAddress: factoryAddress.trim(),
      social: {
        facebook: facebook.trim(),
        instagram: instagram.trim(),
        youtube: youtube.trim(),
      },
    });
  };

  const handleResetAll = () => {
    if (window.confirm('Reset all website settings and mock data back to defaults?')) {
      resetToDefaults();
      setBusinessName('Home & More Furniture');
      setSlogan('Modern Living. Better You.');
      setLogoSubtitle('FURNITURE');
      setLogoUrl('');
      setLogoLightUrl('');
      setLogoDisplayMode('both');
    }
  };

  return (
    <div className="space-y-8 max-w-4xl">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#24150F] tracking-tight">
            Website &amp; Store Settings
          </h1>
          <p className="text-xs sm:text-sm text-[#82746B] mt-0.5">
            Configure your brand identity, dynamic logo, contact numbers, and social channels.
          </p>
        </div>

        <button
          type="button"
          onClick={handleResetAll}
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-2xl bg-white border border-[#F0DFD1] text-xs font-semibold text-[#82746B] hover:text-[#F36B0A] hover:border-[#F36B0A] transition-colors"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Reset Demo Data</span>
        </button>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* CARD 1: BRAND IDENTITY & LOGO CUSTOMIZATION */}
        <div className="card p-6 bg-white border border-[#F0DFD1] space-y-6">
          <div className="flex items-center justify-between pb-3 border-b border-[#F0DFD1]">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-[#F36B0A]" />
              <h2 className="text-base font-bold text-[#24150F]">
                Brand Identity &amp; Logo Customizer
              </h2>
            </div>

            <button
              type="button"
              onClick={handleResetLogo}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#82746B] hover:text-[#F36B0A] transition-colors"
              title="Revert back to original signature orange house logo"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Restore Default Logo</span>
            </button>
          </div>

          {/* Business Name, Slogan, and Tagline */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase text-[#24150F] mb-1">
                Business Name *
              </label>
              <input
                type="text"
                value={businessName}
                onChange={(e) => setBusinessName(e.target.value)}
                placeholder="Home & More Furniture"
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
                placeholder="Modern Living. Better You."
                className="w-full px-4 py-2.5 rounded-xl border border-[#F0DFD1] text-xs sm:text-sm focus:outline-none focus:border-[#F36B0A]"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase text-[#24150F] mb-1">
                Logo Subtitle / Tagline
              </label>
              <input
                type="text"
                value={logoSubtitle}
                onChange={(e) => setLogoSubtitle(e.target.value)}
                placeholder="FURNITURE"
                className="w-full px-4 py-2.5 rounded-xl border border-[#F0DFD1] text-xs sm:text-sm focus:outline-none focus:border-[#F36B0A]"
              />
            </div>
          </div>

          {/* Logo Display Mode Choice */}
          <div className="space-y-2 pt-1">
            <label className="block text-xs font-bold uppercase tracking-wider text-[#24150F]">
              Logo Display Style
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setLogoDisplayMode('both')}
                className={`p-3.5 rounded-2xl border text-left transition-all flex items-start gap-3 ${
                  logoDisplayMode === 'both'
                    ? 'border-[#F36B0A] bg-[#FFF3EA] ring-2 ring-[#F36B0A]/20'
                    : 'border-[#F0DFD1] bg-white hover:border-stone-300'
                }`}
              >
                <div
                  className={`w-4 h-4 rounded-full mt-0.5 border flex items-center justify-center shrink-0 ${
                    logoDisplayMode === 'both'
                      ? 'border-[#F36B0A] bg-[#F36B0A]'
                      : 'border-stone-300'
                  }`}
                >
                  {logoDisplayMode === 'both' && (
                    <div className="w-1.5 h-1.5 rounded-full bg-white" />
                  )}
                </div>
                <div>
                  <span className="block text-xs font-bold text-[#24150F]">
                    Emblem / Icon + Brand Name
                  </span>
                  <span className="block text-[11px] text-[#82746B] mt-0.5">
                    Displays your uploaded image/icon next to your brand name and subtitle.
                  </span>
                </div>
              </button>

              <button
                type="button"
                onClick={() => setLogoDisplayMode('image_only')}
                className={`p-3.5 rounded-2xl border text-left transition-all flex items-start gap-3 ${
                  logoDisplayMode === 'image_only'
                    ? 'border-[#F36B0A] bg-[#FFF3EA] ring-2 ring-[#F36B0A]/20'
                    : 'border-[#F0DFD1] bg-white hover:border-stone-300'
                }`}
              >
                <div
                  className={`w-4 h-4 rounded-full mt-0.5 border flex items-center justify-center shrink-0 ${
                    logoDisplayMode === 'image_only'
                      ? 'border-[#F36B0A] bg-[#F36B0A]'
                      : 'border-stone-300'
                  }`}
                >
                  {logoDisplayMode === 'image_only' && (
                    <div className="w-1.5 h-1.5 rounded-full bg-white" />
                  )}
                </div>
                <div>
                  <span className="block text-xs font-bold text-[#24150F]">
                    Full Image Logo (Wordmark / Badge)
                  </span>
                  <span className="block text-[11px] text-[#82746B] mt-0.5">
                    Replaces the entire logo with your image. Best for full logos designed with text.
                  </span>
                </div>
              </button>
            </div>
          </div>

          {/* Primary Logo Upload */}
          <div className="pt-2">
            <ImageUploadInput
              value={logoUrl}
              onChange={handleLogoChange}
              label="Primary Logo Image (Upload from Mac or Web URL)"
              helpText="Upload your custom logo directly from your Mac, phone, or PC (PNG with transparent background recommended, SVG, JPG, WEBP). This automatically updates your browser tab icon too."
              presets={LOGO_PRESETS}
            />
          </div>

          {/* Optional Dark Background Variant */}
          <div className="pt-2 border-t border-[#F0DFD1]">
            <button
              type="button"
              onClick={() => setShowLightLogoSection((prev) => !prev)}
              className="flex items-center justify-between w-full text-left py-2 text-xs font-bold text-[#24150F] hover:text-[#F36B0A] transition-colors"
            >
              <div className="flex items-center gap-2">
                <Layers className="w-4 h-4 text-[#82746B]" />
                <span>Optional: Inverted / White Logo for Dark Backgrounds (Footer &amp; Admin Sidebar)</span>
              </div>
              {showLightLogoSection ? (
                <ChevronUp className="w-4 h-4 text-[#82746B]" />
              ) : (
                <ChevronDown className="w-4 h-4 text-[#82746B]" />
              )}
            </button>

            {showLightLogoSection && (
              <div className="mt-3 p-4 rounded-2xl bg-[#FFFAF5] border border-[#F0DFD1] space-y-2">
                <ImageUploadInput
                  value={logoLightUrl}
                  onChange={(newUrl) => setLogoLightUrl(newUrl)}
                  label="White / Light Logo Variant"
                  helpText="If your primary logo has dark typography, upload an all-white or light version here for the dark footer and admin sidebar. If left empty, the primary logo will be used."
                />
              </div>
            )}
          </div>

          {/* Real-time Interactive Previews */}
          <div className="pt-3 border-t border-[#F0DFD1] space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-[#24150F]">
                Real-Time Live Logo Preview
              </span>
              <span className="text-[11px] text-[#82746B]">
                Updates live as you upload files or edit text
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Light surface (Storefront Header & Login) */}
              <div className="rounded-2xl border border-[#F0DFD1] overflow-hidden bg-white shadow-xs">
                <div className="px-3.5 py-2 bg-stone-50 border-b border-[#F0DFD1] flex items-center justify-between text-[11px] font-bold text-[#82746B]">
                  <span>Storefront Header (Light Surface)</span>
                  <span className="text-emerald-600">Active View</span>
                </div>
                <div className="p-6 flex items-center justify-center min-h-[100px]">
                  <Logo
                    variant="dark"
                    size="md"
                    to={null}
                    overrideLogoUrl={logoUrl}
                    overrideLogoLightUrl={logoLightUrl}
                    overrideDisplayMode={logoDisplayMode}
                    overrideBusinessName={businessName}
                    overrideSubtitle={logoSubtitle}
                  />
                </div>
              </div>

              {/* Dark surface (Footer & Admin Sidebar) */}
              <div className="rounded-2xl border border-[#29160D] overflow-hidden bg-[#29160D] shadow-xs text-white">
                <div className="px-3.5 py-2 bg-black/40 border-b border-white/10 flex items-center justify-between text-[11px] font-bold text-white/70">
                  <span>Footer &amp; Admin Sidebar (Dark Surface)</span>
                  <span className="text-[#F36B0A]">Active View</span>
                </div>
                <div className="p-6 flex items-center justify-center min-h-[100px]">
                  <Logo
                    variant="light"
                    size="md"
                    to={null}
                    overrideLogoUrl={logoUrl}
                    overrideLogoLightUrl={logoLightUrl}
                    overrideDisplayMode={logoDisplayMode}
                    overrideBusinessName={businessName}
                    overrideSubtitle={logoSubtitle}
                  />
                </div>
              </div>

              {/* Browser Tab Favicon Preview */}
              <div className="rounded-2xl border border-[#F0DFD1] overflow-hidden bg-stone-100 shadow-xs sm:col-span-2">
                <div className="px-3.5 py-2 bg-white border-b border-[#F0DFD1] flex items-center justify-between text-[11px] font-bold text-[#82746B]">
                  <div className="flex items-center gap-1.5">
                    <Globe className="w-3.5 h-3.5 text-[#F36B0A]" />
                    <span>Browser Tab Icon (Favicon) Preview</span>
                  </div>
                  <span className="text-emerald-600 font-semibold">Active in Browser Tab</span>
                </div>
                <div className="p-4 bg-stone-200/50 flex items-center justify-start">
                  <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-t-xl bg-white border-t border-x border-stone-300 text-xs shadow-xs max-w-md">
                    <div className="w-4 h-4 rounded-xs overflow-hidden shrink-0 flex items-center justify-center bg-stone-50">
                      {logoUrl ? (
                        <img src={logoUrl} alt="" className="w-full h-full object-contain" />
                      ) : (
                        <img src="/favicon.svg" alt="" className="w-full h-full object-contain" />
                      )}
                    </div>
                    <span className="font-semibold text-stone-800 truncate text-[11px]">
                      {businessName || 'Home & More Furniture'} | {slogan || 'Modern Living. Better You.'}
                    </span>
                    <span className="text-stone-400 text-[10px] ml-1">×</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* CARD 2: CONTACT DETAILS & WHATSAPP ROUTING */}
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
                Primary Contact Address
              </label>
              <input
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-[#F0DFD1] text-xs sm:text-sm focus:outline-none focus:border-[#F36B0A]"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase text-[#24150F] mb-1">
                Abuja Showroom Address
              </label>
              <input
                type="text"
                value={showroomAddress}
                onChange={(e) => setShowroomAddress(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-[#F0DFD1] text-xs sm:text-sm focus:outline-none focus:border-[#F36B0A]"
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase text-[#24150F] mb-1">
                Factory Address
              </label>
              <input
                type="text"
                value={factoryAddress}
                onChange={(e) => setFactoryAddress(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-[#F0DFD1] text-xs sm:text-sm focus:outline-none focus:border-[#F36B0A]"
              />
            </div>
          </div>
        </div>

        {/* CARD 3: SOCIAL LINKS */}
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
