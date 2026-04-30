import { useState } from "react";
import Link from "next/link";
import { menuItems, Category } from "@/data/menuData";
import { motion, AnimatePresence } from "framer-motion";
import { Plus } from "lucide-react";
import { toast } from "sonner";
import { useCart } from "@/store/useCart";

export default function MenuSection() {
  const addItem = useCart((state) => state.addItem);
  const [activeCategory, setActiveCategory] = useState<Category>("All");

  const filteredItems = menuItems.filter(item => item.category.includes(activeCategory));

  const categories: Category[] = ["All", "Courses", "Desserts", "Starters", "Appetizers"];

  return (
    <section className="relative px-6 max-w-[1200px] mx-auto mt-4 pb-12 z-10 flex flex-col items-center">
      <div className="text-center mb-16">
        <motion.span 
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] as const }}
          viewport={{ once: true }}
          className="text-[#FF5C00] font-sans font-semibold text-[11px] tracking-[0.15em] uppercase mb-4 block"
        >
          THIS IS WHAT WE SERVE YOU
        </motion.span>
        
        <motion.h2 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1, ease: [0.25, 0.46, 0.45, 0.94] as const }}
          viewport={{ once: true }}
          className="text-4xl md:text-[52px] font-serif font-medium text-[#1A1A1A] leading-[1.05] tracking-tight mb-10"
        >
          Discover the perfect<br className="hidden md:block" />meal for every taste
        </motion.h2>

        <div className="flex flex-wrap items-center justify-center gap-2">
          {categories.map((cat, i) => (
            <motion.button
              key={cat}
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.1, duration: 0.4 }}
              viewport={{ once: true }}
              onClick={() => setActiveCategory(cat)}
              className={`px-5 py-2 rounded-full text-[13px] font-medium transition-all ${
                activeCategory === cat
                  ? "bg-[#FF5C00] text-white shadow-lg shadow-orange-500/20"
                  : "bg-white text-[#666666] hover:text-[#1A1A1A] shadow-sm border border-neutral-100 hover:shadow-md"
              }`}
            >
              {cat === "All" ? "Full Menu" : cat}
            </motion.button>
          ))}
        </div>
      </div>

      <motion.div 
        layout
        className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-x-8 gap-y-16 w-full"
      >
        <AnimatePresence mode="popLayout">
          {filteredItems.map(item => (
            <motion.div
              layout
              key={item.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] as const }}
            >
              <div className="flex flex-col items-center text-center group">
                <Link 
                  href={`/menu/${item.id}`}
                  className="cursor-pointer"
                >
                <div className="w-[180px] h-[180px] md:w-[210px] md:h-[210px] mb-6 relative rounded-full overflow-hidden transition-all duration-700 ease-[cubic-bezier(0.34,1.56,0.64,1)] group-hover:scale-105 group-hover:rotate-[5deg]">
                  <img src={item.image} alt={item.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                </div>
                <div className="flex flex-col items-center gap-1.5 mb-2 relative">
                  <div className="flex items-center gap-1.5">
                    <h3 className="font-serif font-medium text-[#1A1A1A] text-[20px] transition-colors group-hover:text-[#FF5C00]">{item.name}</h3>
                    {item.logo && (
                      <img src={item.logo} alt="icon" className="w-[14px] h-[14px] object-contain" />
                    )}
                  </div>
                  {/* Sliding Underline */}
                  <div className="w-0 h-[1.5px] bg-[#FF5C00] group-hover:w-full transition-all duration-500 ease-out" />
                </div>
                <span className="text-[#999999] text-[14px] font-sans tracking-wide uppercase mb-4">{item.price}</span>
              </Link>
              
              <button
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  const priceNum = parseFloat(item.price.replace(/[^\d.]/g, ''));
                  addItem({
                    id: item.id,
                    name: item.name,
                    price: priceNum,
                    image: item.image
                  });
                  toast.success(`${item.name} added to cart`);
                }}
                className="bg-[#1A1A1A] hover:bg-[#FF5C00] text-white text-[11px] font-bold py-2 px-6 rounded-full transition-all duration-300 transform active:scale-95 flex items-center gap-2"
              >
                <Plus size={14} />
                Add to Cart
              </button>
            </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>
    </section>
  );
}


