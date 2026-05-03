import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export const runtime = "nodejs";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const filter = searchParams.get("filter") || "today"; // today | tomorrow | week

    const now = new Date();
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    let dateFrom = todayStart;
    let dateTo = new Date(todayStart.getTime() + 86400000);

    if (filter === "tomorrow") {
      dateFrom = new Date(todayStart.getTime() + 86400000);
      dateTo = new Date(todayStart.getTime() + 2 * 86400000);
    } else if (filter === "week") {
      dateTo = new Date(todayStart.getTime() + 7 * 86400000);
    }

    const reservations = await prisma.reservation.findMany({
      where: {
        date: { gte: dateFrom, lt: dateTo },
      },
      include: { table: true },
      orderBy: [{ date: "asc" }, { timeSlot: "asc" }],
    });

    // Filter only those with actual pre-order items (non-empty array)
    const withPreOrders = reservations.filter((r) => {
      const items = r.preOrderItems as any[];
      return Array.isArray(items) && items.length > 0;
    });

    return NextResponse.json(withPreOrders);
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}
