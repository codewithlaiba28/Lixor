"use client";

import { useState, useRef } from "react";
import useSWR from "swr";
import { motion, AnimatePresence } from "framer-motion";
import { Printer, X, ChefHat, Clock, Users } from "lucide-react";

const fetcher = (url: string) => fetch(url).then((r) => r.json());

const FILTERS = ["today", "tomorrow", "week"] as const;
type Filter = typeof FILTERS[number];

const PRE_ORDER_STATUSES = ["Not Prepared", "In Preparation", "Ready"];

const STATUS_COLORS: Record<string, string> = {
  "Not Prepared": "bg-amber-500/20 text-amber-400 border-amber-500/30",
  "In Preparation": "bg-blue-500/20 text-blue-400 border-blue-500/30",
  "Ready": "bg-green-500/20 text-green-400 border-green-500/30",
};

export default function CombinedPage() {
  const [filter, setFilter] = useState<Filter>("today");
  const [preOrderStatuses, setPreOrderStatuses] = useState<Record<string, string>>({});
  const [detailRes, setDetailRes] = useState<any>(null);
  const printRef = useRef<HTMLDivElement>(null);

  const { data: reservations, isLoading } = useSWR(
    `/api/admin/combined?filter=${filter}`, fetcher, { refreshInterval: 30000 }
  );

  const getPreOrderStatus = (id: string) => preOrderStatuses[id] || "Not Prepared";
  const setPreOrderStatus = (id: string, status: string) => {
    setPreOrderStatuses((prev) => ({ ...prev, [id]: status }));
  };

  const getPreOrderTotal = (items: any[]) =>
    items.reduce((s: number, i: any) => s + (i.price || 0) * (i.quantity || 1), 0);

  const handlePrint = () => {
    const content = printRef.current;
    if (!content) return;
    const win = window.open("", "_blank");
    if (!win) return;
    win.document.write(`
      <html><head><title>Pre-orders - ${new Date().toLocaleDateString()}</title>
      <style>
        body { font-family: sans-serif; padding: 20px; color: #000; }
        h1 { font-size: 20px; margin-bottom: 4px; }
        .card { border: 1px solid #ddd; border-radius: 8px; padding: 16px; margin-bottom: 16px; page-break-inside: avoid; }
        .header { display: flex; justify-content: space-between; margin-bottom: 8px; }
        .name { font-weight: bold; font-size: 16px; }
        .meta { color: #666; font-size: 13px; }
        table { width: 100%; border-collapse: collapse; margin-top: 8px; }
        th, td { text-align: left; padding: 6px 8px; border-bottom: 1px solid #eee; font-size: 13px; }
        th { font-weight: bold; background: #f5f5f5; }
        .total { font-weight: bold; text-align: right; margin-top: 8px; }
        @media print { body { padding: 0; } }
      </style></head><body>
      <h1>Kitchen Pre-orders</h1>
      <p style="color:#666;margin-bottom:20px">${new Date().toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}</p>
      ${(reservations || []).map((res: any) => `
        <div class="card">
          <div class="header">
            <div>
              <div class="name">${res.guestName}</div>
              <div class="meta">${res.timeSlot} · Table ${res.table?.tableNumber} · ${res.guests} guests</div>
            </div>
            <div class="meta">#${res.id.slice(-6).toUpperCase()}</div>
          </div>
          <table>
            <tr><th>Item</th><th>Qty</th><th>Price</th></tr>
            ${(res.preOrderItems as any[]).map((item: any) => `
              <tr><td>${item.name}</td><td>${item.quantity || 1}</td><td>PKR ${((item.price || 0) * (item.quantity || 1)).toLocaleString()}</td></tr>
            `).join("")}
          </table>
          <div class="total">Total: PKR ${getPreOrderTotal(res.preOrderItems as any[]).toLocaleString()}</div>
        </div>
      `).join("")}
      </body></html>
    `);
    win.document.close();
    win.print();
  };

  return (
    <div className="p-6 space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-serif font-bold text-white">Combined Pre-orders</h1>
          <p className="text-sm text-white/40 mt-1">Reservations with pre-ordered food</p>
        </div>
        <button onClick={handlePrint}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#C9A84C] hover:bg-[#D4AF37] text-black font-bold text-sm transition-all">
          <Printer size={15} /> Print Kitchen View
        </button>
      </div>

      {/* Filter */}
      <div className="flex gap-2">
        {FILTERS.map((f) => (
          <button key={f} onClick={() => setFilter(f)}
            className={`px-4 py-2 rounded-xl text-sm font-bold capitalize transition-all ${
              filter === f ? "bg-[#C9A84C]/20 text-[#C9A84C] border border-[#C9A84C]/30" : "bg-white/5 text-white/50 hover:text-white hover:bg-white/10"
            }`}>
            {f}
          </button>
        ))}
      </div>

      {/* Table */}
      <div ref={printRef} className="bg-[#111111] border border-white/5 rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-white/5">
                {["Booking ID", "Guest", "Date & Time", "Table", "Pre-ordered Items", "Total", "Status", "Actions"].map((h) => (
                  <th key={h} className="px-4 py-3 text-[10px] uppercase tracking-widest text-white/30 font-bold whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.03]">
              {isLoading ? (
                Array(4).fill(0).map((_, i) => (
                  <tr key={i}>{Array(8).fill(0).map((_, j) => <td key={j} className="px-4 py-4"><div className="h-4 bg-white/5 rounded animate-pulse" /></td>)}</tr>
                ))
              ) : (reservations || []).length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-4 py-16 text-center">
                    <ChefHat size={32} className="mx-auto text-white/20 mb-3" />
                    <p className="text-white/30 text-sm">No pre-orders for {filter}</p>
                  </td>
                </tr>
              ) : (
                (reservations || []).map((res: any) => {
                  const items = res.preOrderItems as any[];
                  const total = getPreOrderTotal(items);
                  const preStatus = getPreOrderStatus(res.id);
                  return (
                    <tr key={res.id} className="hover:bg-white/[0.02] transition-colors cursor-pointer" onClick={() => setDetailRes(res)}>
                      <td className="px-4 py-4"><span className="text-xs font-mono text-[#C9A84C] font-bold">#{res.id.slice(-6).toUpperCase()}</span></td>
                      <td className="px-4 py-4">
                        <p className="text-sm font-bold text-white">{res.guestName}</p>
                        <p className="text-xs text-white/40">{res.phone}</p>
                      </td>
                      <td className="px-4 py-4">
                        <p className="text-sm text-white">{new Date(res.date).toLocaleDateString("en-US", { month: "short", day: "numeric" })}</p>
                        <p className="text-xs text-[#C9A84C] flex items-center gap-1"><Clock size={10} />{res.timeSlot}</p>
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-1.5">
                          <span className="text-sm font-bold text-white">{res.table?.tableNumber}</span>
                          <span className="text-xs text-white/40 flex items-center gap-0.5"><Users size={10} />{res.guests}</span>
                        </div>
                      </td>
                      <td className="px-4 py-4 max-w-[200px]">
                        <p className="text-xs text-white/60 truncate">
                          {items.map((i: any) => `${i.quantity || 1}x ${i.name}`).join(", ")}
                        </p>
                        <p className="text-[10px] text-white/30 mt-0.5">{items.length} item{items.length !== 1 ? "s" : ""}</p>
                      </td>
                      <td className="px-4 py-4"><span className="text-sm font-bold text-[#C9A84C]">PKR {total.toLocaleString()}</span></td>
                      <td className="px-4 py-4" onClick={(e) => e.stopPropagation()}>
                        <select value={preStatus} onChange={(e) => setPreOrderStatus(res.id, e.target.value)}
                          className="bg-[#1a1a1a] border border-white/10 rounded-lg px-2 py-1.5 text-xs text-white outline-none focus:border-[#C9A84C]/50">
                          {PRE_ORDER_STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
                        </select>
                      </td>
                      <td className="px-4 py-4" onClick={(e) => e.stopPropagation()}>
                        <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border ${STATUS_COLORS[preStatus]}`}>
                          {preStatus}
                        </span>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Detail Panel */}
      <AnimatePresence>
        {detailRes && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/60 z-40" onClick={() => setDetailRes(null)} />
            <motion.div initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }} transition={{ type: "spring", damping: 30, stiffness: 300 }}
              className="fixed right-0 top-0 h-full w-[420px] bg-[#111111] border-l border-white/10 z-50 overflow-y-auto">
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-lg font-bold text-white">Pre-order Details</h2>
                  <button onClick={() => setDetailRes(null)} className="p-2 rounded-lg hover:bg-white/5 text-white/50 hover:text-white transition-all"><X size={18} /></button>
                </div>
                <div className="space-y-4">
                  <div className="bg-white/5 rounded-xl p-4 space-y-2">
                    <div className="flex justify-between"><span className="text-xs text-white/40">Guest</span><span className="text-sm font-bold text-white">{detailRes.guestName}</span></div>
                    <div className="flex justify-between"><span className="text-xs text-white/40">Table</span><span className="text-sm text-white">{detailRes.table?.tableNumber}</span></div>
                    <div className="flex justify-between"><span className="text-xs text-white/40">Time</span><span className="text-sm text-[#C9A84C]">{detailRes.timeSlot}</span></div>
                    <div className="flex justify-between"><span className="text-xs text-white/40">Guests</span><span className="text-sm text-white">{detailRes.guests}</span></div>
                  </div>
                  <div className="bg-[#C9A84C]/10 border border-[#C9A84C]/20 rounded-xl p-4">
                    <p className="text-xs text-[#C9A84C] font-bold uppercase tracking-widest mb-3">Pre-ordered Items</p>
                    <div className="space-y-2">
                      {(detailRes.preOrderItems as any[]).map((item: any, i: number) => (
                        <div key={i} className="flex justify-between text-sm">
                          <span className="text-white">{item.quantity || 1}x {item.name}</span>
                          <span className="text-[#C9A84C]">PKR {((item.price || 0) * (item.quantity || 1)).toLocaleString()}</span>
                        </div>
                      ))}
                    </div>
                    <div className="border-t border-[#C9A84C]/20 mt-3 pt-3 flex justify-between font-bold">
                      <span className="text-white">Total</span>
                      <span className="text-[#C9A84C]">PKR {getPreOrderTotal(detailRes.preOrderItems as any[]).toLocaleString()}</span>
                    </div>
                  </div>
                  <div>
                    <p className="text-xs text-white/40 uppercase tracking-widest mb-2">Kitchen Status</p>
                    <div className="flex gap-2">
                      {PRE_ORDER_STATUSES.map((s) => (
                        <button key={s} onClick={() => setPreOrderStatus(detailRes.id, s)}
                          className={`flex-1 py-2 rounded-xl text-xs font-bold border transition-all ${
                            getPreOrderStatus(detailRes.id) === s ? STATUS_COLORS[s] : "bg-white/5 text-white/40 border-white/10 hover:bg-white/10"
                          }`}>{s}</button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
