import type { Metadata } from "next";
import NutritionClient from "./NutritionClient";

export const metadata: Metadata = {
  title: "Nutrient Analyzer | Lixor Restaurant",
  description:
    "Build your perfect meal and analyze its nutritional content. Set diet goals and get personalized recommendations.",
};

export default function NutritionPage() {
  return <NutritionClient />;
}
