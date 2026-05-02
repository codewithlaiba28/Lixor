"use client";

import { useState, useCallback } from "react";
import useSWR from "swr";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Filter, Plus, Download, X, ChevronLeft, ChevronRight, Users, Phone, Mail, Clock } from "lucide-react";
import { toast } from "sonner";

const fetcher = (url: string) => fetch(url).then((r) => r.json());

const STATUSES = ["all", "Pending", "Confirmed", "Seated", "Completed", "No-show", "Cancelled"];
const TIME_SLOTS = ["all", "12:00 PM", "1:00 PM", "2:00 PM", "6:00 PM", "7:00 PM", "8:00 PM", "9:00 PM"];

const STATUS_COLORS: Record<string, string> = {
  Pending: "bg-amber-500/20 text-amber-400 border-amber-500/30",
  Confirmed: "bg-green-500/20 text-green-400 border-green-500/30",
  Seated: "bg-blue-500/20 text-blue-400 border-blue-500/30",
  Completed: "bg-gray-500/20 text-gray-400 border-gray-500/30",
  "No-show": "bg-red-500/20 text-red-400 border-red-500/30",
  Cancelled: "bg-red-500/20 text-red-400 border-red-500/30",
};

function StatusBadge({ status }: { status: string }) {
  return (
    <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border ${STATUS_COLORS[status] || "bg-white/10 text-white/50 border-white/10"}`}>
      {status}
    </span>
  );
}

export default function ReservationsPage() {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");
  const [timeSlot, setTimeSlot] = useState("all");
  const [date, setDate] = useState("");
  const [page, setPage] = useState(1);
  const [selected, setSelected] = useState<string[]>([]);
  const [detailRes, setDetailRes] = useState<any>(null);
  const [showNewForm, setShowNewForm] = useState(false);

  const buildUrl = useCallback(() => {
    const p = new URLSearchParams();
    if (search) p.set("search", search);
    if (status !== "all") p.set("status", status);
    if (timeSlot !== "all") p.set("timeSlot", timeSlot);
    if (date) p.set("date", date);
    p.set("page", String(page));
    p.set("limit", "20");
    return `/api/admin/reservations?${p}`;
  }, [search, status, timeSlot, date, page]);

  const { data, mutate, isLoading } = useSWR(buildUrl, fetcher, { refreshInterval: 30000 });
  const reservations: any[] = data?.reservations || [];
  const total: number = data?.total || 0;
  const totalPages = Math.ceil(total / 20);

  const updateStatus = async (id: string, newStatus: string) => {
    await fetch(`/api/admin/reservations/${id}`, {
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
      ["ID", "Guest", "Phone", "Email", "Date", "Time", "Guests", "Table", "Status"],
      ...reservations.map((r) => [
        r.id, r.guestName, r.phone, r.email,
        new Date(r.date).toLocaleDateString(),
        r.timeSlot, r.guests, r.table?.tableNumber, r.status,
      ]),
    ];
    const csv = rows.map((r) => r.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a"); a.href = url; a.download = "reservations.csv"; a.click();
  };

  const isToday = (dateStr: string) => {
    const d = new Date(dateStr);
    const t = new Date();
    return d.getFullYear() === t.getFullYear() && d.getMonth() === t.getMonth() && d.getDate() === t.getDate();
  };

  return (
    <div className="p-6 space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-serif font-bold text-white">Reservations</h1>
          <p className="text-sm text-white/40 mt-1">{total} total reservations</p>
        </div>
        <div className="flex gap-2">
          <button onClick={exportCSV} className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-white/70 text-sm transition-all">
            <Download size={15} /> Export CSV
          </button>
          <button onClick={() => setShowNewForm(true)} className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#C9A84C] hover:bg-[#D4AF37] text-black font-bold text-sm transition-all">
            <Plus size={15} /> New Reservation
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3">
        <div className="relative flex-1 min-w-[200px]">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" />
          <input
            value={search} onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            placeholder="Search by name, phone, ID..."
            className="w-full bg-[#111111] border border-white/10 rounded-xl pl-9 pr-4 py-2.5 text-sm text-white placeholder-white/30 outline-none focus:border-[#C9A84C]/50"
          />
        </div>
        <input
          type="date" value={date} onChange={(e) => { setDate(e.target.value); setPage(1); }}
          className="bg-[#111111] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white outline-none focus:border-[#C9A84C]/50"
        />
        <select value={status} onChange={(e) => { setStatus(e.target.value); setPage(1); }}
          className="bg-[#111111] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white outline-none focus:border-[#C9A84C]/50">
          {STATUSES.map((s) => <option key={s} value={s}>{s === "all" ? "All Statuses" : s}</option>)}
        </select>
        <select value={timeSlot} onChange={(e) => { setTimeSlot(e.target.value); setPage(1); }}
          className="bg-[#111111] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white outline-none focus:border-[#C9A84C]/50">
          {TIME_SLOTS.map((s) => <option key={s} value={s}>{s === "all" ? "All Time Slots" : s}</option>)}
        </select>
        {(search || date || status !== "all" || timeSlot !== "all") && (
          <button onClick={() => { setSearch(""); setDate(""); setStatus("all"); setTimeSlot("all"); setPage(1); }}
            className="flex items-center gap-1 px-3 py-2 rounded-xl bg-red-500/10 text-red-400 text-sm hover:bg-red-500/20 transition-all">
            <X size={14} /> Clear
          </button>
        )}
      </div>

      {/* Bulk actions */}
      {selected.length > 0 && (
        <div className="flex items-center gap-3 px-4 py-3 bg-[#C9A84C]/10 border border-[#C9A84C]/20 rounded-xl">
          <span className="text-sm text-[#C9A84C] font-bold">{selected.length} selected</span>
          <button onClick={() => bulkAction("No-show")} className="px-3 py-1.5 rounded-lg bg-red-500/20 text-red-400 text-xs font-bold hover:bg-red-500/30 transition-all">Mark No-show</button>
          <button onClick={() => bulkAction("Cancelled")} className="px-3 py-1.5 rounded-lg bg-red-500/20 text-red-400 text-xs font-bold hover:bg-red-500/30 transition-all">Cancel</button>
          <button onClick={() => setSelected([])} className="ml-auto text-white/40 hover:text-white"><X size={16} /></button>
        </div>
      )}

      {/* Table */}
      <div className="bg-[#111111] border border-white/5 rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-white/5">
                <th className="px-4 py-3 w-10">
                  <input type="checkbox" className="accent-[#C9A84C]"
                    checked={selected.length === reservations.length && reservations.length > 0}
                    onChange={(e) => setSelected(e.target.checked ? reservations.map((r) => r.id) : [])} />
                </th>
                {["Booking ID", "Guest", "Date & Time", "Table", "Guests", "Pre-order", "Status", "Actions"].map((h) => (
                  <th key={h} className="px-4 py-3 text-[10px] uppercase tracking-widest text-white/30 font-bold whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.03]">
              {isLoading ? (
                Array(6).fill(0).map((_, i) => (
                  <tr key={i}>
                    {Array(9).fill(0).map((_, j) => (
                      <td key={j} className="px-4 py-4"><div className="h-4 bg-white/5 rounded animate-pulse" /></td>
                    ))}
                  </tr>
                ))
              ) : reservations.length === 0 ? (
                <tr><td colSpan={9} className="px-4 py-16 text-center text-white/30 text-sm">No reservations found</td></tr>
              ) : (
                reservations.map((res) => (
                  <tr
                    key={res.id}
                    className={`hover:bg-white/[0.02] transition-colors cursor-pointer ${isToday(res.date) ? "bg-[#C9A84C]/[0.03]" : ""}`}
                    onClick={() => setDetailRes(res)}
                  >
                    <td className="px-4 py-4" onClick={(e) => e.stopPropagation()}>
                      <input type="checkbox" className="accent-[#C9A84C]"
                        checked={selected.includes(res.id)}
                        onChange={(e) => setSelected(e.target.checked ? [...selected, res.id] : selected.filter((s) => s !== res.id))} />
                    </td>
                    <td className="px-4 py-4">
                      <span className="text-xs font-mono text-[#C9A84C] font-bold">#{res.id.slice(-6).toUpperCase()}</span>
                    </td>
                    <td className="px-4 py-4">
                      <p className="text-sm font-bold text-white">{res.guestName}</p>
                      <p className="text-xs text-white/40">{res.phone}</p>
                    </td>
                    <td className="px-4 py-4">
                      <p className="text-sm text-white">{new Date(res.date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}</p>
                      <p className="text-xs text-[#C9A84C]">{res.timeSlot}</p>
                    </td>
                    <td className="px-4 py-4">
                      <span className="text-sm text-white font-bold">{res.table?.tableNumber}</span>
                    </td>
                    <td className="px-4 py-4">
                      <span className="text-sm text-white">{res.guests}</span>
                    </td>
                    <td className="px-4 py-4">
                      {Array.isArray(res.preOrderItems) && res.preOrderItems.length > 0 ? (
                        <span className="px-2 py-1 rounded-full text-[10px] bg-[#C9A84C]/20 text-[#C9A84C] font-bold">Yes ({res.preOrderItems.length})</span>
                      ) : (
                        <span className="text-xs text-white/30">—</span>
                      )}
                    </td>
                    <td className="px-4 py-4" onClick={(e) => e.stopPropagation()}>
                      <select
                        value={res.status}
                        onChange={(e) => updateStatus(res.id, e.target.value)}
                        className="bg-[#1a1a1a] border border-white/10 rounded-lg px-2 py-1.5 text-xs text-white outline-none focus:border-[#C9A84C]/50"
                      >
                        {STATUSES.filter((s) => s !== "all").map((s) => <option key={s} value={s}>{s}</option>)}
                      </select>
                    </td>
                    <td className="px-4 py-4" onClick={(e) => e.stopPropagation()}>
                      <button onClick={() => updateStatus(res.id, "Cancelled")}
                        className="text-xs text-red-400 hover:text-red-300 transition-colors">Cancel</button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="px-4 py-3 border-t border-white/5 flex items-center justify-between">
            <span className="text-xs text-white/30">Page {page} of {totalPages}</span>
            <div className="flex gap-2">
              <button disabled={page === 1} onClick={() => setPage((p) => p - 1)}
                className="p-1.5 rounded-lg bg-white/5 text-white/50 disabled:opacity-30 hover:bg-white/10 transition-all">
                <ChevronLeft size={16} />
              </button>
              <button disabled={page === totalPages} onClick={() => setPage((p) => p + 1)}
                className="p-1.5 rounded-lg bg-white/5 text-white/50 disabled:opacity-30 hover:bg-white/10 transition-all">
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Detail Side Panel */}
      <AnimatePresence>
        {detailRes && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60 z-40" onClick={() => setDetailRes(null)} />
            <motion.div initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 30, stiffness: 300 }}
              className="fixed right-0 top-0 h-full w-[420px] bg-[#111111] border-l border-white/10 z-50 overflow-y-auto">
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-lg font-bold text-white">Reservation Details</h2>
                  <button onClick={() => setDetailRes(null)} className="p-2 rounded-lg hover:bg-white/5 text-white/50 hover:text-white transition-all"><X size={18} /></button>
                </div>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-white/40 uppercase tracking-widest">Booking ID</span>
                    <span className="font-mono text-[#C9A84C] font-bold">#{detailRes.id.slice(-6).toUpperCase()}</span>
                  </div>
                  <StatusBadge status={detailRes.status} />
                  <div className="bg-white/5 rounded-xl p-4 space-y-3">
                    <div className="flex items-center gap-3"><Users size={15} className="text-[#C9A84C]" /><div><p className="text-xs text-white/40">Guest</p><p className="text-sm font-bold text-white">{detailRes.guestName}</p></div></div>
                    <div className="flex items-center gap-3"><Phone size={15} className="text-[#C9A84C]" /><div><p className="text-xs text-white/40">Phone</p><p className="text-sm text-white">{detailRes.phone}</p></div></div>
                    <div className="flex items-center gap-3"><Mail size={15} className="text-[#C9A84C]" /><div><p className="text-xs text-white/40">Email</p><p className="text-sm text-white">{detailRes.email}</p></div></div>
                    <div className="flex items-center gap-3"><Clock size={15} className="text-[#C9A84C]" /><div><p className="text-xs text-white/40">Date & Time</p><p className="text-sm text-white">{new Date(detailRes.date).toLocaleDateString()} at {detailRes.timeSlot}</p></div></div>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-white/5 rounded-xl p-3 text-center"><p className="text-xs text-white/40 mb-1">Table</p><p className="text-xl font-bold text-[#C9A84C]">{detailRes.table?.tableNumber}</p></div>
                    <div className="bg-white/5 rounded-xl p-3 text-center"><p className="text-xs text-white/40 mb-1">Guests</p><p className="text-xl font-bold text-white">{detailRes.guests}</p></div>
                  </div>
                  {detailRes.specialRequests && (
                    <div className="bg-white/5 rounded-xl p-4"><p className="text-xs text-white/40 mb-2">Special Requests</p><p className="text-sm text-white">{detailRes.specialRequests}</p></div>
                  )}
                  {Array.isArray(detailRes.preOrderItems) && detailRes.preOrderItems.length > 0 && (
                    <div className="bg-[#C9A84C]/10 border border-[#C9A84C]/20 rounded-xl p-4">
                      <p className="text-xs text-[#C9A84C] font-bold uppercase tracking-widest mb-3">Pre-ordered Food</p>
                      <div className="space-y-2">
                        {detailRes.preOrderItems.map((item: any, i: number) => (
                          <div key={i} className="flex justify-between text-sm">
                            <span className="text-white">{item.quantity}x {item.name}</span>
                            <span className="text-[#C9A84C]">PKR {(item.price * item.quantity).toLocaleString()}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* New Reservation Form */}
      <AnimatePresence>
        {showNewForm && <NewReservationForm onClose={() => setShowNewForm(false)} onSuccess={() => { setShowNewForm(false); mutate(); }} />}
      </AnimatePresence>
    </div>
  );
}

function NewReservationForm({ onClose, onSuccess }: { onClose: () => void; onSuccess: () => void }) {
  const [form, setForm] = useState({ guestName: "", phone: "", email: "", date: "", timeSlot: "7:00 PM", guests: "2", tableId: "", specialRequests: "" });
  const { data: tables } = useSWR("/api/admin/tables", fetcher);
  const [loading, setLoading] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const res = await fetch("/api/admin/reservations", {
      method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form),
    });
    if (res.ok) { toast.success("Reservation created"); onSuccess(); }
    else toast.error("Failed to create reservation");
    setLoading(false);
  };

  return (
    <>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/60 z-40" onClick={onClose} />
      <motion.div initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }} transition={{ type: "spring", damping: 30, stiffness: 300 }}
        className="fixed right-0 top-0 h-full w-[420px] bg-[#111111] border-l border-white/10 z-50 overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-bold text-white">New Reservation</h2>
            <button onClick={onClose} className="p-2 rounded-lg hover:bg-white/5 text-white/50 hover:text-white transition-all"><X size={18} /></button>
          </div>
          <form onSubmit={submit} className="space-y-4">
            {[
              { label: "Guest Name", key: "guestName", type: "text", required: true },
              { label: "Phone", key: "phone", type: "tel", required: true },
              { label: "Email", key: "email", type: "email", required: false },
              { label: "Date", key: "date", type: "date", required: true },
            ].map(({ label, key, type, required }) => (
              <div key={key}>
                <label className="text-xs text-white/40 uppercase tracking-widest block mb-1.5">{label}</label>
                <input type={type} required={required} value={(form as any)[key]}
                  onChange={(e) => setForm((f) => ({ ...f, [key]: e.target.value }))}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white outline-none focus:border-[#C9A84C]/50" />
              </div>
            ))}
            <div>
              <label className="text-xs text-white/40 uppercase tracking-widest block mb-1.5">Time Slot</label>
              <select value={form.timeSlot} onChange={(e) => setForm((f) => ({ ...f, timeSlot: e.target.value }))}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white outline-none focus:border-[#C9A84C]/50">
                {["12:00 PM", "1:00 PM", "2:00 PM", "6:00 PM", "7:00 PM", "8:00 PM", "9:00 PM"].map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
            <div>
              <label className="text-xs text-white/40 uppercase tracking-widest block mb-1.5">Guests</label>
              <input type="number" min="1" max="20" value={form.guests} onChange={(e) => setForm((f) => ({ ...f, guests: e.target.value }))}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white outline-none focus:border-[#C9A84C]/50" />
            </div>
            <div>
              <label className="text-xs text-white/40 uppercase tracking-widest block mb-1.5">Table</label>
              <select value={form.tableId} onChange={(e) => setForm((f) => ({ ...f, tableId: e.target.value }))} required
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white outline-none focus:border-[#C9A84C]/50">
                <option value="">Select table</option>
                {(tables || []).map((t: any) => <option key={t.id} value={t.id}>Table {t.tableNumber} (cap. {t.capacity})</option>)}
              </select>
            </div>
            <div>
              <label className="text-xs text-white/40 uppercase tracking-widest block mb-1.5">Special Requests</label>
              <textarea value={form.specialRequests} onChange={(e) => setForm((f) => ({ ...f, specialRequests: e.target.value }))}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white outline-none focus:border-[#C9A84C]/50 h-20 resize-none" />
            </div>
            <button type="submit" disabled={loading}
              className="w-full bg-[#C9A84C] hover:bg-[#D4AF37] text-black font-bold py-3 rounded-xl transition-all disabled:opacity-50">
              {loading ? "Creating..." : "Create Reservation"}
            </button>
          </form>
        </div>
      </motion.div>
    </>
  );
}
