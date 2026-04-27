"use client";

import { motion } from "framer-motion";
import Link from "next/link";

interface ChefsSectionProps {
  subtitle?: string;
  title?: string;
  buttonText?: string;
  buttonHref?: string;
  limit?: number;
}

const chefs = [
  { name: "Hiroshi Tanaka", role: "Umami Specialist", img: "image1.avif" },
  { name: "Luca Moretti", role: "Italian Cuisine", img: "image2.avif" },
  { name: "Camille Laurent", role: "Dessert Chef", img: "image3.avif" },
  { name: "Alejandro Cruz", role: "Executive Chef", img: "image4.avif" },
  { name: "Mei Lin", role: "Pastry Chef", img: "image5.avif" },
  { name: "Olivia Bennett", role: "Sous Chef", img: "image6.avif" }
];

export default function ChefsSection({
  subtitle = "PASSIONATE CREATORS",
  title = "Meet the chefs behind<br />our culinary creations",
  buttonText = "Book a table",
  buttonHref = "/booking",
  limit = 3
}: ChefsSectionProps) {
  const displayedChefs = chefs.slice(0, limit);

  return (
    <section className="py-24 px-6 bg-white relative overflow-hidden">
      {/* Subtle Side Glows */}
      <div className="absolute left-[-5%] top-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-[#FF5C00]/[0.02] rounded-full blur-[100px] -z-10" />
      <div className="absolute right-[-5%] top-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-[#FF5C00]/[0.02] rounded-full blur-[100px] -z-10" />

      <div className="max-w-[1200px] mx-auto text-center relative z-10">
        <motion.span 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-[#FF5C00] font-sans font-bold text-[11px] tracking-[0.2em] uppercase mb-6 block"
        >
          {subtitle}
        </motion.span>
        
        <motion.h2 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          viewport={{ once: true }}
          className="text-3xl md:text-[42px] font-serif font-medium text-[#1A1A1A] leading-[1.2] mb-8"
        >
          {title.split('<br />').map((line, i) => (
            <span key={i}>
              {line}
              {i < title.split('<br />').length - 1 && <br />}
            </span>
          ))}
        </motion.h2>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          viewport={{ once: true }}
          className="mb-16"
        >
          <Link 
            href={buttonHref}
            className="group inline-block bg-[#FF5C00] hover:bg-[#E65200] text-white px-10 py-4 rounded-full text-[15px] font-bold transition-all shadow-xl shadow-orange-500/20"
          >
            <span className="relative block overflow-hidden">
              <span className="block transition-transform duration-0 group-hover:duration-500 ease-[cubic-bezier(0.87,0,0.13,1)] group-hover:-translate-y-full">
                {buttonText}
              </span>
              <span className="absolute inset-0 block translate-y-full transition-transform duration-0 group-hover:duration-500 ease-[cubic-bezier(0.87,0,0.13,1)] group-hover:translate-y-0">
                {buttonText}
              </span>
            </span>
          </Link>
        </motion.div>

        {/* Chef Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {displayedChefs.map((chef, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: (index % 3) * 0.1 }}
              viewport={{ once: true }}
              className="group text-left"
            >
              <div className="rounded-[32px] overflow-hidden aspect-square mb-6 shadow-lg relative bg-gray-50">
                <img 
                  src={`/images/pages/about/chefs/${chef.img}`} 
                  alt={chef.name}
                  className="w-full h-full object-cover transition-all duration-700 group-hover:scale-105 group-hover:grayscale-[0.3]"
                />
              </div>
              <div className="flex justify-between items-center px-1">
                <div>
                  <h3 className="text-xl md:text-[24px] font-serif font-medium text-[#1A1A1A] mb-1">
                    {chef.name}
                  </h3>
                  <p className="text-[#666666] text-[15px] font-sans opacity-70">
                    {chef.role}
                  </p>
                </div>
                <div className="w-9 h-9 rounded-full bg-[#FF5C00] flex items-center justify-center text-white transition-all duration-300 group-hover:rotate-[-45deg] shrink-0 shadow-lg shadow-orange-500/20">
                  <span className="text-xl">→</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
