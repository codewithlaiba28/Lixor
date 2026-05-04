/**
 * POST /api/voice/incoming
 * Twilio calls this when a customer calls the restaurant number.
 * Returns TwiML to greet and start gathering speech.
 */

import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";

export async function POST(_req: NextRequest) {
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || "https://your-app.vercel.app";

  const twiml = `<?xml version="1.0" encoding="UTF-8"?>
<Response>
  <Say voice="Polly.Joanna" language="en-US">
    Assalam o Alaikum! Lixor Fine Dining mein khush aamdeed. Main Zara hoon, aapki kya madad kar sakti hoon?
  </Say>
  <Gather
    input="speech"
    action="${appUrl}/api/voice/respond"
    method="POST"
    speechTimeout="auto"
    language="en-US"
    hints="order, booking, menu, table, delivery, takeaway"
    timeout="5"
  >
    <Say voice="Polly.Joanna" language="en-US">Please speak after the tone.</Say>
  </Gather>
  <Redirect method="POST">${appUrl}/api/voice/incoming</Redirect>
</Response>`;

  return new NextResponse(twiml, {
    headers: { "Content-Type": "text/xml" },
  });
}
