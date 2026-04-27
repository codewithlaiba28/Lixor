import { Metadata } from "next";
import AboutClient from "@/components/AboutClient";

export const metadata: Metadata = {
  title: "About Us",
  description: "Learn about the passion, mission, and journey behind Lixor Restaurant. Discover what makes our dining experience unique.",
};

export default function About() {
  return <AboutClient />;
}
