import { Metadata } from "next";
import ChefClient from "@/components/ChefClient";

export const metadata: Metadata = {
  title: "Our Chefs",
  description: "Meet the experts behind the magic at Lixor Restaurant. Discover the passion and skill of our world-class culinary team.",
};

export default function ChefPage() {
  return <ChefClient />;
}
