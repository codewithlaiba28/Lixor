"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { getTables, checkAvailability, createBooking } from "@/app/actions/booking";
import { getMenuItems } from "@/app/actions/order";
import TableGrid from "@/components/TableGrid";
import { Calendar, Clock, Users, ArrowRight, Check, Plus, Minus, Info } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useSession } from "@/lib/auth-client";

const TIME_SLOTS = ["12:00 PM", "1:00 PM", "2:00 PM", "6:00 PM", "7:00 PM", "8:00 PM", "9:00 PM"];

export default function BookPage() {
  const router = useRouter();
  const [tables, setTables] = useState<any[]>([]);
  const [menuItems, setMenuItems] = useState<any[]>([]);
  const [bookedTableIds, setBookedTableIds] = useState<string[]>([]);
  const [isChecking, setIsChecking] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { data: session } = useSession();

  // Form State
  const [formData, setFormData] = useState({
    guestName: "",
    phone: "",
    email: "",
    date: new Date().toISOString().split('T')[0],
    timeSlot: "7:00 PM",
    guests: "2",
    tableId: "",
    specialRequests: "",
  });

  const [preOrderItems, setPreOrderItems] = useState<any[]>([]);

  useEffect(() => {
    async function init() {
      const [tData, mData] = await Promise.all([getTables(), getMenuItems()]);
      setTables(tData);
      setMenuItems(mData);
    }
    init();
  }, []);

  useEffect(() => {
    if (session?.user) {
      setFormData(prev => ({
        ...prev,
        guestName: session.user.name || "",
        email: session.user.email || "",
      }));
    }
  }, [session]);

  useEffect(() => {
    async function updateAvailability() {
      if (formData.date && formData.timeSlot) {
        setIsChecking(true);
        const booked = await checkAvailability(formData.date, formData.timeSlot);
        setBookedTableIds(booked);
        // Deselect table if it's now booked
        if (booked.includes(formData.tableId)) {
          setFormData(prev => ({ ...prev, tableId: "" }));
        }
        setIsChecking(false);
      }
    }
    updateAvailability();
  }, [formData.date, formData.timeSlot]);

  const togglePreOrderItem = (item: any) => {
    const existing = preOrderItems.find(i => i.id === item.id);
    if (existing) {
      setPreOrderItems(prev => prev.filter(i => i.id !== item.id));
    } else {
      setPreOrderItems(prev => [...prev, { ...item, quantity: 1 }]);
    }
  };

  const updatePreOrderQuantity = (id: string, q: number) => {
    if (q <= 0) {
      setPreOrderItems(prev => prev.filter(i => i.id !== id));
      return;
    }
    setPreOrderItems(prev => prev.map(i => i.id === id ? { ...i, quantity: q } : i));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.tableId) {
      toast.error("Please select a table first");
      return;
    }

    setIsSubmitting(true);
    const result = await createBooking({
      ...formData,
      preOrderItems,
      userId: session?.user?.id
    });

    if (result.success) {
      toast.success("Reservation confirmed!");
      router.push("/confirmation");
    } else {
      toast.error(result.error || "Something went wrong");
    }
    setIsSubmitting(false);
  };

  return (
    <main className="bg-white min-h-screen">
      <Navbar />

      <section className="pt-32 pb-24 px-6 max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <motion.span 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-[#FF5C00] font-sans font-bold text-[11px] tracking-[0.25em] uppercase mb-4 block"
          >
            EXPERIENCE EXCELLENCE
          </motion.span>
          <motion.h1 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-[56px] font-serif font-medium text-[#1A1A1A] leading-tight"
          >
            Book your table at Lixor
          </motion.h1>
        </div>

        <div className="flex flex-col lg:flex-row gap-16">
          {/* Main Booking Panel */}
          <div className="flex-1 space-y-12">
            
            {/* Step 1: Date & Time */}
            <div className="bg-neutral-50 p-8 rounded-[32px] border border-neutral-100">
              <h2 className="text-2xl font-serif text-[#1A1A1A] mb-8 flex items-center gap-3">
                <span className="w-8 h-8 bg-[#FF5C00] text-white rounded-full flex items-center justify-center text-sm">1</span>
                Schedule your visit
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-3">
                  <label className="text-[11px] font-bold text-neutral-400 uppercase tracking-widest flex items-center gap-2">
                    <Calendar size={14} /> Pick Date
                  </label>
                  <input 
                    type="date" 
                    min={new Date().toISOString().split('T')[0]}
                    value={formData.date}
                    onChange={(e) => setFormData(prev => ({ ...prev, date: e.target.value }))}
                    className="w-full bg-white border border-neutral-200 rounded-2xl px-6 py-4 text-[#1A1A1A] outline-none focus:border-[#FF5C00] transition-colors"
                  />
                </div>

                <div className="space-y-3">
                  <label className="text-[11px] font-bold text-neutral-400 uppercase tracking-widest flex items-center gap-2">
                    <Clock size={14} /> Time Slot
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {TIME_SLOTS.map((slot) => (
                      <button
                        key={slot}
                        type="button"
                        onClick={() => setFormData(prev => ({ ...prev, timeSlot: slot }))}
                        className={`px-4 py-2 rounded-xl text-[12px] font-bold border transition-all ${
                          formData.timeSlot === slot 
                            ? "bg-[#FF5C00] border-[#FF5C00] text-white shadow-lg shadow-orange-500/20" 
                            : "bg-white border-neutral-200 text-[#666] hover:border-[#FF5C00]/30"
                        }`}
                      >
                        {slot}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Step 2: Table Selection */}
            <div className="space-y-8">
              <h2 className="text-2xl font-serif text-[#1A1A1A] flex items-center gap-3 px-2">
                <span className="w-8 h-8 bg-[#FF5C00] text-white rounded-full flex items-center justify-center text-sm">2</span>
                Choose your table
              </h2>

              {isChecking ? (
                <div className="py-12 text-center text-neutral-400 flex flex-col items-center gap-4">
                  <div className="w-6 h-6 border-2 border-[#FF5C00] border-t-transparent rounded-full animate-spin" />
                  Checking table availability...
                </div>
              ) : (
                <TableGrid 
                  tables={tables}
                  bookedTableIds={bookedTableIds}
                  selectedTableId={formData.tableId}
                  onSelect={(id) => setFormData(prev => ({ ...prev, tableId: id }))}
                />
              )}
            </div>

            {/* Step 3: Pre-order Food (Unified Flow) */}
            <div className="bg-neutral-50 p-8 rounded-[32px] border border-neutral-100">
              <h2 className="text-2xl font-serif text-[#1A1A1A] mb-4 flex items-center gap-3">
                <span className="w-8 h-8 bg-[#FF5C00] text-white rounded-full flex items-center justify-center text-sm">3</span>
                Pre-order your meal <span className="text-sm font-sans text-neutral-400 font-normal">(Optional)</span>
              </h2>
              <p className="text-sm text-neutral-500 mb-8 px-11">Skip the wait! Select your favorite dishes now and we'll have them ready shortly after you arrive.</p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                {menuItems.map((item) => {
                  const isSelected = preOrderItems.find(i => i.id === item.id);
                  return (
                    <div 
                      key={item.id}
                      onClick={() => togglePreOrderItem(item)}
                      className={`group cursor-pointer p-3 rounded-2xl border transition-all flex items-center gap-4 ${
                        isSelected ? "bg-white border-[#FF5C00] shadow-sm" : "bg-white/50 border-neutral-100 hover:border-[#FF5C00]/20"
                      }`}
                    >
                      <div className="w-16 h-16 rounded-xl overflow-hidden flex-shrink-0">
                        <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="text-[14px] font-bold text-[#1A1A1A] truncate">{item.name}</h4>
                        <p className="text-[11px] text-[#FF5C00] font-bold">PKR {item.price.toLocaleString()}</p>
                      </div>
                      <div className={`w-6 h-6 rounded-full flex items-center justify-center transition-colors ${
                        isSelected ? "bg-[#FF5C00] text-white" : "bg-neutral-100 text-neutral-300"
                      }`}>
                        {isSelected ? <Check size={14} /> : <Plus size={14} />}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Checkout Panel */}
          <div className="w-full lg:w-[400px]">
            <div className="bg-[#1A1A1A] text-white p-8 rounded-[40px] shadow-2xl sticky top-32">
              <h3 className="text-2xl font-serif mb-8">Confirm Reservation</h3>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-neutral-500 uppercase tracking-[0.2em]">Contact Details</label>
                    <input 
                      required 
                      type="text" 
                      placeholder="Full Name" 
                      value={formData.guestName}
                      onChange={(e) => setFormData(prev => ({ ...prev, guestName: e.target.value }))}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-5 py-4 text-sm focus:border-[#FF5C00] outline-none transition-colors" 
                    />
                    <div className="grid grid-cols-2 gap-4">
                      <input 
                        required 
                        type="tel" 
                        placeholder="Phone" 
                        value={formData.phone}
                        onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-5 py-4 text-sm focus:border-[#FF5C00] outline-none transition-colors" 
                      />
                      <select
                        value={formData.guests}
                        onChange={(e) => setFormData(prev => ({ ...prev, guests: e.target.value }))}
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-5 py-4 text-sm focus:border-[#FF5C00] outline-none transition-colors"
                      >
                        {[1,2,3,4,5,6,7,8].map(n => <option key={n} value={n} className="bg-[#1A1A1A]">{n} Guests</option>)}
                      </select>
                    </div>
                    <input 
                      required 
                      type="email" 
                      placeholder="Email Address" 
                      value={formData.email}
                      onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-5 py-4 text-sm focus:border-[#FF5C00] outline-none transition-colors" 
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-neutral-500 uppercase tracking-[0.2em]">Summary</label>
                    <div className="bg-white/5 rounded-2xl p-5 space-y-3">
                      <div className="flex justify-between text-sm">
                        <span className="text-neutral-400">Date & Time</span>
                        <span className="font-bold">{formData.date} at {formData.timeSlot}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-neutral-400">Table No.</span>
                        <span className="font-bold text-[#FF5C00]">
                          {formData.tableId ? tables.find(t => t.id === formData.tableId)?.tableNumber : "Not Selected"}
                        </span>
                      </div>
                      {preOrderItems.length > 0 && (
                        <div className="pt-3 border-t border-white/10 space-y-2">
                          <div className="text-[10px] text-neutral-500 uppercase">Pre-ordered Food:</div>
                          {preOrderItems.map(item => (
                            <div key={item.id} className="flex justify-between text-[12px]">
                              <span>{item.quantity}x {item.name}</span>
                              <span className="text-neutral-400">PKR {(item.price * item.quantity).toLocaleString()}</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <button 
                  disabled={isSubmitting || !formData.tableId}
                  className="w-full bg-[#FF5C00] hover:bg-[#E65200] disabled:bg-neutral-800 disabled:text-neutral-500 py-5 rounded-2xl font-bold transition-all flex items-center justify-center gap-2 group shadow-xl shadow-orange-500/10"
                >
                  {isSubmitting ? "Processing..." : "Complete Booking"}
                  {!isSubmitting && <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />}
                </button>
                
                <p className="text-[10px] text-center text-neutral-500 flex items-center justify-center gap-2">
                  <Info size={12} />
                  No payment required now. Pay at restaurant.
                </p>
              </form>
            </div>
          </div>
        </div>
      </section>

      <Footer />
      
      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #f1f1f1;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #FF5C00;
          border-radius: 10px;
        }
      `}</style>
    </main>
  );
}
