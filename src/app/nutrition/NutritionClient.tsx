"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import {
  Plus,
  Minus,
  Trash2,
  Sparkles,
  Target,
  TrendingUp,
  Zap,
  ChevronDown,
} from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { menuItems, NutritionData } from "@/data/menuData";
import { useMealBuilder, DietGoal } from "@/store/useMealBuilder";

// ─── Constants ────────────────────────────────────────────────────────────────

const DAILY_VALUES: NutritionData = {
  calories: 2000,
  protein: 50,
  carbs: 275,
  fats: 78,
  fiber: 28,
  sodium: 2300,
};

const DIET_GOALS: DietGoal[] = [
  "Weight Loss",
  "Muscle Gain",
  "Balanced",
  "Diabetic Friendly",
  "Low Sodium",
];

const MACRO_COLORS = {
  protein: "#FF5C00",
  carbs: "#F59E0B",
  fats: "#8B5CF6",
};

// Per-goal scoring weights and item filters
const GOAL_CONFIG: Record<
  DietGoal,
  {
    label: string;
    description: string;
    recommend: (n: NutritionData) => boolean;
    avoid: (n: NutritionData) => boolean;
    score: (n: NutritionData, total: NutritionData) => number;
    maxCalories: number;
  }
> = {
  "Weight Loss": {
    label: "Weight Loss",
    description: "Low calorie, high fiber, moderate protein",
    recommend: (n) => n.calories < 300 && n.fiber >= 2,
    avoid: (n) => n.calories > 450 || n.fats > 20,
    score: (n, total) => {
      let s = 100;
      if (total.calories > 600) s -= 30;
      if (total.fats > 30) s -= 20;
      if (total.fiber < 5) s -= 15;
      if (total.protein > 30) s += 10;
      return Math.max(0, Math.min(100, s));
    },
    maxCalories: 600,
  },
  "Muscle Gain": {
    label: "Muscle Gain",
    description: "High protein, moderate carbs, sufficient calories",
    recommend: (n) => n.protein >= 20,
    avoid: (n) => n.protein < 5 && n.calories > 300,
    score: (n, total) => {
      let s = 100;
      if (total.protein < 40) s -= 30;
      if (total.calories < 500) s -= 20;
      if (total.carbs < 30) s -= 10;
      return Math.max(0, Math.min(100, s));
    },
    maxCalories: 1200,
  },
  Balanced: {
    label: "Balanced",
    description: "Well-rounded macros, moderate everything",
    recommend: (n) =>
      n.calories >= 150 && n.calories <= 450 && n.protein >= 5,
    avoid: (n) => n.sodium > 700 || n.fats > 30,
    score: (n, total) => {
      let s = 100;
      const proteinPct = (total.protein * 4) / total.calories;
      const carbPct = (total.carbs * 4) / total.calories;
      const fatPct = (total.fats * 9) / total.calories;
      if (proteinPct < 0.15 || proteinPct > 0.35) s -= 15;
      if (carbPct < 0.3 || carbPct > 0.6) s -= 15;
      if (fatPct < 0.2 || fatPct > 0.4) s -= 15;
      return Math.max(0, Math.min(100, s));
    },
    maxCalories: 900,
  },
  "Diabetic Friendly": {
    label: "Diabetic Friendly",
    description: "Low carbs, low sugar, high fiber",
    recommend: (n) => n.carbs < 20 && n.fiber >= 2,
    avoid: (n) => n.carbs > 40,
    score: (n, total) => {
      let s = 100;
      if (total.carbs > 60) s -= 40;
      if (total.fiber < 8) s -= 20;
      if (total.sodium > 1500) s -= 10;
      return Math.max(0, Math.min(100, s));
    },
    maxCalories: 700,
  },
  "Low Sodium": {
    label: "Low Sodium",
    description: "Under 1500mg sodium per meal",
    recommend: (n) => n.sodium < 400,
    avoid: (n) => n.sodium > 600,
    score: (n, total) => {
      let s = 100;
      if (total.sodium > 1500) s -= 50;
      else if (total.sodium > 1000) s -= 25;
      else if (total.sodium > 700) s -= 10;
      return Math.max(0, Math.min(100, s));
    },
    maxCalories: 900,
  },
};

// ─── Helper ───────────────────────────────────────────────────────────────────

function sumNutrition(
  ids: { id: string; quantity: number }[]
): NutritionData {
  const base: NutritionData = {
    calories: 0,
    protein: 0,
    carbs: 0,
    fats: 0,
    fiber: 0,
    sodium: 0,
  };
  for (const { id, quantity } of ids) {
    const item = menuItems.find((m) => m.id === id);
    if (!item?.nutrition) continue;
    const n = item.nutrition;
    base.calories += n.calories * quantity;
    base.protein += n.protein * quantity;
    base.carbs += n.carbs * quantity;
    base.fats += n.fats * quantity;
    base.fiber += n.fiber * quantity;
    base.sodium += n.sodium * quantity;
  }
  return base;
}

function intakeColor(value: number, daily: number): string {
  const pct = value / daily;
  if (pct <= 0.7) return "text-emerald-600";
  if (pct <= 1.0) return "text-amber-500";
  return "text-red-500";
}

function intakeBg(value: number, daily: number): string {
  const pct = value / daily;
  if (pct <= 0.7) return "bg-emerald-500";
  if (pct <= 1.0) return "bg-amber-400";
  return "bg-red-500";
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function NutrientBar({
  label,
  value,
  daily,
  unit,
}: {
  label: string;
  value: number;
  daily: number;
  unit: string;
}) {
  const pct = Math.min((value / daily) * 100, 100);
  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex justify-between items-center">
        <span className="text-[13px] font-sans font-medium text-[#1A1A1A]">
          {label}
        </span>
        <span className={`text-[13px] font-bold font-sans ${intakeColor(value, daily)}`}>
          {Math.round(value)}
          {unit}{" "}
          <span className="text-[#999] font-normal">
            / {daily}
            {unit}
          </span>
        </span>
      </div>
      <div className="h-2 bg-neutral-100 rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className={`h-full rounded-full ${intakeBg(value, daily)}`}
        />
      </div>
    </div>
  );
}

function ScoreRing({ score }: { score: number }) {
  const radius = 40;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;
  const color =
    score >= 75 ? "#10B981" : score >= 50 ? "#F59E0B" : "#EF4444";

  return (
    <div className="relative w-24 h-24 flex items-center justify-center">
      <svg width="96" height="96" className="-rotate-90">
        <circle
          cx="48"
          cy="48"
          r={radius}
          fill="none"
          stroke="#F3F4F6"
          strokeWidth="8"
        />
        <motion.circle
          cx="48"
          cy="48"
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth="8"
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1, ease: "easeOut" }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-[22px] font-bold font-sans text-[#1A1A1A]">
          {score}%
        </span>
      </div>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function NutritionClient() {
  const {
    selectedItems,
    dietGoal,
    calorieLimit,
    addItem,
    removeItem,
    updateQuantity,
    clearMeal,
    setDietGoal,
    setCalorieLimit,
    setSelectedItems,
  } = useMealBuilder();

  const [activeCategory, setActiveCategory] = useState<string>("All");
  const [chartType, setChartType] = useState<"pie" | "bar">("pie");

  // All items are unique — no deduplication needed
  const uniqueMenuItems = menuItems;

  const categories = ["All", "Courses", "Desserts", "Starters", "Appetizers"];

  const filteredItems = useMemo(
    () =>
      uniqueMenuItems.filter((item) =>
        activeCategory === "All"
          ? true
          : item.category.includes(activeCategory as any)
      ),
    [uniqueMenuItems, activeCategory]
  );

  const totals = useMemo(
    () => sumNutrition(selectedItems),
    [selectedItems]
  );

  const goalConfig = GOAL_CONFIG[dietGoal];
  const compatibilityScore =
    selectedItems.length > 0
      ? goalConfig.score(totals, totals)
      : 0;

  const macroData = [
    { name: "Protein", value: Math.round(totals.protein), color: MACRO_COLORS.protein },
    { name: "Carbs", value: Math.round(totals.carbs), color: MACRO_COLORS.carbs },
    { name: "Fats", value: Math.round(totals.fats), color: MACRO_COLORS.fats },
  ];

  // Suggest healthy combo
  function suggestCombo() {
    const config = GOAL_CONFIG[dietGoal];
    const candidates = uniqueMenuItems.filter(
      (item) => item.nutrition && config.recommend(item.nutrition)
    );

    const combo: typeof selectedItems = [];
    let totalCals = 0;

    for (const item of candidates) {
      if (!item.nutrition) continue;
      if (totalCals + item.nutrition.calories <= calorieLimit) {
        combo.push({ id: item.id, name: item.name, image: item.image, quantity: 1 });
        totalCals += item.nutrition.calories;
      }
      if (combo.length >= 4) break;
    }

    if (combo.length === 0) {
      // Fallback: pick lowest calorie items
      const sorted = [...uniqueMenuItems]
        .filter((i) => i.nutrition)
        .sort((a, b) => (a.nutrition!.calories - b.nutrition!.calories));
      for (const item of sorted) {
        if (!item.nutrition) continue;
        if (totalCals + item.nutrition.calories <= calorieLimit) {
          combo.push({ id: item.id, name: item.name, image: item.image, quantity: 1 });
          totalCals += item.nutrition.calories;
        }
        if (combo.length >= 3) break;
      }
    }

    setSelectedItems(combo);
  }

  const isSelected = (id: string) => selectedItems.some((i) => i.id === id);
  const getQty = (id: string) =>
    selectedItems.find((i) => i.id === id)?.quantity ?? 0;

  return (
    <main className="bg-white min-h-screen">
      <Navbar />

      {/* Hero */}
      <section className="pt-32 pb-16 px-6 text-center relative overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-[#FF5C00]/[0.05] rounded-full blur-[100px] pointer-events-none" />
        <div className="relative max-w-3xl mx-auto">
          <motion.span
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-[#FF5C00] font-sans font-semibold text-[11px] tracking-[0.15em] uppercase mb-4 block"
          >
            SMART EATING STARTS HERE
          </motion.span>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-4xl md:text-[60px] font-serif font-medium text-[#1A1A1A] leading-[1.05] tracking-tight mb-6"
          >
            Nutrient Diet
            <br />
            <span className="text-[#FF5C00]">Analyzer</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-[#666666] text-[16px] font-sans leading-relaxed max-w-xl mx-auto"
          >
            Build your perfect meal, track macros in real time, and get
            personalized recommendations based on your diet goal.
          </motion.p>
        </div>
      </section>

      <div className="max-w-[1280px] mx-auto px-6 pb-24 grid grid-cols-1 xl:grid-cols-[1fr_420px] gap-10">
        {/* ── LEFT: Menu Picker ── */}
        <div className="flex flex-col gap-8">

          {/* Diet Goal Selector */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="bg-white border border-black/[0.06] rounded-[24px] p-6 shadow-sm"
          >
            <div className="flex items-center gap-3 mb-5">
              <div className="w-9 h-9 rounded-full bg-[#FFF5F0] flex items-center justify-center">
                <Target size={16} className="text-[#FF5C00]" />
              </div>
              <h2 className="text-[18px] font-serif font-medium text-[#1A1A1A]">
                Diet Goal
              </h2>
            </div>
            <div className="flex flex-wrap gap-2 mb-4">
              {DIET_GOALS.map((goal) => (
                <button
                  key={goal}
                  onClick={() => setDietGoal(goal)}
                  className={`px-4 py-2 rounded-full text-[13px] font-medium transition-all ${
                    dietGoal === goal
                      ? "bg-[#FF5C00] text-white shadow-lg shadow-orange-500/20"
                      : "bg-neutral-50 text-[#666] hover:text-[#1A1A1A] border border-black/[0.06]"
                  }`}
                >
                  {goal}
                </button>
              ))}
            </div>
            <p className="text-[13px] text-[#999] font-sans">
              {goalConfig.description}
            </p>

            {/* Calorie Limit */}
            <div className="mt-5 flex items-center gap-4">
              <label className="text-[13px] font-medium text-[#1A1A1A] whitespace-nowrap">
                Calorie limit for combo:
              </label>
              <input
                type="range"
                min={300}
                max={2000}
                step={50}
                value={calorieLimit}
                onChange={(e) => setCalorieLimit(Number(e.target.value))}
                className="flex-1 accent-[#FF5C00]"
              />
              <span className="text-[13px] font-bold text-[#FF5C00] w-16 text-right">
                {calorieLimit} kcal
              </span>
            </div>

            <button
              onClick={suggestCombo}
              className="mt-5 flex items-center gap-2 bg-[#1A1A1A] hover:bg-[#FF5C00] text-white px-6 py-3 rounded-full text-[13px] font-bold transition-all shadow-md active:scale-95"
            >
              <Sparkles size={15} />
              Suggest a Healthy Combo
            </button>
          </motion.div>

          {/* Category Filter */}
          <div className="flex flex-wrap gap-2">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-5 py-2 rounded-full text-[13px] font-medium transition-all ${
                  activeCategory === cat
                    ? "bg-[#FF5C00] text-white shadow-lg shadow-orange-500/20"
                    : "bg-white text-[#666] hover:text-[#1A1A1A] shadow-sm border border-neutral-100"
                }`}
              >
                {cat === "All" ? "Full Menu" : cat}
              </button>
            ))}
          </div>

          {/* Menu Grid */}
          <motion.div
            layout
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5"
          >
            <AnimatePresence mode="popLayout">
              {filteredItems.map((item) => {
                const n = item.nutrition;
                const selected = isSelected(item.id);
                const qty = getQty(item.id);
                const isRecommended = n ? goalConfig.recommend(n) : false;
                const isAvoid = n ? goalConfig.avoid(n) : false;

                return (
                  <motion.div
                    layout
                    key={item.id}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.3 }}
                    className={`relative bg-white border rounded-[20px] p-4 flex flex-col gap-3 transition-all ${
                      selected
                        ? "border-[#FF5C00] shadow-lg shadow-orange-500/10"
                        : "border-black/[0.06] shadow-sm hover:shadow-md"
                    }`}
                  >
                    {/* Badge */}
                    {isRecommended && (
                      <span className="absolute top-3 right-3 bg-emerald-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                        Recommended
                      </span>
                    )}
                    {isAvoid && !isRecommended && (
                      <span className="absolute top-3 right-3 bg-red-400 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                        Avoid
                      </span>
                    )}

                    <div className="flex items-center gap-3">
                      <div className="w-16 h-16 rounded-full overflow-hidden shrink-0">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-serif font-medium text-[#1A1A1A] text-[15px] leading-tight truncate">
                          {item.name}
                        </h3>
                        <span className="text-[#999] text-[12px] font-sans">
                          {item.price}
                        </span>
                      </div>
                    </div>

                    {/* Nutrition mini-stats */}
                    {n && (
                      <div className="grid grid-cols-3 gap-1 text-center">
                        <div className="bg-neutral-50 rounded-lg py-1.5">
                          <div className="text-[13px] font-bold text-[#1A1A1A]">
                            {n.calories}
                          </div>
                          <div className="text-[10px] text-[#999]">kcal</div>
                        </div>
                        <div className="bg-neutral-50 rounded-lg py-1.5">
                          <div className="text-[13px] font-bold text-[#FF5C00]">
                            {n.protein}g
                          </div>
                          <div className="text-[10px] text-[#999]">protein</div>
                        </div>
                        <div className="bg-neutral-50 rounded-lg py-1.5">
                          <div className="text-[13px] font-bold text-[#F59E0B]">
                            {n.carbs}g
                          </div>
                          <div className="text-[10px] text-[#999]">carbs</div>
                        </div>
                      </div>
                    )}

                    {/* Add / Qty controls */}
                    {selected ? (
                      <div className="flex items-center justify-between bg-neutral-50 rounded-full px-3 py-1.5">
                        <button
                          onClick={() => updateQuantity(item.id, qty - 1)}
                          className="w-7 h-7 rounded-full bg-white shadow-sm flex items-center justify-center hover:bg-red-50 transition-colors"
                        >
                          <Minus size={13} />
                        </button>
                        <span className="text-[14px] font-bold text-[#1A1A1A]">
                          {qty}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.id, qty + 1)}
                          className="w-7 h-7 rounded-full bg-[#FF5C00] shadow-sm flex items-center justify-center text-white hover:bg-[#E65200] transition-colors"
                        >
                          <Plus size={13} />
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() =>
                          addItem({ id: item.id, name: item.name, image: item.image })
                        }
                        className="flex items-center justify-center gap-1.5 bg-[#1A1A1A] hover:bg-[#FF5C00] text-white text-[12px] font-bold py-2 px-4 rounded-full transition-all active:scale-95"
                      >
                        <Plus size={13} />
                        Add to Meal
                      </button>
                    )}
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </motion.div>
        </div>

        {/* ── RIGHT: Analysis Panel ── */}
        <div className="flex flex-col gap-6 xl:sticky xl:top-28 xl:self-start">

          {/* My Meal Builder */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="bg-white border border-black/[0.06] rounded-[24px] p-6 shadow-sm"
          >
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-[#FFF5F0] flex items-center justify-center">
                  <Zap size={16} className="text-[#FF5C00]" />
                </div>
                <h2 className="text-[18px] font-serif font-medium text-[#1A1A1A]">
                  My Meal Builder
                </h2>
              </div>
              {selectedItems.length > 0 && (
                <button
                  onClick={clearMeal}
                  className="text-[12px] text-[#999] hover:text-red-500 transition-colors flex items-center gap-1"
                >
                  <Trash2 size={13} />
                  Clear
                </button>
              )}
            </div>

            {selectedItems.length === 0 ? (
              <div className="text-center py-8 text-[#999] text-[14px] font-sans">
                <div className="text-4xl mb-3">🍽️</div>
                Add dishes from the menu to build your meal
              </div>
            ) : (
              <div className="flex flex-col gap-3">
                <AnimatePresence>
                  {selectedItems.map((si) => {
                    const item = menuItems.find((m) => m.id === si.id);
                    if (!item) return null;
                    const itemCals = (item.nutrition?.calories ?? 0) * si.quantity;
                    return (
                      <motion.div
                        key={si.id}
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="flex items-center gap-3 bg-neutral-50 rounded-[14px] p-3"
                      >
                        <img
                          src={si.image}
                          alt={si.name}
                          className="w-10 h-10 rounded-full object-cover shrink-0"
                        />
                        <div className="flex-1 min-w-0">
                          <div className="text-[13px] font-medium text-[#1A1A1A] truncate">
                            {si.name}
                          </div>
                          <div className="text-[11px] text-[#999]">
                            {itemCals} kcal
                          </div>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <button
                            onClick={() => updateQuantity(si.id, si.quantity - 1)}
                            className="w-6 h-6 rounded-full bg-white shadow-sm flex items-center justify-center hover:bg-red-50 transition-colors"
                          >
                            <Minus size={11} />
                          </button>
                          <span className="text-[13px] font-bold w-4 text-center">
                            {si.quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(si.id, si.quantity + 1)}
                            className="w-6 h-6 rounded-full bg-[#FF5C00] shadow-sm flex items-center justify-center text-white hover:bg-[#E65200] transition-colors"
                          >
                            <Plus size={11} />
                          </button>
                        </div>
                        <button
                          onClick={() => removeItem(si.id)}
                          className="text-[#ccc] hover:text-red-400 transition-colors ml-1"
                        >
                          <Trash2 size={14} />
                        </button>
                      </motion.div>
                    );
                  })}
                </AnimatePresence>

                {/* Total calories */}
                <div className="flex justify-between items-center pt-3 border-t border-black/[0.06] mt-1">
                  <span className="text-[13px] font-medium text-[#666]">
                    Total Calories
                  </span>
                  <span className="text-[18px] font-bold font-serif text-[#FF5C00]">
                    {Math.round(totals.calories)} kcal
                  </span>
                </div>
              </div>
            )}
          </motion.div>

          {/* Compatibility Score */}
          {selectedItems.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="bg-white border border-black/[0.06] rounded-[24px] p-6 shadow-sm"
            >
              <div className="flex items-center gap-3 mb-5">
                <div className="w-9 h-9 rounded-full bg-[#FFF5F0] flex items-center justify-center">
                  <TrendingUp size={16} className="text-[#FF5C00]" />
                </div>
                <h2 className="text-[18px] font-serif font-medium text-[#1A1A1A]">
                  Goal Compatibility
                </h2>
              </div>
              <div className="flex items-center gap-6">
                <ScoreRing score={compatibilityScore} />
                <div>
                  <div className="text-[14px] font-bold text-[#1A1A1A] mb-1">
                    {compatibilityScore >= 75
                      ? "Great match!"
                      : compatibilityScore >= 50
                      ? "Decent match"
                      : "Needs adjustment"}
                  </div>
                  <div className="text-[13px] text-[#666] leading-relaxed">
                    This meal is{" "}
                    <span className="font-bold text-[#FF5C00]">
                      {compatibilityScore}% aligned
                    </span>{" "}
                    with your{" "}
                    <span className="font-medium text-[#1A1A1A]">
                      {dietGoal}
                    </span>{" "}
                    goal.
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* Macro Chart */}
          {selectedItems.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.05 }}
              className="bg-white border border-black/[0.06] rounded-[24px] p-6 shadow-sm"
            >
              <div className="flex items-center justify-between mb-5">
                <h2 className="text-[18px] font-serif font-medium text-[#1A1A1A]">
                  Macro Breakdown
                </h2>
                <div className="flex gap-1 bg-neutral-100 rounded-full p-1">
                  {(["pie", "bar"] as const).map((t) => (
                    <button
                      key={t}
                      onClick={() => setChartType(t)}
                      className={`px-3 py-1 rounded-full text-[12px] font-medium transition-all ${
                        chartType === t
                          ? "bg-white shadow-sm text-[#1A1A1A]"
                          : "text-[#999]"
                      }`}
                    >
                      {t === "pie" ? "Pie" : "Bar"}
                    </button>
                  ))}
                </div>
              </div>

              {chartType === "pie" ? (
                <ResponsiveContainer width="100%" height={200}>
                  <PieChart>
                    <Pie
                      data={macroData}
                      cx="50%"
                      cy="50%"
                      innerRadius={55}
                      outerRadius={85}
                      paddingAngle={3}
                      dataKey="value"
                    >
                      {macroData.map((entry, index) => (
                        <Cell key={index} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip
                      formatter={(value) => [`${value ?? 0}g`, ""]}
                      contentStyle={{
                        borderRadius: "12px",
                        border: "1px solid #f0f0f0",
                        fontSize: "13px",
                      }}
                    />
                    <Legend
                      iconType="circle"
                      iconSize={8}
                      formatter={(value) => (
                        <span style={{ fontSize: "12px", color: "#666" }}>
                          {value}
                        </span>
                      )}
                    />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <ResponsiveContainer width="100%" height={200}>
                  <BarChart data={macroData} barSize={32}>
                    <XAxis
                      dataKey="name"
                      tick={{ fontSize: 12, fill: "#999" }}
                      axisLine={false}
                      tickLine={false}
                    />
                    <YAxis
                      tick={{ fontSize: 11, fill: "#999" }}
                      axisLine={false}
                      tickLine={false}
                      unit="g"
                    />
                    <Tooltip
                      formatter={(value) => [`${value ?? 0}g`, ""]}
                      contentStyle={{
                        borderRadius: "12px",
                        border: "1px solid #f0f0f0",
                        fontSize: "13px",
                      }}
                    />
                    <Bar dataKey="value" radius={[6, 6, 0, 0]}>
                      {macroData.map((entry, index) => (
                        <Cell key={index} fill={entry.color} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              )}
            </motion.div>
          )}

          {/* Daily Intake Comparison */}
          {selectedItems.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.1 }}
              className="bg-white border border-black/[0.06] rounded-[24px] p-6 shadow-sm"
            >
              <h2 className="text-[18px] font-serif font-medium text-[#1A1A1A] mb-2">
                Daily Intake Comparison
              </h2>
              <p className="text-[12px] text-[#999] mb-5 font-sans">
                Based on a 2000 kcal/day reference diet.{" "}
                <span className="text-emerald-500 font-medium">Green</span> = within limit,{" "}
                <span className="text-amber-500 font-medium">Yellow</span> = approaching,{" "}
                <span className="text-red-500 font-medium">Red</span> = exceeds.
              </p>
              <div className="flex flex-col gap-4">
                <NutrientBar
                  label="Calories"
                  value={totals.calories}
                  daily={DAILY_VALUES.calories}
                  unit=" kcal"
                />
                <NutrientBar
                  label="Protein"
                  value={totals.protein}
                  daily={DAILY_VALUES.protein}
                  unit="g"
                />
                <NutrientBar
                  label="Carbohydrates"
                  value={totals.carbs}
                  daily={DAILY_VALUES.carbs}
                  unit="g"
                />
                <NutrientBar
                  label="Fats"
                  value={totals.fats}
                  daily={DAILY_VALUES.fats}
                  unit="g"
                />
                <NutrientBar
                  label="Fiber"
                  value={totals.fiber}
                  daily={DAILY_VALUES.fiber}
                  unit="g"
                />
                <NutrientBar
                  label="Sodium"
                  value={totals.sodium}
                  daily={DAILY_VALUES.sodium}
                  unit="mg"
                />
              </div>
            </motion.div>
          )}
        </div>
      </div>

      <Footer />
    </main>
  );
}
