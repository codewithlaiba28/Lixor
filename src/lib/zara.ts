/**
 * Zara — AI WhatsApp Receptionist for Lixor Fine Dining
 * Handles conversation state and LLM responses via Cerebras
 */

import OpenAI from "openai";
import prisma from "@/lib/prisma";

const cerebras = new OpenAI({
  apiKey: process.env.CEREBRAS_API_KEY!,
  baseURL: "https://api.cerebras.ai/v1",
});

// ── Menu for Zara's knowledge ─────────────────────────────────────────────────
const MENU_TEXT = `
STARTERS & APPETIZERS:
- Bruschetta Trio — USD 12
- Crispy Calamari — USD 18
- Spicy Chicken Wings — USD 14
- Stuffed Mushrooms — USD 16
- Caprese Salad — USD 16
- Cheese Crostini — USD 14
- Chilled Gazpacho — USD 12
- Caesar Salad — USD 30

MAIN COURSES:
- Chicken Alfredo — USD 22
- Grilled Salmon — USD 28
- Steak au Poivre — USD 35
- Vegetarian Lasagna — USD 20
- Mashed Potatoes — USD 10

DESSERTS:
- Classic Tiramisu — USD 12
- Creme Brulee — USD 14
- Molten Lava Cake — USD 15
- NY Cheesecake — USD 13
`;

const SYSTEM_PROMPT = `You are "Zara", a friendly AI receptionist for Lixor Fine Dining restaurant on WhatsApp.

RESTAURANT INFO:
- Name: Lixor Fine Dining
- Hours: 12:00 PM – 11:00 PM, 7 days a week
- Delivery: Available (USD 1 delivery fee)
- Tables: 10 tables, 2–8 capacity
- Payment: Cash on delivery / at counter only
- Location: Lixor Fine Dining Restaurant

MENU:
${MENU_TEXT}

TABLE BOOKING TIME SLOTS: 12:00 PM, 1:00 PM, 2:00 PM, 6:00 PM, 7:00 PM, 8:00 PM, 9:00 PM

YOUR JOB:
1. Take food orders (delivery or takeaway)
2. Book tables (dine-in)
3. Answer menu/timing/location questions

LANGUAGE:
- Urdu/Roman Urdu mein baat karo agar customer Urdu mein likhe
- English mein jawab do agar customer English mein likhe
- Warm, friendly, professional raho

FIRST MESSAGE GREETING:
"Assalam o Alaikum! 🍽️ Lixor Fine Dining mein khush aamdeed!
Main Zara hoon, aapki kya madad kar sakti hoon?

📋 Menu dekhna chahte hain?
🛵 Food order karna hai?
🪑 Table book karna hai?"

FOR TABLE BOOKING — step by step collect karo:
1. Naam
2. Date (YYYY-MM-DD format mein internally store karo)
3. Time slot
4. Guests ki tadaad
5. Special request (optional)

FOR FOOD ORDER — step by step collect karo:
1. Items aur quantity
2. Delivery ya takeaway
3. Agar delivery: full address
4. Naam aur phone number

WHEN ALL INFO IS COLLECTED — emit action tag on its own line:

For order:
<action>{"type":"order","customerName":"...","phone":"...","address":"...","orderType":"Delivery","items":[{"name":"Chicken Alfredo","price":22,"quantity":1}]}</action>

For booking:
<action>{"type":"booking","guestName":"...","phone":"...","date":"YYYY-MM-DD","timeSlot":"7:00 PM","guests":2,"specialRequests":"..."}</action>

RULES:
- NEVER emit <action> jab tak sab info complete na ho
- Ek baar mein ek hi sawaal poocho
- Short replies — WhatsApp conversation hai
- Emojis use karo — friendly lagta hai 😊
- Payment sirf cash on delivery / at counter

CLOSING:
"Shukriya Lixor Fine Dining ko choose karne ka! 🙏
Aapka din mubarak ho! Allah Hafiz! 😊"`;

// ── Conversation state ────────────────────────────────────────────────────────
interface ConversationState {
  messages: Array<{ role: "user" | "assistant"; content: string }>;
  createdAt: number;
}

const conversations = new Map<string, ConversationState>();

function cleanup() {
  const cutoff = Date.now() - 60 * 60 * 1000; // 1 hour
  for (const [id, state] of conversations) {
    if (state.createdAt < cutoff) conversations.delete(id);
  }
}

export function getOrCreateConversation(id: string): ConversationState {
  cleanup();
  if (!conversations.has(id)) {
    conversations.set(id, { messages: [], createdAt: Date.now() });
  }
  return conversations.get(id)!;
}

export function clearConversation(id: string) {
  conversations.delete(id);
}

// ── Get Zara's response ───────────────────────────────────────────────────────
export async function getZaraResponse(
  conversationId: string,
  userMessage: string
): Promise<{ text: string; action: any | null }> {
  const state = getOrCreateConversation(conversationId);

  // Add user message
  state.messages.push({ role: "user", content: userMessage });

  // Keep last 20 messages to avoid token overflow
  const recentMessages = state.messages.slice(-20);

  const completion = await cerebras.chat.completions.create({
    model: "llama3.1-8b",
    messages: [
      { role: "system", content: SYSTEM_PROMPT },
      ...recentMessages,
    ],
    temperature: 0.4,
    max_tokens: 400,
  });

  const rawResponse =
    completion.choices[0]?.message?.content ||
    "Maafi chahti hoon, kuch masla aa gaya. Dobara try karein. 🙏";

  // Extract <action> tag
  const actionMatch = rawResponse.match(/<action>([\s\S]*?)<\/action>/);
  let action: any = null;
  const cleanText = rawResponse.replace(/<action>[\s\S]*?<\/action>/g, "").trim();

  if (actionMatch) {
    try {
      action = JSON.parse(actionMatch[1].trim());
    } catch {
      // ignore malformed
    }
  }

  // Save assistant reply
  state.messages.push({ role: "assistant", content: cleanText });

  return { text: cleanText, action };
}

// ── Execute action — save to DB ───────────────────────────────────────────────
export async function executeZaraAction(action: any): Promise<string> {
  if (!action?.type) return "";

  // ── Food Order ──────────────────────────────────────────────────────────────
  if (action.type === "order") {
    try {
      const items = (action.items || []).map((i: any) => ({
        itemName: String(i.name || "Item"),
        quantity: Number(i.quantity) || 1,
        price: Number(i.price) || 0,
      }));

      if (items.length === 0) {
        return "⚠️ Order mein koi item nahi tha. Dobara try karein.";
      }

      const subtotal = items.reduce(
        (s: number, i: any) => s + i.price * i.quantity,
        0
      );
      const total = subtotal + 1; // +1 delivery fee

      await prisma.order.create({
        data: {
          customerName: String(action.customerName || "WhatsApp Customer"),
          phone: String(action.phone || "Unknown"),
          address: String(action.address || "Not provided"),
          orderType: String(action.orderType || "Delivery"),
          totalAmount: total,
          status: "Pending",
          items: { create: items },
        },
      });

      const itemsList = items
        .map((i: any) => `• ${i.quantity}x ${i.itemName} — USD ${(i.price * i.quantity).toFixed(2)}`)
        .join("\n");

      return `✅ *Order Confirm Ho Gaya!*

${itemsList}
━━━━━━━━━━━━━━
🛵 Delivery Fee: USD 1.00
💰 *Total: USD ${total.toFixed(2)}*

⏱️ Approximately 30-45 minutes mein ready ho jaye ga.
💵 Payment: Cash on delivery`;
    } catch (e) {
      console.error("Zara order error:", e);
      return "❌ Order save karne mein masla aa gaya. Dobara try karein.";
    }
  }

  // ── Table Booking ───────────────────────────────────────────────────────────
  if (action.type === "booking") {
    try {
      const guests = Number(action.guests) || 2;
      const bookingDate = new Date(action.date);

      if (isNaN(bookingDate.getTime())) {
        return "⚠️ Date sahi nahi hai. Kripya YYYY-MM-DD format mein dein (e.g., 2025-06-15).";
      }

      // Find booked tables for this slot
      const bookedTableIds = await prisma.reservation.findMany({
        where: {
          date: bookingDate,
          timeSlot: action.timeSlot,
          status: { not: "Cancelled" },
        },
        select: { tableId: true },
      });

      const bookedIds = bookedTableIds.map((r) => r.tableId);

      // Find available table with enough capacity
      const availableTable = await prisma.restaurantTable.findFirst({
        where: {
          isActive: true,
          capacity: { gte: guests },
          id: { notIn: bookedIds },
        },
        orderBy: { capacity: "asc" },
      });

      if (!availableTable) {
        return `😔 Maafi chahti hoon! ${action.timeSlot} par ${action.date} ko ${guests} afraad ke liye koi table available nahi hai.\n\nKoi aur time slot try karein?\n⏰ Available slots: 12:00 PM, 1:00 PM, 2:00 PM, 6:00 PM, 7:00 PM, 8:00 PM, 9:00 PM`;
      }

      await prisma.reservation.create({
        data: {
          guestName: String(action.guestName || "WhatsApp Guest"),
          phone: String(action.phone || "Unknown"),
          email: String(action.email || "whatsapp@lixor.com"),
          date: bookingDate,
          timeSlot: String(action.timeSlot),
          guests,
          tableId: availableTable.id,
          specialRequests: String(action.specialRequests || ""),
          status: "Confirmed",
          preOrderItems: [],
        },
      });

      const dateFormatted = bookingDate.toLocaleDateString("en-PK", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      });

      return `✅ *Booking Confirm Ho Gayi!*

👤 Naam: ${action.guestName}
📅 Date: ${dateFormatted}
⏰ Time: ${action.timeSlot}
👥 Guests: ${guests}
🪑 Table: #${availableTable.tableNumber}
${action.specialRequests ? `📝 Special Request: ${action.specialRequests}` : ""}

Hum aapka intezaar karenge! 🍽️`;
    } catch (e) {
      console.error("Zara booking error:", e);
      return "❌ Booking save karne mein masla aa gaya. Dobara try karein.";
    }
  }

  return "";
}
