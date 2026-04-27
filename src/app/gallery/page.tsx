import { Metadata } from "next";
import GalleryClient from "@/components/GalleryClient";

export const metadata: Metadata = {
  title: "Gallery",
  description: "Visual stories behind our culinary creations. Browse through our gallery of mouthwatering dishes and memorable moments at Lixor Restaurant.",
};

export default function Gallery() {
  return <GalleryClient />;
}
