"use client";

import useSWR from "swr";
import {
  BarChart, Bar, LineChart, Line, PieChart, Pie, Cell,
  XAxis, YAxis, Tooltip, ResponsiveContainer,
} from "recharts";
import {
  CalendarDays, ShoppingBag, Grid3X3, DollarSign,
  TrendingUp, AlertCircle, ArrowUp, ArrowDown,
} from "lucide-react";
import { motion } from "framer-motion";

const fetcher = (url: string) => fetch(url).then((r) => r.json());

const STATUS_COLORS: Record<string, string> = {
  Pending: "bg-amber-500/20 text-amber-400 border-amber-500/30",
  Preparing: "bg-blue-500/20 text-blue-400 border-blue-500/30",
  "Out for Delivery": "bg-purple-500/20 text-purple-400 border-purple-500/30",
  Delivered: "bg-green-500/20 text-green-400 border-green-500/30",
  Cancelled: "bg-red-500/20 text-red-400 border-red-500/30",
  Confirmed: "bg-green-500/20 text-green-400 border-green-500/30",
  Seated: "bg-blue-500/20 text-blue-400 border-blue-500/30",
  Completed: "bg-gray-500/20 text-gray-400 border-gray-500/30",
  "No-show": "bg-red-500/20 text-red-400 border-red-500/30",
};

const GOLD = "#C9A84C";
const CHART_COLORS = [GOLD, "#60A5FA", "#A78BFA", "#34D399"];

function StatCard({
  icon: Icon, label, value, sub, subUp, accent,
}: {
  icon: any; label: string; value: string | number; sub?: string; subUp?: boolean; accent?: boolean;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      className={`bg-[#111111] border rounded-2xl p-5 flex flex-col gap-3 ${
        accent ? "border-[#C9A84C]/30" : "border-white/5"
      }`}
    >
      <div className="flex items-center justify-between">
        <span className="text-xs text-white/40 font-sans uppercase tracking-widest">{label}</span>
        <div className={`p-2 rounded-xl ${accent ? "bg-[#C9A84C]/15" : "bg-white/5"}`}>
          <Icon size={16} className={accent ? "text-[#C9A84C]" : "text-white/50"} />
        </div>
      </div>
      <p className="text-3xl font-bold font-sans text-white">{value}</p>
      {sub && (
        <p className={`text-xs flex items-center gap-1 ${subUp ? "text-green-400" : "text-red-400"}`}>
          {subUp ? <ArrowUp size={12} /> : <ArrowDown size={12} />}
          {sub}
        </p>
      )}
    </motion.div>
  );
}

function StatusBadge({ status }: { status: string }) {
  return (
    <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border ${STATUS_COLORS[status] || "bg-white/10 text-white/50 border-white/10"}`}>
      {status}
    </span>
  );
}

export default function AdminDashboard() {
  const { data: stats, isLoading: statsLoading } = useSWR("/api/admin/stats", fetcher, { refreshInterval: 30000 });
  const { data: ordersData, isLoading: ordersLoading } = useSWR(
    "/api/admin/orders?limit=10", fetcher, { refreshInterval: 30000 }
  );
  const { data: resData, isLoading: resLoading } = useSWR(() => {
    const today = new Date().toISOString().split("T")[0];
    return `/api/admin/reservations?date=${today}&limit=20`;
  }, fetcher, { refreshInterval: 30000 });

  const orders = ordersData?.orders || [];
  const reservations = resData?.reservations || [];

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-serif font-bold text-white">Dashboard</h1>
        <p className="text-sm text-white/40 mt-1">Live overview of restaurant operations</p>
      </div>

      {/* Stat Cards */}
      {statsLoading ? (
        <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
          {Array(6).fill(0).map((_, i) => (
            <div key={i} className="bg-[#111111] border border-white/5 rounded-2xl p-5 h-32 animate-pulse" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
          <StatCard
            icon={CalendarDays} label="Reservations Today"
            value={stats?.reservationsToday ?? 0}
            sub={`vs ${stats?.reservationsYesterday ?? 0} yesterday`}
            subUp={(stats?.reservationsToday ?? 0) >= (stats?.reservationsYesterday ?? 0)}
          />
          <StatCard
            icon={ShoppingBag} label="Active Orders"
            value={stats?.activeOrders ?? 0}
            accent
          />
          <StatCard
            icon={Grid3X3} label="Tables"
            value={`${stats?.tablesOccupied ?? 0} / ${stats?.tablesTotal ?? 0}`}
            sub="occupied today"
            subUp={false}
          />
          <StatCard
            icon={DollarSign} label="Revenue Today"
            value={`PKR ${(stats?.revenueToday ?? 0).toLocaleString()}`}
            accent
          />
          <StatCard
            icon={TrendingUp} label="Bookings This Week"
            value={stats?.reservationsWeek ?? 0}
          />
          <StatCard
            icon={AlertCircle} label="Pending Orders"
            value={stats?.pendingOrders ?? 0}
            accent={stats?.pendingOrders > 0}
          />
        </div>
      )}

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Orders per hour */}
        <div className="lg:col-span-2 bg-[#111111] border border-white/5 rounded-2xl p-5">
          <p className="text-sm font-bold text-white mb-4">Orders Per Hour (Today)</p>
          <ResponsiveContainer width="100%" height={180}>
            <LineChart data={stats?.ordersPerHourData || []}>
              <XAxis dataKey="hour" tick={{ fill: "#ffffff40", fontSize: 10 }} tickLine={false} axisLine={false} interval={3} />
              <YAxis tick={{ fill: "#ffffff40", fontSize: 10 }} tickLine={false} axisLine={false} />
              <Tooltip contentStyle={{ background: "#1a1a1a", border: "1px solid #ffffff10", borderRadius: 8, color: "#fff" }} />
              <Line type="monotone" dataKey="orders" stroke={GOLD} strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Order type donut */}
        <div className="bg-[#111111] border border-white/5 rounded-2xl p-5">
          <p className="text-sm font-bold text-white mb-4">Order Types (Today)</p>
          {stats?.orderTypeSplitData?.length > 0 ? (
            <>
              <ResponsiveContainer width="100%" height={140}>
                <PieChart>
                  <Pie data={stats.orderTypeSplitData} dataKey="count" nameKey="type" cx="50%" cy="50%" innerRadius={40} outerRadius={65}>
                    {stats.orderTypeSplitData.map((_: any, i: number) => (
                      <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ background: "#1a1a1a", border: "1px solid #ffffff10", borderRadius: 8, color: "#fff" }} />
                </PieChart>
              </ResponsiveContainer>
              <div className="flex flex-wrap gap-2 mt-2">
                {stats.orderTypeSplitData.map((t: any, i: number) => (
                  <div key={i} className="flex items-center gap-1.5 text-xs text-white/60">
                    <span className="w-2.5 h-2.5 rounded-full" style={{ background: CHART_COLORS[i % CHART_COLORS.length] }} />
                    {t.type} ({t.count})
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div className="h-40 flex items-center justify-center text-white/30 text-sm">No orders today</div>
          )}
        </div>

        {/* Bookings by day */}
        <div className="lg:col-span-3 bg-[#111111] border border-white/5 rounded-2xl p-5">
          <p className="text-sm font-bold text-white mb-4">Bookings This Week</p>
          <ResponsiveContainer width="100%" height={160}>
            <BarChart data={stats?.bookingsByDayData || []}>
              <XAxis dataKey="date" tick={{ fill: "#ffffff40", fontSize: 11 }} tickLine={false} axisLine={false} />
              <YAxis tick={{ fill: "#ffffff40", fontSize: 11 }} tickLine={false} axisLine={false} />
              <Tooltip contentStyle={{ background: "#1a1a1a", border: "1px solid #ffffff10", borderRadius: 8, color: "#fff" }} />
              <Bar dataKey="bookings" fill={GOLD} radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Live feeds */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {/* Live Orders */}
        <div className="bg-[#111111] border border-white/5 rounded-2xl overflow-hidden">
          <div className="px-5 py-4 border-b border-white/5 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
              <p className="text-sm font-bold text-white">Live Orders</p>
            </div>
            <span className="text-xs text-white/30">Auto-refreshes every 30s</span>
          </div>
          <div className="divide-y divide-white/5 max-h-[420px] overflow-y-auto">
            {ordersLoading ? (
              Array(4).fill(0).map((_, i) => (
                <div key={i} className="p-4 animate-pulse">
                  <div className="h-4 bg-white/5 rounded w-3/4 mb-2" />
                  <div className="h-3 bg-white/5 rounded w-1/2" />
                </div>
              ))
            ) : orders.length === 0 ? (
              <div className="p-8 text-center text-white/30 text-sm">No orders yet</div>
            ) : (
              orders.map((order: any) => (
                <div key={order.id} className="px-5 py-4 hover:bg-white/[0.02] transition-colors">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs text-[#C9A84C] font-mono font-bold">
                          #{order.id.slice(-6).toUpperCase()}
                        </span>
                        <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                          order.orderType === "Delivery"
                            ? "bg-blue-500/20 text-blue-400"
                            : "bg-purple-500/20 text-purple-400"
                        }`}>
                          {order.orderType}
                        </span>
                      </div>
                      <p className="text-sm font-bold text-white truncate">{order.customerName}</p>
                      <p className="text-xs text-white/40 mt-0.5 truncate">
                        {order.items.map((i: any) => `${i.quantity}x ${i.itemName || i.menuItem?.name || "Item"}`).join(", ")}
                      </p>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <StatusBadge status={order.status} />
                      <p className="text-xs text-[#C9A84C] font-bold mt-1.5">
                        PKR {order.totalAmount.toLocaleString()}
                      </p>
                      <p className="text-[10px] text-white/30 mt-0.5">
                        {new Date(order.createdAt).toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })}
                      </p>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Today's Reservations */}
        <div className="bg-[#111111] border border-white/5 rounded-2xl overflow-hidden">
          <div className="px-5 py-4 border-b border-white/5 flex items-center justify-between">
            <p className="text-sm font-bold text-white">Today&apos;s Reservations</p>
            <span className="text-xs text-white/30">
              {new Date().toLocaleDateString("en-US", { month: "short", day: "numeric" })}
            </span>
          </div>
          <div className="divide-y divide-white/5 max-h-[420px] overflow-y-auto">
            {resLoading ? (
              Array(4).fill(0).map((_, i) => (
                <div key={i} className="p-4 animate-pulse">
                  <div className="h-4 bg-white/5 rounded w-3/4 mb-2" />
                  <div className="h-3 bg-white/5 rounded w-1/2" />
                </div>
              ))
            ) : reservations.length === 0 ? (
              <div className="p-8 text-center text-white/30 text-sm">No reservations today</div>
            ) : (
              reservations.map((res: any) => (
                <div key={res.id} className="px-5 py-4 hover:bg-white/[0.02] transition-colors">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs text-[#C9A84C] font-mono font-bold">
                          #{res.id.slice(-6).toUpperCase()}
                        </span>
                        <span className="text-xs text-white/40">Table {res.table?.tableNumber}</span>
                      </div>
                      <p className="text-sm font-bold text-white">{res.guestName}</p>
                      <p className="text-xs text-white/40 mt-0.5">{res.guests} guests</p>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <StatusBadge status={res.status} />
                      <p className="text-xs text-[#C9A84C] font-bold mt-1.5">{res.timeSlot}</p>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
