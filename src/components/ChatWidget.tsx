"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageSquare, X, Send, Bot } from "lucide-react";
import ReactMarkdown from "react-markdown";
import { useCart } from "@/store/useCart";
import { createOrder } from "@/app/actions/order";
import { menuItems } from "@/data/menuData";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
}

export default function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [localInput, setLocalInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  const { addItem, removeItem, items, clearCart } = useCart();

  // Chat memory is disabled as per user request for a fresh start every time
  useEffect(() => {
    // We no longer load from localStorage
    setMessages([]);
  }, []);

  // We no longer save to localStorage
  useEffect(() => {
    // No-op
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleSend = async (e?: React.FormEvent, overrideText?: string, isSilent = false) => {
    e?.preventDefault();
    const content = (overrideText || localInput).trim();
    if (!content || isLoading) return;

    if (!isSilent) setLocalInput("");
    const userMessage: Message = { id: `user-${Date.now()}`, role: "user", content };
    if (!isSilent) {
      setMessages(prev => [...prev, userMessage]);
    }
    setIsLoading(true);

    try {
      const response = await fetch("/api/chat-v2", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: isSilent ? [...messages, { role: 'user', content }] : [...messages, userMessage] }),
      });

      if (!response.ok) throw new Error("Failed to send message");

      const reader = response.body?.getReader();
      if (!reader) throw new Error("No reader available");

      const decoder = new TextDecoder();
      let toolCalls: any[] = [];
      let assistantMessageId = `assistant-${Date.now()}`;
      let assistantContent = "";
      let hasAddedAssistantMessage = false;
      let buffer = ""; 

      let interceptedTool: string | null = null;
      let interceptedArgs: any = null;
      let didPlaceOrder = false; // Prevention flag

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n");
        buffer = lines.pop() || ""; 

        for (const line of lines) {
          const trimmedLine = line.trim();
          if (!trimmedLine) continue;

          if (trimmedLine.startsWith("0:")) {
            try {
              const text = JSON.parse(trimmedLine.substring(2));
              assistantContent += text;
              
              const toolCallRegex = /\{[\s\S]*?"name"\s*:\s*"(add_to_cart|place_order|view_cart|get_full_menu)"[\s\S]*?\}/;
              if (toolCallRegex.test(assistantContent)) {
                try {
                  const jsonMatch = assistantContent.match(/\{[\s\S]*\}/);
                  if (jsonMatch) {
                    const jsonStr = jsonMatch[0];
                    const potentialTool = JSON.parse(jsonStr);
                    const name = potentialTool.name || potentialTool.function?.name;
                    const args = potentialTool.arguments || potentialTool.function?.arguments || potentialTool;
                    const parsedArgs = typeof args === 'string' ? JSON.parse(args) : args;
                    
                    let statusMsg = "";
                    if (name === 'add_to_cart') {
                      const id = parsedArgs.item_id || parsedArgs.id;
                      const { name: itemName, price, image } = parsedArgs;
                      const encodedImage = image ? image.replace(/ /g, '%20') : "";
                      addItem({ id, name: itemName || id, price: parseFloat(String(price).replace(/[^0-9.]/g, '')) || 0, image: encodedImage });
                      statusMsg = " ✅ **Item Added!**";
                    } else if (name === 'place_order') {
                      // ANTI-FAKE FILTER: Check if AI is using placeholder data
                      const cName = Array.isArray(parsedArgs.customer_name) ? parsedArgs.customer_name[0] : parsedArgs.customer_name;
                      const cPhone = Array.isArray(parsedArgs.phone) ? parsedArgs.phone[0] : parsedArgs.phone;
                      const cAddr = Array.isArray(parsedArgs.address) ? parsedArgs.address[0] : parsedArgs.address;

                      const isFake = /please enter|your name|your address|your phone/i.test(String(cName) + String(cPhone) + String(cAddr));

                      if (!didPlaceOrder && !isFake) {
                        interceptedTool = 'place_order';
                        interceptedArgs = { ...parsedArgs, customer_name: cName, phone: cPhone, address: cAddr };
                        statusMsg = " 🔄 **Processing order...**";
                      } else if (isFake) {
                        statusMsg = " ⚠️ **Waiting for your real details...**";
                      }
                    } else if (name === 'view_cart') {
                      interceptedTool = 'view_cart';
                      statusMsg = " 📋 **Checking bag...**";
                    } else if (name === 'get_full_menu') {
                      interceptedTool = 'get_full_menu';
                      statusMsg = " 🍴 **Loading menu...**";
                    }

                    assistantContent = assistantContent.replace(jsonStr, statusMsg);
                    setMessages(prev => prev.map(m => m.id === assistantMessageId ? { ...m, content: assistantContent } : m));
                  }
                } catch (e) { /* Wait for full JSON */ }
              }

              if (assistantContent.trim().length > 0) {
                if (!hasAddedAssistantMessage) {
                  setMessages(prev => [...prev, { id: assistantMessageId, role: "assistant", content: assistantContent }]);
                  hasAddedAssistantMessage = true;
                } else {
                  setMessages(prev => prev.map(m => m.id === assistantMessageId ? { ...m, content: assistantContent } : m));
                }
              }
            } catch (e) { console.error(e); }
          } else if (trimmedLine.startsWith("9:")) {
            try {
              const calls = JSON.parse(trimmedLine.substring(2));
              toolCalls = [...toolCalls, ...calls];
            } catch (e) { console.error(e); }
          }
        }
      }

      setIsLoading(false);

      // AUTO-FOLLOW-UP: If a tool was intercepted, resume conversation automatically
      if (interceptedTool === 'get_full_menu') {
        const menuStr = menuItems.map(i => `${i.name} ($${i.price}) - Image: ${i.image}`).join("\n");
        handleSend(undefined, `SYSTEM_FEEDBACK: Here is the full menu data: \n${menuStr}\nNow display this menu beautifully using the Item Cards format.`, true);
      } else if (interceptedTool === 'view_cart') {
        const bagSummary = items.length > 0 
          ? items.map(i => `${i.name} (x${i.quantity || 1}) - $${i.price}`).join(", ") 
          : "Empty";
        const total = items.reduce((sum, item) => sum + (item.price * (item.quantity || 1)), 0);
        handleSend(undefined, `SYSTEM_FEEDBACK: Bag contents retrieved: ${bagSummary}. Total: $${total}. Now show the order summary with images and ask for details.`, true);
      } else if (interceptedTool === 'place_order' && interceptedArgs && !didPlaceOrder) {
        didPlaceOrder = true; // Set flag
        const totalAmount = items.reduce((sum, item) => sum + (item.price * (item.quantity || 1)), 0);
        const result = await createOrder({
          customerName: interceptedArgs.customer_name,
          phone: interceptedArgs.phone,
          address: interceptedArgs.address,
          orderType: interceptedArgs.order_type || "Delivery",
          totalAmount: totalAmount + 1, // Including $1 delivery fee
          items: items.map(i => ({ id: i.id, quantity: i.quantity || 1, price: i.price })),
        });
        if (result.success) {
          clearCart();
          handleSend(undefined, "SYSTEM_FEEDBACK: Order placed successfully. Show the final ✅ ORDER CONFIRMED ticket now.", true);
        } else {
          handleSend(undefined, `SYSTEM_FEEDBACK: Order failed: ${result.error}. Please tell the user.`, true);
        }
      }

      if (toolCalls.length > 0) {
        await handleToolCalls(toolCalls);
      }

    } catch (error) {
      console.error("Detailed Send Error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleToolCalls = async (calls: any[]) => {
    for (const call of calls) {
      if (!call.function) continue;
      const { name, arguments: argsString } = call.function;
      
      try {
        const args = JSON.parse(argsString || "{}");
        if (name === 'add_to_cart') {
          const { item_id, name: itemName, price, image } = args;
          const numericPrice = typeof price === 'string' 
            ? parseFloat(price.replace(/[^0-9.]/g, '')) 
            : price;
          
          const encodedImage = image ? image.replace(/ /g, '%20') : "";
          addItem({ id: item_id, name: itemName || item_id, price: numericPrice || 0, image: encodedImage });
          
          setMessages(prev => [...prev, {
            id: `sys-${Date.now()}`,
            role: "assistant",
            content: `✅ **Success!** I have added the **${itemName || item_id}** to your bag. Your order has been confirmed in the cart! 🥖✨`
          }]);
        } else if (name === 'place_order') {
          const { customer_name, phone, address, order_type } = args;
          const totalAmount = items.reduce((sum, item) => sum + (item.price * (item.quantity || 1)), 0);
          
          const result = await createOrder({
            customerName: customer_name,
            phone,
            address,
            orderType: order_type,
            totalAmount,
            items: items.map(i => ({ id: i.id, quantity: i.quantity || 1, price: i.price })),
          });

          if (result.success) {
            clearCart();
            setMessages(prev => [...prev, {
              id: `sys-${Date.now()}`,
              role: "assistant",
              content: `✨ **Order Confirmed!** ✨\n\nThank you, **${customer_name}**! Your order for Lixor Fine Dining has been placed successfully. \n\n📍 **Delivery to:** ${address}\n📞 **Contact:** ${phone}\n💰 **Total:** $ ${totalAmount}\n\nOur chefs are starting on your meal right now! 👨‍🍳🔥`
            }]);
          } else {
            throw new Error(result.error);
          }
        }
      } catch (e) {
        console.error("Tool execution error:", e);
      }
    }
  };

  const quickQuestions = [
    "What's on the menu?",
    "How do I book a table?",
    "Do you offer delivery?",
    "What are your opening hours?",
  ];

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className={`fixed bottom-6 right-6 z-50 w-16 h-16 rounded-full shadow-[0_8px_30px_rgb(255,92,0,0.4)] transition-all duration-500 flex items-center justify-center ${
          isOpen ? "scale-0 opacity-0" : "scale-100 opacity-100 bg-gradient-to-br from-[#FF5C00] to-[#FF8C4D] text-white hover:scale-110 active:scale-95"
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
            <div className="bg-[#1A1A1A] text-white p-6 flex justify-between items-center">
              <div className="flex items-center gap-4">
                <div className="relative">
                  <div className="w-12 h-12 bg-gradient-to-br from-[#FF5C00] to-[#FF8C4D] rounded-2xl flex items-center justify-center">
                    <span className="text-white font-serif font-bold text-xl">L</span>
                  </div>
                  <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-[#4ADE80] rounded-full border-[3px] border-[#1A1A1A]" />
                </div>
                <div>
                  <h3 className="font-serif font-medium text-xl leading-tight text-white">Lixor <span className="text-[#FF5C00]">Concierge</span></h3>
                  <p className="text-[10px] text-gray-400 font-sans uppercase tracking-widest font-bold">Online</p>
                </div>
              </div>
              <button onClick={() => setIsOpen(false)} className="text-gray-400 hover:text-white transition-all">
                <X size={22} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-[#FDFDFD]">
              {messages.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center space-y-8 p-4">
                  <div className="w-24 h-24 bg-gradient-to-br from-[#FF5C00]/20 to-[#FF8C4D]/10 rounded-3xl flex items-center justify-center text-[#FF5C00]">
                    <Bot size={48} />
                  </div>
                  <div className="space-y-3">
                    <h4 className="font-serif text-2xl text-[#1A1A1A]">Greetings from Lixor</h4>
                    <p className="text-sm text-gray-500 font-sans max-w-[280px]">How may I assist your culinary journey today?</p>
                  </div>
                  <div className="flex flex-wrap gap-2.5 justify-center">
                    {quickQuestions.map((q, i) => (
                      <button key={i} onClick={() => handleSend(undefined, q)} className="text-[13px] bg-white border border-gray-100 text-gray-600 px-4 py-2.5 rounded-xl hover:border-[#FF5C00] hover:text-[#FF5C00] transition-all">
                        {q}
                      </button>
                    ))}
                  </div>
                </div>
              ) : (
                <>
                  {messages.filter(m => m.content && m.content.trim().length > 0).map((m) => (
                    <div key={m.id} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
                      <div className={`px-5 py-3.5 max-w-[85%] text-[15px] font-sans leading-relaxed shadow-sm ${
                        m.role === "user" 
                          ? "bg-[#1A1A1A] text-white rounded-[24px]" 
                          : "bg-white border border-gray-100 text-gray-800 rounded-[24px]"
                      }`}>
                        <div className="prose prose-sm prose-slate max-w-none 
                          prose-p:leading-relaxed prose-p:my-1
                          prose-li:my-0.5 prose-ul:my-1
                          prose-strong:text-[#FF5C00] prose-strong:font-bold">
                          <ReactMarkdown components={{
                            img: ({ node, ...props }) => (
                              <img 
                                {...props} 
                                src={typeof props.src === 'string' ? props.src.replace(/ /g, '%20') : props.src} 
                                className="rounded-xl shadow-md border border-gray-100 my-3 max-w-full h-auto transform transition-transform hover:scale-[1.02]"
                                loading="lazy"
                              />
                            ),
                            p: ({ children }) => <p className="mb-2 last:mb-0 leading-relaxed">{children}</p>,
                            hr: () => <hr className="my-4 border-gray-100" />,
                          }}>
                            {m.content}
                          </ReactMarkdown>
                        </div>
                      </div>
                    </div>
                  ))}
                  {isLoading && (
                    <div className="flex justify-start">
                      <div className="px-4 py-3 bg-white border border-neutral-100 rounded-[20px] shadow-sm flex items-center gap-1">
                        <motion.div className="w-1.5 h-1.5 bg-[#FF5C00] rounded-full" animate={{ opacity: [0.3, 1, 0.3] }} transition={{ repeat: Infinity, duration: 1 }} />
                        <motion.div className="w-1.5 h-1.5 bg-[#FF5C00] rounded-full" animate={{ opacity: [0.3, 1, 0.3] }} transition={{ repeat: Infinity, duration: 1, delay: 0.2 }} />
                        <motion.div className="w-1.5 h-1.5 bg-[#FF5C00] rounded-full" animate={{ opacity: [0.3, 1, 0.3] }} transition={{ repeat: Infinity, duration: 1, delay: 0.4 }} />
                      </div>
                    </div>
                  )}
                  <div ref={messagesEndRef} />
                </>
              )}
            </div>

            <div className="p-5 bg-white border-t border-gray-100">
              <form onSubmit={handleSend} className="relative flex items-center group">
                <input
                  type="text"
                  value={localInput}
                  onChange={(e) => setLocalInput(e.target.value)}
                  placeholder="Type your message..."
                  className="w-full pl-6 pr-14 py-4 bg-gray-50 border border-gray-200 rounded-2xl focus:border-[#FF5C00] outline-none transition-all"
                />
                <button type="submit" disabled={isLoading || !localInput.trim()} className="absolute right-2.5 w-11 h-11 bg-[#FF5C00] text-white rounded-xl hover:bg-[#E65200] disabled:opacity-30 transition-all flex items-center justify-center">
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
