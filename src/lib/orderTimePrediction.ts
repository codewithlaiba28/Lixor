/**
 * Smart Order Time Prediction — frontend-only, no backend required
 */

// ─── Prep times per item id (minutes) ────────────────────────────────────────
const PREP_TIMES: Record<string, number> = {
  // Appetizers
  "bruschetta-trio-app": 8,
  "crispy-calamari": 10,
  "spicy-chicken-wing": 12,
  "stuffed-mushrooms": 9,

  // Starters
  "caesar-salad": 7,
  "caprese-salad": 6,
  "cheese-crostini": 6,
  "chilled-gazpacho-starter": 5,

  // Courses
  "chicken-alfredo": 18,
  "grilled-salmon": 16,
  "steak-au-poivre": 20,
  "vegetarian-lasagna": 18,

  // Desserts
  "classic-tiramisu": 8,
  "creme-brulee": 10,
  "molten-lava-cake-dessert": 12,
  "ny-cheesecake": 6,

  // Misc
  "mashed-potatoes": 8,
};

const DEFAULT_PREP_TIME = 12; // fallback for unknown items

// ─── Delivery zone buffers (minutes) ─────────────────────────────────────────
export const DELIVERY_ZONES: { label: string; value: string; buffer: number }[] = [
  { label: "Zone A — Nearby (0–3 km)", value: "zone-a", buffer: 10 },
  { label: "Zone B — Mid (3–7 km)", value: "zone-b", buffer: 20 },
  { label: "Zone C — Far (7–15 km)", value: "zone-c", buffer: 30 },
  { label: "Zone D — Outskirts (15+ km)", value: "zone-d", buffer: 45 },
];

// ─── Peak hour detection ──────────────────────────────────────────────────────
export function isPeakHour(date: Date = new Date()): boolean {
  const h = date.getHours();
  const m = date.getMinutes();
  const totalMins = h * 60 + m;

  const lunchStart = 12 * 60;      // 12:00 PM
  const lunchEnd   = 14 * 60;      // 2:00 PM
  const dinnerStart = 19 * 60;     // 7:00 PM
  const dinnerEnd   = 21 * 60;     // 9:00 PM

  return (
    (totalMins >= lunchStart && totalMins < lunchEnd) ||
    (totalMins >= dinnerStart && totalMins < dinnerEnd)
  );
}

// ─── Core calculation ─────────────────────────────────────────────────────────
export interface CartItemInput {
  id: string;
  quantity: number;
}

export type OrderType = "Delivery" | "Dine-in" | "Takeaway";

export interface TimeEstimate {
  minMins: number;
  maxMins: number;
  basePrepTime: number;
  kitchenBuffer: number;
  deliveryBuffer: number;
  dineInDiscount: number;
  isPeak: boolean;
  totalItems: number;
}

export function calculateEstimatedTime(
  items: CartItemInput[],
  orderType: OrderType,
  deliveryZone?: string
): TimeEstimate {
  if (items.length === 0) {
    return {
      minMins: 0, maxMins: 0,
      basePrepTime: 0, kitchenBuffer: 0,
      deliveryBuffer: 0, dineInDiscount: 0,
      isPeak: false, totalItems: 0,
    };
  }

  // 1. Max prep time of all unique items
  const maxPrepTime = Math.max(
    ...items.map((item) => PREP_TIMES[item.id] ?? DEFAULT_PREP_TIME)
  );

  // 2. Additional items buffer (parallel cooking: +2 min per extra unique item)
  const uniqueItemCount = items.length;
  const additionalBuffer = Math.max(0, (uniqueItemCount - 1) * 2);

  const basePrepTime = maxPrepTime + additionalBuffer;

  // 3. Kitchen load buffer
  const peak = isPeakHour();
  const kitchenBuffer = peak ? 10 : 2;

  // 4. Delivery zone buffer
  let deliveryBuffer = 0;
  if (orderType === "Delivery") {
    const zone = DELIVERY_ZONES.find((z) => z.value === deliveryZone);
    deliveryBuffer = zone ? zone.buffer : 15; // default 15 min if no zone selected
  }

  // 5. Dine-in discount
  const dineInDiscount = orderType === "Dine-in" ? 3 : 0;

  const totalItems = items.reduce((sum, i) => sum + i.quantity, 0);

  const base = basePrepTime + kitchenBuffer + deliveryBuffer - dineInDiscount;
  const minMins = Math.max(5, base - 2);
  const maxMins = base + 4;

  return {
    minMins,
    maxMins,
    basePrepTime,
    kitchenBuffer,
    deliveryBuffer,
    dineInDiscount,
    isPeak: peak,
    totalItems,
  };
}

// ─── Order tracker stages ─────────────────────────────────────────────────────
export interface TrackerStage {
  id: string;
  label: string;
  description: string;
  durationSecs: number; // how long this stage lasts in the simulation
  icon: string;
}

export function getTrackerStages(orderType: OrderType): TrackerStage[] {
  const stages: TrackerStage[] = [
    {
      id: "confirmed",
      label: "Order Confirmed",
      description: "We've received your order and it's being reviewed.",
      durationSecs: 8,
      icon: "✅",
    },
    {
      id: "preparing",
      label: "Kitchen Preparing",
      description: "Our chefs are crafting your meal with care.",
      durationSecs: 15,
      icon: "👨‍🍳",
    },
    {
      id: "almost",
      label: "Almost Ready",
      description: "Final touches being added to your order.",
      durationSecs: 10,
      icon: "⏳",
    },
    {
      id: "ready",
      label: orderType === "Delivery" ? "Out for Delivery" : "Ready for Pickup",
      description:
        orderType === "Delivery"
          ? "Your order is on its way!"
          : "Your order is ready. Come grab it!",
      durationSecs: 0,
      icon: orderType === "Delivery" ? "🛵" : "🎉",
    },
  ];
  return stages;
}
