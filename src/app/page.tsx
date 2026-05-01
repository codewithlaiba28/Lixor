import { Metadata } from "next";
import HomeClient from "./HomeClient";

export const metadata: Metadata = {
  title: "Lixor Restaurant | Fine Dining & Authentic Flavors",
  description: "Experience the art of fine dining at Lixor. Authentic flavors, cozy ambiance, and exceptional service in the heart of the city. Book your table today!",
  alternates: {
    canonical: "https://lixor-restaurant.vercel.app",
  },
};

export default function Home() {
  return <HomeClient />;
}
