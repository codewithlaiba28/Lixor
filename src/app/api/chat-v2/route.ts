// Force Refresh: 2026-05-01T14:27:00
import OpenAI from 'openai';
import { generateEmbedding } from '@/lib/embeddings';
import { searchSimilarDocuments } from '@/lib/vectorSearch';

const openai = new OpenAI({
  apiKey: process.env.CEREBRAS_API_KEY,
  baseURL: 'https://api.cerebras.ai/v1',
});

export const runtime = 'nodejs';
export const maxDuration = 30;

export async function POST(req: Request) {
  if (!process.env.CEREBRAS_API_KEY) {
    return new Response(JSON.stringify({ error: "API configuration missing" }), { status: 500 });
  }

  try {
    const { messages } = await req.json();
    const latestMessage = messages[messages.length - 1];
    const userQuery = latestMessage?.content || "";

    const queryEmbedding = await generateEmbedding(userQuery);
    const relevantDocs = await searchSimilarDocuments(queryEmbedding, 4);
    
    const contextText = relevantDocs
      .map((doc, idx) => {
        const meta = doc.metadata as any;
        const metadataStr = Object.entries(meta).map(([k, v]) => `${k}: ${v}`).join(", ");
        return `--- Document ${idx + 1} ---\nMetadata: ${metadataStr}\nContent: ${doc.content}`;
      })
      .join("\n\n");

    const tools: OpenAI.Chat.ChatCompletionTool[] = [
      {
        type: 'function',
        function: {
          name: 'view_cart',
          description: 'Get the current list of items in the user\'s shopping cart',
          parameters: { type: 'object', properties: {} },
        }
      },
      {
        type: 'function',
        function: {
          name: 'add_to_cart',
          description: 'Add a menu item to the user\'s shopping cart',
          parameters: {
            type: 'object',
            properties: {
              item_id: { type: 'string', description: 'The unique SLUG ID' },
              name: { type: 'string', description: 'The display name' },
              price: { type: 'string', description: 'The price' },
              image: { type: 'string', description: 'The image URL' },
            },
            required: ['item_id', 'name', 'price', 'image'],
          },
        }
      },
      {
        type: 'function',
        function: {
          name: 'get_full_menu',
          description: 'Retrieve the complete restaurant menu including all categories, prices, and images.',
          parameters: { type: 'object', properties: {} },
        }
      },
      {
        type: 'function',
        function: {
          name: 'place_order',
          description: 'Finalize and place the delivery order',
          parameters: {
            type: 'object',
            properties: {
              customer_name: { type: 'string' },
              phone: { type: 'string' },
              address: { type: 'string' },
              order_type: { type: 'string' },
            },
            required: ['customer_name', 'phone', 'address', 'order_type'],
          },
        }
      }
    ];

    const systemPrompt = `You are the Elite AI Concierge for Lixor Fine Dining. Your responses must be STUNNING, SURGICAL, and EXTREMELY BRIEF.

### 💎 VISUAL STYLE GUIDELINES
- **Brevity**: ONE SENTENCE MAX for conversational replies. No "fluff".
- **Dividers**: Use --- between EVERY item and section.
- **Item Cards** (Compact):
  **[Name]** | [Price]
  ![Image](encoded_path)
  ---
- **Hierarchy**: Use ### for titles. Use Bold for emphasis.

### 1. CORE RESPONSIBILITIES
- Show Menu via "Compact Item Cards".
- Provide bold Order Summary + Total.
- Collect details (Name -> Phone -> Address) one-by-one.

### 5. RAG & ENCODING RULES
- **BYTE-FOR-BYTE**: Copy image paths exactly.
- **%20**: Replace spaces with %20 in Markdown links.

### 6. TONE
- **Greetings**: If the user says "hi" or "hello", reply with a warm, conversational welcome (e.g., "Hello! Welcome to Lixor. How can I assist you today?"). Do not sound robotic.
- **General**: Respond in the user's language. Keep it elegant, elite, and concise.
---

Context:
${contextText}`;

    const response = await openai.chat.completions.create({
      model: 'llama3.1-8b',
      messages: [
        { role: 'system', content: systemPrompt },
        ...messages.map((m: any) => ({ role: m.role, content: m.content })),
      ],
      tools: tools,
      stream: true,
    });

    const stream = new ReadableStream({
      async start(controller) {
        const encoder = new TextEncoder();
        try {
          for await (const chunk of response) {
            const content = chunk.choices[0]?.delta?.content || "";
            const toolCalls = chunk.choices[0]?.delta?.tool_calls;
            if (content) controller.enqueue(encoder.encode(`0:${JSON.stringify(content)}\n`));
            if (toolCalls) controller.enqueue(encoder.encode(`9:${JSON.stringify(toolCalls)}\n`));
          }
        } catch (e) { controller.error(e); } finally { controller.close(); }
      },
    });

    return new Response(stream);
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ error: "Failed" }), { status: 500 });
  }
}
