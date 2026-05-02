"use client";

import { useState } from "react";
import useSWR from "swr";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, X, Users, Edit2, Power } from "lucide-react";
import { toast } from "sonner";

const fetcher = (url: string) => fetch(url).then((r) => r.json());

const TIME_SLOTS = ["12:00 PM", "1:00 PM", "2:00 PM", "6:00 PM", "7:00 PM", "8:00 PM", "9:00 PM"];

export default function TablesPage() {
  const { data: tables, mutate, isLoading } = useSWR("/api/admin/tables", fetcher, { refreshInterval: 30000 });
  const [selectedTable, setSelectedTable] = useState<any>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editTable, setEditTable] = useState<any>(null);

  const toggleActive = async (table: any) => {
    await fetch(`/api/admin/tables/${table.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isActive: !table.isActive }),
    });
    toast.success(`Table ${table.tableNumber} ${table.isActive ? "deactivated" : "activated"}`);
    mutate();
  };

  const getTableStatus = (table: any) => {
    if (!table.isActive) return "unavailable";
    if (table.reservations?.length > 0) return "booked";
    return "available";
  };

  const statusConfig = {
    available: { label: "Available", color: "border-green-500/40 bg-green-500/10", glow: "shadow-green-500/20", dot: "bg-green-400" },
    booked: { label: "Booked", color: "border-[#C9A84C]/40 bg-[#C9A84C]/10", glow: "shadow-[#C9A84C]/20", dot: "bg-[#C9A84C]" },
    unavailable: { label: "Unavailable", color: "border-white/10 bg-white/5", glow: "", dot: "bg-white/20" },
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-serif font-bold text-white">Tables</h1>
          <p className="text-sm text-white/40 mt-1">{(tables || []).length} tables total</p>
        </div>
        <button onClick={() => setShowAddForm(true)}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#C9A84C] hover:bg-[#D4AF37] text-black font-bold text-sm transition-all">
          <Plus size={15} /> Add Table
        </button>
      </div>

      {/* Legend */}
      <div className="flex gap-4">
        {Object.entries(statusConfig).map(([key, cfg]) => (
          <div key={key} className="flex items-center gap-2">
            <span className={`w-2.5 h-2.5 rounded-full ${cfg.dot}`} />
            <span className="text-xs text-white/50">{cfg.label}</span>
          </div>
        ))}
      </div>

      {/* Floor Plan Grid */}
      {isLoading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {Array(10).fill(0).map((_, i) => <div key={i} className="h-36 bg-[#111111] rounded-2xl animate-pulse" />)}
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {(tables || []).map((table: any) => {
            const st = getTableStatus(table);
            const cfg = statusConfig[st as keyof typeof statusConfig];
            return (
              <motion.div
                key={table.id}
                whileHover={{ scale: 1.02 }}
                onClick={() => setSelectedTable(table)}
                className={`relative border rounded-2xl p-4 cursor-pointer transition-all shadow-lg ${cfg.color} ${cfg.glow}`}
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="text-2xl font-serif font-bold text-white">{table.tableNumber}</span>
                  <span className={`w-2.5 h-2.5 rounded-full ${cfg.dot} ${st === "available" ? "animate-pulse" : ""}`} />
                </div>
                <div className="flex items-center gap-1.5 text-white/50 text-xs mb-2">
                  <Users size={12} />
                  <span>Cap. {table.capacity}</span>
                </div>
                <span className={`text-[10px] font-bold uppercase tracking-wider ${
                  st === "available" ? "text-green-400" : st === "booked" ? "text-[#C9A84C]" : "text-white/30"
                }`}>{cfg.label}</span>
                {table.reservations?.length > 0 && (
                  <div className="mt-2 text-[10px] text-white/40">
                    {table.reservations.length} booking{table.reservations.length > 1 ? "s" : ""} today
                  </div>
                )}
              </motion.div>
            );
          })}
        </div>
      )}

      {/* Table List */}
      <div className="bg-[#111111] border border-white/5 rounded-2xl overflow-hidden">
        <div className="px-5 py-4 border-b border-white/5">
          <p className="text-sm font-bold text-white">Table List</p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-white/5">
                {["Table #", "Capacity", "Status", "Today's Bookings", "Next Slots", "Actions"].map((h) => (
                  <th key={h} className="px-5 py-3 text-[10px] uppercase tracking-widest text-white/30 font-bold whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.03]">
              {(tables || []).map((table: any) => {
                const st = getTableStatus(table);
                const nextSlots = TIME_SLOTS.slice(0, 3).map((slot) => {
                  const booked = table.reservations?.some((r: any) => r.timeSlot === slot);
                  return { slot, booked };
                });
                return (
                  <tr key={table.id} className="hover:bg-white/[0.02] transition-colors">
                    <td className="px-5 py-4"><span className="text-lg font-serif font-bold text-white">{table.tableNumber}</span></td>
                    <td className="px-5 py-4"><span className="text-sm text-white/70">{table.capacity} guests</span></td>
                    <td className="px-5 py-4">
                      <span className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full border ${
                        st === "available" ? "bg-green-500/20 text-green-400 border-green-500/30" :
                        st === "booked" ? "bg-[#C9A84C]/20 text-[#C9A84C] border-[#C9A84C]/30" :
                        "bg-white/5 text-white/30 border-white/10"
                      }`}>{statusConfig[st as keyof typeof statusConfig].label}</span>
                    </td>
                    <td className="px-5 py-4"><span className="text-sm text-white">{table.reservations?.length || 0}</span></td>
                    <td className="px-5 py-4">
                      <div className="flex gap-1.5">
                        {nextSlots.map(({ slot, booked }) => (
                          <span key={slot} className={`text-[9px] px-2 py-1 rounded-lg font-bold ${booked ? "bg-[#C9A84C]/20 text-[#C9A84C]" : "bg-green-500/10 text-green-400"}`}>
                            {slot.replace(" PM", "").replace(" AM", "")}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex gap-2">
                        <button onClick={() => setEditTable(table)} className="p-1.5 rounded-lg bg-white/5 text-white/50 hover:text-white hover:bg-white/10 transition-all"><Edit2 size={14} /></button>
                        <button onClick={() => toggleActive(table)} className={`p-1.5 rounded-lg transition-all ${table.isActive ? "bg-red-500/10 text-red-400 hover:bg-red-500/20" : "bg-green-500/10 text-green-400 hover:bg-green-500/20"}`}>
                          <Power size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Table Detail Panel */}
      <AnimatePresence>
        {selectedTable && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/60 z-40" onClick={() => setSelectedTable(null)} />
            <motion.div initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }} transition={{ type: "spring", damping: 30, stiffness: 300 }}
              className="fixed right-0 top-0 h-full w-[380px] bg-[#111111] border-l border-white/10 z-50 overflow-y-auto">
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-lg font-bold text-white">Table {selectedTable.tableNumber}</h2>
                  <button onClick={() => setSelectedTable(null)} className="p-2 rounded-lg hover:bg-white/5 text-white/50 hover:text-white transition-all"><X size={18} /></button>
                </div>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-white/5 rounded-xl p-3 text-center"><p className="text-xs text-white/40 mb-1">Capacity</p><p className="text-2xl font-bold text-white">{selectedTable.capacity}</p></div>
                    <div className="bg-white/5 rounded-xl p-3 text-center"><p className="text-xs text-white/40 mb-1">Today's Bookings</p><p className="text-2xl font-bold text-[#C9A84C]">{selectedTable.reservations?.length || 0}</p></div>
                  </div>
                  {selectedTable.reservations?.length > 0 && (
                    <div className="space-y-2">
                      <p className="text-xs text-white/40 uppercase tracking-widest">Today&apos;s Reservations</p>
                      {selectedTable.reservations.map((res: any) => (
                        <div key={res.id} className="bg-[#C9A84C]/10 border border-[#C9A84C]/20 rounded-xl p-3">
                          <div className="flex justify-between items-start">
                            <div>
                              <p className="text-sm font-bold text-white">{res.guestName}</p>
                              <p className="text-xs text-white/50">{res.phone}</p>
                            </div>
                            <span className="text-xs text-[#C9A84C] font-bold">{res.timeSlot}</span>
                          </div>
                          <p className="text-xs text-white/40 mt-1">{res.guests} guests</p>
                        </div>
                      ))}
                    </div>
                  )}
                  <button onClick={() => toggleActive(selectedTable)}
                    className={`w-full py-3 rounded-xl font-bold text-sm transition-all ${selectedTable.isActive ? "bg-red-500/20 text-red-400 hover:bg-red-500/30" : "bg-green-500/20 text-green-400 hover:bg-green-500/30"}`}>
                    {selectedTable.isActive ? "Mark as Unavailable" : "Mark as Available"}
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Add Table Form */}
      <AnimatePresence>
        {(showAddForm || editTable) && (
          <TableForm
            table={editTable}
            onClose={() => { setShowAddForm(false); setEditTable(null); }}
            onSuccess={() => { setShowAddForm(false); setEditTable(null); mutate(); }}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

function TableForm({ table, onClose, onSuccess }: { table?: any; onClose: () => void; onSuccess: () => void }) {
  const [form, setForm] = useState({ tableNumber: table?.tableNumber || "", capacity: table?.capacity || "" });
  const [loading, setLoading] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const url = table ? `/api/admin/tables/${table.id}` : "/api/admin/tables";
    const method = table ? "PUT" : "POST";
    const res = await fetch(url, { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify({ tableNumber: parseInt(form.tableNumber), capacity: parseInt(form.capacity) }) });
    if (res.ok) { toast.success(table ? "Table updated" : "Table added"); onSuccess(); }
    else toast.error("Failed");
    setLoading(false);
  };

  return (
    <>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/60 z-40" onClick={onClose} />
      <motion.div initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }} transition={{ type: "spring", damping: 30, stiffness: 300 }}
        className="fixed right-0 top-0 h-full w-[360px] bg-[#111111] border-l border-white/10 z-50">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-bold text-white">{table ? "Edit Table" : "Add Table"}</h2>
            <button onClick={onClose} className="p-2 rounded-lg hover:bg-white/5 text-white/50 hover:text-white transition-all"><X size={18} /></button>
          </div>
          <form onSubmit={submit} className="space-y-4">
            <div>
              <label className="text-xs text-white/40 uppercase tracking-widest block mb-1.5">Table Number</label>
              <input type="number" required value={form.tableNumber} onChange={(e) => setForm((f) => ({ ...f, tableNumber: e.target.value }))}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white outline-none focus:border-[#C9A84C]/50" />
            </div>
            <div>
              <label className="text-xs text-white/40 uppercase tracking-widest block mb-1.5">Capacity</label>
              <input type="number" required value={form.capacity} onChange={(e) => setForm((f) => ({ ...f, capacity: e.target.value }))}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white outline-none focus:border-[#C9A84C]/50" />
            </div>
            <button type="submit" disabled={loading} className="w-full bg-[#C9A84C] hover:bg-[#D4AF37] text-black font-bold py-3 rounded-xl transition-all disabled:opacity-50">
              {loading ? "Saving..." : table ? "Update Table" : "Add Table"}
            </button>
          </form>
        </div>
      </motion.div>
    </>
  );
}
