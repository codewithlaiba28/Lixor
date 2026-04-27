import { Metadata } from "next";
import HomeClient from "@/components/HomeClient";

export const metadata: Metadata = {
  title: "Lixor Restaurant | Where every meal is a chef masterpiece",
  description: "Experience the finest flavors at Lixor Restaurant. Carefully crafted dishes with fresh ingredients, cozy ambiance, and exceptional service in Orangi Town.",
};

export default function Home() {
  return <HomeClient />;
}
