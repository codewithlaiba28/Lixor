"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard, CalendarDays, ShoppingBag, Grid3X3,
  UtensilsCrossed, ClipboardList, Bell, RefreshCw,
  ChevronLeft, Menu, X, ExternalLink, Lock, Eye, EyeOff, LogOut,
} from "lucide-react";

const NAV = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/reservations", label: "Reservations", icon: CalendarDays },
  { href: "/admin/orders", label: "Orders", icon: ShoppingBag },
  { href: "/admin/tables", label: "Tables", icon: Grid3X3 },
  { href: "/admin/menu", label: "Menu", icon: UtensilsCrossed },
  { href: "/admin/combined", label: "Pre-orders", icon: ClipboardList },
];

// ─── Login Screen ─────────────────────────────────────────────────────────────
function LoginScreen({ onSuccess }: { onSuccess: () => void }) {
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const res = await fetch("/api/admin/auth", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });

    if (res.ok) {
      onSuccess();
    } else {
      setError("Incorrect password. Please try again.");
      setPassword("");
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-[#0A0A0A] flex items-center justify-center p-4">
      {/* Background glow */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#C9A84C]/5 rounded-full blur-[120px]" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 24, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
        className="relative w-full max-w-sm"
      >
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-br from-[#C9A84C] to-[#D4AF37] rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-2xl shadow-[#C9A84C]/20">
            <span className="font-serif font-bold text-black text-3xl">L</span>
          </div>
          <h1 className="text-2xl font-serif font-bold text-white">Lixor Admin</h1>
          <p className="text-sm text-white/40 mt-1">Enter your admin password to continue</p>
        </div>

        {/* Form */}
        <div className="bg-[#111111] border border-white/10 rounded-2xl p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-xs text-white/40 uppercase tracking-widest block mb-2">
                Admin Password
              </label>
              <div className="relative">
                <Lock size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/30" />
                <input
                  type={showPw ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter password..."
                  autoFocus
                  required
                  className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-10 py-3 text-sm text-white placeholder-white/20 outline-none focus:border-[#C9A84C]/60 transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowPw((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60 transition-colors"
                >
                  {showPw ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
            </div>

            <AnimatePresence>
              {error && (
                <motion.p
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="text-xs text-red-400 bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2"
                >
                  {error}
                </motion.p>
              )}
            </AnimatePresence>

            <button
              type="submit"
              disabled={loading || !password}
              className="w-full bg-[#C9A84C] hover:bg-[#D4AF37] disabled:opacity-40 text-black font-bold py-3 rounded-xl transition-all text-sm"
            >
              {loading ? "Verifying..." : "Access Dashboard"}
            </button>
          </form>
        </div>

        <p className="text-center text-xs text-white/20 mt-4">
          Session expires after 8 hours
        </p>
      </motion.div>
    </div>
  );
}

// ─── Main Shell ───────────────────────────────────────────────────────────────
export default function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [time, setTime] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [notifications] = useState(3);
  const [authenticated, setAuthenticated] = useState<boolean | null>(null); // null = checking

  // Check if already authenticated via cookie
  useEffect(() => {
    fetch("/api/admin/auth", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ password: "__check__" }) })
      .then(() => {
        // We can't read httpOnly cookies from JS — instead check by trying a protected route
        // Simple approach: try to hit /api/admin/stats and see if it works
        // Actually, just check the cookie existence via a dedicated check endpoint
      });

    // Better: check via a lightweight ping
    checkAuth();
  }, []);

  const checkAuth = async () => {
    // Try to access a protected admin API — if cookie is set it will work
    // We use a simple approach: store auth state in sessionStorage as a mirror
    const cached = sessionStorage.getItem("admin_authed");
    if (cached === "1") {
      setAuthenticated(true);
    } else {
      setAuthenticated(false);
    }
  };

  const handleLoginSuccess = () => {
    sessionStorage.setItem("admin_authed", "1");
    setAuthenticated(true);
  };

  const handleLogout = async () => {
    await fetch("/api/admin/auth", { method: "DELETE" });
    sessionStorage.removeItem("admin_authed");
    setAuthenticated(false);
  };

  // Live clock
  useEffect(() => {
    const tick = () => {
      setTime(
        new Date().toLocaleTimeString("en-US", {
          hour: "2-digit", minute: "2-digit", second: "2-digit",
        })
      );
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  // Still checking
  if (authenticated === null) {
    return (
      <div className="min-h-screen bg-[#0A0A0A] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-[#C9A84C] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  // Not authenticated — show login
  if (!authenticated) {
    return <LoginScreen onSuccess={handleLoginSuccess} />;
  }

  const isActive = (href: string) =>
    href === "/admin" ? pathname === "/admin" : pathname.startsWith(href);

  return (
    <div className="flex h-screen bg-[#0A0A0A] text-white overflow-hidden">
      {/* Sidebar */}
      <AnimatePresence initial={false}>
        {sidebarOpen && (
          <motion.aside
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: 240, opacity: 1 }}
            exit={{ width: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="flex-shrink-0 h-full bg-[#111111] border-r border-white/5 flex flex-col overflow-hidden"
          >
            {/* Logo */}
            <div className="px-6 py-6 border-b border-white/5">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 bg-gradient-to-br from-[#C9A84C] to-[#D4AF37] rounded-xl flex items-center justify-center">
                  <span className="font-serif font-bold text-black text-lg">L</span>
                </div>
                <div>
                  <p className="font-serif font-bold text-white text-base leading-none">Lixor</p>
                  <p className="text-[10px] text-[#C9A84C] uppercase tracking-widest font-bold">Admin</p>
                </div>
              </div>
            </div>

            {/* Nav */}
            <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
              {NAV.map(({ href, label, icon: Icon }) => (
                <Link
                  key={href}
                  href={href}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                    isActive(href)
                      ? "bg-[#C9A84C]/15 text-[#C9A84C] border border-[#C9A84C]/20"
                      : "text-white/50 hover:text-white hover:bg-white/5"
                  }`}
                >
                  <Icon size={17} />
                  <span className="whitespace-nowrap">{label}</span>
                  {isActive(href) && (
                    <motion.div
                      layoutId="activeNav"
                      className="ml-auto w-1.5 h-1.5 rounded-full bg-[#C9A84C]"
                    />
                  )}
                </Link>
              ))}
            </nav>

            {/* Bottom */}
            <div className="px-3 py-4 border-t border-white/5 space-y-1">
              <Link
                href="/"
                className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm text-white/40 hover:text-white/70 transition-all"
              >
                <ExternalLink size={16} />
                <span>Back to Website</span>
              </Link>
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm text-red-400/60 hover:text-red-400 hover:bg-red-500/5 transition-all"
              >
                <LogOut size={16} />
                <span>Logout</span>
              </button>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top bar */}
        <header className="h-16 bg-[#111111] border-b border-white/5 flex items-center justify-between px-6 flex-shrink-0">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSidebarOpen((v) => !v)}
              className="p-2 rounded-lg text-white/40 hover:text-white hover:bg-white/5 transition-all"
            >
              {sidebarOpen ? <ChevronLeft size={18} /> : <Menu size={18} />}
            </button>
            <p className="text-xs text-white/40 font-sans hidden sm:block">
              {new Date().toLocaleDateString("en-US", {
                weekday: "long", year: "numeric", month: "long", day: "numeric",
              })}
            </p>
          </div>

          <div className="flex items-center gap-4">
            <span className="font-mono text-sm text-[#C9A84C] tabular-nums">{time}</span>
            <button
              onClick={() => window.location.reload()}
              className="p-2 rounded-lg text-white/40 hover:text-white hover:bg-white/5 transition-all"
              title="Refresh"
            >
              <RefreshCw size={16} />
            </button>
            <button className="relative p-2 rounded-lg text-white/40 hover:text-white hover:bg-white/5 transition-all">
              <Bell size={16} />
              {notifications > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 bg-red-500 rounded-full text-[9px] font-bold flex items-center justify-center">
                  {notifications}
                </span>
              )}
            </button>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto bg-[#0A0A0A]">
          {children}
        </main>
      </div>
    </div>
  );
}
