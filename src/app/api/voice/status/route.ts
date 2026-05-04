/**
 * POST /api/voice/status
 * Twilio calls this with call status updates.
 * Used for cleanup and logging.
 */

import { NextRequest, NextResponse } from "next/server";
import { clearConversation } from "@/lib/zara";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  try {
    const body = await req.text();
    const params = new URLSearchParams(body);
    const callSid = params.get("CallSid") || "";
    const callStatus = params.get("CallStatus") || "";
    const duration = params.get("CallDuration") || "0";

    console.log(`[Zara] Call ${callSid} ended. Status: ${callStatus}, Duration: ${duration}s`);

    if (["completed", "failed", "busy", "no-answer", "canceled"].includes(callStatus)) {
      clearConversation(callSid);
    }
  } catch (e) {
    console.error("Status webhook error:", e);
  }

  return new NextResponse("OK", { status: 200 });
}
