/** Build a wa.me link. `number` may contain +, spaces or dashes. */
export function buildWhatsAppLink(number, message = '') {
  const digits = String(number || '').replace(/\D/g, '');
  const text = message ? `?text=${encodeURIComponent(message)}` : '';
  return `https://wa.me/${digits}${text}`;
}
