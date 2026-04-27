import { menuItems } from "@/data/menuData";
import FoodDetailClient from "@/components/FoodDetailClient";
import { Metadata } from "next";
import { notFound } from "next/navigation";

export async function generateStaticParams() {
  return menuItems.map((item) => ({ id: item.id }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const item = menuItems.find((m) => m.id === id);
  if (!item) return { title: "Dish Not Found" };
  return {
    title: item.name,
    description: item.shortDesc,
  };
}

export default async function FoodDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const item = menuItems.find((m) => m.id === id);
  if (!item) return notFound();
  return <FoodDetailClient id={id} />;
}
