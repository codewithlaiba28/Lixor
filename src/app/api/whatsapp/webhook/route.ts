/**
 * POST /api/whatsapp/webhook
 * Twilio sends incoming WhatsApp messages here.
 * Zara AI processes them and replies.
 */

import { NextRequest, NextResponse } from "next/server";
import twilio from "twilio";
import { getZaraResponse, executeZaraAction } from "@/lib/zara";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  try {
    const body = await req.text();
    const params = new URLSearchParams(body);

    const from = params.get("From") || "";       // e.g. whatsapp:+923001234567
    const to = params.get("To") || "";           // e.g. whatsapp:+14155238886
    const messageBody = params.get("Body") || "";
    const profileName = params.get("ProfileName") || "Customer";

    console.log(`[Zara WhatsApp] From: ${from}, Message: "${messageBody}"`);

    if (!messageBody.trim()) {
      return new NextResponse("OK", { status: 200 });
    }

    // Use phone number as conversation ID (strip "whatsapp:" prefix)
    const conversationId = from.replace("whatsapp:", "");

    // Get Zara's response
    const { text, action } = await getZaraResponse(conversationId, messageBody);

    // Execute action if present (save order/booking to DB)
    let actionFeedback = "";
    if (action) {
      actionFeedback = await executeZaraAction(action);
    }

    const fullReply = actionFeedback
      ? `${text}\n\n${actionFeedback}`
      : text;

    // Send reply via Twilio
    const client = twilio(
      process.env.TWILIO_ACCOUNT_SID!,
      process.env.TWILIO_AUTH_TOKEN!
    );

    await client.messages.create({
      from: process.env.TWILIO_WHATSAPP_NUMBER!,
      to: from,
      body: fullReply,
    });

    return new NextResponse("OK", { status: 200 });
  } catch (error) {
    console.error("[Zara WhatsApp] Error:", error);
    return new NextResponse("Error", { status: 500 });
  }
}
