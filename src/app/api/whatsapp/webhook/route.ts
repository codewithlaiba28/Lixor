/**
 * POST /api/whatsapp/webhook
 * Twilio sends incoming WhatsApp messages here.
 * Zara AI processes them and replies.
 */

import { NextRequest, NextResponse } from "next/server";
import twilio from "twilio";
import { getZaraResponse, executeZaraAction } from "@/lib/zara";

export const runtime = "nodejs";

// ── Send message with retry on rate limit ─────────────────────────────────────
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
      return; // success
    } catch (err: any) {
      const isRateLimit = err?.code === 63038 || err?.status === 429;
      const isLastAttempt = attempt === retries;

      if (isRateLimit && !isLastAttempt) {
        // Wait 2 seconds before retry
        console.warn(`[Zara] Rate limit hit, retrying in 2s (attempt ${attempt}/${retries})`);
        await new Promise((r) => setTimeout(r, 2000));
        continue;
      }

      // For rate limit on last attempt — log but don't crash
      if (isRateLimit) {
        console.warn(`[Zara] Rate limit on all retries. Message not sent to ${to}`);
        return;
      }

      // Other errors — rethrow
      throw err;
    }
  }
}

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

    // Use phone number as conversation ID
    const conversationId = from.replace("whatsapp:", "");

    // Get Zara's AI response
    const { text, action } = await getZaraResponse(conversationId, messageBody);

    // Execute action (save order/booking to DB)
    let actionFeedback = "";
    if (action) {
      actionFeedback = await executeZaraAction(action);
    }

    const fullReply = actionFeedback
      ? `${text}\n\n${actionFeedback}`
      : text;

    // Send reply with retry support
    const client = twilio(
      process.env.TWILIO_ACCOUNT_SID!,
      process.env.TWILIO_AUTH_TOKEN!
    );

    await sendWhatsAppMessage(client, from, fullReply);

    return new NextResponse("OK", { status: 200 });
  } catch (error: any) {
    console.error("[Zara WhatsApp] Error:", error?.message || error);
    // Always return 200 to Twilio so it doesn't retry endlessly
    return new NextResponse("OK", { status: 200 });
  }
}
