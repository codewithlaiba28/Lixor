"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function getAllReservations() {
  return await prisma.reservation.findMany({
    include: { table: true },
    orderBy: { date: "desc" },
  });
}

export async function getAllOrders() {
  return await prisma.order.findMany({
    include: { items: { include: { menuItem: true } } },
    orderBy: { createdAt: "desc" },
  });
}

export async function updateReservationStatus(id: string, status: string) {
  await prisma.reservation.update({
    where: { id },
    data: { status },
  });
  revalidatePath("/admin");
}

export async function updateOrderStatus(id: string, status: string) {
  await prisma.order.update({
    where: { id },
    data: { status },
  });
  revalidatePath("/admin");
}
