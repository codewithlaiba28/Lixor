/**
 * Demo data seeder — adds realistic reservations and orders
 * so the admin dashboard shows real-looking data.
 *
 * Run: npx tsx scripts/seed-demo.ts
 */
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import pg from "pg";
import * as dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.resolve(process.cwd(), ".env") });

const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

const TIME_SLOTS = ["12:00 PM", "1:00 PM", "2:00 PM", "6:00 PM", "7:00 PM", "8:00 PM", "9:00 PM"];
const RES_STATUSES = ["Confirmed", "Confirmed", "Confirmed", "Seated", "Completed", "Pending"];
const ORDER_STATUSES = ["Pending", "Pending", "Preparing", "Preparing", "Out for Delivery", "Delivered", "Delivered"];
const ORDER_TYPES = ["Delivery", "Delivery", "Takeaway"];

const GUEST_NAMES = [
  "Laiba Khan", "Ahmed Raza", "Sara Malik", "Usman Ali", "Fatima Noor",
  "Bilal Sheikh", "Ayesha Siddiqui", "Hamza Butt", "Zara Hussain", "Omar Farooq",
  "Nadia Iqbal", "Tariq Mehmood", "Sana Baig", "Imran Chaudhry", "Hina Qureshi",
];

const PHONES = [
  "0300-1234567", "0321-9876543", "0333-4567890", "0345-1122334", "0311-9988776",
  "0301-5544332", "0322-6677889", "0312-3344556", "0344-7788990", "0355-1234567",
];

const ADDRESSES = [
  "House 12, Block B, Gulshan-e-Iqbal, Karachi",
  "Flat 5, DHA Phase 6, Lahore",
  "Plot 33, F-7/2, Islamabad",
  "Street 4, Johar Town, Lahore",
  "Apartment 8, Clifton Block 5, Karachi",
  "House 22, G-11/3, Islamabad",
  "Bungalow 7, PECHS Block 2, Karachi",
];

function randomFrom<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function daysAgo(n: number): Date {
  const d = new Date();
  d.setDate(d.getDate() - n);
  d.setHours(0, 0, 0, 0);
  return d;
}

function daysFromNow(n: number): Date {
  const d = new Date();
  d.setDate(d.getDate() + n);
  d.setHours(0, 0, 0, 0);
  return d;
}

function hoursAgo(h: number): Date {
  return new Date(Date.now() - h * 3600 * 1000);
}

async function main() {
  console.log("Fetching tables and menu items...");
  const tables = await prisma.restaurantTable.findMany({ orderBy: { tableNumber: "asc" } });
  const menuItems = await prisma.menuItem.findMany();

  if (tables.length === 0 || menuItems.length === 0) {
    console.error("No tables or menu items found. Run `npx tsx prisma/seed.ts` first.");
    process.exit(1);
  }

  // ── Clear existing demo data ──────────────────────────────────────────────
  console.log("Clearing existing orders and reservations...");
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.reservation.deleteMany();

  // ── Reservations ──────────────────────────────────────────────────────────
  console.log("Creating reservations...");

  const reservationData = [
    // Today
    { name: "Laiba Khan",      phone: "0345-3155537", email: "laiba@example.com",   date: daysFromNow(0), slot: "7:00 PM", guests: 2, tableIdx: 0, status: "Confirmed", preOrder: true },
    { name: "Ahmed Raza",      phone: "0321-9876543", email: "ahmed@example.com",   date: daysFromNow(0), slot: "8:00 PM", guests: 4, tableIdx: 2, status: "Confirmed", preOrder: false },
    { name: "Sara Malik",      phone: "0333-4567890", email: "sara@example.com",    date: daysFromNow(0), slot: "6:00 PM", guests: 2, tableIdx: 1, status: "Seated",    preOrder: false },
    { name: "Usman Ali",       phone: "0300-1122334", email: "usman@example.com",   date: daysFromNow(0), slot: "9:00 PM", guests: 6, tableIdx: 5, status: "Confirmed", preOrder: true },
    { name: "Fatima Noor",     phone: "0311-9988776", email: "fatima@example.com",  date: daysFromNow(0), slot: "1:00 PM", guests: 3, tableIdx: 3, status: "Completed", preOrder: false },
    // Tomorrow
    { name: "Bilal Sheikh",    phone: "0301-5544332", email: "bilal@example.com",   date: daysFromNow(1), slot: "7:00 PM", guests: 2, tableIdx: 0, status: "Confirmed", preOrder: false },
    { name: "Ayesha Siddiqui", phone: "0322-6677889", email: "ayesha@example.com",  date: daysFromNow(1), slot: "8:00 PM", guests: 4, tableIdx: 2, status: "Confirmed", preOrder: true },
    { name: "Hamza Butt",      phone: "0312-3344556", email: "hamza@example.com",   date: daysFromNow(1), slot: "6:00 PM", guests: 2, tableIdx: 4, status: "Pending",   preOrder: false },
    // This week
    { name: "Zara Hussain",    phone: "0344-7788990", email: "zara@example.com",    date: daysFromNow(2), slot: "7:00 PM", guests: 5, tableIdx: 6, status: "Confirmed", preOrder: false },
    { name: "Omar Farooq",     phone: "0355-1234567", email: "omar@example.com",    date: daysFromNow(3), slot: "8:00 PM", guests: 8, tableIdx: 7, status: "Confirmed", preOrder: true },
    { name: "Nadia Iqbal",     phone: "0300-9988776", email: "nadia@example.com",   date: daysFromNow(4), slot: "6:00 PM", guests: 2, tableIdx: 8, status: "Pending",   preOrder: false },
    // Past
    { name: "Tariq Mehmood",   phone: "0321-5544332", email: "tariq@example.com",   date: daysAgo(1),     slot: "7:00 PM", guests: 4, tableIdx: 3, status: "Completed", preOrder: false },
    { name: "Sana Baig",       phone: "0333-6677889", email: "sana@example.com",    date: daysAgo(1),     slot: "8:00 PM", guests: 2, tableIdx: 1, status: "Completed", preOrder: true },
    { name: "Imran Chaudhry",  phone: "0345-3344556", email: "imran@example.com",   date: daysAgo(2),     slot: "6:00 PM", guests: 6, tableIdx: 5, status: "Completed", preOrder: false },
    { name: "Hina Qureshi",    phone: "0311-7788990", email: "hina@example.com",    date: daysAgo(2),     slot: "9:00 PM", guests: 3, tableIdx: 2, status: "No-show",   preOrder: false },
    { name: "Kamran Mirza",    phone: "0300-1234567", email: "kamran@example.com",  date: daysAgo(3),     slot: "7:00 PM", guests: 2, tableIdx: 0, status: "Completed", preOrder: false },
    { name: "Rabia Tahir",     phone: "0322-9876543", email: "rabia@example.com",   date: daysAgo(4),     slot: "8:00 PM", guests: 4, tableIdx: 4, status: "Cancelled", preOrder: false },
    { name: "Asad Javed",      phone: "0312-4567890", email: "asad@example.com",    date: daysAgo(5),     slot: "6:00 PM", guests: 2, tableIdx: 1, status: "Completed", preOrder: true },
    { name: "Mehwish Akhtar",  phone: "0344-1122334", email: "mehwish@example.com", date: daysAgo(6),     slot: "7:00 PM", guests: 5, tableIdx: 6, status: "Completed", preOrder: false },
  ];

  // Pre-order items to attach
  const preOrderSamples = [
    [{ id: menuItems[0].id, name: menuItems[0].name, price: menuItems[0].price, quantity: 2 },
     { id: menuItems[5].id, name: menuItems[5].name, price: menuItems[5].price, quantity: 1 }],
    [{ id: menuItems[1].id, name: menuItems[1].name, price: menuItems[1].price, quantity: 1 },
     { id: menuItems[10].id, name: menuItems[10].name, price: menuItems[10].price, quantity: 2 }],
    [{ id: menuItems[6].id, name: menuItems[6].name, price: menuItems[6].price, quantity: 2 },
     { id: menuItems[14].id, name: menuItems[14].name, price: menuItems[14].price, quantity: 3 }],
  ];

  let preOrderIdx = 0;
  for (const r of reservationData) {
    const table = tables[r.tableIdx % tables.length];
    await prisma.reservation.create({
      data: {
        guestName: r.name,
        phone: r.phone,
        email: r.email,
        date: r.date,
        timeSlot: r.slot,
        guests: r.guests,
        tableId: table.id,
        status: r.status,
        specialRequests: r.preOrder ? "Please prepare pre-ordered items before arrival." : "",
        preOrderItems: r.preOrder ? preOrderSamples[preOrderIdx++ % preOrderSamples.length] : [],
      },
    });
  }
  console.log(`Created ${reservationData.length} reservations`);

  // ── Orders ────────────────────────────────────────────────────────────────
  console.log("Creating orders...");

  const orderData = [
    // Today — active
    { name: "Laiba Khan",      phone: "0345-3155537", address: "House 12, Block B, Gulshan-e-Iqbal, Karachi", type: "Delivery",  status: "Pending",           hoursBack: 0.2,  items: [[0,2],[5,1],[14,2]] },
    { name: "Ahmed Raza",      phone: "0321-9876543", address: "Flat 5, DHA Phase 6, Lahore",                 type: "Preparing", status: "Preparing",         hoursBack: 0.5,  items: [[1,1],[6,1],[10,1]] },
    { name: "Sara Malik",      phone: "0333-4567890", address: "Plot 33, F-7/2, Islamabad",                   type: "Delivery",  status: "Out for Delivery",  hoursBack: 1,    items: [[7,1],[11,1]] },
    { name: "Usman Ali",       phone: "0300-1122334", address: "Street 4, Johar Town, Lahore",                type: "Takeaway",  status: "Preparing",         hoursBack: 0.3,  items: [[2,3],[12,2]] },
    { name: "Fatima Noor",     phone: "0311-9988776", address: "Apartment 8, Clifton Block 5, Karachi",       type: "Delivery",  status: "Pending",           hoursBack: 0.1,  items: [[3,1],[4,1],[13,1]] },
    // Today — delivered
    { name: "Bilal Sheikh",    phone: "0301-5544332", address: "House 22, G-11/3, Islamabad",                 type: "Delivery",  status: "Delivered",         hoursBack: 3,    items: [[5,1],[10,1],[14,1]] },
    { name: "Ayesha Siddiqui", phone: "0322-6677889", address: "Bungalow 7, PECHS Block 2, Karachi",          type: "Takeaway",  status: "Delivered",         hoursBack: 4,    items: [[6,2],[11,1]] },
    { name: "Hamza Butt",      phone: "0312-3344556", address: "House 12, Block B, Gulshan-e-Iqbal, Karachi", type: "Delivery",  status: "Delivered",         hoursBack: 5,    items: [[7,1],[12,1],[15,2]] },
    // Yesterday
    { name: "Zara Hussain",    phone: "0344-7788990", address: "Flat 5, DHA Phase 6, Lahore",                 type: "Delivery",  status: "Delivered",         hoursBack: 26,   items: [[0,1],[5,1]] },
    { name: "Omar Farooq",     phone: "0355-1234567", address: "Plot 33, F-7/2, Islamabad",                   type: "Takeaway",  status: "Delivered",         hoursBack: 28,   items: [[8,1],[13,2]] },
    { name: "Nadia Iqbal",     phone: "0300-9988776", address: "Street 4, Johar Town, Lahore",                type: "Delivery",  status: "Delivered",         hoursBack: 30,   items: [[1,2],[10,1],[16,1]] },
    { name: "Tariq Mehmood",   phone: "0321-5544332", address: "Apartment 8, Clifton Block 5, Karachi",       type: "Delivery",  status: "Cancelled",         hoursBack: 32,   items: [[6,1],[11,1]] },
    // 2 days ago
    { name: "Sana Baig",       phone: "0333-6677889", address: "House 22, G-11/3, Islamabad",                 type: "Takeaway",  status: "Delivered",         hoursBack: 50,   items: [[7,1],[12,1]] },
    { name: "Imran Chaudhry",  phone: "0345-3344556", address: "Bungalow 7, PECHS Block 2, Karachi",          type: "Delivery",  status: "Delivered",         hoursBack: 52,   items: [[2,2],[5,1],[14,1]] },
    // 3 days ago
    { name: "Hina Qureshi",    phone: "0311-7788990", address: "House 12, Block B, Gulshan-e-Iqbal, Karachi", type: "Delivery",  status: "Delivered",         hoursBack: 74,   items: [[3,1],[8,1]] },
    { name: "Kamran Mirza",    phone: "0300-1234567", address: "Flat 5, DHA Phase 6, Lahore",                 type: "Takeaway",  status: "Delivered",         hoursBack: 76,   items: [[6,1],[10,2],[15,1]] },
    // 4-6 days ago
    { name: "Rabia Tahir",     phone: "0322-9876543", address: "Plot 33, F-7/2, Islamabad",                   type: "Delivery",  status: "Delivered",         hoursBack: 98,   items: [[1,1],[7,1],[11,1]] },
    { name: "Asad Javed",      phone: "0312-4567890", address: "Street 4, Johar Town, Lahore",                type: "Delivery",  status: "Delivered",         hoursBack: 122,  items: [[5,2],[12,1]] },
    { name: "Mehwish Akhtar",  phone: "0344-1122334", address: "Apartment 8, Clifton Block 5, Karachi",       type: "Takeaway",  status: "Delivered",         hoursBack: 146,  items: [[8,1],[13,1],[16,2]] },
  ];

  for (const o of orderData) {
    const orderItems = o.items.map(([idx, qty]) => {
      const mi = menuItems[idx % menuItems.length];
      return { menuItemId: mi.id, quantity: qty, price: mi.price };
    });
    const total = orderItems.reduce((s, i) => s + i.price * i.quantity, 0) + 1;

    await prisma.order.create({
      data: {
        customerName: o.name,
        phone: o.phone,
        address: o.address,
        orderType: o.type === "Preparing" ? "Delivery" : o.type,
        status: o.status,
        totalAmount: total,
        createdAt: hoursAgo(o.hoursBack),
        items: { create: orderItems },
      },
    });
  }
  console.log(`Created ${orderData.length} orders`);

  // Final count
  const [finalOrders, finalRes] = await Promise.all([
    prisma.order.count(),
    prisma.reservation.count(),
  ]);
  console.log(`\n✅ Done! Database now has:`);
  console.log(`   Orders:       ${finalOrders}`);
  console.log(`   Reservations: ${finalRes}`);
}

main()
  .catch(console.error)
  .finally(() => process.exit(0));
