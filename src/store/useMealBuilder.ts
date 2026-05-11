import { create } from "zustand";
import { persist } from "zustand/middleware";

export type DietGoal =
  | "Weight Loss"
  | "Muscle Gain"
  | "Balanced"
  | "Diabetic Friendly"
  | "Low Sodium";

export interface MealBuilderItem {
  id: string;
  name: string;
  image: string;
  quantity: number;
}

interface MealBuilderStore {
  selectedItems: MealBuilderItem[];
  dietGoal: DietGoal;
  calorieLimit: number;
  addItem: (item: Omit<MealBuilderItem, "quantity">) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearMeal: () => void;
  setDietGoal: (goal: DietGoal) => void;
  setCalorieLimit: (limit: number) => void;
  setSelectedItems: (items: MealBuilderItem[]) => void;
}

export const useMealBuilder = create<MealBuilderStore>()(
  persist(
    (set, get) => ({
      selectedItems: [],
      dietGoal: "Balanced",
      calorieLimit: 800,

      addItem: (item) => {
        const current = get().selectedItems;
        const existing = current.find((i) => i.id === item.id);
        if (existing) {
          set({
            selectedItems: current.map((i) =>
              i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i
            ),
          });
        } else {
          set({ selectedItems: [...current, { ...item, quantity: 1 }] });
        }
      },

      removeItem: (id) => {
        set({ selectedItems: get().selectedItems.filter((i) => i.id !== id) });
      },

      updateQuantity: (id, quantity) => {
        if (quantity <= 0) {
          get().removeItem(id);
          return;
        }
        set({
          selectedItems: get().selectedItems.map((i) =>
            i.id === id ? { ...i, quantity } : i
          ),
        });
      },

      clearMeal: () => set({ selectedItems: [] }),

      setDietGoal: (goal) => set({ dietGoal: goal }),

      setCalorieLimit: (limit) => set({ calorieLimit: limit }),

      setSelectedItems: (items) => set({ selectedItems: items }),
    }),
    { name: "lixor-meal-builder" }
  )
);
