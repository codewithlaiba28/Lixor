"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, ShoppingBag } from "lucide-react";
import { usePathname } from "next/navigation";
import { useCart } from "@/store/useCart";

function CartCount() {
  const [mounted, setMounted] = useState(false);
  const items = useCart((state) => state.items);
  
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted || items.length === 0) return null;

  return (
    <span className="absolute -top-1 -right-1 bg-[#FF5C00] text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
      {items.length}
    </span>
  );
}

const navLinks = [
  { name: "About", href: "/about" },
  { name: "Menu", href: "/menu" },
  { name: "Gallery", href: "/gallery" },
  { name: "Blog", href: "/blog" },
  { name: "Chef", href: "/chef" },
];

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] as const }}
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-500 ${
        isScrolled 
          ? "py-2 bg-white/80 backdrop-blur-xl border-b border-[#FF5C00]/10 shadow-lg" 
          : "py-4 bg-white border-b border-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-8 flex items-center justify-between">
        {/* Logo */}
        <div className="w-[150px]">
          <Link href="/" className="flex-shrink-0 group">
            <span className="text-[32px] font-serif font-medium tracking-tight text-[#1a1a1a] transition-colors group-hover:text-[#FF5C00]">
              Lixor
            </span>
          </Link>
        </div>

        {/* Desktop Links */}
        <div className="hidden md:flex flex-1 items-center justify-center gap-2">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.name}
                href={link.href}
                className={`group relative text-[15px] font-medium transition-all duration-300 px-5 py-2`}
              >
                <span className={`relative z-10 transition-colors ${isActive ? "text-[#FF5C00]" : "text-[#1a1a1a] group-hover:text-[#FF5C00]"}`}>
                  {link.name}
                </span>
                {/* Golden Dot / Underline effect */}
                <motion.div
                  className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 bg-[#FF5C00] rounded-full opacity-0"
                  initial={false}
                  animate={{ 
                    opacity: isActive ? 1 : 0,
                    scale: isActive ? 1 : 0 
                  }}
                  whileHover={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3 }}
                />
              </Link>
            );
          })}
        </div>

        {/* Action Buttons */}
        <div className="hidden md:flex items-center gap-6 w-auto">
          <Link href="/cart" className="relative p-2 text-[#1a1a1a] hover:text-[#FF5C00] transition-colors group">
            <ShoppingBag size={22} />
            <CartCount />
          </Link>
          
          <Link
            href="/book"
            className="group relative bg-[#FF5C00] hover:bg-[#E65200] text-white px-8 py-3.5 rounded-full text-[14px] font-bold transition-all shadow-xl shadow-orange-500/20 active:scale-95 overflow-hidden"
          >
            <span className="relative z-10 block overflow-hidden">
              <span className="block transition-transform duration-500 ease-[cubic-bezier(0.87,0,0.13,1)] group-hover:-translate-y-full">
                Book a table
              </span>
              <span className="absolute inset-0 block translate-y-full transition-transform duration-500 ease-[cubic-bezier(0.87,0,0.13,1)] group-hover:translate-y-0">
                Book a table
              </span>
            </span>
            {/* Shimmer Effect */}
            <div className="absolute inset-0 w-1/2 h-full bg-white/20 skew-x-[-25deg] -translate-x-full group-hover:translate-x-[200%] transition-transform duration-1000" />
          </Link>
        </div>

        {/* Mobile Toggle */}
        <button
          className="md:hidden p-2 text-[#1a1a1a] hover:text-[#FF5C00] transition-colors"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-white border-b border-black/5 overflow-hidden"
          >
            <div className="flex flex-col p-8 gap-6">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  className="text-lg font-medium text-[#1a1a1a] hover:text-[#FF5C00] transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {link.name}
                </Link>
              ))}
              <Link
                href="/book"
                className="bg-[#FF5C00] text-white text-center py-4 rounded-full font-bold shadow-lg shadow-orange-500/20 active:scale-95 transition-transform"
                onClick={() => setMobileMenuOpen(false)}
              >
                Book a table
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}
