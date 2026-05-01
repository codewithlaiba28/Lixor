import "dotenv/config";
import prisma from "../src/lib/prisma";
import { generateEmbedding } from "../src/lib/embeddings";
import { menuItems } from "../src/data/menuData";

const restaurantKnowledge = [
  {
    content: "Lixor is a premium fine-dining restaurant located at 123 Culinary Avenue, Foodville. We offer a curated experience blending modern culinary techniques with classic flavors.",
    metadata: { type: "about" }
  },
  {
    content: "Lixor Opening Hours: Monday to Thursday from 12:00 PM to 10:00 PM. Friday and Saturday from 12:00 PM to 11:00 PM. Sunday from 1:00 PM to 9:00 PM.",
    metadata: { type: "hours" }
  },
  {
    content: "Dress Code: We require smart casual attire. Please no athletic wear, flip flops, or excessively casual clothing.",
    metadata: { type: "policies" }
  },
  {
    content: "Table Reservations: Advance booking is highly recommended, especially for weekends. You can book a table via our online booking system or by calling us. We have a 24-hour cancellation policy.",
    metadata: { type: "booking" }
  },
  {
    content: "Online Ordering and Delivery: We offer delivery within a 5-mile radius. Delivery time usually takes 30-45 minutes. Minimum order for delivery is $30. You can place an order directly through our website.",
    metadata: { type: "delivery" }
  },
  {
    content: "Lixor Online Ordering: You can place an order for delivery or takeaway directly on our website by visiting the /cart page. Simply browse the /menu, add items to your bag, and proceed to checkout. We support cash on delivery and online payments.",
    metadata: { type: "ordering_how_to" }
  },
  {
    content: "Table Reservation System: To book a table, go to the /book page. You can select your preferred date, time slot, and even choose your specific table from our interactive floor plan. You'll receive a confirmation instantly.",
    metadata: { type: "booking_how_to" }
  },
  {
    content: "Lixor Features: Our website includes a full digital menu (/menu), a gallery of our fine dining ambiance (/gallery), an about page (/about) detailing our history, and a blog (/blog) for the latest culinary updates.",
    metadata: { type: "website_features" }
  },
  {
    content: "Chef Profiles: Meet our master chefs on the /chef page. Our team is led by world-class culinary experts who specialize in gourmet fusion and premium dining.",
    metadata: { type: "chef_info" }
  }
];

async function main() {
  console.log("Seeding Knowledge Base into Neon pgvector...");

  // Clear existing documents to avoid duplicates
  await prisma.document.deleteMany({});
  console.log("Cleared existing documents.");

  let documentCount = 0;

  // 1. Seed generic knowledge
  for (const knowledge of restaurantKnowledge) {
    const embedding = await generateEmbedding(knowledge.content);
    
    // Convert embedding to string format for raw SQL insertion
    const embeddingString = `[${embedding.join(",")}]`;

    await prisma.$executeRaw`
      INSERT INTO "Document" (id, content, metadata, embedding)
      VALUES (gen_random_uuid(), ${knowledge.content}, ${knowledge.metadata}::jsonb, ${embeddingString}::vector)
    `;
    documentCount++;
  }

  // 2. Seed menu items
  for (const item of menuItems) {
    console.log(`Syncing item: ${item.name}`);

    // A. Sync to MenuItem table for Order functionality
    await prisma.menuItem.upsert({
      where: { id: item.id },
      update: {
        name: item.name,
        description: item.description || "Premium Lixor dish",
        price: parseFloat(String(item.price).replace(/[^0-9.]/g, '')) || 0,
        category: item.category.join(", "),
        imageUrl: item.image,
        isAvailable: true,
      },
      create: {
        id: item.id,
        name: item.name,
        description: item.description || "Premium Lixor dish",
        price: parseFloat(String(item.price).replace(/[^0-9.]/g, '')) || 0,
        category: item.category.join(", "),
        imageUrl: item.image,
        isAvailable: true,
      }
    });

    // B. Sync to RAG Knowledge Base for Chat functionality
    const content = `Menu Item: ${item.name}. Category: ${item.category.join(", ")}. Price: ${item.price}. Image Path: ${item.image}. Description: ${item.description || "Premium Lixor dish"}.`;
    const embedding = await generateEmbedding(content);
    const metadata = { 
      type: "menu", 
      id: item.id,
      name: item.name,
      category: item.category, 
      price: item.price,
      image: item.image 
    };

    const embeddingString = `[${embedding.join(",")}]`;

    await prisma.$executeRaw`
      INSERT INTO "Document" (id, content, metadata, embedding)
      VALUES (gen_random_uuid(), ${content}, ${metadata}::jsonb, ${embeddingString}::vector)
    `;
    documentCount++;
  }

  console.log(`Successfully seeded ${documentCount} documents into the knowledge base.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
