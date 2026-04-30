"use client";

import { useState, useEffect } from "react";
import { getAllReservations, getAllOrders, updateReservationStatus, updateOrderStatus } from "@/app/actions/admin";
import { motion, AnimatePresence } from "framer-motion";
import { Calendar, Package, CheckCircle, Clock, Truck, ChevronRight } from "lucide-react";
import { toast } from "sonner";
import Navbar from "@/components/Navbar";

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState<"reservations" | "orders">("reservations");
  const [reservations, setReservations] = useState<any[]>([]);
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    const [resData, orderData] = await Promise.all([
      getAllReservations(),
      getAllOrders()
    ]);
    setReservations(resData);
    setOrders(orderData);
    setLoading(false);
  };

  const handleStatusUpdate = async (type: "reservation" | "order", id: string, status: string) => {
    if (type === "reservation") {
      await updateReservationStatus(id, status);
      toast.success("Reservation updated");
    } else {
      await updateOrderStatus(id, status);
      toast.success("Order updated");
    }
    fetchData();
  };

  return (
    <main className="bg-white min-h-screen">
      <Navbar />
      
      <div className="pt-32 pb-24 px-6 max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
          <div>
            <h1 className="text-4xl font-serif font-medium text-[#1A1A1A]">Admin Dashboard</h1>
            <p className="text-[#666] font-sans">Manage your restaurant operations in real-time.</p>
          </div>
          
          <div className="flex bg-neutral-100 p-1 rounded-2xl">
            <button 
              onClick={() => setActiveTab("reservations")}
              className={`px-6 py-2.5 rounded-xl text-sm font-bold transition-all flex items-center gap-2 ${activeTab === "reservations" ? "bg-white text-[#FF5C00] shadow-sm" : "text-[#999] hover:text-[#1A1A1A]"}`}
            >
              <Calendar size={18} />
              Reservations
            </button>
            <button 
              onClick={() => setActiveTab("orders")}
              className={`px-6 py-2.5 rounded-xl text-sm font-bold transition-all flex items-center gap-2 ${activeTab === "orders" ? "bg-white text-[#FF5C00] shadow-sm" : "text-[#999] hover:text-[#1A1A1A]"}`}
            >
              <Package size={18} />
              Orders
            </button>
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="w-8 h-8 border-4 border-[#FF5C00] border-t-transparent rounded-full animate-spin" />
          </div>
        ) : (
          <AnimatePresence mode="wait">
            {activeTab === "reservations" ? (
              <motion.div
                key="res"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="bg-white border border-neutral-100 rounded-[32px] overflow-hidden shadow-xl shadow-black/[0.02]"
              >
                <div className="overflow-x-auto">
                  <table className="w-full text-left font-sans">
                    <thead>
                      <tr className="bg-neutral-50 text-[11px] uppercase tracking-widest text-neutral-500 font-bold">
                        <th className="px-8 py-5">Guest</th>
                        <th className="px-8 py-5">Details</th>
                        <th className="px-8 py-5">Table</th>
                        <th className="px-8 py-5">Status</th>
                        <th className="px-8 py-5">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-neutral-50">
                      {reservations.map((res) => (
                        <tr key={res.id} className="hover:bg-neutral-50/50 transition-colors">
                          <td className="px-8 py-6">
                            <div className="font-bold text-[#1A1A1A]">{res.guestName}</div>
                            <div className="text-[12px] text-neutral-400">{res.email}</div>
                          </td>
                          <td className="px-8 py-6">
                            <div className="text-sm font-medium">{new Date(res.date).toLocaleDateString()}</div>
                            <div className="text-[#FF5C00] font-bold text-[12px]">{res.timeSlot} • {res.guests} Guests</div>
                          </td>
                          <td className="px-8 py-6">
                            <div className="w-10 h-10 bg-neutral-100 rounded-xl flex items-center justify-center font-bold text-[#1A1A1A]">
                              {res.table.tableNumber}
                            </div>
                          </td>
                          <td className="px-8 py-6">
                            <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                              res.status === 'Confirmed' ? 'bg-green-100 text-green-600' : 
                              res.status === 'Cancelled' ? 'bg-red-100 text-red-600' : 'bg-orange-100 text-orange-600'
                            }`}>
                              {res.status}
                            </span>
                          </td>
                          <td className="px-8 py-6">
                            <select 
                              onChange={(e) => handleStatusUpdate("reservation", res.id, e.target.value)}
                              value={res.status}
                              className="bg-neutral-100 border-none rounded-lg text-[12px] font-bold p-2 outline-none focus:ring-2 focus:ring-[#FF5C00]/20"
                            >
                              <option value="Pending">Pending</option>
                              <option value="Confirmed">Confirm</option>
                              <option value="Cancelled">Cancel</option>
                            </select>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  {reservations.length === 0 && <div className="p-12 text-center text-neutral-400">No reservations found.</div>}
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="orders"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="bg-white border border-neutral-100 rounded-[32px] overflow-hidden shadow-xl shadow-black/[0.02]"
              >
                <div className="overflow-x-auto">
                  <table className="w-full text-left font-sans">
                    <thead>
                      <tr className="bg-neutral-50 text-[11px] uppercase tracking-widest text-neutral-500 font-bold">
                        <th className="px-8 py-5">Customer</th>
                        <th className="px-8 py-5">Items</th>
                        <th className="px-8 py-5">Total</th>
                        <th className="px-8 py-5">Status</th>
                        <th className="px-8 py-5">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-neutral-50">
                      {orders.map((order) => (
                        <tr key={order.id} className="hover:bg-neutral-50/50 transition-colors">
                          <td className="px-8 py-6">
                            <div className="font-bold text-[#1A1A1A]">{order.customerName}</div>
                            <div className="text-[12px] text-neutral-400">{order.phone}</div>
                            <div className="text-[11px] text-neutral-300 truncate max-w-[200px]">{order.address}</div>
                          </td>
                          <td className="px-8 py-6">
                            <div className="flex flex-col gap-1">
                              {order.items.map((item: any, idx: number) => (
                                <div key={idx} className="text-[12px] text-neutral-600">
                                  {item.quantity}x {item.menuItem.name}
                                </div>
                              ))}
                            </div>
                          </td>
                          <td className="px-8 py-6 font-bold text-[#FF5C00]">
                            PKR {order.totalAmount.toLocaleString()}
                          </td>
                          <td className="px-8 py-6">
                            <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                              order.status === 'Delivered' ? 'bg-green-100 text-green-600' : 
                              order.status === 'Preparing' ? 'bg-blue-100 text-blue-600' : 
                              order.status === 'Out for Delivery' ? 'bg-purple-100 text-purple-600' : 'bg-orange-100 text-orange-600'
                            }`}>
                              {order.status}
                            </span>
                          </td>
                          <td className="px-8 py-6">
                            <select 
                              onChange={(e) => handleStatusUpdate("order", order.id, e.target.value)}
                              value={order.status}
                              className="bg-neutral-100 border-none rounded-lg text-[12px] font-bold p-2 outline-none focus:ring-2 focus:ring-[#FF5C00]/20"
                            >
                              <option value="Pending">Pending</option>
                              <option value="Preparing">Preparing</option>
                              <option value="Out for Delivery">Out for Delivery</option>
                              <option value="Delivered">Delivered</option>
                            </select>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  {orders.length === 0 && <div className="p-12 text-center text-neutral-400">No orders found.</div>}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        )}
      </div>
    </main>
  );
}
