"use client";

import { Star } from "lucide-react";

export default function ReviewsSection() {
  return (
    <section className="py-12 px-6 bg-white flex flex-col items-center text-center">
      <span className="text-[#FF5C00] font-sans font-bold text-[11px] tracking-[0.25em] uppercase mb-6">
        REAL EXPERIENCES, REAL SATISFACTION
      </span>
      
      <h2 className="text-4xl md:text-[52px] font-serif font-medium text-[#1A1A1A] leading-tight mb-10 max-w-2xl">
        Customer reviews that speak for themselves
      </h2>

      {/* Marquee Rows */}
      <div className="w-full max-w-[1200px] flex flex-col gap-6 relative overflow-hidden">
        {/* Left fade */}
        <div className="absolute left-0 top-0 h-full w-32 z-10 pointer-events-none" style={{ background: "linear-gradient(to right, white 0%, transparent 100%)" }} />
        {/* Right fade */}
        <div className="absolute right-0 top-0 h-full w-32 z-10 pointer-events-none" style={{ background: "linear-gradient(to left, white 0%, transparent 100%)" }} />

        {/* Row 1 */}
        <div
          className="group/row1 flex gap-6 w-max"
          style={{ animation: "marquee 30s linear infinite" }}
          onMouseEnter={(e) => (e.currentTarget.style.animationPlayState = "paused")}
          onMouseLeave={(e) => (e.currentTarget.style.animationPlayState = "running")}
        >
          {[...Array(2)].flatMap(() => [
            { date: "27/02/2025", stars: 5, text: "Lixor crafted to the last detail — the food never disappoints.", name: "Ravi Shah", img: "/images/Customer Reviews Section/image1.avif" },
            { date: "12/03/2025", stars: 5, text: "Every visit to Lixor feels like a special occasion. The presentation and taste are truly unmatched.", name: "Sarah Mendez", img: "/images/Customer Reviews Section/image2.avif" },
            { date: "19/01/2025", stars: 4, text: "We've made Lixor our go-to spot. Their cozy vibe and flavorful dishes make it unforgettable.", name: "Aisha Rahman", img: "/images/Customer Reviews Section/image3.avif" },
            { date: "08/04/2025", stars: 5, text: "From the first bite to the last sip, everything is crafted with care. Lixor never disappoints.", name: "Ravi Shah", img: "/images/Customer Reviews Section/image4.avif" },
            { date: "05/12/2024", stars: 5, text: "What sets Lixor apart is the passion in every plate. The service is just as memorable as the food.", name: "Luca Romano", img: "/images/Customer Reviews Section/image5.avif" },
            { date: "22/11/2024", stars: 5, text: "Fresh ingredients, warm staff, and bold flavors—Lixor checks every box for a perfect meal.", name: "Emily Chen", img: "/images/Customer Reviews Section/image6.avif" },
          ]).map((r, i) => (
            <div key={i} className="w-[320px] flex-shrink-0 bg-white border border-black/8 rounded-[24px] p-7 text-left shadow-sm">
              <div className="flex justify-between items-center mb-4">
                <div className="flex gap-0.5">{Array.from({length: r.stars}).map((_, s) => <Star key={s} size={14} fill="#FF5C00" className="text-[#FF5C00]" />)}{Array.from({length: 5 - r.stars}).map((_, s) => <Star key={s} size={14} className="text-gray-200" fill="#e5e7eb" />)}</div>
                <span className="text-[#999] font-sans text-[12px]">{r.date}</span>
              </div>
              <p className="text-[#444] font-sans text-[14px] leading-relaxed mb-6">{r.text}</p>
              <div className="flex items-center gap-3">
                <img src={r.img} alt={r.name} className="w-10 h-10 rounded-full object-cover" />
                <span className="text-[#1A1A1A] font-sans font-bold text-[14px]">{r.name}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Row 2 */}
        <div
          className="group/row2 flex gap-6 w-max"
          style={{ animation: "marquee 40s linear infinite" }}
          onMouseEnter={(e) => (e.currentTarget.style.animationPlayState = "paused")}
          onMouseLeave={(e) => (e.currentTarget.style.animationPlayState = "running")}
        >
          {[...Array(2)].flatMap(() => [
            { date: "08/04/2025", stars: 5, text: "A perfect balance of food and atmosphere. Lixor is our favorite dining spot.", name: "Nina Patel", img: "/images/Customer Reviews Section/image5.avif" },
            { date: "05/12/2024", stars: 5, text: "What sets Lixor apart is the passion in every plate. The service is just as memorable.", name: "Luca Romano", img: "/images/Customer Reviews Section/image2.avif" },
            { date: "22/11/2024", stars: 4, text: "Lixor delivers a perfect blend of flavor and atmosphere. It has become our favorite dining spot.", name: "Nina Patel", img: "/images/Customer Reviews Section/image6.avif" },
            { date: "27/02/2025", stars: 5, text: "Simply outstanding! The menu is diverse and every dish bursts with authentic flavors.", name: "James Li", img: "/images/Customer Reviews Section/image3.avif" },
            { date: "12/03/2025", stars: 5, text: "Incredible experience from start to finish. The staff went above and beyond for our anniversary dinner.", name: "Maria Torres", img: "/images/Customer Reviews Section/image1.avif" },
            { date: "19/01/2025", stars: 5, text: "The lamb dish was absolutely divine! I keep coming back for that alone. Highly recommended.", name: "Omar Farooq", img: "/images/Customer Reviews Section/image4.avif" },
          ]).map((r, i) => (
            <div key={i} className="w-[320px] flex-shrink-0 bg-white border border-black/8 rounded-[24px] p-7 text-left shadow-sm">
              <div className="flex justify-between items-center mb-4">
                <div className="flex gap-0.5">{Array.from({length: r.stars}).map((_, s) => <Star key={s} size={14} fill="#FF5C00" className="text-[#FF5C00]" />)}{Array.from({length: 5 - r.stars}).map((_, s) => <Star key={s} size={14} className="text-gray-200" fill="#e5e7eb" />)}</div>
                <span className="text-[#999] font-sans text-[12px]">{r.date}</span>
              </div>
              <p className="text-[#444] font-sans text-[14px] leading-relaxed mb-6">{r.text}</p>
              <div className="flex items-center gap-3">
                <img src={r.img} alt={r.name} className="w-10 h-10 rounded-full object-cover" />
                <span className="text-[#1A1A1A] font-sans font-bold text-[14px]">{r.name}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <style>{`
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
      `}</style>
    </section>
  );
}
