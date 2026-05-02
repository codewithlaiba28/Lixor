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
  console.log("Testing order creation...");

  // Check if itemName column exists
  const cols = await prisma.$queryRaw<any[]>`
    SELECT column_name, is_nullable, column_default
    FROM information_schema.columns
    WHERE table_name = 'OrderItem'
    ORDER BY ordinal_position;
  `;
  console.log("OrderItem columns:", cols);

  // Try creating a test order
  try {
    const order = await prisma.order.create({
      data: {
        customerName: "Test User",
        phone: "03001234567",
        address: "Test Address, Karachi",
        orderType: "Delivery",
        totalAmount: 101,
        items: {
          create: [
            {
              itemName: "Bruschetta Trio",
              quantity: 1,
              price: 100,
            },
          ],
        },
      },
    });
    console.log("✅ Order created successfully! ID:", order.id);

    // Clean up
    await prisma.orderItem.deleteMany({ where: { orderId: order.id } });
    await prisma.order.delete({ where: { id: order.id } });
    console.log("✅ Test order cleaned up");
  } catch (err: any) {
    console.error("❌ Order creation failed:", err.message);
    console.error("Code:", err.code);
    console.error("Meta:", err.meta);
  }
}

main()
  .catch(console.error)
  .finally(() => process.exit(0));
