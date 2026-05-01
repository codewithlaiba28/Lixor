"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageSquare, X, Send, Bot, LogIn } from "lucide-react";
import ReactMarkdown from "react-markdown";
import Link from "next/link";
import { useCart } from "@/store/useCart";
import { useSession } from "@/lib/auth-client";
import { createOrder } from "@/app/actions/order";
import { menuItems } from "@/data/menuData";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
}

// Regex to find a COMPLETE <tool_call>...</tool_call> block
const TOOL_CALL_RE = /<tool_call>([\s\S]*?)<\/tool_call>/g;

/**
 * Strip tool_call tags for the UI:
 * - Remove complete <tool_call>...</tool_call> blocks entirely
 * - Also hide any partial/incomplete opening tag that hasn't closed yet
 *   (this prevents the raw tag from flashing during streaming)
 */
function stripToolCalls(text: string): string {
  // 1. Remove complete blocks
  let clean = text.replace(/<tool_call>[\s\S]*?<\/tool_call>/g, "");
  // 2. Remove any partial opening tag that hasn't closed yet
  //    e.g. "<tool_call>{"name"..." or just "<tool_ca"
  clean = clean.replace(/<tool_call>[\s\S]*$/, "");
  // 3. Remove a dangling partial opening tag fragment like "<tool_" or "<t"
  clean = clean.replace(/<\/?tool[^>]*$/, "");
  return clean.trim();
}

export default function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [localInput, setLocalInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const { addItem, removeItem, items, clearCart, setDeliveryInfo } = useCart();
  const { data: session, isPending: sessionLoading } = useSession();
  const isAuthenticated = !!session?.user;

  useEffect(() => { setMessages([]); }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  // ─── Execute a parsed tool call, return a result string for the AI ───────
  const executeTool = useCallback(
    async (name: string, args: Record<string, unknown>): Promise<string> => {
      switch (name) {
        case "get_full_menu": {
          const lines = menuItems.map(
            (i) =>
              `id:${i.id} | name:${i.name} | price:${i.price} | image:${i.image} | category:${i.category.filter((c) => c !== "All").join("/") || "All"}`
          );
          return (
            `Here is the full menu data (${menuItems.length} items):\n` +
            lines.join("\n") +
            `\n\nNow display the menu grouped by category. For each item use this exact format:\n` +
            `**Item Name** | USD X.XX\n![Item Name](/images/path%20encoded.avif)\n---`
          );
        }

        case "add_to_cart": {
          const id = String(args.item_id ?? "");
          const name = String(args.name ?? "");
          const priceStr = String(args.price ?? "0");
          const image = String(args.image ?? "");
          if (!id || !name) return "Error: item_id and name are required.";
          const numericPrice = parseFloat(priceStr.replace(/[^0-9.]/g, "")) || 0;
          addItem({ id, name, price: numericPrice, image: image.replace(/ /g, "%20") });
          return `✅ **${name}** added to cart successfully.`;
        }

        case "remove_from_cart": {
          const id = String(args.item_id ?? "");
          const found = items.find((i) => i.id === id);
          if (!found) return `Item with id "${id}" was not found in the cart.`;
          removeItem(id);
          return `🗑️ **${found.name}** removed from cart.`;
        }

        case "view_cart": {
          if (items.length === 0) return "The cart is currently empty.";
          const total = items.reduce((s, i) => s + i.price * i.quantity, 0);
          const lines = items.map(
            (i) => `- ${i.name} x${i.quantity} = $${(i.price * i.quantity).toFixed(2)}`
          );
          return (
            `Cart contents:\n${lines.join("\n")}\nTotal: $${total.toFixed(2)}\n\n` +
            `Show this as a neat order summary and ask the user if they want to confirm the order.`
          );
        }

        case "place_order": {
          const customerName = String(args.customer_name ?? "");
          const phone = String(args.phone ?? "");
          const address = String(args.address ?? "");
          const orderType = String(args.order_type ?? "Delivery");

          if (!customerName || !phone || !address) {
            return "Missing required fields. Please collect customer_name, phone, and address before placing the order.";
          }
          if (items.length === 0) {
            return "Cannot place order — the cart is empty.";
          }

          // Save delivery info to cart store so cart page can pre-fill it
          setDeliveryInfo({ customerName, phone, address });

          const totalAmount = items.reduce((s, i) => s + i.price * i.quantity, 0);
          const result = await createOrder({
            customerName,
            phone,
            address,
            orderType,
            totalAmount: totalAmount + 1,
            items: items.map((i) => ({ id: i.id, quantity: i.quantity, price: i.price })),
            userId: session?.user?.id,
          });

          if (result.success) {
            clearCart();
            return (
              `ORDER_PLACED_SUCCESSFULLY.\n` +
              `Show a ✅ confirmation ticket:\n` +
              `- Name: ${customerName}\n- Phone: ${phone}\n- Address: ${address}\n` +
              `- Type: ${orderType}\n- Total: $${(totalAmount + 1).toFixed(2)} (incl. $1 delivery fee)\n` +
              `- Order ID: ${result.orderId}`
            );
          }
          return `Order failed: ${result.error}. Tell the user and ask them to try again.`;
        }

        default:
          return `Unknown tool "${name}".`;
      }
    },
    [addItem, removeItem, items, clearCart, setDeliveryInfo, session]
  );

  // ─── Core send function ───────────────────────────────────────────────────
  const handleSend = useCallback(
    async (
      e?: React.FormEvent,
      overrideText?: string,
      isSilent = false
    ) => {
      e?.preventDefault();
      const content = (overrideText ?? localInput).trim();
      if (!content || isLoading) return;

      if (!isSilent) setLocalInput("");

      const userMsg: Message = {
        id: `user-${Date.now()}`,
        role: "user",
        content,
      };

      // Build the message list to send to the API
      const apiMessages = isSilent
        ? [...messages, { role: "user" as const, content }]
        : [...messages, userMsg];

      // Show user message in UI (skip for silent tool-result follow-ups)
      if (!isSilent) {
        setMessages((prev) => [...prev, userMsg]);
      }

      setIsLoading(true);

      try {
        const res = await fetch("/api/chat-v2", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ messages: apiMessages }),
        });

        if (res.status === 401) {
          setMessages((prev) => [
            ...prev,
            {
              id: `auth-${Date.now()}`,
              role: "assistant",
              content: "Please [log in](/login) first to use the chatbot. 🔐",
            },
          ]);
          return;
        }
        if (!res.ok) throw new Error("Request failed");

        const reader = res.body?.getReader();
        if (!reader) throw new Error("No reader");

        const decoder = new TextDecoder();
        let buffer = "";
        let rawContent = "";          // full raw text including tool_call tags
        let assistantMsgId = `assistant-${Date.now()}`;
        let hasAddedMsg = false;

        /** Update (or create) the visible assistant bubble, stripping tool tags */
        const upsert = (raw: string) => {
          const visible = stripToolCalls(raw);
          if (!hasAddedMsg && visible.length > 0) {
            setMessages((prev) => [
              ...prev,
              { id: assistantMsgId, role: "assistant", content: visible },
            ]);
            hasAddedMsg = true;
          } else if (hasAddedMsg) {
            setMessages((prev) =>
              prev.map((m) =>
                m.id === assistantMsgId ? { ...m, content: visible } : m
              )
            );
          }
        };

        // ── Stream reading loop ──────────────────────────────────────────
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          buffer += decoder.decode(value, { stream: true });
          const lines = buffer.split("\n");
          buffer = lines.pop() ?? "";

          for (const line of lines) {
            const trimmed = line.trim();
            if (!trimmed || !trimmed.startsWith("0:")) continue;
            try {
              const token = JSON.parse(trimmed.slice(2)) as string;
              rawContent += token;
              upsert(rawContent);
            } catch {
              // ignore malformed chunk
            }
          }
        }

        setIsLoading(false);

        // ── After stream ends: find & execute all tool calls ─────────────
        const toolMatches = [...rawContent.matchAll(TOOL_CALL_RE)];
        if (toolMatches.length === 0) return; // nothing to execute

        const toolResults: string[] = [];

        for (const match of toolMatches) {
          let parsed: { name: string; args?: Record<string, unknown> };
          try {
            parsed = JSON.parse(match[1].trim());
          } catch {
            toolResults.push(`Error: could not parse tool call JSON: ${match[1]}`);
            continue;
          }

          const result = await executeTool(parsed.name, parsed.args ?? {});
          toolResults.push(result);
        }

        // Feed results back to the AI as a silent follow-up
        const feedback = toolResults.join("\n\n");
        handleSend(undefined, `[TOOL_RESULT]\n${feedback}`, true);

      } catch (err) {
        console.error("Chat error:", err);
        setMessages((prev) => [
          ...prev,
          {
            id: `err-${Date.now()}`,
            role: "assistant",
            content: "Sorry, something went wrong. Please try again.",
          },
        ]);
      } finally {
        setIsLoading(false);
      }
    },
    [localInput, isLoading, messages, executeTool]
  );

  const quickQuestions = [
    "What's on the menu?",
    "Show me desserts 🍮",
    "How do I book a table?",
    "What are your opening hours?",
  ];

  // ─── UI ──────────────────────────────────────────────────────────────────
  return (
    <>
      {/* Floating trigger */}
      <button
        onClick={() => setIsOpen(true)}
        aria-label="Open chat"
        className={`fixed bottom-6 right-6 z-50 w-16 h-16 rounded-full shadow-[0_8px_30px_rgb(255,92,0,0.4)] transition-all duration-500 flex items-center justify-center ${
          isOpen
            ? "scale-0 opacity-0 pointer-events-none"
            : "scale-100 opacity-100 bg-gradient-to-br from-[#FF5C00] to-[#FF8C4D] text-white hover:scale-110 active:scale-95"
        }`}
      >
        <MessageSquare size={28} />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 30, scale: 0.95 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="fixed bottom-6 right-6 z-50 w-[420px] h-[650px] max-w-[calc(100vw-48px)] max-h-[calc(100vh-48px)] bg-white rounded-[32px] shadow-[0_20px_50px_rgba(0,0,0,0.2)] flex flex-col overflow-hidden border border-gray-100"
          >
            {/* Header */}
            <div className="bg-[#1A1A1A] text-white p-6 flex justify-between items-center shrink-0">
              <div className="flex items-center gap-4">
                <div className="relative">
                  <div className="w-12 h-12 bg-gradient-to-br from-[#FF5C00] to-[#FF8C4D] rounded-2xl flex items-center justify-center">
                    <span className="text-white font-serif font-bold text-xl">L</span>
                  </div>
                  <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-[#4ADE80] rounded-full border-[3px] border-[#1A1A1A]" />
                </div>
                <div>
                  <h3 className="font-serif font-medium text-xl leading-tight text-white">
                    Lixor <span className="text-[#FF5C00]">Concierge</span>
                  </h3>
                  <p className="text-[10px] text-gray-400 font-sans uppercase tracking-widest font-bold">
                    {isAuthenticated
                      ? `Hi, ${session.user.name.split(" ")[0]}`
                      : "Online"}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                aria-label="Close chat"
                className="text-gray-400 hover:text-white transition-all"
              >
                <X size={22} />
              </button>
            </div>

            {/* Auth banner */}
            {!sessionLoading && !isAuthenticated && (
              <div className="bg-amber-50 border-b border-amber-100 px-5 py-3 flex items-center gap-3 shrink-0">
                <LogIn size={16} className="text-amber-600 shrink-0" />
                <p className="text-xs text-amber-700 font-sans">
                  <Link href="/login" className="font-semibold underline">
                    Log in
                  </Link>{" "}
                  to add items to cart and place orders.
                </p>
              </div>
            )}

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-[#FDFDFD]">
              {messages.length === 0 ? (
                /* Welcome screen */
                <div className="flex flex-col items-center justify-center h-full text-center space-y-8 p-4">
                  <div className="w-24 h-24 bg-gradient-to-br from-[#FF5C00]/20 to-[#FF8C4D]/10 rounded-3xl flex items-center justify-center text-[#FF5C00]">
                    <Bot size={48} />
                  </div>
                  <div className="space-y-3">
                    <h4 className="font-serif text-2xl text-[#1A1A1A]">
                      {isAuthenticated
                        ? `Welcome, ${session.user.name.split(" ")[0]}!`
                        : "Greetings from Lixor"}
                    </h4>
                    <p className="text-sm text-gray-500 font-sans max-w-[280px]">
                      How may I assist your culinary journey today?
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-2.5 justify-center">
                    {quickQuestions.map((q, i) => (
                      <button
                        key={i}
                        onClick={() => handleSend(undefined, q)}
                        className="text-[13px] bg-white border border-gray-100 text-gray-600 px-4 py-2.5 rounded-xl hover:border-[#FF5C00] hover:text-[#FF5C00] transition-all"
                      >
                        {q}
                      </button>
                    ))}
                  </div>
                </div>
              ) : (
                <>
                  {messages
                    .filter((m) => {
                      // Hide silent tool-result follow-up messages
                      if (
                        m.role === "user" &&
                        m.content.startsWith("[TOOL_RESULT]")
                      )
                        return false;
                      return m.content.trim().length > 0;
                    })
                    .map((m) => (
                      <div
                        key={m.id}
                        className={`flex ${
                          m.role === "user" ? "justify-end" : "justify-start"
                        }`}
                      >
                        <div
                          className={`px-5 py-3.5 max-w-[85%] text-[15px] font-sans leading-relaxed shadow-sm ${
                            m.role === "user"
                              ? "bg-[#1A1A1A] text-white rounded-[24px]"
                              : "bg-white border border-gray-100 text-gray-800 rounded-[24px]"
                          }`}
                        >
                          {m.role === "user" ? (
                            <p>{m.content}</p>
                          ) : (
                            <div className="prose prose-sm prose-slate max-w-none prose-p:leading-relaxed prose-p:my-1 prose-li:my-0.5 prose-ul:my-1 prose-strong:text-[#FF5C00] prose-strong:font-bold prose-h3:text-[#1A1A1A] prose-h3:font-serif prose-h3:text-base prose-h3:mt-3 prose-h3:mb-1">
                              <ReactMarkdown
                                components={{
                                  img: ({ ...props }) => (
                                    <img
                                      {...props}
                                      src={
                                        typeof props.src === "string"
                                          ? props.src.replace(/ /g, "%20")
                                          : props.src
                                      }
                                      alt={props.alt ?? ""}
                                      className="rounded-xl shadow-md border border-gray-100 my-3 max-w-full h-auto hover:scale-[1.02] transition-transform"
                                      loading="lazy"
                                    />
                                  ),
                                  p: ({ children }) => (
                                    <p className="mb-2 last:mb-0 leading-relaxed">
                                      {children}
                                    </p>
                                  ),
                                  hr: () => (
                                    <hr className="my-3 border-gray-100" />
                                  ),
                                  a: ({ href, children }) => (
                                    <a
                                      href={href}
                                      className="text-[#FF5C00] underline"
                                    >
                                      {children}
                                    </a>
                                  ),
                                }}
                              >
                                {m.content}
                              </ReactMarkdown>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}

                  {/* Typing indicator */}
                  {isLoading && (
                    <div className="flex justify-start">
                      <div className="px-4 py-3 bg-white border border-neutral-100 rounded-[20px] shadow-sm flex items-center gap-1">
                        {[0, 0.2, 0.4].map((delay, i) => (
                          <motion.div
                            key={i}
                            className="w-1.5 h-1.5 bg-[#FF5C00] rounded-full"
                            animate={{ opacity: [0.3, 1, 0.3] }}
                            transition={{
                              repeat: Infinity,
                              duration: 1,
                              delay,
                            }}
                          />
                        ))}
                      </div>
                    </div>
                  )}
                  <div ref={messagesEndRef} />
                </>
              )}
            </div>

            {/* Input */}
            <div className="p-5 bg-white border-t border-gray-100 shrink-0">
              <form
                onSubmit={handleSend}
                className="relative flex items-center"
              >
                <input
                  type="text"
                  value={localInput}
                  onChange={(e) => setLocalInput(e.target.value)}
                  placeholder={
                    isAuthenticated
                      ? "Type your message..."
                      : "Log in to chat..."
                  }
                  disabled={!isAuthenticated}
                  className="w-full pl-6 pr-14 py-4 bg-gray-50 border border-gray-200 rounded-2xl focus:border-[#FF5C00] outline-none transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                />
                <button
                  type="submit"
                  disabled={isLoading || !localInput.trim() || !isAuthenticated}
                  aria-label="Send message"
                  className="absolute right-2.5 w-11 h-11 bg-[#FF5C00] text-white rounded-xl hover:bg-[#E65200] disabled:opacity-30 transition-all flex items-center justify-center"
                >
                  <Send size={18} />
                </button>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
