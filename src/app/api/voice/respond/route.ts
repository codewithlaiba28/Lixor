/**
 * POST /api/voice/respond
 * Twilio sends the customer's speech here.
 * We process it with Zara AI and return TwiML with the response.
 */

import { NextRequest, NextResponse } from "next/server";
import { getZaraResponse, executeZaraAction, clearConversation } from "@/lib/zara";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || "https://your-app.vercel.app";

  let callSid = "unknown";
  let speechResult = "";

  try {
    const body = await req.text();
    const params = new URLSearchParams(body);
    callSid = params.get("CallSid") || "unknown";
    speechResult = params.get("SpeechResult") || "";
    const callStatus = params.get("CallStatus") || "";

    // Call ended — clean up
    if (callStatus === "completed" || callStatus === "failed") {
      clearConversation(callSid);
      return new NextResponse(`<?xml version="1.0" encoding="UTF-8"?><Response></Response>`, {
        headers: { "Content-Type": "text/xml" },
      });
    }

    // No speech detected
    if (!speechResult.trim()) {
      const twiml = `<?xml version="1.0" encoding="UTF-8"?>
<Response>
  <Say voice="Polly.Joanna" language="en-US">Mujhe aapki awaaz nahi aayi. Kripya dobara bolein.</Say>
  <Gather
    input="speech"
    action="${appUrl}/api/voice/respond"
    method="POST"
    speechTimeout="auto"
    language="en-US"
    timeout="5"
  >
    <Say voice="Polly.Joanna" language="en-US">Main sun rahi hoon.</Say>
  </Gather>
  <Redirect method="POST">${appUrl}/api/voice/incoming</Redirect>
</Response>`;
      return new NextResponse(twiml, { headers: { "Content-Type": "text/xml" } });
    }

    // Get Zara's response
    const { text, action } = await getZaraResponse(callSid, speechResult);

    // Execute action if present (save order/booking to DB)
    let actionFeedback = "";
    if (action) {
      actionFeedback = await executeZaraAction(action);
    }

    // Combine Zara's response with action feedback
    const fullResponse = actionFeedback
      ? `${text} ${actionFeedback}`
      : text;

    // Check if this is a closing message
    const isClosing =
      fullResponse.toLowerCase().includes("allah hafiz") ||
      fullResponse.toLowerCase().includes("mubarak ho") ||
      fullResponse.toLowerCase().includes("goodbye") ||
      fullResponse.toLowerCase().includes("bye");

    let twiml: string;

    if (isClosing) {
      // End the call after farewell
      twiml = `<?xml version="1.0" encoding="UTF-8"?>
<Response>
  <Say voice="Polly.Joanna" language="en-US">${escapeXml(fullResponse)}</Say>
  <Hangup/>
</Response>`;
      clearConversation(callSid);
    } else {
      // Continue conversation
      twiml = `<?xml version="1.0" encoding="UTF-8"?>
<Response>
  <Say voice="Polly.Joanna" language="en-US">${escapeXml(fullResponse)}</Say>
  <Gather
    input="speech"
    action="${appUrl}/api/voice/respond"
    method="POST"
    speechTimeout="auto"
    language="en-US"
    hints="order, booking, menu, table, delivery, takeaway, yes, no, confirm"
    timeout="8"
  >
    <Say voice="Polly.Joanna" language="en-US">Main sun rahi hoon.</Say>
  </Gather>
  <Redirect method="POST">${appUrl}/api/voice/incoming</Redirect>
</Response>`;
    }

    return new NextResponse(twiml, {
      headers: { "Content-Type": "text/xml" },
    });
  } catch (error) {
    console.error("Zara voice error:", error);

    const errorTwiml = `<?xml version="1.0" encoding="UTF-8"?>
<Response>
  <Say voice="Polly.Joanna" language="en-US">Maafi chahti hoon, kuch technical masla aa gaya. Thodi der baad dobara call karein. Shukriya!</Say>
  <Hangup/>
</Response>`;

    clearConversation(callSid);
    return new NextResponse(errorTwiml, {
      headers: { "Content-Type": "text/xml" },
    });
  }
}

function escapeXml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}
