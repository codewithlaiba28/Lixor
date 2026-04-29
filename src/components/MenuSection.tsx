"use client";

import { useState } from "react";

type Category = "All" | "Courses" | "Desserts" | "Starters" | "Appetizers";

interface MenuItem {
  id: string;
  name: string;
  price: string;
  image: string;
  category: Category[];
  logo?: string;
}

const menuItems: MenuItem[] = [
  // 4 items from root folder
  { id: "1", name: "Mashed potatoes", price: "USD 10.00", image: "/images/meal-section-images/mashed potatoes.avif", category: ["All"], logo: "/images/meal-section-images/logo/logo1.svg" },
  { id: "2", name: "Bruschetta trio", price: "USD 12.00", image: "/images/meal-section-images/bruschetta trio.avif", category: ["All"] },
  { id: "3", name: "Chilled gazpacho", price: "USD 30.00", image: "/images/meal-section-images/chilled gazpacho.avif", category: ["All"] },
  { id: "4", name: "Molten lava cake", price: "USD 70.00", image: "/images/meal-section-images/molten lava cake.avif", category: ["All"] },
  
  // 4 items from Appetizers
  { id: "5", name: "Bruschetta trio", price: "USD 15.00", image: "/images/meal-section-images/appetizer/bruschetta trio.avif", category: ["All", "Appetizers"] },
  { id: "6", name: "Crispy calamari", price: "USD 18.00", image: "/images/meal-section-images/appetizer/crispy calamari.avif", category: ["All", "Appetizers"] },
  { id: "7", name: "Spicy chicken wing", price: "USD 14.00", image: "/images/meal-section-images/appetizer/spicy chicken wing.avif", category: ["All", "Appetizers"], logo: "/images/meal-section-images/logo/logo2.svg" },
  { id: "8", name: "Stuffed mushrooms", price: "USD 16.00", image: "/images/meal-section-images/appetizer/stuffed mushrooms.avif", category: ["All", "Appetizers"], logo: "/images/meal-section-images/logo/logo1.svg" },

  // 4 items from Courses
  { id: "9", name: "Chicken alfredo", price: "USD 22.00", image: "/images/meal-section-images/courses/chicken alfredo.avif", category: ["All", "Courses"] },
  { id: "10", name: "Grilled salmon", price: "USD 28.00", image: "/images/meal-section-images/courses/grilled salmon.avif", category: ["All", "Courses"] },
  { id: "11", name: "Steak au poivre", price: "USD 35.00", image: "/images/meal-section-images/courses/steak au poivre.avif", category: ["All", "Courses"], logo: "/images/meal-section-images/logo/logo2.svg" },
  { id: "12", name: "Vegetarian lasagna", price: "USD 20.00", image: "/images/meal-section-images/courses/vegetarian lasagna.avif", category: ["All", "Courses"], logo: "/images/meal-section-images/logo/logo1.svg" },

  // 4 items from Desserts
  { id: "13", name: "Classic tiramisu", price: "USD 12.00", image: "/images/meal-section-images/desserts/classic tiramisu.avif", category: ["All", "Desserts"] },
  { id: "14", name: "Creme brulee", price: "USD 14.00", image: "/images/meal-section-images/desserts/creme brulee.avif", category: ["All", "Desserts"] },
  { id: "15", name: "Molten lava cake", price: "USD 15.00", image: "/images/meal-section-images/desserts/molten lava cake.avif", category: ["All", "Desserts"] },
  { id: "16", name: "NY cheesecake", price: "USD 13.00", image: "/images/meal-section-images/desserts/ny cheesecake.avif", category: ["All", "Desserts"] },

  // 4 items from Starters
  { id: "17", name: "Caprese salad", price: "USD 16.00", image: "/images/meal-section-images/starter/caprese salad.avif", category: ["All", "Starters"], logo: "/images/meal-section-images/logo/logo1.svg" },
  { id: "18", name: "Cheese crostini", price: "USD 14.00", image: "/images/meal-section-images/starter/cheese crostini.avif", category: ["All", "Starters"] },
  { id: "19", name: "Chilled gazpacho", price: "USD 12.00", image: "/images/meal-section-images/starter/chilled gazpacho.avif", category: ["All", "Starters"], logo: "/images/meal-section-images/logo/logo1.svg" },
  { id: "20", name: "Smoked salmon", price: "USD 18.00", image: "/images/meal-section-images/starter/smoked salmon.avif", category: ["All", "Starters"] },
];

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
          <div key={item.id} className="flex flex-col items-center text-center group cursor-pointer">
            <div className="w-[180px] h-[180px] md:w-[210px] md:h-[210px] mb-6 transition-transform duration-700 ease-[cubic-bezier(0.34,1.56,0.64,1)] group-hover:scale-110 group-hover:rotate-[15deg]">
              <img src={item.image} alt={item.name} className="w-full h-full object-cover rounded-full" />
            </div>
            <div className="flex items-center gap-1.5 mb-2">
              <h3 className="font-serif font-medium text-[#1A1A1A] text-[18px]">{item.name}</h3>
              {item.logo && (
                <img src={item.logo} alt="icon" className="w-[14px] h-[14px] object-contain" />
              )}
            </div>
            <span className="text-[#999999] text-[14px] font-sans tracking-wide uppercase">{item.price}</span>
          </div>
        ))}
      </div>
    </section>
  );
}
