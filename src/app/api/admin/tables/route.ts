import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export const runtime = "nodejs";

export async function GET() {
  try {
    const now = new Date();
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const todayEnd = new Date(todayStart.getTime() + 86400000);

    const tables = await prisma.restaurantTable.findMany({
      orderBy: { tableNumber: "asc" },
      include: {
        reservations: {
          where: { date: { gte: todayStart, lt: todayEnd }, status: { notIn: ["Cancelled"] } },
          orderBy: { timeSlot: "asc" },
        },
      },
    });
    return NextResponse.json(tables);
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();
    const table = await prisma.restaurantTable.create({
      data: { tableNumber: data.tableNumber, capacity: data.capacity },
    });
    return NextResponse.json(table);
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}
