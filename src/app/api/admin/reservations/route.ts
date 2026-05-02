import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export const runtime = "nodejs";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const date = searchParams.get("date");
    const status = searchParams.get("status");
    const timeSlot = searchParams.get("timeSlot");
    const search = searchParams.get("search");
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "20");

    const where: any = {};
    if (date) {
      const d = new Date(date);
      where.date = { gte: d, lt: new Date(d.getTime() + 86400000) };
    }
    if (status && status !== "all") where.status = status;
    if (timeSlot && timeSlot !== "all") where.timeSlot = timeSlot;
    if (search) {
      where.OR = [
        { guestName: { contains: search, mode: "insensitive" } },
        { phone: { contains: search } },
        { id: { contains: search } },
      ];
    }

    const [total, reservations] = await Promise.all([
      prisma.reservation.count({ where }),
      prisma.reservation.findMany({
        where,
        include: { table: true },
        orderBy: { date: "desc" },
        skip: (page - 1) * limit,
        take: limit,
      }),
    ]);

    return NextResponse.json({ reservations, total, page, limit });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();
    const reservation = await prisma.reservation.create({
      data: {
        guestName: data.guestName,
        phone: data.phone,
        email: data.email || "",
        date: new Date(data.date),
        timeSlot: data.timeSlot,
        guests: parseInt(data.guests),
        tableId: data.tableId,
        specialRequests: data.specialRequests || "",
        status: "Confirmed",
      },
      include: { table: true },
    });
    return NextResponse.json(reservation);
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}
