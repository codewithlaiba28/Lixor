"use client";

import { useState } from "react";
import Link from "next/link";
import { menuItems, Category } from "@/data/menuData";

export default function MenuSection() {
  const [activeCategory, setActiveCategory] = useState<Category>("All");

  const filteredItems = menuItems.filter(item => item.category.includes(activeCategory));

  const categories: Category[] = ["All", "Courses", "Desserts", "Starters", "Appetizers"];

  return (
    <section className="relative px-6 max-w-[1200px] mx-auto mt-4 pb-12 z-10 flex flex-col items-center">
      <div className="text-center mb-16">
        <span className="text-[#FF5C00] font-sans font-semibold text-[11px] tracking-[0.15em] uppercase mb-4 block">
          THIS IS WHAT WE SERVE YOU
        </span>
        
        <h2 className="text-4xl md:text-[52px] font-serif font-medium text-[#1A1A1A] leading-[1.05] tracking-tight mb-10">
          Discover the perfect<br className="hidden md:block" />meal for every taste
        </h2>

        <div className="flex flex-wrap items-center justify-center gap-2">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-1.5 rounded-full text-[12px] font-medium transition-all ${
                activeCategory === cat
                  ? "bg-[#FF5C00] text-white shadow-md shadow-orange-500/20"
                  : "bg-white text-[#666666] hover:text-[#1A1A1A] shadow-sm border border-neutral-100 hover:shadow-md"
              }`}
            >
              {cat === "All" ? "Full Menu" : cat}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-x-8 gap-y-16 w-full">
        {filteredItems.map(item => (
          <Link 
            key={item.id} 
            href={`/menu/${item.id}`}
            className="flex flex-col items-center text-center group cursor-pointer"
          >
            <div className="w-[180px] h-[180px] md:w-[210px] md:h-[210px] mb-6 transition-transform duration-700 ease-[cubic-bezier(0.34,1.56,0.64,1)] group-hover:scale-110 group-hover:rotate-[15deg]">
              <img src={item.image} alt={item.name} className="w-full h-full object-cover rounded-full" />
            </div>
            <div className="flex items-center gap-1.5 mb-2">
              <h3 className="font-serif font-medium text-[#1A1A1A] text-[18px] group-hover:text-[#FF5C00] transition-colors">{item.name}</h3>
              {item.logo && (
                <img src={item.logo} alt="icon" className="w-[14px] h-[14px] object-contain" />
              )}
            </div>
            <span className="text-[#999999] text-[14px] font-sans tracking-wide uppercase">{item.price}</span>
          </Link>
        ))}
      </div>
    </section>
  );
}

