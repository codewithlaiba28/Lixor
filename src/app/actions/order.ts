"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function createOrder(data: any) {
  try {
    if (!data.items || data.items.length === 0) {
      return { success: false, error: "Cannot place an order with an empty bag." };
    }

    const order = await prisma.order.create({
      data: {
        customerName: data.customerName,
        phone: data.phone,
        address: data.address,
        orderType: data.orderType,
        totalAmount: data.totalAmount,
        userId: data.userId,
        items: {
          create: data.items.map((item: any) => ({
            // Store item name directly — no foreign key dependency on MenuItem
            // so cart items with slug IDs never cause a constraint failure
            itemName: item.name || item.id || "Unknown item",
            quantity: item.quantity,
            price: item.price,
            // menuItemId is now optional — only set it if it looks like a real DB cuid
            // (cuids are 25 chars starting with 'c'); slug IDs like "bruschetta-trio-app" are skipped
            ...(item.id && /^c[a-z0-9]{24}$/.test(item.id)
              ? { menuItemId: item.id }
              : {}),
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
