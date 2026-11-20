import { useState } from 'react';
import { Link } from 'react-router-dom';
import { X, Plus, Minus, Trash2, ArrowRight, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useStore } from '../../context/StoreContext';
import { WhatsAppIcon } from '../common/BrandIcons';
import { buildWhatsAppLink } from '../../utils/whatsapp';

export default function CartDrawer() {
  const { items, isOpen, closeCart, updateQuantity, removeFromCart, subtotal, itemCount, clearCart } = useCart();
  const { settings, addEnquiry } = useStore();

  const [checkoutModalOpen, setCheckoutModalOpen] = useState(false);
  const [customerName, setCustomerName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [deliveryNote, setDeliveryNote] = useState('');
  const [submitted, setSubmitted] = useState(false);

  if (!isOpen) return null;

  // Format Nigerian Naira
  const formatNaira = (amt) => `₦${Number(amt || 0).toLocaleString()}`;

  // WhatsApp checkout message manifest
  const generateWhatsAppMessage = () => {
    let msg = `Hello Home & More Furniture,\nI would like to place an order for the following items from my shopping bag:\n\n`;
    items.forEach((item, index) => {
      msg += `${index + 1}. ${item.name} (${item.quantity}x) - ${formatNaira(item.price * item.quantity)}\n`;
      if (item.selectedColor) msg += `   Color: ${item.selectedColor}\n`;
      if (item.selectedMaterial) msg += `   Material: ${item.selectedMaterial}\n`;
      msg += `\n`;
    });
    msg += `Total Amount: ${formatNaira(subtotal)}\n`;
    msg += `Delivery Destination: Abuja / Nationwide\n\nPlease confirm availability and payment details. Thank you!`;
    return msg;
  };

  const whatsAppOrderLink = buildWhatsAppLink(settings.whatsappNumber, generateWhatsAppMessage());

  const handleInvoiceCheckout = (e) => {
    e.preventDefault();
    if (!customerName.trim() || !phone.trim()) return;

    // Record into store enquiries/orders
    addEnquiry({
      customerName: customerName.trim(),
      phone: phone.trim(),
      email: 'Via Shopping Bag Order',
      productName: items.map((i) => `${i.name} (x${i.quantity})`).join(', '),
      price: subtotal,
      message: `Delivery Address: ${address}\nNotes: ${deliveryNote}\nItems: ${items.map((i) => `${i.name} x${i.quantity} @ ${i.price}`).join(', ')}`,
    });

    setSubmitted(true);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        onClick={closeCart}
        className="absolute inset-0 bg-black/50 backdrop-blur-xs transition-opacity duration-300"
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-[#FBF9F5] text-[#1C1815] shadow-2xl border-l border-[#E8E3DA] flex flex-col justify-between">
          
          {/* Header */}
          <div className="px-6 py-5 border-b border-[#E8E3DA] bg-white flex items-center justify-between">
            <div className="flex items-baseline gap-2">
              <h2 className="font-luxury-serif text-2xl font-normal uppercase tracking-wider">Shopping Bag</h2>
              <span className="text-xs text-[#7A7268] font-sans">({itemCount} {itemCount === 1 ? 'piece' : 'pieces'})</span>
            </div>
            <button
              onClick={closeCart}
              aria-label="Close Bag"
              className="p-2 text-[#7A7268] hover:text-black transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Value Prop Banner */}
          <div className="bg-[#EFECE6] px-6 py-2.5 text-[11px] text-[#5C554E] flex items-center gap-2 border-b border-[#E8E3DA]">
            <ShieldCheck className="w-4 h-4 text-[#B89358] shrink-0" />
            <span>Complimentary white-glove unboxing &amp; room placement in Abuja.</span>
          </div>

          {/* Cart Item List */}
          <div className="flex-1 overflow-y-auto px-6 py-6 divide-y divide-[#E8E3DA]">
            {items.length === 0 ? (
              <div className="py-20 text-center space-y-4">
                <p className="font-luxury-serif text-2xl text-[#1C1815] font-light">Your shopping bag is empty.</p>
                <p className="text-xs text-[#7A7268] max-w-xs mx-auto leading-relaxed">
                  Explore our handcrafted living, dining, bedroom, and executive office collections.
                </p>
                <div className="pt-2">
                  <Link
                    to="/shop"
                    onClick={closeCart}
                    className="btn-primary text-xs tracking-wide-caps inline-block"
                  >
                    Explore Furniture Catalog
                  </Link>
                </div>
              </div>
            ) : (
              items.map((item) => (
                <div key={item.cartItemId} className="py-5 flex gap-4 items-start">
                  {/* Thumbnail */}
                  <div className="w-20 h-24 bg-[#EFECE6] shrink-0 overflow-hidden border border-[#E8E3DA]">
                    <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                  </div>

                  {/* Info */}
                  <div className="flex-1 space-y-1">
                    <Link
                      to={`/product/${item.slug}`}
                      onClick={closeCart}
                      className="font-luxury-serif text-lg text-[#1C1815] hover:text-[#B89358] font-normal leading-snug block transition-colors"
                    >
                      {item.name}
                    </Link>

                    {(item.selectedColor || item.selectedMaterial) && (
                      <p className="text-[11px] text-[#7A7268]">
                        {[item.selectedColor, item.selectedMaterial].filter(Boolean).join(' • ')}
                      </p>
                    )}

                    <p className="text-xs font-semibold text-[#1C1815] pt-0.5">
                      {formatNaira(item.price * item.quantity)}
                      {item.quantity > 1 && (
                        <span className="text-[10px] text-[#7A7268] font-normal ml-1">
                          ({formatNaira(item.price)} each)
                        </span>
                      )}
                    </p>

                    {/* Quantity Stepper & Remove */}
                    <div className="pt-2 flex items-center justify-between">
                      <div className="flex items-center border border-[#E8E3DA] bg-white">
                        <button
                          onClick={() => updateQuantity(item.cartItemId, -1)}
                          className="px-2 py-1 text-xs text-[#7A7268] hover:text-black"
                          aria-label="Decrease quantity"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="px-3 py-1 font-mono text-xs">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.cartItemId, 1)}
                          className="px-2 py-1 text-xs text-[#7A7268] hover:text-black"
                          aria-label="Increase quantity"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>

                      <button
                        onClick={() => removeFromCart(item.cartItemId, item.name)}
                        className="text-[11px] text-[#7A7268] hover:text-[#d32f2f] flex items-center gap-1 transition-colors"
                      >
                        <Trash2 className="w-3 h-3" />
                        <span>Remove</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer & Checkout Area */}
          {items.length > 0 && (
            <div className="px-6 py-6 bg-white border-t border-[#E8E3DA] space-y-4">
              {/* Order Calculations */}
              <div className="space-y-1.5 text-xs text-[#5C554E]">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-medium text-[#1C1815]">{formatNaira(subtotal)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Abuja Room Delivery &amp; Setup</span>
                  <span className="text-[#2e7d32] font-semibold">Complimentary</span>
                </div>
                <div className="flex justify-between text-sm font-semibold text-[#1C1815] pt-2 border-t border-[#E8E3DA]">
                  <span>Estimated Total</span>
                  <span className="font-luxury-serif text-xl">{formatNaira(subtotal)}</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-2 pt-1">
                <a
                  href={whatsAppOrderLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-3.5 bg-[#1C1815] hover:bg-[#B89358] text-white text-xs font-semibold uppercase tracking-wide-caps flex items-center justify-center gap-2 transition-all shadow-sm"
                >
                  <WhatsAppIcon className="w-4 h-4 fill-white" />
                  <span>Order via WhatsApp Concierge</span>
                </a>

                <button
                  onClick={() => setCheckoutModalOpen(true)}
                  className="w-full py-3 border border-[#1C1815] text-[#1C1815] hover:bg-[#FBF9F5] text-xs font-semibold uppercase tracking-wide-caps transition-all"
                >
                  Direct Invoice / Bank Transfer
                </button>
              </div>

              <p className="text-[10px] text-center text-[#7A7268]">
                Prices include all VAT &bull; 10-Year Structural Craftsmanship Warranty
              </p>
            </div>
          )}

        </div>
      </div>

      {/* Direct Invoice Modal */}
      {checkoutModalOpen && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-[#FBF9F5] rounded-sm border border-[#E8E3DA] max-w-md w-full p-6 shadow-2xl relative">
            <button
              onClick={() => {
                setCheckoutModalOpen(false);
                setSubmitted(false);
              }}
              className="absolute top-4 right-4 text-[#7A7268] hover:text-black"
            >
              <X className="w-5 h-5" />
            </button>

            {submitted ? (
              <div className="text-center py-6 space-y-4">
                <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <h3 className="font-luxury-serif text-2xl text-[#1C1815]">Order Reservation Received</h3>
                <p className="text-xs text-[#7A7268] leading-relaxed">
                  Thank you, {customerName}. Your reservation for <strong>{items.length} pieces ({formatNaira(subtotal)})</strong> has been logged. Our Abuja concierge will contact you via phone/WhatsApp within 2 hours with invoice verification and delivery scheduling.
                </p>
                <div className="pt-2">
                  <button
                    onClick={() => {
                      clearCart();
                      setCheckoutModalOpen(false);
                      setSubmitted(false);
                      closeCart();
                    }}
                    className="btn-primary text-xs tracking-wide-caps"
                  >
                    Close &amp; Return to Shop
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleInvoiceCheckout} className="space-y-4">
                <div>
                  <span className="text-[10px] uppercase tracking-ultra-caps text-[#B89358] font-bold">Direct Client Order</span>
                  <h3 className="font-luxury-serif text-2xl text-[#1C1815] mt-0.5">Order Invoice Request</h3>
                  <p className="text-xs text-[#7A7268]">Total: {formatNaira(subtotal)} &bull; {items.length} pieces</p>
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-[#1C1815] mb-1">Full Name *</label>
                  <input
                    type="text"
                    required
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    placeholder="e.g. Arc. Nnamdi Okonjo"
                    className="w-full px-3.5 py-2.5 bg-white border border-[#E8E3DA] text-xs focus:outline-none focus:border-[#1C1815]"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-[#1C1815] mb-1">Phone / WhatsApp Number *</label>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+234 803 351 3144"
                    className="w-full px-3.5 py-2.5 bg-white border border-[#E8E3DA] text-xs focus:outline-none focus:border-[#1C1815]"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-[#1C1815] mb-1">Delivery Address (Abuja / Nationwide)</label>
                  <textarea
                    rows={2}
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="e.g. Plot 14, Maitama District, Abuja"
                    className="w-full px-3.5 py-2.5 bg-white border border-[#E8E3DA] text-xs focus:outline-none focus:border-[#1C1815]"
                  />
                </div>

                <div className="pt-2">
                  <button type="submit" className="w-full btn-primary text-xs tracking-wide-caps">
                    Submit Order Reservation
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
