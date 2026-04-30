"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function createOrder(data: any) {
  try {
    const order = await prisma.order.create({
      data: {
        customerName: data.customerName,
        phone: data.phone,
        address: data.address,
        orderType: data.orderType,
        totalAmount: data.totalAmount,
        items: {
          create: data.items.map((item: any) => ({
            menuItemId: item.id,
            quantity: item.quantity,
            price: item.price,
          })),
        },
      },
    });
    
    revalidatePath("/admin");
    return { success: true, orderId: order.id };
  } catch (error) {
    console.error("Order error:", error);
    return { success: false, error: "Failed to place order" };
  }
}

export async function getMenuItems() {
  try {
    return await prisma.menuItem.findMany({
      where: { isAvailable: true },
      orderBy: { category: "asc" },
    });
  } catch (error) {
    console.error("Error fetching menu items:", error);
    return [];
  }
}
