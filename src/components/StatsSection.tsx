"use client";
import React, { useEffect, useRef, useState } from "react";
import { motion, useInView, useMotionValue, useTransform, animate } from "framer-motion";

const Counter = ({ value, from = 0, suffix = "", duration = 2 }: { value: number, from?: number, suffix?: string, duration?: number }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const count = useMotionValue(from);
  const displayValue = useTransform(count, (latest) => 
    Math.round(latest).toLocaleString() + suffix
  );

  useEffect(() => {
    if (isInView) {
      const controls = animate(count, value, {
        duration: duration,
        ease: "easeOut" as const,
      });
      return controls.stop;
    }
  }, [isInView, value, count, duration]);

  return <motion.span ref={ref}>{displayValue}</motion.span>;
};

const StatsSection = () => {
  const floatingAnimation = (delay: number) => ({
    y: [0, -15, 0],
    transition: {
      duration: 5,
      repeat: Infinity,
      ease: "easeInOut" as const,
      delay,
    },
  });

  const stats = [
    { value: 20, suffix: "K+", label: "Creative experience" },
    { value: 1000, suffix: "+", label: "Events created" },
    { value: 500, suffix: "K+", label: "Customer Reviews" },
    { value: 10, suffix: "+", label: "Years experience" },
  ];

  return (
    <section className="relative px-6 max-w-[1300px] mx-auto py-24 z-10 flex flex-col items-center">
      {/* Central Content Container */}
      <div className="relative w-full max-w-[800px] flex flex-col items-center mb-32">
        {/* Floating Dishes */}
        {/* Top Left */}
        <motion.div 
          animate={floatingAnimation(0)}
          className="absolute -left-12 md:-left-24 -top-12 w-24 h-24 md:w-32 md:h-32 z-0 bg-transparent"
        >
          <img 
            src="/images/Meals served for everyone/image1.avif" 
            alt="" 
            className="w-full h-full object-cover rounded-full filter drop-shadow-[0_10px_20px_rgba(0,0,0,0.1)]" 
          />
        </motion.div>

        {/* Bottom Left */}
        <motion.div 
          animate={floatingAnimation(1)}
          className="absolute -left-20 md:-left-40 top-20 md:top-28 w-28 h-28 md:w-36 md:h-36 z-0 bg-transparent"
        >
          <img 
            src="/images/Meals served for everyone/image2.avif" 
            alt="" 
            className="w-full h-full object-cover rounded-full filter drop-shadow-[0_15px_30px_rgba(0,0,0,0.12)]" 
          />
        </motion.div>

        {/* Top Right */}
        <motion.div 
          animate={floatingAnimation(0.5)}
          className="absolute -right-12 md:-right-24 -top-10 w-24 h-24 md:w-32 md:h-32 z-0 bg-transparent"
        >
          <img 
            src="/images/Meals served for everyone/image3.avif" 
            alt="" 
            className="w-full h-full object-cover rounded-full filter drop-shadow-[0_10px_20px_rgba(0,0,0,0.1)]" 
          />
        </motion.div>

        {/* Bottom Right */}
        <motion.div 
          animate={floatingAnimation(1.5)}
          className="absolute -right-20 md:-right-40 top-20 md:top-28 w-28 h-28 md:w-36 md:h-36 z-0 bg-transparent"
        >
          <img 
            src="/images/Meals served for everyone/image4.avif" 
            alt="" 
            className="w-full h-full object-cover rounded-full filter drop-shadow-[0_15px_30px_rgba(0,0,0,0.12)]" 
          />
        </motion.div>

        {/* The Big Number */}
        <div className="text-center relative z-10">
          <motion.h2 
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            viewport={{ once: true }}
            className="text-[64px] md:text-[120px] font-serif font-bold text-[#1A1A1A] leading-none mb-4 tracking-tight flex items-baseline justify-center"
          >
            <Counter value={80022} from={79950} />
            <span className="text-[32px] md:text-[60px] font-light ml-1 font-sans text-[#1A1A1A]/80">+</span>
          </motion.h2>
          
          <motion.span 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            viewport={{ once: true }}
            className="text-[#FF5C00] font-sans font-bold text-[10px] tracking-[0.25em] uppercase"
          >
            MEALS SERVED FOR EVERYONE
          </motion.span>
        </div>
      </div>

      {/* Bottom Stats Grid */}
      <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-6 md:gap-x-12 w-full max-w-[1000px]">
        {stats.map((stat, index) => (
          <React.Fragment key={index}>
            <motion.div 
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1, duration: 0.6 }}
              viewport={{ once: true }}
              className="flex flex-col items-center text-center"
            >
              <span className="text-[28px] md:text-[42px] font-sans font-bold text-[#1A1A1A] leading-tight tracking-tight">
                <Counter value={stat.value} suffix={stat.suffix} />
              </span>
              <span className="text-[#666666] text-[12px] md:text-[14px] font-sans font-semibold opacity-60">
                {stat.label}
              </span>
            </motion.div>
            
            {index < stats.length - 1 && (
              <div className="hidden md:block">
                <div className="w-2.5 h-2.5 rounded-full bg-[#FF5C00]" />
              </div>
            )}
          </React.Fragment>
        ))}
      </div>
    </section>
  );
};

export default StatsSection;
