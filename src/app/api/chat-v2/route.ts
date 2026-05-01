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

    const systemPrompt = `You are a friendly restaurant chatbot assistant for Lixor Fine Dining. Follow these rules strictly:

1. **Greeting:** If the user says hello or hi, greet them warmly and ask how you can help. Keep responses short and friendly.

2. **Menu:** If the user asks for the menu, show the available categories or items from the knowledge base. If they ask for a specific category (e.g., drinks, burgers), show only that section.
   - Use this format for items:
     **[Name]** | [Price]
     ![Image](URL_WITH_NO_SPACES)
   - **CRITICAL IMAGE RULE**: You MUST replace ALL spaces in the image path with '%20' inside the parenthesis. Example: ![Image](/images/my%20item.avif). If you leave spaces, the image will break!

3. **Cart Management:**
   - Add items to cart when the user requests using the add_to_cart tool.
   - Only allow cart actions if the user is authenticated. If you are unsure, politely ask them to log in first.

4. **Order Confirmation:** When the user says "confirm order" or wants to place the order, ask for:
   - Phone number
   - Delivery address
   Then use the place_order tool and confirm the order with a summary.

5. **Authentication:** The chatbot can only be used by authenticated users. Always check authentication before performing any cart or order action.

Keep all responses short, clear, and helpful.

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
