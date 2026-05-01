import { Metadata } from "next";
import ChefClient from "./ChefClient";

export const metadata: Metadata = {
  title: "Our Chefs | Lixor Restaurant",
  description: "Meet the masterminds behind our culinary excellence. Learn about our passionate chefs and their dedication to fine dining.",
  alternates: {
    canonical: "https://lixor-restaurant.vercel.app/chef",
  },
};

export default function Chef() {
  return <ChefClient />;
}
