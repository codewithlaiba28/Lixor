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

// ── Send WhatsApp message — single attempt, no retry loop ───────────────────
async function sendWhatsAppMessage(
  client: twilio.Twilio,
  to: string,
  body: string
): Promise<void> {
  try {
    const msg = await client.messages.create({
      from: process.env.TWILIO_WHATSAPP_NUMBER!,
      to,
      body,
    });
    console.log(`[Zara] Message sent — SID: ${msg.sid}, Status: ${msg.status}`);
  } catch (err: any) {
    console.error(`[Zara] Send failed:`, {
      code: err?.code,
      status: err?.status,
      message: err?.message,
    });
    // Do not retry — Twilio retries cause duplicate messages and throttling
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
