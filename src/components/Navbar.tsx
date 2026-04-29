"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";
import { usePathname } from "next/navigation";

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
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
        isScrolled 
          ? "py-2 bg-white/90 backdrop-blur-md" 
          : "py-4 bg-white"
      }`}
    >
      <div className="max-w-7xl mx-auto px-8 flex items-center justify-between">
        {/* Logo - Fixed width to help centering */}
        <div className="w-[150px]">
          <Link href="/" className="flex-shrink-0">
            <span className="text-[32px] font-serif font-medium tracking-tight text-[#1a1a1a]">
              Lixor
            </span>
          </Link>
        </div>

        {/* Desktop Links - Centered */}
        <div className="hidden md:flex flex-1 items-center justify-center gap-2">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.name}
                href={link.href}
                className={`text-[15px] font-medium transition-all duration-300 px-4 py-2.5 rounded-full ${
                  isActive 
                    ? "text-[#1a1a1a] border border-black/5 bg-black/[0.02]" 
                    : "text-[#1a1a1a] hover:text-[#FF5C00]"
                }`}
              >
                {link.name}
              </Link>
            );
          })}
        </div>

        {/* Action Button - Fixed width matching logo area */}
        <div className="hidden md:flex w-[150px] justify-end">
          <Link
            href="/book"
            className="hidden md:flex group bg-[#FF5C00] hover:bg-[#E65200] text-white px-7 py-3 rounded-full text-[14px] font-bold transition-all shadow-xl shadow-orange-500/20"
          >
            <span className="relative block overflow-hidden">
              <span className="block transition-transform duration-0 group-hover:duration-500 ease-[cubic-bezier(0.87,0,0.13,1)] group-hover:-translate-y-full">
                Book a table
              </span>
              <span className="absolute inset-0 block translate-y-full transition-transform duration-0 group-hover:duration-500 ease-[cubic-bezier(0.87,0,0.13,1)] group-hover:translate-y-0">
                Book a table
              </span>
            </span>
          </Link>
        </div>

        {/* Mobile Toggle */}
        <button
          className="md:hidden p-2 text-[#1a1a1a]"
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
                  className="text-lg font-medium text-[#1a1a1a]"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {link.name}
                </Link>
              ))}
              <Link
                href="/book"
                className="bg-[#FF5C00] text-white text-center py-4 rounded-full font-bold"
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
