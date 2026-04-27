import { Metadata } from "next";
import MenuClient from "@/components/MenuClient";

export const metadata: Metadata = {
  title: "Our Menu",
  description: "Explore the delicious and carefully crafted menu at Lixor Restaurant. From mouthwatering starters to chef masterpieces.",
};

export default function Menu() {
  return <MenuClient />;
}
