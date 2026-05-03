"use client";

import {
  MessageSquare, CheckCircle, Copy, ExternalLink,
  Smartphone, Database, ShoppingBag, CalendarDays, Info,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export default function ZaraPage() {
  const [copied, setCopied] = useState<string | null>(null);

  const webhookUrl = `${process.env.NEXT_PUBLIC_APP_URL || "https://your-app.vercel.app"}/api/whatsapp/webhook`;

  const copy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopied(key);
    toast.success("Copied!");
    setTimeout(() => setCopied(null), 2000);
  };

  return (
    <div className="p-6 space-y-6 max-w-3xl">

      {/* Header */}
      <div className="flex items-start gap-4">
        <div className="w-14 h-14 bg-gradient-to-br from-[#25D366] to-[#128C7E] rounded-2xl flex items-center justify-center flex-shrink-0 shadow-lg">
          <MessageSquare size={24} className="text-white" />
        </div>
        <div>
          <h1 className="text-2xl font-serif font-bold text-white">Zara — WhatsApp AI Receptionist</h1>
          <p className="text-sm text-white/50 mt-1">
            Customers WhatsApp karein → Zara jawab de → Order/Booking admin mein save ho
          </p>
        </div>
      </div>

      {/* Status */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: "Twilio Connected", ok: true },
          { label: "Cerebras AI", ok: true },
          { label: "Database", ok: true },
        ].map((s, i) => (
          <div key={i} className={`border rounded-xl p-3 flex items-center gap-2 ${s.ok ? "border-green-500/20 bg-green-500/5" : "border-red-500/20 bg-red-500/5"}`}>
            <CheckCircle size={14} className={s.ok ? "text-green-400" : "text-red-400"} />
            <span className="text-xs text-white/70">{s.label}</span>
          </div>
        ))}
      </div>

      {/* How it works */}
      <div className="bg-[#111111] border border-white/5 rounded-2xl p-5">
        <p className="text-xs text-[#C9A84C] font-bold uppercase tracking-widest mb-4">Flow</p>
        <div className="flex items-center gap-2 flex-wrap">
          {[
            { icon: Smartphone, label: "Customer WhatsApp kare" },
            { icon: MessageSquare, label: "Zara jawab de" },
            { icon: ShoppingBag, label: "Order/Booking" },
            { icon: Database, label: "Admin mein save" },
          ].map(({ icon: Icon, label }, i) => (
            <div key={i} className="flex items-center gap-2">
              <div className="flex items-center gap-2 bg-white/5 rounded-xl px-3 py-2">
                <Icon size={13} className="text-[#C9A84C]" />
                <span className="text-xs text-white/70">{label}</span>
              </div>
              {i < 3 && <span className="text-white/20">→</span>}
            </div>
          ))}
        </div>
      </div>

      {/* Step 1 — Join Sandbox */}
      <div className="bg-[#111111] border border-white/5 rounded-2xl p-5 space-y-3">
        <div className="flex items-center gap-2">
          <span className="text-[#C9A84C] font-serif font-bold text-xl">01</span>
          <p className="text-sm font-bold text-white">Sandbox Join Karo (Sirf Pehli Baar)</p>
        </div>
        <p className="text-xs text-white/50">
          Apne WhatsApp se <span className="text-[#25D366] font-bold">+1 415 523 8886</span> par yeh message bhejo:
        </p>
        <div className="flex items-center gap-2 bg-black/40 border border-white/10 rounded-xl px-4 py-3">
          <code className="text-sm text-[#25D366] font-mono flex-1">join rabbit-herd</code>
          <button onClick={() => copy("join rabbit-herd", "join")}
            className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-white/40 hover:text-white transition-all">
            {copied === "join" ? <CheckCircle size={13} className="text-green-400" /> : <Copy size={13} />}
          </button>
        </div>
        <p className="text-xs text-white/30">✅ "joined rabbit-herd" reply aaye toh connected hai</p>
      </div>

      {/* Step 2 — Webhook */}
      <div className="bg-[#111111] border border-white/5 rounded-2xl p-5 space-y-3">
        <div className="flex items-center gap-2">
          <span className="text-[#C9A84C] font-serif font-bold text-xl">02</span>
          <p className="text-sm font-bold text-white">Twilio Webhook Set Karo</p>
        </div>
        <p className="text-xs text-white/50">
          Twilio Console → Messaging → Try it out → Send a WhatsApp message → Sandbox settings
        </p>
        <a href="https://console.twilio.com/us1/develop/sms/try-it-out/whatsapp-learn"
          target="_blank" rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 text-xs text-[#C9A84C] hover:text-[#D4AF37] transition-colors">
          <ExternalLink size={12} /> Twilio Sandbox Settings →
        </a>

        <div className="space-y-2 mt-2">
          <p className="text-[10px] text-white/40 uppercase tracking-widest">
            "WHEN A MESSAGE COMES IN" field mein yeh URL paste karo:
          </p>
          <div className="flex items-center gap-2 bg-black/40 border border-white/10 rounded-xl px-4 py-3">
            <code className="text-xs text-green-400 font-mono flex-1 break-all">{webhookUrl}</code>
            <button onClick={() => copy(webhookUrl, "webhook")}
              className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-white/40 hover:text-white transition-all flex-shrink-0">
              {copied === "webhook" ? <CheckCircle size={13} className="text-green-400" /> : <Copy size={13} />}
            </button>
          </div>
          <p className="text-[10px] text-white/30">Method: HTTP POST</p>
        </div>
      </div>

      {/* Step 3 — Vercel Env */}
      <div className="bg-[#111111] border border-white/5 rounded-2xl p-5 space-y-3">
        <div className="flex items-center gap-2">
          <span className="text-[#C9A84C] font-serif font-bold text-xl">03</span>
          <p className="text-sm font-bold text-white">Vercel Environment Variables</p>
        </div>
        <p className="text-xs text-white/50">Vercel Dashboard → Project → Settings → Environment Variables</p>
        <div className="bg-black/40 border border-white/10 rounded-xl p-4 space-y-2">
          {[
            { key: "TWILIO_ACCOUNT_SID", val: "from Twilio Console → Account Info" },
            { key: "TWILIO_AUTH_TOKEN", val: "from Twilio Console → Account Info" },
            { key: "TWILIO_WHATSAPP_NUMBER", val: "whatsapp:+14155238886" },
            { key: "NEXT_PUBLIC_APP_URL", val: "https://your-app.vercel.app" },
          ].map(({ key, val }) => (
            <div key={key} className="flex items-center gap-2 text-xs font-mono">
              <span className="text-[#C9A84C]">{key}</span>
              <span className="text-white/30">=</span>
              <span className="text-green-400 truncate">{val}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Step 4 — Test */}
      <div className="bg-[#111111] border border-white/5 rounded-2xl p-5 space-y-3">
        <div className="flex items-center gap-2">
          <span className="text-[#C9A84C] font-serif font-bold text-xl">04</span>
          <p className="text-sm font-bold text-white">Test Karo</p>
        </div>
        <p className="text-xs text-white/50 mb-3">
          Apne WhatsApp se <span className="text-[#25D366] font-bold">+1 415 523 8886</span> par koi bhi message bhejo:
        </p>
        <div className="space-y-2">
          {[
            { msg: "Hi", desc: "Greeting test" },
            { msg: "Menu dikhao", desc: "Menu test" },
            { msg: "Mujhe 2 Chicken Alfredo order karna hai", desc: "Order test" },
            { msg: "Kal 7 baje table book karna hai 4 logon ke liye", desc: "Booking test" },
          ].map(({ msg, desc }) => (
            <div key={msg} className="flex items-center gap-3 bg-white/[0.03] rounded-xl px-4 py-2.5">
              <div className="w-2 h-2 rounded-full bg-[#25D366]" />
              <div className="flex-1">
                <p className="text-xs font-bold text-white">&quot;{msg}&quot;</p>
                <p className="text-[10px] text-white/30">{desc}</p>
              </div>
              <button onClick={() => copy(msg, msg)}
                className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-white/40 hover:text-white transition-all">
                {copied === msg ? <CheckCircle size={12} className="text-green-400" /> : <Copy size={12} />}
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* What happens after */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-blue-500/5 border border-blue-500/20 rounded-2xl p-4">
          <ShoppingBag size={16} className="text-blue-400 mb-2" />
          <p className="text-sm font-bold text-white mb-1">Order Place Ho</p>
          <p className="text-xs text-white/50">Admin → Orders mein automatically dikh jaye ga status "Pending"</p>
        </div>
        <div className="bg-[#C9A84C]/5 border border-[#C9A84C]/20 rounded-2xl p-4">
          <CalendarDays size={16} className="text-[#C9A84C] mb-2" />
          <p className="text-sm font-bold text-white mb-1">Table Book Ho</p>
          <p className="text-xs text-white/50">Admin → Reservations mein automatically dikh jaye ga status "Confirmed"</p>
        </div>
      </div>

      {/* Note */}
      <div className="bg-amber-500/10 border border-amber-500/20 rounded-2xl p-4 flex gap-3">
        <Info size={15} className="text-amber-400 flex-shrink-0 mt-0.5" />
        <div className="text-xs text-amber-400/80 space-y-1">
          <p className="font-bold text-amber-400">Important</p>
          <p>• Sandbox mein sirf woh numbers message kar sakte hain jo "join rabbit-herd" bhej chuke hain</p>
          <p>• Production ke liye Twilio WhatsApp Business API approve karwana hoga (free process)</p>
          <p>• App Vercel par deployed hona chahiye — localhost par webhook kaam nahi karta</p>
        </div>
      </div>
    </div>
  );
}
