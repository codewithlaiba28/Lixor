import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export const runtime = "nodejs";

export async function GET(_req: NextRequest) {
  try {
    const now = new Date();
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const todayEnd = new Date(todayStart.getTime() + 86400000);
    const yesterdayStart = new Date(todayStart.getTime() - 86400000);
    const weekStart = new Date(todayStart.getTime() - 6 * 86400000);

    const [
      reservationsToday,
      reservationsYesterday,
      reservationsWeek,
      activeOrders,
      pendingOrders,
      allTables,
      todayOrders,
      ordersPerHour,
      bookingsByDay,
      orderTypeSplit,
    ] = await Promise.all([
      prisma.reservation.count({ where: { date: { gte: todayStart, lt: todayEnd } } }),
      prisma.reservation.count({ where: { date: { gte: yesterdayStart, lt: todayStart } } }),
      prisma.reservation.count({ where: { date: { gte: weekStart, lt: todayEnd } } }),
      prisma.order.count({ where: { status: { in: ["Pending", "Preparing"] } } }),
      prisma.order.count({ where: { status: "Pending" } }),
      prisma.restaurantTable.findMany({ where: { isActive: true } }),
      prisma.order.findMany({
        where: { createdAt: { gte: todayStart, lt: todayEnd } },
        select: { totalAmount: true, createdAt: true, orderType: true },
      }),
      // Orders per hour for today (raw)
      prisma.order.findMany({
        where: { createdAt: { gte: todayStart, lt: todayEnd } },
        select: { createdAt: true },
      }),
      // Bookings by day for this week
      prisma.reservation.findMany({
        where: { date: { gte: weekStart, lt: todayEnd } },
        select: { date: true },
      }),
      // Order type split
      prisma.order.groupBy({
        by: ["orderType"],
        _count: { orderType: true },
        where: { createdAt: { gte: todayStart, lt: todayEnd } },
      }),
    ]);

    // Tables occupied today
    const occupiedTableIds = await prisma.reservation.findMany({
      where: {
        date: { gte: todayStart, lt: todayEnd },
        status: { notIn: ["Cancelled"] },
      },
      select: { tableId: true },
    });
    const uniqueOccupied = new Set(occupiedTableIds.map((r) => r.tableId)).size;

    const revenueToday = todayOrders.reduce((s, o) => s + o.totalAmount, 0);

    // Build orders per hour array (0-23)
    const hourCounts = Array(24).fill(0);
    ordersPerHour.forEach((o) => {
      hourCounts[new Date(o.createdAt).getHours()]++;
    });
    const ordersPerHourData = hourCounts.map((count, hour) => ({
      hour: `${hour}:00`,
      orders: count,
    }));

    // Bookings by day (last 7 days)
    const dayMap: Record<string, number> = {};
    for (let i = 0; i < 7; i++) {
      const d = new Date(weekStart.getTime() + i * 86400000);
      dayMap[d.toISOString().split("T")[0]] = 0;
    }
    bookingsByDay.forEach((b) => {
      const key = new Date(b.date).toISOString().split("T")[0];
      if (key in dayMap) dayMap[key]++;
    });
    const bookingsByDayData = Object.entries(dayMap).map(([date, count]) => ({
      date: new Date(date).toLocaleDateString("en-US", { weekday: "short" }),
      bookings: count,
    }));

    // Order type split
    const orderTypeSplitData = orderTypeSplit.map((t) => ({
      type: t.orderType,
      count: t._count.orderType,
    }));

    return NextResponse.json({
      reservationsToday,
      reservationsYesterday,
      reservationsWeek,
      activeOrders,
      pendingOrders,
      tablesTotal: allTables.length,
      tablesOccupied: uniqueOccupied,
      revenueToday,
      ordersPerHourData,
      bookingsByDayData,
      orderTypeSplitData,
    });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}
