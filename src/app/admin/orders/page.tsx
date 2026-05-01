"use client";

import { useState, useCallback, useEffect } from "react";
import useSWR from "swr";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Download, X, ChevronLeft, ChevronRight, LayoutGrid, List, Phone, MapPin, Clock } from "lucide-react";
import { toast } from "sonner";

const fetcher = (url: string) => fetch(url).then((r) => r.json());

const STATUSES = ["all", "Pending", "Preparing", "Out for Delivery", "Delivered", "Cancelled"];
const ORDER_TYPES = ["all", "Delivery", "Takeaway"];

const STATUS_COLORS: Record<string, string> = {
  Pending: "bg-amber-500/20 text-amber-400 border-amber-500/30",
  Preparing: "bg-blue-500/20 text-blue-400 border-blue-500/30",
  "Out for Delivery": "bg-purple-500/20 text-purple-400 border-purple-500/30",
  Delivered: "bg-green-500/20 text-green-400 border-green-500/30",
  Cancelled: "bg-red-500/20 text-red-400 border-red-500/30",
};

const KANBAN_COLS = ["Pending", "Preparing", "Out for Delivery", "Delivered"];

function StatusBadge({ status }: { status: string }) {
  return (
    <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border ${STATUS_COLORS[status] || "bg-white/10 text-white/50 border-white/10"}`}>
      {status}
    </span>
  );
}

export default function OrdersPage() {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");
  const [orderType, setOrderType] = useState("all");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [page, setPage] = useState(1);
  const [selected, setSelected] = useState<string[]>([]);
  const [detailOrder, setDetailOrder] = useState<any>(null);
  const [view, setView] = useState<"table" | "kanban">("table");
  const [lastUpdated, setLastUpdated] = useState(new Date());

  const buildUrl = useCallback(() => {
    const p = new URLSearchParams();
    if (search) p.set("search", search);
    if (status !== "all") p.set("status", status);
    if (orderType !== "all") p.set("orderType", orderType);
    if (dateFrom) p.set("dateFrom", dateFrom);
    if (dateTo) p.set("dateTo", dateTo);
    p.set("page", String(page));
    p.set("limit", "20");
    return `/api/admin/orders?${p}`;
  }, [search, status, orderType, dateFrom, dateTo, page]);

  const { data, mutate, isLoading } = useSWR(buildUrl, fetcher, {
    refreshInterval: 30000,
    onSuccess: () => setLastUpdated(new Date()),
  });

  // All orders for kanban (no pagination)
  const { data: allData } = useSWR(
    view === "kanban" ? "/api/admin/orders?limit=100" : null, fetcher, { refreshInterval: 30000 }
  );

  const orders: any[] = data?.orders || [];
  const total: number = data?.total || 0;
  const totalPages = Math.ceil(total / 20);

  const [secondsAgo, setSecondsAgo] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setSecondsAgo(Math.floor((Date.now() - lastUpdated.getTime()) / 1000)), 1000);
    return () => clearInterval(id);
  }, [lastUpdated]);

  const updateStatus = async (id: string, newStatus: string) => {
    await fetch(`/api/admin/orders/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: newStatus }),
    });
    toast.success("Status updated");
    mutate();
  };

  const bulkAction = async (action: string) => {
    await Promise.all(selected.map((id) => updateStatus(id, action)));
    setSelected([]);
  };

  const exportCSV = () => {
    const rows = [
      ["ID", "Customer", "Phone", "Type", "Items", "Total", "Address", "Time", "Status"],
      ...orders.map((o) => [
        o.id, o.customerName, o.phone, o.orderType,
        o.items.map((i: any) => `${i.quantity}x ${i.itemName || i.menuItem?.name || "Item"}`).join("; "),
        o.totalAmount, o.address,
        new Date(o.createdAt).toLocaleString(), o.status,
      ]),
    ];
    const csv = rows.map((r) => r.map((c) => `"${c}"`).join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const a = document.createElement("a"); a.href = URL.createObjectURL(blob); a.download = "orders.csv"; a.click();
  };

  return (
    <div className="p-6 space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-serif font-bold text-white">Orders</h1>
          <p className="text-sm text-white/40 mt-1">
            {total} total · Last updated {secondsAgo}s ago
          </p>
        </div>
        <div className="flex gap-2">
          <div className="flex bg-white/5 rounded-xl p-1">
            <button onClick={() => setView("table")} className={`px-3 py-1.5 rounded-lg text-sm transition-all flex items-center gap-1.5 ${view === "table" ? "bg-[#C9A84C]/20 text-[#C9A84C]" : "text-white/40 hover:text-white"}`}>
              <List size={14} /> Table
            </button>
            <button onClick={() => setView("kanban")} className={`px-3 py-1.5 rounded-lg text-sm transition-all flex items-center gap-1.5 ${view === "kanban" ? "bg-[#C9A84C]/20 text-[#C9A84C]" : "text-white/40 hover:text-white"}`}>
              <LayoutGrid size={14} /> Kanban
            </button>
          </div>
          <button onClick={exportCSV} className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-white/70 text-sm transition-all">
            <Download size={15} /> Export
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3">
        <div className="relative flex-1 min-w-[200px]">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" />
          <input value={search} onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            placeholder="Search by name, phone, ID..."
            className="w-full bg-[#111111] border border-white/10 rounded-xl pl-9 pr-4 py-2.5 text-sm text-white placeholder-white/30 outline-none focus:border-[#C9A84C]/50" />
        </div>
        <select value={status} onChange={(e) => { setStatus(e.target.value); setPage(1); }}
          className="bg-[#111111] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white outline-none focus:border-[#C9A84C]/50">
          {STATUSES.map((s) => <option key={s} value={s}>{s === "all" ? "All Statuses" : s}</option>)}
        </select>
        <select value={orderType} onChange={(e) => { setOrderType(e.target.value); setPage(1); }}
          className="bg-[#111111] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white outline-none focus:border-[#C9A84C]/50">
          {ORDER_TYPES.map((t) => <option key={t} value={t}>{t === "all" ? "All Types" : t}</option>)}
        </select>
        <input type="date" value={dateFrom} onChange={(e) => setDateFrom(e.target.value)}
          className="bg-[#111111] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white outline-none focus:border-[#C9A84C]/50" />
        <input type="date" value={dateTo} onChange={(e) => setDateTo(e.target.value)}
          className="bg-[#111111] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white outline-none focus:border-[#C9A84C]/50" />
      </div>

      {/* Bulk actions */}
      {selected.length > 0 && (
        <div className="flex items-center gap-3 px-4 py-3 bg-[#C9A84C]/10 border border-[#C9A84C]/20 rounded-xl">
          <span className="text-sm text-[#C9A84C] font-bold">{selected.length} selected</span>
          <button onClick={() => bulkAction("Preparing")} className="px-3 py-1.5 rounded-lg bg-blue-500/20 text-blue-400 text-xs font-bold hover:bg-blue-500/30 transition-all">Mark Preparing</button>
          <button onClick={() => bulkAction("Delivered")} className="px-3 py-1.5 rounded-lg bg-green-500/20 text-green-400 text-xs font-bold hover:bg-green-500/30 transition-all">Mark Delivered</button>
          <button onClick={() => setSelected([])} className="ml-auto text-white/40 hover:text-white"><X size={16} /></button>
        </div>
      )}

      {/* Kanban View */}
      {view === "kanban" ? (
        <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
          {KANBAN_COLS.map((col) => {
            const colOrders = (allData?.orders || []).filter((o: any) => o.status === col);
            return (
              <div key={col} className="bg-[#111111] border border-white/5 rounded-2xl overflow-hidden">
                <div className="px-4 py-3 border-b border-white/5 flex items-center justify-between">
                  <span className="text-xs font-bold text-white uppercase tracking-widest">{col}</span>
                  <span className="w-5 h-5 rounded-full bg-white/10 text-white/60 text-[10px] font-bold flex items-center justify-center">{colOrders.length}</span>
                </div>
                <div className="p-3 space-y-3 max-h-[600px] overflow-y-auto">
                  {colOrders.length === 0 ? (
                    <p className="text-center text-white/20 text-xs py-6">Empty</p>
                  ) : (
                    colOrders.map((order: any) => (
                      <div key={order.id} onClick={() => setDetailOrder(order)}
                        className="bg-white/[0.03] border border-white/5 rounded-xl p-3 cursor-pointer hover:border-[#C9A84C]/30 transition-all">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-[10px] font-mono text-[#C9A84C] font-bold">#{order.id.slice(-6).toUpperCase()}</span>
                          <span className={`text-[9px] px-2 py-0.5 rounded-full font-bold ${order.orderType === "Delivery" ? "bg-blue-500/20 text-blue-400" : "bg-purple-500/20 text-purple-400"}`}>{order.orderType}</span>
                        </div>
                        <p className="text-sm font-bold text-white mb-1">{order.customerName}</p>
                        <p className="text-xs text-white/40 truncate">{order.items.map((i: any) => `${i.quantity}x ${i.itemName || i.menuItem?.name || "Item"}`).join(", ")}</p>
                        <p className="text-xs text-[#C9A84C] font-bold mt-2">PKR {order.totalAmount.toLocaleString()}</p>
                        <div className="mt-2 flex gap-1 flex-wrap">
                          {KANBAN_COLS.filter((c) => c !== col).map((c) => (
                            <button key={c} onClick={(e) => { e.stopPropagation(); updateStatus(order.id, c); }}
                              className="text-[9px] px-2 py-1 rounded-lg bg-white/5 text-white/40 hover:bg-white/10 hover:text-white transition-all">
                              → {c.split(" ")[0]}
                            </button>
                          ))}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* Table View */
        <div className="bg-[#111111] border border-white/5 rounded-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-white/5">
                  <th className="px-4 py-3 w-10">
                    <input type="checkbox" className="accent-[#C9A84C]"
                      checked={selected.length === orders.length && orders.length > 0}
                      onChange={(e) => setSelected(e.target.checked ? orders.map((o) => o.id) : [])} />
                  </th>
                  {["Order ID", "Customer", "Type", "Items", "Total", "Time", "Status", "Actions"].map((h) => (
                    <th key={h} className="px-4 py-3 text-[10px] uppercase tracking-widest text-white/30 font-bold whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.03]">
                {isLoading ? (
                  Array(6).fill(0).map((_, i) => (
                    <tr key={i}>{Array(9).fill(0).map((_, j) => <td key={j} className="px-4 py-4"><div className="h-4 bg-white/5 rounded animate-pulse" /></td>)}</tr>
                  ))
                ) : orders.length === 0 ? (
                  <tr><td colSpan={9} className="px-4 py-16 text-center text-white/30 text-sm">No orders found</td></tr>
                ) : (
                  orders.map((order) => (
                    <tr key={order.id} className="hover:bg-white/[0.02] transition-colors cursor-pointer" onClick={() => setDetailOrder(order)}>
                      <td className="px-4 py-4" onClick={(e) => e.stopPropagation()}>
                        <input type="checkbox" className="accent-[#C9A84C]"
                          checked={selected.includes(order.id)}
                          onChange={(e) => setSelected(e.target.checked ? [...selected, order.id] : selected.filter((s) => s !== order.id))} />
                      </td>
                      <td className="px-4 py-4"><span className="text-xs font-mono text-[#C9A84C] font-bold">#{order.id.slice(-6).toUpperCase()}</span></td>
                      <td className="px-4 py-4">
                        <p className="text-sm font-bold text-white">{order.customerName}</p>
                        <p className="text-xs text-white/40">{order.phone}</p>
                      </td>
                      <td className="px-4 py-4">
                        <span className={`text-xs px-2 py-1 rounded-full font-bold ${order.orderType === "Delivery" ? "bg-blue-500/20 text-blue-400" : "bg-purple-500/20 text-purple-400"}`}>{order.orderType}</span>
                      </td>
                      <td className="px-4 py-4 max-w-[200px]">
                        <p className="text-xs text-white/60 truncate">{order.items.map((i: any) => `${i.quantity}x ${i.itemName || i.menuItem?.name || "Item"}`).join(", ")}</p>
                      </td>
                      <td className="px-4 py-4"><span className="text-sm font-bold text-[#C9A84C]">PKR {order.totalAmount.toLocaleString()}</span></td>
                      <td className="px-4 py-4"><span className="text-xs text-white/50">{new Date(order.createdAt).toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })}</span></td>
                      <td className="px-4 py-4" onClick={(e) => e.stopPropagation()}>
                        <select value={order.status} onChange={(e) => updateStatus(order.id, e.target.value)}
                          className="bg-[#1a1a1a] border border-white/10 rounded-lg px-2 py-1.5 text-xs text-white outline-none focus:border-[#C9A84C]/50">
                          {STATUSES.filter((s) => s !== "all").map((s) => <option key={s} value={s}>{s}</option>)}
                        </select>
                      </td>
                      <td className="px-4 py-4" onClick={(e) => e.stopPropagation()}>
                        <button onClick={() => updateStatus(order.id, "Cancelled")} className="text-xs text-red-400 hover:text-red-300 transition-colors">Cancel</button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
          {totalPages > 1 && (
            <div className="px-4 py-3 border-t border-white/5 flex items-center justify-between">
              <span className="text-xs text-white/30">Page {page} of {totalPages}</span>
              <div className="flex gap-2">
                <button disabled={page === 1} onClick={() => setPage((p) => p - 1)} className="p-1.5 rounded-lg bg-white/5 text-white/50 disabled:opacity-30 hover:bg-white/10 transition-all"><ChevronLeft size={16} /></button>
                <button disabled={page === totalPages} onClick={() => setPage((p) => p + 1)} className="p-1.5 rounded-lg bg-white/5 text-white/50 disabled:opacity-30 hover:bg-white/10 transition-all"><ChevronRight size={16} /></button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Detail Panel */}
      <AnimatePresence>
        {detailOrder && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/60 z-40" onClick={() => setDetailOrder(null)} />
            <motion.div initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }} transition={{ type: "spring", damping: 30, stiffness: 300 }}
              className="fixed right-0 top-0 h-full w-[420px] bg-[#111111] border-l border-white/10 z-50 overflow-y-auto">
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-lg font-bold text-white">Order Details</h2>
                  <button onClick={() => setDetailOrder(null)} className="p-2 rounded-lg hover:bg-white/5 text-white/50 hover:text-white transition-all"><X size={18} /></button>
                </div>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-[#C9A84C] font-bold">#{detailOrder.id.slice(-6).toUpperCase()}</span>
                    <StatusBadge status={detailOrder.status} />
                  </div>
                  <div className="bg-white/5 rounded-xl p-4 space-y-3">
                    <div className="flex items-center gap-3"><Phone size={15} className="text-[#C9A84C]" /><div><p className="text-xs text-white/40">Customer</p><p className="text-sm font-bold text-white">{detailOrder.customerName}</p><p className="text-xs text-white/50">{detailOrder.phone}</p></div></div>
                    {detailOrder.address && <div className="flex items-center gap-3"><MapPin size={15} className="text-[#C9A84C]" /><div><p className="text-xs text-white/40">Address</p><p className="text-sm text-white">{detailOrder.address}</p></div></div>}
                    <div className="flex items-center gap-3"><Clock size={15} className="text-[#C9A84C]" /><div><p className="text-xs text-white/40">Placed</p><p className="text-sm text-white">{new Date(detailOrder.createdAt).toLocaleString()}</p></div></div>
                  </div>
                  <div className="bg-white/5 rounded-xl p-4">
                    <p className="text-xs text-white/40 uppercase tracking-widest mb-3">Items</p>
                    <div className="space-y-2">
                      {detailOrder.items.map((item: any, i: number) => (
                        <div key={i} className="flex justify-between text-sm">
                          <span className="text-white">{item.quantity}x {item.itemName || item.menuItem?.name || "Item"}</span>
                          <span className="text-[#C9A84C]">PKR {(item.price * item.quantity).toLocaleString()}</span>
                        </div>
                      ))}
                    </div>
                    <div className="border-t border-white/10 mt-3 pt-3 flex justify-between font-bold">
                      <span className="text-white">Total</span>
                      <span className="text-[#C9A84C]">PKR {detailOrder.totalAmount.toLocaleString()}</span>
                    </div>
                  </div>
                  <div>
                    <p className="text-xs text-white/40 uppercase tracking-widest mb-2">Update Status</p>
                    <div className="flex flex-wrap gap-2">
                      {STATUSES.filter((s) => s !== "all" && s !== detailOrder.status).map((s) => (
                        <button key={s} onClick={() => { updateStatus(detailOrder.id, s); setDetailOrder({ ...detailOrder, status: s }); }}
                          className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition-all ${STATUS_COLORS[s]}`}>{s}</button>
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
