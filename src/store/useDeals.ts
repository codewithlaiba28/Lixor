import { create } from "zustand";

export interface ActiveDeal {
  id: string;
  type: "time" | "cart" | "spin";
  label: string;
  description: string;
  emoji: string;
  code?: string | null;
  accentColor?: string;
  /** For bulk discount — the computed percent */
  discountPercent?: number;
  /** For free-delivery threshold — remaining amount */
  remaining?: number;
}

interface DealsStore {
  /** Currently active deals to show in the tray */
  activeDeals: ActiveDeal[];
  /** IDs of deals the user has manually dismissed this session */
  dismissedIds: Set<string>;
  /** Spin wheel result code (null = no prize) */
  spinResult: string | null;
  /** Whether the spin wheel modal is open */
  spinOpen: boolean;
  /** Whether the welcome popup has been shown/dismissed */
  welcomeDismissed: boolean;
  /** Applied promo code (from welcome or spin) */
  appliedCode: string | null;

  setActiveDeals: (deals: ActiveDeal[]) => void;
  addDeal: (deal: ActiveDeal) => void;
  removeDeal: (id: string) => void;
  setSpinResult: (code: string | null) => void;
  setSpinOpen: (open: boolean) => void;
  setWelcomeDismissed: (v: boolean) => void;
  setAppliedCode: (code: string | null) => void;
}

export const useDeals = create<DealsStore>((set) => ({
  activeDeals: [],
  dismissedIds: new Set<string>(),
  spinResult: null,
  spinOpen: false,
  welcomeDismissed: false,
  appliedCode: null,

  setActiveDeals: (deals) => set({ activeDeals: deals }),
  addDeal: (deal) =>
    set((state) => {
      if (state.activeDeals.find((d) => d.id === deal.id)) return state;
      return { activeDeals: [...state.activeDeals, deal] };
    }),
  removeDeal: (id) =>
    set((state) => ({
      activeDeals: state.activeDeals.filter((d) => d.id !== id),
      dismissedIds: new Set([...state.dismissedIds, id]),
    })),
  setSpinResult: (code) => set({ spinResult: code }),
  setSpinOpen: (open) => set({ spinOpen: open }),
  setWelcomeDismissed: (v) => set({ welcomeDismissed: v }),
  setAppliedCode: (code) => set({ appliedCode: code }),
}));
