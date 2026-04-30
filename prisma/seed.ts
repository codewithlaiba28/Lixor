import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import pg from "pg";
import * as dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.resolve(process.cwd(), ".env") });

const url = process.env.DATABASE_URL;

if (!url) {
  throw new Error("DATABASE_URL is not defined in the environment.");
}

console.log("Connecting to:", url.replace(/:[^@]+@/, ":***@"));

const pool = new pg.Pool({ connectionString: url });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("Cleaning up database...");
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.reservation.deleteMany();
  await prisma.menuItem.deleteMany();
  await prisma.restaurantTable.deleteMany();

  console.log("Seeding tables...");
  const tables = [
    { tableNumber: 1, capacity: 2 },
    { tableNumber: 2, capacity: 2 },
    { tableNumber: 3, capacity: 4 },
    { tableNumber: 4, capacity: 4 },
    { tableNumber: 5, capacity: 4 },
    { tableNumber: 6, capacity: 6 },
    { tableNumber: 7, capacity: 6 },
    { tableNumber: 8, capacity: 8 },
    { tableNumber: 9, capacity: 2 },
    { tableNumber: 10, capacity: 4 },
  ];

  for (const table of tables) {
    await prisma.restaurantTable.create({ data: table });
  }

  console.log("Seeding menu items...");
  const menuItems = [
    { name: "Bruschetta trio", description: "Toasted bread with tomatoes, garlic, and basil.", price: 1500, category: "Starters", imageUrl: "/images/meal-section-images/appetizer/bruschetta trio.avif" },
    { name: "Crispy calamari", description: "Lightly battered and fried squid with dipping sauce.", price: 1800, category: "Starters", imageUrl: "/images/meal-section-images/appetizer/crispy calamari.avif" },
    { name: "Spicy chicken wings", description: "Zesty wings served with celery and blue cheese.", price: 1400, category: "Starters", imageUrl: "/images/meal-section-images/appetizer/spicy chicken wing.avif" },
    { name: "Stuffed mushrooms", description: "Mushrooms filled with herbs and cheese.", price: 1600, category: "Starters", imageUrl: "/images/meal-section-images/appetizer/stuffed mushrooms.avif" },
    { name: "Caprese salad", description: "Fresh mozzarella, tomatoes, and basil with balsamic glaze.", price: 1600, category: "Starters", imageUrl: "/images/meal-section-images/starter/caprese salad.avif" },
    { name: "Chicken Alfredo", description: "Fettuccine in a creamy white sauce with grilled chicken.", price: 2200, category: "Main Course", imageUrl: "/images/meal-section-images/courses/chicken alfredo.avif" },
    { name: "Grilled Salmon", description: "Perfectly seared salmon with a side of asparagus.", price: 2800, category: "Main Course", imageUrl: "/images/meal-section-images/courses/grilled salmon.avif" },
    { name: "Steak au Poivre", description: "Peppercorn-crusted steak with a rich sauce.", price: 3500, category: "Main Course", imageUrl: "/images/meal-section-images/courses/steak au poivre.avif" },
    { name: "Vegetarian Lasagna", description: "Layered pasta with fresh vegetables and mozzarella.", price: 2000, category: "Main Course", imageUrl: "/images/meal-section-images/courses/vegetarian lasagna.avif" },
    { name: "Caesar Salad", description: "Crisp romaine, croutons, and parmesan with house dressing.", price: 1800, category: "Main Course", imageUrl: "/images/meal-section-images/starter/caprese salad.avif" },
    { name: "Classic Tiramisu", description: "Coffee-soaked ladyfingers with mascarpone cream.", price: 1200, category: "Desserts", imageUrl: "/images/meal-section-images/desserts/classic tiramisu.avif" },
    { name: "Creme Brulee", description: "Vanilla custard with a burnt sugar crust.", price: 1400, category: "Desserts", imageUrl: "/images/meal-section-images/desserts/creme brulee.avif" },
    { name: "Molten Lava Cake", description: "Warm chocolate cake with a gooey center.", price: 1500, category: "Desserts", imageUrl: "/images/meal-section-images/desserts/molten lava cake.avif" },
    { name: "NY Cheesecake", description: "Rich and creamy cheesecake with berry compote.", price: 1300, category: "Desserts", imageUrl: "/images/meal-section-images/desserts/ny cheesecake.avif" },
    { name: "Iced Tea", description: "Refreshing brewed tea with lemon.", price: 500, category: "Drinks", imageUrl: "/images/meal-section-images/starter/chilled gazpacho.avif" },
    { name: "Fresh Orange Juice", description: "Freshly squeezed oranges.", price: 800, category: "Drinks", imageUrl: "/images/meal-section-images/starter/chilled gazpacho.avif" },
    { name: "Sparkling Water", description: "Refreshing bubbly water.", price: 400, category: "Drinks", imageUrl: "/images/meal-section-images/starter/chilled gazpacho.avif" },
    { name: "Red Wine", description: "A glass of fine house red wine.", price: 1500, category: "Drinks", imageUrl: "/images/meal-section-images/starter/chilled gazpacho.avif" },
    { name: "Black Coffee", description: "Premium roasted beans.", price: 600, category: "Drinks", imageUrl: "/images/meal-section-images/starter/chilled gazpacho.avif" },
  ];

  for (const item of menuItems) {
    await prisma.menuItem.create({ data: item });
  }

  console.log("Database seeded successfully!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
