"use client";

import { motion } from "framer-motion";
import { Users } from "lucide-react";

interface Table {
  id: string;
  tableNumber: number;
  capacity: number;
}

interface TableGridProps {
  tables: Table[];
  bookedTableIds: string[];
  selectedTableId: string | null;
  onSelect: (id: string) => void;
}

export default function TableGrid({ tables, bookedTableIds, selectedTableId, onSelect }: TableGridProps) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
      {tables.map((table) => {
        const isBooked = bookedTableIds.includes(table.id);
        const isSelected = selectedTableId === table.id;

        return (
          <motion.button
            key={table.id}
            disabled={isBooked}
            whileHover={!isBooked ? { scale: 1.05, y: -2 } : {}}
            whileTap={!isBooked ? { scale: 0.95 } : {}}
            onClick={() => onSelect(table.id)}
            type="button"
            className={`relative p-6 rounded-[24px] border-2 transition-all flex flex-col items-center gap-3 ${
              isBooked 
                ? "bg-neutral-50 border-neutral-100 opacity-40 cursor-not-allowed" 
                : isSelected 
                  ? "bg-[#FF5C00]/5 border-[#FF5C00] shadow-lg shadow-orange-500/10" 
                  : "bg-white border-neutral-100 hover:border-[#FF5C00]/30"
            }`}
          >
            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-serif text-xl font-bold ${
              isSelected ? "text-[#FF5C00]" : "text-[#1A1A1A]"
            }`}>
              {table.tableNumber}
            </div>
            
            <div className="flex items-center gap-1.5 text-[11px] font-bold text-neutral-400 uppercase tracking-widest">
              <Users size={12} />
              {table.capacity}
            </div>

            {isBooked && (
              <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-red-400" />
            )}
            {isSelected && (
              <motion.div 
                layoutId="activeTable"
                className="absolute inset-0 border-2 border-[#FF5C00] rounded-[24px] pointer-events-none" 
              />
            )}
          </motion.button>
        );
      })}
    </div>
  );
}
