"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function getTables() {
  try {
    return await prisma.restaurantTable.findMany({
      where: { isActive: true },
      orderBy: { tableNumber: "asc" },
    });
  } catch (error) {
    console.error("Error fetching tables:", error);
    return [];
  }
}

export async function checkAvailability(date: string, timeSlot: string) {
  try {
    const reservations = await prisma.reservation.findMany({
      where: {
        date: new Date(date),
        timeSlot: timeSlot,
        status: { not: "Cancelled" },
      },
      select: { tableId: true },
    });
    
    return reservations.map(r => r.tableId);
  } catch (error) {
    console.error("Error checking availability:", error);
    return [];
  }
}

export async function createBooking(data: any) {
  try {
    const booking = await prisma.reservation.create({
      data: {
        guestName: data.guestName,
        phone: data.phone,
        email: data.email,
        date: new Date(data.date),
        timeSlot: data.timeSlot,
        guests: parseInt(data.guests),
        tableId: data.tableId,
        specialRequests: data.specialRequests,
        preOrderItems: data.preOrderItems || [],
      },
    });
    
    revalidatePath("/admin");
    return { success: true, bookingId: booking.id };
  } catch (error) {
    console.error("Booking error:", error);
    return { success: false, error: "Failed to create booking" };
  }
}
