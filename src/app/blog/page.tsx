import { Metadata } from "next";
import BlogClient from "./BlogClient";

export const metadata: Metadata = {
  title: "Blog | Lixor Restaurant",
  description: "Read our latest articles, news, and insights about fine dining, culinary arts, and our restaurant's events.",
  alternates: {
    canonical: "https://lixor-restaurant.vercel.app/blog",
  },
};

export default function Blog() {
  return <BlogClient />;
}
