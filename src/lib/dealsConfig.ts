/**
 * Deals Configuration
 * ─────────────────────────────────────────────────────────────────────────────
 * All deal timings, discounts, and copy live here.
 * The restaurant owner only needs to edit this file to update any deal.
 */

export interface TimeDeal {
  id: string;
  label: string;
  description: string;
  /** 24-hour format */
  startHour: number;
  endHour: number;
  discount: string;
  code: string;
  emoji: string;
  color: string; // Tailwind bg class for accent
}

export interface CartDeal {
  id: string;
  type: "threshold" | "upsell" | "bulk";
  label: string;
  description: string;
  emoji: string;
  /** For threshold: minimum cart value in PKR */
  minCartValue?: number;
  /** For threshold: how much more to add */
  targetCartValue?: number;
  /** For bulk: minimum item count */
  minItems?: number;
  /** For bulk: discount percentage */
  discountPercent?: number;
  /** For upsell: keyword to match in item names (lowercase) */
  triggerKeyword?: string;
  /** For upsell: upsell offer text */
  upsellText?: string;
  code?: string;
}

export interface SpinWheelSlice {
  label: string;
  code: string | null;
  /** Weight for random selection (higher = more likely) */
  weight: number;
  color: string;
  emoji: string;
}

// ─── Time-Based Deals ────────────────────────────────────────────────────────

export const TIME_DEALS: TimeDeal[] = [
  {
    id: "happy-hour",
    label: "Happy Hour",
    description: "15% off all beverages",
    startHour: 15, // 3 PM
    endHour: 18,   // 6 PM
    discount: "15% OFF Beverages",
    code: "HAPPY15",
    emoji: "🍹",
    color: "#8B5CF6",
  },
  {
    id: "lunch-special",
    label: "Lunch Special",
    description: "Combo meals at fixed price",
    startHour: 12, // 12 PM
    endHour: 15,   // 3 PM
    discount: "Combo Meals Fixed Price",
    code: "LUNCH22",
    emoji: "🥗",
    color: "#10B981",
  },
  {
    id: "late-night",
    label: "Late Night Bites",
    description: "Buy 1 Get 1 on selected items",
    startHour: 22, // 10 PM
    endHour: 24,   // 12 AM (midnight)
    discount: "Buy 1 Get 1 Free",
    code: "BOGO99",
    emoji: "🌙",
    color: "#3B82F6",
  },
];

// ─── Cart-Based Deals ────────────────────────────────────────────────────────

export const CART_DEALS: CartDeal[] = [
  {
    id: "free-delivery",
    type: "threshold",
    label: "Free Delivery Unlocked!",
    description: "Add PKR {remaining} more for free delivery",
    emoji: "🛵",
    minCartValue: 0,
    targetCartValue: 1500,
  },
  {
    id: "burger-upsell",
    type: "upsell",
    label: "Complete Your Meal!",
    description: "Add fries + drink for only PKR 199 more",
    emoji: "🍟",
    triggerKeyword: "burger",
    upsellText: "Add fries + drink for only PKR 199 more",
    code: "COMBO199",
  },
  {
    id: "bulk-discount",
    type: "bulk",
    label: "Bulk Order Discount",
    description: "5% off automatically applied — you have {count} items!",
    emoji: "🎉",
    minItems: 3,
    discountPercent: 5,
    code: "BULK5",
  },
];

// ─── Welcome Deal ────────────────────────────────────────────────────────────

export const WELCOME_DEAL = {
  code: "WELCOME20",
  discount: "20% OFF",
  description: "Your first order discount — auto-applied at checkout!",
  emoji: "🎁",
};

// ─── Spin Wheel Slices ───────────────────────────────────────────────────────

export const SPIN_WHEEL_SLICES: SpinWheelSlice[] = [
  { label: "Free Drink",      code: "FREEDRINK",  weight: 15, color: "#3B82F6", emoji: "🥤" },
  { label: "10% Off",         code: "SPIN10",     weight: 25, color: "#10B981", emoji: "🏷️" },
  { label: "Free Dessert",    code: "FREEDESSERT",weight: 15, color: "#F59E0B", emoji: "🍰" },
  { label: "Better Luck!",    code: null,          weight: 30, color: "#6B7280", emoji: "😅" },
  { label: "15% Off",         code: "SPIN15",     weight: 15, color: "#FF5C00", emoji: "🔥" },
];

// ─── Display Rules ───────────────────────────────────────────────────────────

export const DEAL_DISPLAY = {
  /** Max banners shown in the tray at once */
  maxBanners: 2,
  /** Delay (ms) before spin wheel button appears */
  spinWheelDelay: 30_000,
  /** localStorage key for spin wheel result */
  spinResultKey: "lixor-spin-result",
  /** localStorage key for first visit */
  firstVisitKey: "lixor-first-visit",
  /** localStorage key for welcome popup dismissed */
  welcomeDismissedKey: "lixor-welcome-dismissed",
};
