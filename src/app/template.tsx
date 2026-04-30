"use client";

import { motion, AnimatePresence } from "framer-motion";
import { usePathname } from "next/navigation";

export default function Template({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={pathname}
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -15 }}
        transition={{ 
          duration: 0.5, 
          ease: [0.25, 0.46, 0.45, 0.94] as const 
        }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}
