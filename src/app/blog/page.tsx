import { Metadata } from "next";
import BlogClient from "@/components/BlogClient";

export const metadata: Metadata = {
  title: "Blog & Food Stories",
  description: "Stay updated with the latest food stories, cooking tips, and culinary insights from Lixor Restaurant. Discover the secrets behind our flavors.",
};

export default function Blog() {
  return <BlogClient />;
}
