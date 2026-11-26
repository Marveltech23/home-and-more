import AdBannerRenderer from './AdBannerRenderer';
import { useStore } from '../../context/StoreContext';

function isWithinSchedule(ad) {
  if (!ad) return false;
  const today = new Date().toISOString().split('T')[0];
  if (ad.startDate && ad.startDate > today) return false;
  if (ad.endDate && ad.endDate < today) return false;
  return true;
}

/**
 * Dynamic 2-Slot Homepage Promotional Advertisement Section.
 * - Loads Advertisement 1 (slot_1 / legacy hero_bottom) and Advertisement 2 (slot_2)
 *   dynamically from Admin-managed Supabase data.
 * - Displays side-by-side on desktop/tablet when both slots are active & published.
 * - Expands cleanly to a single full-width banner when only 1 slot is active.
 * - Stacks vertically on mobile without clipping or horizontal overflow.
 * - Renders nothing if both slots are disabled or draft.
 */
export default function PromotionalAd() {
  const { advertisements } = useStore();

  const liveAds = (advertisements || []).filter(
    (a) => a.isActive !== false && a.status !== 'draft' && isWithinSchedule(a)
  );

  // Single full-width panoramic middle banner (exact 1024x318 / 1920x600 proportion)
  const middleAd =
    liveAds.find((a) => a.slotPosition === 'slot_1' || a.placement === 'slot_1') ||
    liveAds.find((a) => a.placement === 'hero_bottom');

  if (!middleAd) return null;

  return (
    <section
      className="container-page pb-14 sm:pb-16"
      aria-label={middleAd.name || 'Featured Showroom Promotion'}
    >
      <AdBannerRenderer ad={middleAd} isSingleFullWidth />
    </section>
  );
}
