import { Metadata } from "next";
import AboutClient from "./AboutClient";

export const metadata: Metadata = {
  title: "About Us | Lixor Restaurant",
  description: "Learn about the passion, journey, and mission behind Lixor Restaurant. We combine global flavors with fresh ingredients to create an unforgettable dining experience.",
  alternates: {
    canonical: "https://lixor-restaurant.vercel.app/about",
  },
};

export default function About() {
  return <AboutClient />;
}
