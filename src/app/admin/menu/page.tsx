"use client";

import { useState } from "react";
import useSWR from "swr";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Plus, X, ToggleLeft, ToggleRight, Edit2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

const fetcher = (url: string) => fetch(url).then((r) => r.json());
const CATEGORIES = ["All", "Starters", "Main Course", "Desserts", "Drinks"];

type MenuItemForm = {
  name: string; description: string; price: number;
  category: string; imageUrl: string; isAvailable: boolean;
};

export default function MenuPage() {
  const [category, setCategory] = useState("All");
  const [search, setSearch] = useState("");
  const [editItem, setEditItem] = useState<any>(null);
  const [showAdd, setShowAdd] = useState(false);
  const [selected, setSelected] = useState<string[]>([]);

  const buildUrl = () => {
    const p = new URLSearchParams();
    if (category !== "All") p.set("category", category);
    if (search) p.set("search", search);
    return `/api/admin/menu?${p}`;
  };

  const { data: items, mutate, isLoading } = useSWR(buildUrl, fetcher);

  const toggleAvailability = async (item: any) => {
    await fetch(`/api/admin/menu/${item.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isAvailable: !item.isAvailable }),
    });
    toast.success(`${item.name} ${item.isAvailable ? "hidden" : "shown"}`);
    mutate();
  };

  const bulkToggle = async () => {
    await Promise.all(selected.map((id) => {
      const item = (items || []).find((i: any) => i.id === id);
      return fetch(`/api/admin/menu/${id}`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ isAvailable: false }) });
    }));
    toast.success(`${selected.length} items marked unavailable`);
    setSelected([]);
    mutate();
  };

  return (
    <div className="p-6 space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-serif font-bold text-white">Menu Manager</h1>
          <p className="text-sm text-white/40 mt-1">{(items || []).length} items</p>
        </div>
        <button onClick={() => setShowAdd(true)}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#C9A84C] hover:bg-[#D4AF37] text-black font-bold text-sm transition-all">
          <Plus size={15} /> Add Item
        </button>
      </div>

      {/* Category Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-1">
        {CATEGORIES.map((cat) => (
          <button key={cat} onClick={() => setCategory(cat)}
            className={`px-4 py-2 rounded-xl text-sm font-bold whitespace-nowrap transition-all ${
              category === cat ? "bg-[#C9A84C]/20 text-[#C9A84C] border border-[#C9A84C]/30" : "bg-white/5 text-white/50 hover:text-white hover:bg-white/10"
            }`}>
            {cat}
          </button>
        ))}
      </div>

      {/* Search */}
      <div className="relative max-w-sm">
        <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" />
        <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search items..."
          className="w-full bg-[#111111] border border-white/10 rounded-xl pl-9 pr-4 py-2.5 text-sm text-white placeholder-white/30 outline-none focus:border-[#C9A84C]/50" />
      </div>

      {/* Bulk action */}
      {selected.length > 0 && (
        <div className="flex items-center gap-3 px-4 py-3 bg-[#C9A84C]/10 border border-[#C9A84C]/20 rounded-xl">
          <span className="text-sm text-[#C9A84C] font-bold">{selected.length} selected</span>
          <button onClick={bulkToggle} className="px-3 py-1.5 rounded-lg bg-red-500/20 text-red-400 text-xs font-bold hover:bg-red-500/30 transition-all">Mark Unavailable</button>
          <button onClick={() => setSelected([])} className="ml-auto text-white/40 hover:text-white"><X size={16} /></button>
        </div>
      )}

      {/* Grid */}
      {isLoading ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {Array(10).fill(0).map((_, i) => <div key={i} className="h-64 bg-[#111111] rounded-2xl animate-pulse" />)}
        </div>
      ) : (items || []).length === 0 ? (
        <div className="py-20 text-center text-white/30">No items found</div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {(items || []).map((item: any) => (
            <motion.div key={item.id} layout
              className={`bg-[#111111] border rounded-2xl overflow-hidden transition-all ${
                selected.includes(item.id) ? "border-[#C9A84C]/50" : "border-white/5 hover:border-white/10"
              } ${!item.isAvailable ? "opacity-50" : ""}`}>
              {/* Checkbox */}
              <div className="relative">
                <div className="aspect-square overflow-hidden bg-white/5">
                  {item.imageUrl ? (
                    <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-white/20 text-4xl">🍽️</div>
                  )}
                </div>
                <div className="absolute top-2 left-2">
                  <input type="checkbox" className="accent-[#C9A84C] w-4 h-4"
                    checked={selected.includes(item.id)}
                    onChange={(e) => setSelected(e.target.checked ? [...selected, item.id] : selected.filter((s) => s !== item.id))} />
                </div>
                {!item.isAvailable && (
                  <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                    <span className="text-xs font-bold text-white/70 bg-black/60 px-2 py-1 rounded-lg">Unavailable</span>
                  </div>
                )}
              </div>
              <div className="p-3">
                <span className="text-[9px] text-[#C9A84C] font-bold uppercase tracking-widest">{item.category}</span>
                <p className="text-sm font-bold text-white mt-0.5 truncate">{item.name}</p>
                <p className="text-xs text-[#C9A84C] font-bold mt-1">PKR {item.price.toLocaleString()}</p>
                <div className="flex gap-2 mt-3">
                  <button onClick={() => setEditItem(item)}
                    className="flex-1 flex items-center justify-center gap-1 py-1.5 rounded-lg bg-white/5 text-white/50 hover:text-white hover:bg-white/10 text-xs transition-all">
                    <Edit2 size={12} /> Edit
                  </button>
                  <button onClick={() => toggleAvailability(item)}
                    className={`p-1.5 rounded-lg transition-all ${item.isAvailable ? "bg-green-500/10 text-green-400 hover:bg-green-500/20" : "bg-red-500/10 text-red-400 hover:bg-red-500/20"}`}>
                    {item.isAvailable ? <ToggleRight size={16} /> : <ToggleLeft size={16} />}
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Edit / Add Panel */}
      <AnimatePresence>
        {(editItem || showAdd) && (
          <MenuItemPanel
            item={editItem}
            onClose={() => { setEditItem(null); setShowAdd(false); }}
            onSuccess={() => { setEditItem(null); setShowAdd(false); mutate(); }}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

function MenuItemPanel({ item, onClose, onSuccess }: { item?: any; onClose: () => void; onSuccess: () => void }) {
  const { register, handleSubmit, formState: { errors } } = useForm<MenuItemForm>({
    defaultValues: item || { isAvailable: true, category: "Starters" },
  });
  const [loading, setLoading] = useState(false);

  const onSubmit = async (data: MenuItemForm) => {
    setLoading(true);
    const url = item ? `/api/admin/menu/${item.id}` : "/api/admin/menu";
    const method = item ? "PUT" : "POST";
    const res = await fetch(url, { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify({ ...data, price: parseFloat(String(data.price)) }) });
    if (res.ok) { toast.success(item ? "Item updated" : "Item created"); onSuccess(); }
    else toast.error("Failed");
    setLoading(false);
  };

  const deleteItem = async () => {
    if (!item || !confirm("Delete this item?")) return;
    await fetch(`/api/admin/menu/${item.id}`, { method: "DELETE" });
    toast.success("Item deleted");
    onSuccess();
  };

  return (
    <>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/60 z-40" onClick={onClose} />
      <motion.div initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }} transition={{ type: "spring", damping: 30, stiffness: 300 }}
        className="fixed right-0 top-0 h-full w-[420px] bg-[#111111] border-l border-white/10 z-50 overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-bold text-white">{item ? "Edit Item" : "Add Item"}</h2>
            <button onClick={onClose} className="p-2 rounded-lg hover:bg-white/5 text-white/50 hover:text-white transition-all"><X size={18} /></button>
          </div>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label className="text-xs text-white/40 uppercase tracking-widest block mb-1.5">Name *</label>
              <input {...register("name", { required: true })}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white outline-none focus:border-[#C9A84C]/50" />
              {errors.name && <p className="text-red-400 text-xs mt-1">Required</p>}
            </div>
            <div>
              <label className="text-xs text-white/40 uppercase tracking-widest block mb-1.5">Description</label>
              <textarea {...register("description")} rows={3}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white outline-none focus:border-[#C9A84C]/50 resize-none" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs text-white/40 uppercase tracking-widest block mb-1.5">Price (PKR) *</label>
                <input type="number" step="0.01" {...register("price", { required: true })}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white outline-none focus:border-[#C9A84C]/50" />
              </div>
              <div>
                <label className="text-xs text-white/40 uppercase tracking-widest block mb-1.5">Category *</label>
                <select {...register("category", { required: true })}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white outline-none focus:border-[#C9A84C]/50">
                  {["Starters", "Main Course", "Desserts", "Drinks"].map((c) => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
            </div>
            <div>
              <label className="text-xs text-white/40 uppercase tracking-widest block mb-1.5">Image URL</label>
              <input {...register("imageUrl")}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white outline-none focus:border-[#C9A84C]/50" />
            </div>
            <div className="flex items-center gap-3">
              <input type="checkbox" id="avail" {...register("isAvailable")} className="accent-[#C9A84C] w-4 h-4" />
              <label htmlFor="avail" className="text-sm text-white/70">Available on menu</label>
            </div>
            <div className="flex gap-3 pt-2">
              <button type="submit" disabled={loading}
                className="flex-1 bg-[#C9A84C] hover:bg-[#D4AF37] text-black font-bold py-3 rounded-xl transition-all disabled:opacity-50">
                {loading ? "Saving..." : item ? "Update" : "Create"}
              </button>
              {item && (
                <button type="button" onClick={deleteItem}
                  className="px-4 py-3 rounded-xl bg-red-500/20 text-red-400 hover:bg-red-500/30 font-bold transition-all">
                  Delete
                </button>
              )}
            </div>
          </form>
        </div>
      </motion.div>
    </>
  );
}
