"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function createOrder(data: any) {
  try {
    if (!data.items || data.items.length === 0) {
      return { success: false, error: "Cannot place an order with an empty bag." };
    }

    // Log incoming data for debugging
    console.log("createOrder called with:", {
      customerName: data.customerName,
      phone: data.phone,
      address: data.address,
      orderType: data.orderType,
      totalAmount: data.totalAmount,
      itemCount: data.items?.length,
      items: data.items?.map((i: any) => ({
        id: i.id,
        name: i.name,
        price: i.price,
        quantity: i.quantity,
      })),
    });

    const orderItems = data.items.map((item: any) => ({
      itemName: item.name || item.id || "Unknown item",
      quantity: item.quantity ?? 1,
      price: typeof item.price === "number" ? item.price : parseFloat(String(item.price)) || 0,
      // Only set menuItemId if it looks like a real Prisma cuid (25 chars, starts with 'c')
      ...(item.id && /^c[a-z0-9]{24}$/.test(String(item.id))
        ? { menuItemId: item.id }
        : {}),
    }));

    const order = await prisma.order.create({
      data: {
        customerName: data.customerName,
        phone: data.phone,
        address: data.address,
        orderType: data.orderType || "Delivery",
        totalAmount: data.totalAmount,
        userId: data.userId || null,
        items: {
          create: orderItems,
        },
      },
    });

    console.log("Order created successfully:", order.id);
    revalidatePath("/admin");
    return { success: true, orderId: order.id };
  } catch (error: any) {
    console.error("Order error full details:", {
      message: error?.message,
      code: error?.code,
      meta: error?.meta,
      stack: error?.stack?.split("\n").slice(0, 5).join("\n"),
    });
    return {
      success: false,
      error: error?.message || "Failed to place order",
    };
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
