import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import pg from "pg";
import * as dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.resolve(process.cwd(), ".env") });

const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  const [tables, menu, orders, reservations] = await Promise.all([
    prisma.restaurantTable.count(),
    prisma.menuItem.count(),
    prisma.order.count(),
    prisma.reservation.count(),
  ]);
  console.log("=== DATABASE STATUS ===");
  console.log(`Tables:       ${tables}`);
  console.log(`Menu Items:   ${menu}`);
  console.log(`Orders:       ${orders}`);
  console.log(`Reservations: ${reservations}`);

  if (orders > 0) {
    const sample = await prisma.order.findFirst({ include: { items: { include: { menuItem: true } } } });
    console.log("\nSample order:", JSON.stringify(sample, null, 2));
  }
  if (reservations > 0) {
    const sample = await prisma.reservation.findFirst({ include: { table: true } });
    console.log("\nSample reservation:", JSON.stringify(sample, null, 2));
  }
}

main()
  .catch(console.error)
  .finally(() => process.exit(0));
