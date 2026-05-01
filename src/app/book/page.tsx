import { Metadata } from "next";
import BookClient from "./BookClient";

export const metadata: Metadata = {
  title: "Book a Table | Lixor Restaurant",
  description: "Reserve your table at Lixor Restaurant. Choose your preferred date, time, and menu items for a seamless fine dining experience.",
  alternates: {
    canonical: "https://lixor-restaurant.vercel.app/book",
  },
};

export default function Book() {
  return <BookClient />;
}
