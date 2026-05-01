import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface CartItem {
  id: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
}

export interface DeliveryInfo {
  customerName: string;
  phone: string;
  address: string;
}

interface CartStore {
  items: CartItem[];
  deliveryInfo: DeliveryInfo;
  addItem: (item: Omit<CartItem, "quantity">) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  getTotal: () => number;
  setDeliveryInfo: (info: Partial<DeliveryInfo>) => void;
}

export const useCart = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      deliveryInfo: { customerName: "", phone: "", address: "" },

      addItem: (item) => {
        const currentItems = get().items;
        const existingItem = currentItems.find((i) => i.id === item.id);
        if (existingItem) {
          set({
            items: currentItems.map((i) =>
              i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i
            ),
          });
        } else {
          set({ items: [...currentItems, { ...item, quantity: 1 }] });
        }
      },

      removeItem: (id) => {
        set({ items: get().items.filter((i) => i.id !== id) });
      },

      updateQuantity: (id, quantity) => {
        if (quantity <= 0) {
          get().removeItem(id);
          return;
        }
        set({
          items: get().items.map((i) =>
            i.id === id ? { ...i, quantity } : i
          ),
        });
      },

      clearCart: () =>
        set({ items: [], deliveryInfo: { customerName: "", phone: "", address: "" } }),

      getTotal: () =>
        get().items.reduce((acc, item) => acc + item.price * item.quantity, 0),

      setDeliveryInfo: (info) =>
        set((state) => ({
          deliveryInfo: { ...state.deliveryInfo, ...info },
        })),
    }),
    {
      name: "lixor-cart",
    }
  )
);
