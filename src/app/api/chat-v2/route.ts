import OpenAI from "openai";
import { generateEmbedding } from "@/lib/embeddings";
import { searchSimilarDocuments } from "@/lib/vectorSearch";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

const openai = new OpenAI({
  apiKey: process.env.CEREBRAS_API_KEY,
  baseURL: "https://api.cerebras.ai/v1",
});

export const runtime = "nodejs";
export const maxDuration = 30;

export async function POST(req: Request) {
  if (!process.env.CEREBRAS_API_KEY) {
    return new Response(JSON.stringify({ error: "API configuration missing" }), {
      status: 500,
    });
  }

  // Auth check
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user) {
    return new Response(JSON.stringify({ error: "unauthenticated" }), { status: 401 });
  }

  try {
    const { messages } = await req.json();
    const latestMessage = messages[messages.length - 1];
    const userQuery = latestMessage?.content || "";

    // RAG: embed the query and retrieve relevant documents.
    // Wrapped in try/catch so a RAG failure never crashes the whole endpoint.
    let contextText = "No relevant documents found.";
    try {
      const queryEmbedding = await generateEmbedding(userQuery);
      const relevantDocs = await searchSimilarDocuments(queryEmbedding, 5);
      if (relevantDocs.length > 0) {
        contextText = relevantDocs
          .map((doc, idx) => {
            const meta = doc.metadata as Record<string, unknown>;
            const metaStr = Object.entries(meta)
              .map(([k, v]) => `${k}: ${v}`)
              .join(", ");
            return `[Doc ${idx + 1}] ${metaStr}\n${doc.content}`;
          })
          .join("\n\n");
      }
    } catch (ragError) {
      console.warn("RAG pipeline unavailable, continuing without context:", ragError);
    }

    // NOTE: We do NOT use the OpenAI tools API because llama3.1-8b on Cerebras
    // does not reliably emit structured tool_call deltas — it writes JSON as plain
    // text instead. We handle tool calls entirely via a tagged text protocol so
    // the client can detect and strip them from the visible response.

    const systemPrompt = `You are a friendly and helpful restaurant assistant for Lixor Fine Dining.
The logged-in customer's name is: ${session.user.name}.

## TOOL CALL PROTOCOL
When you need to perform an action, emit a tool call tag on its OWN LINE in this exact format:
<tool_call>{"name":"TOOL_NAME","args":{...}}</tool_call>

The client will intercept and execute these tags silently — the user will NEVER see them.
After emitting a tool call tag, stop and wait. The client will send you the result.

Available tools:
- get_full_menu          — no args required. Use when user asks to see the menu.
- add_to_cart            — args: item_id, name, price (string e.g. "USD 14.00"), image (path string)
- remove_from_cart       — args: item_id
- view_cart              — no args required. Use before placing an order.
- place_order            — args: customer_name, phone, address, order_type ("Delivery" or "Takeaway")

RULES:
1. NEVER show the <tool_call> tag or its JSON to the user. It is invisible.
2. NEVER invent item IDs or prices. Only use data from TOOL_RESULT messages.
3. For add_to_cart, you MUST have the exact item_id, name, price, and image from the menu data.
   If you don't have it yet, call get_full_menu first.

## BEHAVIOUR

**Greeting**: Greet the user warmly by name. Keep it short.

**Menu display**: After receiving TOOL_RESULT with menu data, display items like this:

### 🍽️ Category Name

**Item Name** | USD X.XX
![Item Name](/images/path/to/image%20name.avif)

---

Rules for menu cards:
- Bold the name: **Name**
- Price after |
- Image in markdown: ![Name](url) — replace spaces in path with %20
- Separate items with ---
- Group by category with ### heading

**Cart / Order flow**:
- To add an item → emit add_to_cart tool call
- To remove → emit remove_from_cart tool call
- To view cart → emit view_cart tool call
- To place order → collect name, phone, address one at a time, then emit place_order

**Tone**: Friendly, concise. Respond in the user's language.

## RETRIEVED CONTEXT (use for restaurant info questions)
${contextText}`;

    const response = await openai.chat.completions.create({
      model: "llama3.1-8b",
      messages: [
        { role: "system", content: systemPrompt },
        ...messages.map((m: { role: string; content: string }) => ({
          role: m.role,
          content: m.content,
        })),
      ],
      // No tools — we handle everything via text protocol
      stream: true,
      temperature: 0.3,
    });

    const stream = new ReadableStream({
      async start(controller) {
        const encoder = new TextEncoder();
        try {
          for await (const chunk of response) {
            const content = chunk.choices[0]?.delta?.content;
            if (content) {
              controller.enqueue(encoder.encode(`0:${JSON.stringify(content)}\n`));
            }
          }
        } catch (e) {
          controller.error(e);
        } finally {
          controller.close();
        }
      },
    });

    return new Response(stream);
  } catch (error) {
    console.error("Chat API error:", error);
    return new Response(JSON.stringify({ error: "Failed to process request" }), {
      status: 500,
    });
  }
}
