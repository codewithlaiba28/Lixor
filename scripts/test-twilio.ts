/**
 * Test Twilio WhatsApp message sending directly
 * Run: npx tsx scripts/test-twilio.ts
 */
import * as dotenv from "dotenv";
import path from "path";
dotenv.config({ path: path.resolve(process.cwd(), ".env") });

import twilio from "twilio";

async function main() {
  const accountSid = process.env.TWILIO_ACCOUNT_SID;
  const authToken = process.env.TWILIO_AUTH_TOKEN;
  const from = process.env.TWILIO_WHATSAPP_NUMBER;
  const to = "whatsapp:+923453155319"; // your number

  console.log("Testing Twilio WhatsApp...");
  console.log("Account SID:", accountSid?.slice(0, 10) + "...");
  console.log("From:", from);
  console.log("To:", to);

  if (!accountSid || !authToken || !from) {
    console.error("Missing env variables!");
    process.exit(1);
  }

  const client = twilio(accountSid, authToken);

  try {
    const msg = await client.messages.create({
      from,
      to,
      body: "Test from Zara! Agar yeh message aaya toh Twilio sahi kaam kar raha hai. 🎉",
    });
    console.log("✅ SUCCESS!");
    console.log("Message SID:", msg.sid);
    console.log("Status:", msg.status);
  } catch (err: any) {
    console.error("❌ FAILED!");
    console.error("Code:", err.code);
    console.error("Status:", err.status);
    console.error("Message:", err.message);
    console.error("More info:", err.moreInfo);
  }

  process.exit(0);
}

main();
