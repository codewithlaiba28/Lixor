import { Metadata } from "next";
import GalleryClient from "./GalleryClient";

export const metadata: Metadata = {
  title: "Gallery | Lixor Restaurant",
  description: "View the beautiful creations and moments captured at Lixor Restaurant. Discover the visual stories behind our exceptional fine dining experience.",
  alternates: {
    canonical: "https://lixor-restaurant.vercel.app/gallery",
  },
};

export default function Gallery() {
  return <GalleryClient />;
}
