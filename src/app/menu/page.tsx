import { Metadata } from "next";
import MenuClient from "./MenuClient";

export const metadata: Metadata = {
  title: "Menu | Lixor Restaurant",
  description: "Explore our exquisite menu featuring a variety of dishes, appetizers, and desserts crafted with fresh, locally sourced ingredients.",
  alternates: {
    canonical: "https://lixor-restaurant.vercel.app/menu",
  },
};

export default function Menu() {
  return <MenuClient />;
}
