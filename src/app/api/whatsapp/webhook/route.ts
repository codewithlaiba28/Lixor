/**
 * POST /api/whatsapp/webhook
 * Twilio sends incoming WhatsApp messages here.
 *
 * Fix: Use waitUntil() so Vercel keeps the function alive after returning 200.
 * Without this, background processing stops immediately after response.
 */

import { NextRequest, NextResponse } from "next/server";
import { waitUntil } from "@vercel/functions";
import twilio from "twilio";
import { getZaraResponse, executeZaraAction } from "@/lib/zara";

export const runtime = "nodejs";
export const maxDuration = 60;

// ── Send with retry ──────────────────────────────────────────────────────────
async function sendWhatsAppMessage(
  client: twilio.Twilio,
  to: string,
  body: string,
  retries = 2
): Promise<void> {
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      const msg = await client.messages.create({
        from: process.env.TWILIO_WHATSAPP_NUMBER!,
        to,
        body,
      });
      console.log(`[Zara] Message sent SID: ${msg.sid}, Status: ${msg.status}`);
      return;
    } catch (err: any) {
      // Log full error details so we can debug
      console.error(`[Zara] Send error (attempt ${attempt}):`, {
        code: err?.code,
        status: err?.status,
        message: err?.message,
        moreInfo: err?.moreInfo,
      });

      const isLastAttempt = attempt === retries;
      if (!isLastAttempt) {
        await new Promise((r) => setTimeout(r, 2000));
        continue;
      }
      // Don't throw — log and continue so function doesn't crash
      console.error(`[Zara] Failed to send after ${retries} attempts.`);
    }
  }
}

// ── Background: AI response + DB save + WhatsApp reply ───────────────────────
async function processAndReply(from: string, messageBody: string) {
  try {
    const conversationId = from.replace("whatsapp:", "");

    console.log(`[Zara] Processing message from ${conversationId}: "${messageBody}"`);

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
    console.log(`[Zara] Reply sent to ${from}: "${fullReply.slice(0, 80)}..."`);
  } catch (err: any) {
    console.error("[Zara] processAndReply error:", err?.message || err);
  }
}

// ── Webhook handler ───────────────────────────────────────────────────────────
export async function POST(req: NextRequest) {
  try {
    const body = await req.text();
    const params = new URLSearchParams(body);

    const from = params.get("From") || "";
    const messageBody = params.get("Body") || "";

    console.log(`[Zara WhatsApp] Received from: ${from}, Body: "${messageBody}"`);

    if (!messageBody.trim()) {
      return new NextResponse("OK", { status: 200 });
    }

    // ✅ waitUntil keeps the Vercel function alive after returning 200
    // so AI processing completes even after Twilio gets its response
    waitUntil(processAndReply(from, messageBody));

    return new NextResponse("OK", { status: 200 });
  } catch (error: any) {
    console.error("[Zara WhatsApp] Error:", error?.message || error);
    return new NextResponse("OK", { status: 200 });
  }
}
