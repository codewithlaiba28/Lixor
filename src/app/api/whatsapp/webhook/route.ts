/**
 * POST /api/whatsapp/webhook
 * Twilio sends incoming WhatsApp messages here.
 * Zara AI processes them and replies.
 *
 * Pattern: Return 200 immediately to Twilio, process AI in background.
 * This prevents Vercel timeout issues on Hobby plan (10s limit).
 */

import { NextRequest, NextResponse } from "next/server";
import twilio from "twilio";
import { getZaraResponse, executeZaraAction } from "@/lib/zara";

export const runtime = "nodejs";
export const maxDuration = 60;

// ── Send with retry on rate limit ────────────────────────────────────────────
async function sendWhatsAppMessage(
  client: twilio.Twilio,
  to: string,
  body: string,
  retries = 3
): Promise<void> {
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      await client.messages.create({
        from: process.env.TWILIO_WHATSAPP_NUMBER!,
        to,
        body,
      });
      return;
    } catch (err: any) {
      const isRateLimit = err?.code === 63038 || err?.status === 429;
      if (isRateLimit && attempt < retries) {
        console.warn(`[Zara] Rate limit, retrying in 2s (${attempt}/${retries})`);
        await new Promise((r) => setTimeout(r, 2000));
        continue;
      }
      if (isRateLimit) {
        console.warn(`[Zara] Rate limit on all retries.`);
        return;
      }
      throw err;
    }
  }
}

// ── Background processing — AI + DB + reply ──────────────────────────────────
async function processAndReply(from: string, messageBody: string) {
  try {
    const conversationId = from.replace("whatsapp:", "");

    const { text, action } = await getZaraResponse(conversationId, messageBody);

    let actionFeedback = "";
    if (action) {
      actionFeedback = await executeZaraAction(action);
    }

    const fullReply = actionFeedback
      ? `${text}\n\n${actionFeedback}`
      : text;

    const client = twilio(
      process.env.TWILIO_ACCOUNT_SID!,
      process.env.TWILIO_AUTH_TOKEN!
    );

    await sendWhatsAppMessage(client, from, fullReply);
    console.log(`[Zara] Reply sent to ${from}`);
  } catch (err: any) {
    console.error("[Zara] Background processing error:", err?.message || err);
  }
}

// ── Webhook handler ───────────────────────────────────────────────────────────
export async function POST(req: NextRequest) {
  try {
    const body = await req.text();
    const params = new URLSearchParams(body);

    const from = params.get("From") || "";
    const messageBody = params.get("Body") || "";

    console.log(`[Zara WhatsApp] From: ${from}, Message: "${messageBody}"`);

    if (!messageBody.trim()) {
      return new NextResponse("OK", { status: 200 });
    }

    // ✅ Return 200 to Twilio IMMEDIATELY — no timeout
    // AI processing happens in background
    processAndReply(from, messageBody).catch((err) =>
      console.error("[Zara] Background error:", err)
    );

    return new NextResponse("OK", { status: 200 });
  } catch (error: any) {
    console.error("[Zara WhatsApp] Error:", error?.message || error);
    return new NextResponse("OK", { status: 200 });
  }
}
