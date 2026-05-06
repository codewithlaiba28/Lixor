"use client";
import Navbar from "@/components/Navbar";
// Global rebuild trigger to clear cache
import Footer from "@/components/Footer";
import StatsSection from "@/components/StatsSection";
import { Star, MapPin } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import dynamic from "next/dynamic";

const MenuSection = dynamic(() => import("@/components/MenuSection"), { ssr: false });
const ReviewsSection = dynamic(() => import("@/components/ReviewsSection"), { ssr: false });
const FaqSection = dynamic(() => import("@/components/FaqSection"), { ssr: false });
const CTASection = dynamic(() => import("@/components/CTASection"), { ssr: false });
const BlogSection = dynamic(() => import("@/components/BlogSection"), { ssr: false });

export default function Home() {
  const headline = "Where every meal is a chef masterpiece";
  const words = headline.split(" ");

  return (
    <main className="bg-white overflow-hidden relative min-h-screen">
      {/* Global Background Glows */}
      <div className="absolute top-[400px] -left-[20vw] w-[50vw] h-[800px] bg-[#FF5C00]/[0.05] rounded-full blur-[150px] pointer-events-none" />
      <div className="absolute top-[400px] -right-[20vw] w-[50vw] h-[800px] bg-[#FF5C00]/[0.05] rounded-full blur-[150px] pointer-events-none" />

      <Navbar />

      {/* Hero Section */}
      <section className="relative pt-36 pb-4 px-6">
        <div className="max-w-4xl mx-auto flex flex-col items-center text-center z-10 relative">
          <span 
            className="text-[#FF5C00] font-sans font-semibold text-[11px] tracking-[0.15em] uppercase mb-4 animate-fadeUp"
          >
            PREMIUM RESTAURANT TEMPLATE
          </span>

          <h1 
            className="text-4xl md:text-[56px] font-serif font-medium text-[#1A1A1A] leading-[1.05] tracking-tight mb-4 flex flex-wrap justify-center gap-x-3"
          >
            {words.map((word, i) => (
              <span key={i} className="inline-block animate-fadeUp" style={{ animationDelay: `${i * 100}ms` }}>
                {word === "chef" ? <span className="text-[#FF5C00]">{word}</span> : word}
              </span>
            ))}
          </h1>

          <p 
            className="text-[#666666] text-base md:text-[16px] max-w-xl mx-auto mb-8 font-sans leading-relaxed animate-fadeUp"
            style={{ animationDelay: "600ms" }}
          >
            We bring you the finest flavors, carefully crafted with<br className="hidden md:block" />the freshest ingredients & every meal
          </p>

          <div 
            className="flex flex-col sm:flex-row items-center gap-5 animate-fadeUp"
            style={{ animationDelay: "800ms" }}
          >
            <Link
              href="/book"
              className="group relative inline-block bg-[#FF5C00] hover:bg-[#E65200] text-white px-8 py-3.5 rounded-full text-[15px] font-bold transition-all shadow-lg shadow-orange-500/20 active:scale-95"
            >
              <span className="relative z-10 block overflow-hidden">
                <span className="block transition-transform duration-500 ease-[cubic-bezier(0.87,0,0.13,1)] group-hover:-translate-y-full">
                  Book a table
                </span>
                <span className="absolute inset-0 block translate-y-full transition-transform duration-500 ease-[cubic-bezier(0.87,0,0.13,1)] group-hover:translate-y-0">
                  Book a table
                </span>
              </span>
              <div className="absolute inset-0 w-1/2 h-full bg-white/20 skew-x-[-25deg] -translate-x-full group-hover:translate-x-[200%] transition-transform duration-1000" />
            </Link>

            <div className="flex items-center gap-2">
              <span className="font-bold text-[#1A1A1A] text-[14px]">(4.9/5)</span>
              <div className="flex items-center gap-[2px]">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-[18px] h-[18px] fill-[#FF5C00] text-[#FF5C00]" />
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Dishes Section */}
      <section className="relative px-6 max-w-[1200px] mx-auto mt-28 pb-8 z-10">
        <div className="flex flex-col md:flex-row items-center justify-between gap-8 md:gap-0">

          {/* Dish 1: Main Course */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
            viewport={{ once: true }}
          >
            <Link href="/menu" className="flex flex-col items-center gap-6 group cursor-pointer">
              <div className="relative w-[170px] perspective-1000">
                <div className="w-full aspect-[2/3] rounded-[999px] overflow-hidden relative transition-all duration-500 group-hover:rotate-y-12">
                  <Image 
                    src="/images/menu-categories/main-course.avif" 
                    alt="Main Course" 
                    fill
                    sizes="170px"
                    priority
                    className="object-cover" 
                  />
                </div>
                <div className="absolute top-[10%] right-[12%] w-10 h-10 bg-[#FF5C00] rounded-full text-white shadow-xl shadow-orange-500/30 transform translate-x-1/2 -translate-y-1/2 z-20 overflow-hidden">
                  <div className="relative w-full h-full">
                    <div className="absolute inset-0 flex items-center justify-center transition-transform duration-500 ease-[cubic-bezier(0.87,0,0.13,1)] group-hover:-translate-y-full">
                      <img src="/images/menu-categories/logo/main-course.svg" alt="Main Course Icon" className="w-[18px] h-[18px]" />
                    </div>
                    <div className="absolute inset-0 flex items-center justify-center translate-y-full transition-transform duration-500 ease-[cubic-bezier(0.87,0,0.13,1)] group-hover:translate-y-0">
                      <img src="/images/menu-categories/logo/main-course.svg" alt="Main Course Icon" className="w-[18px] h-[18px]" />
                    </div>
                  </div>
                </div>
              </div>
              <span className="font-sans font-medium text-[#1A1A1A] text-[17px] group-hover:text-[#FF5C00] transition-colors">Main Course</span>
            </Link>
          </motion.div>

          <div className="hidden md:block w-1.5 h-1.5 rounded-full bg-[#FF5C00]"></div>

          {/* Dish 2: Desserts */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.15, ease: [0.25, 0.46, 0.45, 0.94] }}
            viewport={{ once: true }}
          >
            <Link href="/menu" className="flex flex-col items-center gap-6 md:-translate-y-12 group cursor-pointer">
              <div className="relative w-[170px] perspective-1000">
                <div className="w-full aspect-[2/3] rounded-[999px] overflow-hidden relative transition-all duration-500 group-hover:rotate-y-12">
                  <Image 
                    src="/images/menu-categories/dessert.avif" 
                    alt="Desserts" 
                    fill
                    sizes="170px"
                    priority
                    className="object-cover" 
                  />
                </div>
                <div className="absolute top-[10%] right-[12%] w-10 h-10 bg-[#FF5C00] rounded-full text-white shadow-xl shadow-orange-500/30 transform translate-x-1/2 -translate-y-1/2 z-20 overflow-hidden">
                  <div className="relative w-full h-full">
                    <div className="absolute inset-0 flex items-center justify-center transition-transform duration-500 ease-[cubic-bezier(0.87,0,0.13,1)] group-hover:-translate-y-full">
                      <img src="/images/menu-categories/logo/desserts.svg" alt="Desserts Icon" className="w-[18px] h-[18px]" />
                    </div>
                    <div className="absolute inset-0 flex items-center justify-center translate-y-full transition-transform duration-500 ease-[cubic-bezier(0.87,0,0.13,1)] group-hover:translate-y-0">
                      <img src="/images/menu-categories/logo/desserts.svg" alt="Desserts Icon" className="w-[18px] h-[18px]" />
                    </div>
                  </div>
                </div>
              </div>
              <span className="font-sans font-medium text-[#1A1A1A] text-[17px] group-hover:text-[#FF5C00] transition-colors">Desserts</span>
            </Link>
          </motion.div>

          <div className="hidden md:block w-1.5 h-1.5 rounded-full bg-[#FF5C00]"></div>

          {/* Dish 3: Appetizer */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
            viewport={{ once: true }}
          >
            <Link href="/menu" className="flex flex-col items-center gap-6 group cursor-pointer">
              <div className="relative w-[170px] perspective-1000">
                <div className="w-full aspect-[2/3] rounded-[999px] overflow-hidden relative transition-all duration-500 group-hover:rotate-y-12">
                  <Image 
                    src="/images/menu-categories/appetizer.avif" 
                    alt="Appetizer" 
                    fill
                    sizes="170px"
                    priority
                    className="object-cover" 
                  />
                </div>
                <div className="absolute top-[10%] right-[12%] w-10 h-10 bg-[#FF5C00] rounded-full text-white shadow-xl shadow-orange-500/30 transform translate-x-1/2 -translate-y-1/2 z-20 overflow-hidden">
                  <div className="relative w-full h-full">
                    <div className="absolute inset-0 flex items-center justify-center transition-transform duration-500 ease-[cubic-bezier(0.87,0,0.13,1)] group-hover:-translate-y-full">
                      <img src="/images/menu-categories/logo/appetizer.svg" alt="Appetizer Icon" className="w-[18px] h-[18px]" />
                    </div>
                    <div className="absolute inset-0 flex items-center justify-center translate-y-full transition-transform duration-500 ease-[cubic-bezier(0.87,0,0.13,1)] group-hover:translate-y-0">
                      <img src="/images/menu-categories/logo/appetizer.svg" alt="Appetizer Icon" className="w-[18px] h-[18px]" />
                    </div>
                  </div>
                </div>
              </div>
              <span className="font-sans font-medium text-[#1A1A1A] text-[17px] group-hover:text-[#FF5C00] transition-colors">Appetizer</span>
            </Link>
          </motion.div>

          <div className="hidden md:block w-1.5 h-1.5 rounded-full bg-[#FF5C00]"></div>

          {/* Dish 4: Starter */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.45, ease: [0.25, 0.46, 0.45, 0.94] }}
            viewport={{ once: true }}
          >
            <Link href="/menu" className="flex flex-col items-center gap-6 md:-translate-y-12 group cursor-pointer">
              <div className="relative w-[170px] perspective-1000">
                <div className="w-full aspect-[2/3] rounded-[999px] overflow-hidden relative transition-all duration-500 group-hover:rotate-y-12">
                  <Image 
                    src="/images/menu-categories/starter.avif" 
                    alt="Starter" 
                    fill
                    sizes="170px"
                    priority
                    className="object-cover" 
                  />
                </div>
                <div className="absolute top-[10%] right-[12%] w-10 h-10 bg-[#FF5C00] rounded-full text-white shadow-xl shadow-orange-500/30 transform translate-x-1/2 -translate-y-1/2 z-20 overflow-hidden">
                  <div className="relative w-full h-full">
                    <div className="absolute inset-0 flex items-center justify-center transition-transform duration-500 ease-[cubic-bezier(0.87,0,0.13,1)] group-hover:-translate-y-full">
                      <img src="/images/menu-categories/logo/starte.svg" alt="Starter Icon" className="w-[18px] h-[18px]" />
                    </div>
                    <div className="absolute inset-0 flex items-center justify-center translate-y-full transition-transform duration-500 ease-[cubic-bezier(0.87,0,0.13,1)] group-hover:translate-y-0">
                      <img src="/images/menu-categories/logo/starte.svg" alt="Starter Icon" className="w-[18px] h-[18px]" />
                    </div>
                  </div>
                </div>
              </div>
              <span className="font-sans font-medium text-[#1A1A1A] text-[17px] group-hover:text-[#FF5C00] transition-colors">Starter</span>
            </Link>
          </motion.div>

        </div>
      </section>


      {/* Dining Experience Section */}
      <section className="relative px-6 max-w-[1200px] mx-auto mt-16 md:mt-24 pb-12 z-10 flex flex-col md:flex-row items-center gap-12 md:gap-20">

        {/* Left Image */}
        <div className="w-full md:w-1/2">
          <div className="rounded-[32px] overflow-hidden aspect-[4/3] shadow-lg">
            <Image src="/images/dining-couple.png" alt="Couple dining" width={600} height={450} className="w-full h-full object-cover" />
          </div>
        </div>

        {/* Right Content */}
        <div className="w-full md:w-1/2 flex flex-col items-start">
          <div className="flex items-center gap-2 mb-6">
            <img src="/images/about/best-dining-experience.avif" alt="" className="w-6 h-4 object-contain opacity-80 shrink-0" />
            <span className="text-[#1A1A1A] font-medium text-[15px]">Best Dining Experience</span>
            <img src="/images/about/best-dining-experience1.avif" alt="" className="w-6 h-4 object-contain opacity-80 shrink-0" />
          </div>

          <h2 className="text-4xl md:text-5xl font-serif font-medium text-[#1A1A1A] leading-[1.15] tracking-tight mb-6">
            Best dining experience<br className="hidden md:block" />with every dish
          </h2>

          <p className="text-[#666666] text-[16px] max-w-[420px] font-sans leading-relaxed mb-10">
            We believe dining is more than just a meal; it's an experience. Our chefs create dishes that combine the freshest ingredients
          </p>

          {/* Location Card */}
          <Link
            href="https://maps.app.goo.gl/JMy8MfM3oyhN46zQ8"
            target="_blank"
            className="inline-flex bg-[#FF5C00] rounded-2xl py-2.5 px-3 pr-5 items-center gap-3 shadow-xl shadow-orange-500/20 hover:-translate-y-1 transition-all group cursor-pointer"
          >
            <div className="w-14 h-14 rounded-md overflow-hidden shrink-0 border border-white/10">
              <img src="/images/about/about.avif" alt="Dish" className="w-full h-full min-h-full object-cover transition-transform duration-500 group-hover:scale-125" />
            </div>
            <div className="flex flex-col">
              <span className="text-white font-serif text-[16px] leading-tight mb-1">Lixor, Fine Dining</span>
              <div className="flex items-center gap-2 text-white overflow-hidden h-5">
                <div className="relative w-4 h-5 flex items-center justify-center">
                  <MapPin size={14} className="absolute transition-all duration-300 group-hover:-translate-y-5 group-hover:opacity-0" />
                  <span className="absolute text-[16px] transition-all duration-300 translate-y-5 opacity-0 group-hover:translate-y-0 group-hover:opacity-100">→</span>
                </div>
                <span className="text-[12px] font-medium">View on Map</span>
              </div>
            </div>
          </Link>

        </div>
      </section>

      {/* Features Section */}
      <section className="relative px-6 max-w-[1100px] mx-auto mt-8 md:mt-12 pb-12 md:pb-16 z-10 grid grid-cols-1 md:grid-cols-3 gap-16 md:gap-16 lg:gap-24 text-center">
        {/* Feature 1 */}
        <div className="flex flex-col items-center">
          <span className="text-[48px] md:text-[56px] font-serif font-medium text-[#1A1A1A] leading-none mb-6">01</span>
          <h3 className="text-[20px] font-serif font-medium text-[#1A1A1A] mb-3">Authentic Flavors</h3>
          <p className="text-[#666666] text-[15px] font-sans leading-relaxed max-w-[260px]">
            We take pride in offering an array of dishes made with love & quality
          </p>
        </div>

        {/* Feature 2 */}
        <div className="flex flex-col items-center">
          <span className="text-[48px] md:text-[56px] font-serif font-medium text-[#1A1A1A] leading-none mb-6">02</span>
          <h3 className="text-[20px] font-serif font-medium text-[#1A1A1A] mb-3">Cozy Ambiance</h3>
          <p className="text-[#666666] text-[15px] font-sans leading-relaxed max-w-[260px]">
            Our restaurant provides the perfect setting to enjoy your food
          </p>
        </div>

        {/* Feature 3 */}
        <div className="flex flex-col items-center">
          <span className="text-[48px] md:text-[56px] font-serif font-medium text-[#1A1A1A] leading-none mb-6">03</span>
          <h3 className="text-[20px] font-serif font-medium text-[#1A1A1A] mb-3">Exceptional Service</h3>
          <p className="text-[#666666] text-[15px] font-sans leading-relaxed max-w-[260px]">
            Our team is dedicated to making your dining experience smooth
          </p>
        </div>
      </section>

      {/* Interactive Menu Section */}
      <MenuSection />
      {/* Why Choose Us Section */}
      <section className="relative px-6 max-w-[1280px] mx-auto mt-16 pb-24 z-10">
        <div className="text-center mb-16">
          <span className="text-[#FF5C00] font-sans font-semibold text-[11px] tracking-[0.15em] uppercase mb-4 block">
            DISCOVER WHAT MAKES US SPECIAL
          </span>
          <h2 className="text-4xl md:text-[48px] font-serif font-medium text-[#1A1A1A] leading-[1.1] tracking-tight">
            Why choose Lixor for<br className="hidden md:block" />your dining expertise
          </h2>
        </div>

        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-24">
          {/* Features Grid */}
          <div className="w-full lg:w-[65%] grid grid-cols-1 md:grid-cols-2 gap-x-16 gap-y-16">
            {/* Feature 1 */}
            <div className="flex items-start gap-6">
              <div className="w-14 h-14 rounded-full bg-[#FFF5F0] flex items-center justify-center shrink-0">
                <img src="/images/Why Choose Us Section/logo1.svg" alt="" className="w-7 h-7" />
              </div>
              <div>
                <h3 className="text-[#1A1A1A] font-sans font-semibold text-[22px] mb-2 leading-tight">Fresh Ingredients</h3>
                <p className="text-[#666666] text-[16px] leading-relaxed max-w-[280px]">Only the freshest ingredients are used in our dishes daily</p>
              </div>
            </div>

            {/* Feature 2 */}
            <div className="flex items-start gap-6">
              <div className="w-14 h-14 rounded-full bg-[#FFF5F0] flex items-center justify-center shrink-0">
                <img src="/images/Why Choose Us Section/logo2.svg" alt="" className="w-7 h-7" />
              </div>
              <div>
                <h3 className="text-[#1A1A1A] font-sans font-semibold text-[22px] mb-2 leading-tight">Creative Plating</h3>
                <p className="text-[#666666] text-[16px] leading-relaxed max-w-[280px]">Every meal is beautifully plated, showcasing our culinary art</p>
              </div>
            </div>

            {/* Feature 3 */}
            <div className="flex items-start gap-6">
              <div className="w-14 h-14 rounded-full bg-[#FFF5F0] flex items-center justify-center shrink-0">
                <img src="/images/Why Choose Us Section/logo3.svg" alt="" className="w-7 h-7" />
              </div>
              <div>
                <h3 className="text-[#1A1A1A] font-sans font-semibold text-[22px] mb-2 leading-tight">Artisan Recipes</h3>
                <p className="text-[#666666] text-[16px] leading-relaxed max-w-[280px]">Each dish is made with our unique, handcrafted artisan recipes</p>
              </div>
            </div>

            {/* Feature 4 */}
            <div className="flex items-start gap-6">
              <div className="w-14 h-14 rounded-full bg-[#FFF5F0] flex items-center justify-center shrink-0">
                <img src="/images/Why Choose Us Section/logo4.svg" alt="" className="w-7 h-7" />
              </div>
              <div>
                <h3 className="text-[#1A1A1A] font-sans font-semibold text-[22px] mb-2 leading-tight">Locally Sourced</h3>
                <p className="text-[#666666] text-[16px] leading-relaxed max-w-[280px]">We work with local farmers to bring the best ingredients</p>
              </div>
            </div>

            {/* Feature 5 */}
            <div className="flex items-start gap-6">
              <div className="w-14 h-14 rounded-full bg-[#FFF5F0] flex items-center justify-center shrink-0">
                <img src="/images/Why Choose Us Section/logo5.svg" alt="" className="w-7 h-7" />
              </div>
              <div>
                <h3 className="text-[#1A1A1A] font-sans font-semibold text-[22px] mb-2 leading-tight">Sustainable Practices</h3>
                <p className="text-[#666666] text-[16px] leading-relaxed max-w-[280px]">We focus on reducing food waste while supporting sustainability</p>
              </div>
            </div>

            {/* Feature 6 */}
            <div className="flex items-start gap-6">
              <div className="w-14 h-14 rounded-full bg-[#FFF5F0] flex items-center justify-center shrink-0">
                <img src="/images/Why Choose Us Section/logo6.svg" alt="" className="w-7 h-7" />
              </div>
              <div>
                <h3 className="text-[#1A1A1A] font-sans font-semibold text-[22px] mb-2 leading-tight">Exceptional Service</h3>
                <p className="text-[#666666] text-[16px] leading-relaxed max-w-[280px]">Delivering personalized service for an unforgettable dining experience</p>
              </div>
            </div>
          </div>

          {/* Right Image */}
          <div className="w-full lg:w-[35%] flex justify-center lg:justify-end">
            <div className="rounded-[48px] overflow-hidden shadow-2xl w-full max-w-[380px] aspect-[4/5]">
              <Image 
                src="/images/Why Choose Us Section/Why Choose Us Section.avif" 
                alt="Chef" 
                width={380} height={475}
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </section>
      <StatsSection />

      {/* Gallery CTA Section */}
      <section className="py-12 px-6 bg-white flex flex-col items-center text-center">
        <span className="text-[#FF5C00] font-sans font-bold text-[11px] tracking-[0.25em] uppercase mb-6">
          CAPTURED WITH CARE
        </span>
        
        <h2 className="text-4xl md:text-[52px] font-serif font-medium text-[#1A1A1A] leading-tight mb-6 max-w-2xl">
          Glimpse of our creation
        </h2>
        
        <p className="text-[#666666] text-base md:text-[18px] font-sans max-w-xl mx-auto mb-10 leading-relaxed opacity-80">
          Take a look at our beautifully crafted memories<br className="hidden md:block" />
          that showcase the passion and dedication
        </p>

        <Link 
          href="/gallery"
          className="group inline-block bg-[#FF5C00] hover:bg-[#E65200] text-white px-10 py-4 rounded-full text-[15px] font-bold transition-all shadow-lg shadow-orange-500/20 hover:scale-105 active:scale-95 mb-16"
        >
          <span className="relative block overflow-hidden">
            <span className="block transition-transform duration-0 group-hover:duration-500 ease-[cubic-bezier(0.87,0,0.13,1)] group-hover:-translate-y-full">
              View All Images
            </span>
            <span className="absolute inset-0 block translate-y-full transition-transform duration-0 group-hover:duration-500 ease-[cubic-bezier(0.87,0,0.13,1)] group-hover:translate-y-0">
              View All Images
            </span>
          </span>
        </Link>

        {/* Gallery Image Grid */}
        <div className="w-full max-w-[1200px] mx-auto flex flex-wrap md:flex-nowrap items-center justify-center gap-5 px-4">
          {/* Image 1: Tallest */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.6 }}
            viewport={{ once: true }}
            className="relative w-full md:w-1/4 h-[280px] md:h-[380px] overflow-hidden rounded-[24px] group/img"
          >
            <Image src="/images/Gallery CTA Section/image1.avif" alt="Gallery 1" fill sizes="(max-width: 768px) 100vw, 25vw" className="object-cover transition-transform duration-700 group-hover/img:scale-110" />
          </motion.div>

          {/* Image 2: Medium */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            viewport={{ once: true }}
            className="relative w-full md:w-1/4 h-[220px] md:h-[300px] overflow-hidden rounded-[24px] group/img"
          >
            <Image src="/images/Gallery CTA Section/image2.avif" alt="Gallery 2" fill sizes="(max-width: 768px) 100vw, 25vw" className="object-cover transition-transform duration-700 group-hover/img:scale-110" />
          </motion.div>

          {/* Image 3: Tall */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            viewport={{ once: true }}
            className="relative w-full md:w-1/4 h-[250px] md:h-[340px] overflow-hidden rounded-[24px] group/img"
          >
            <Image src="/images/Gallery CTA Section/image3.avif" alt="Gallery 3" fill sizes="(max-width: 768px) 100vw, 25vw" className="object-cover transition-transform duration-700 group-hover/img:scale-110" />
          </motion.div>

          {/* Image 4: Shortest */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            viewport={{ once: true }}
            className="relative w-full md:w-1/4 h-[180px] md:h-[240px] overflow-hidden rounded-[24px] group/img"
          >
            <Image src="/images/Gallery CTA Section/image4.avif" alt="Gallery 4" fill sizes="(max-width: 768px) 100vw, 25vw" className="object-cover transition-transform duration-700 group-hover/img:scale-110" />
          </motion.div>
        </div>
      </section>

      {/* Reservation Process Section */}
      <section className="py-24 px-6 bg-white">
        <div className="max-w-[1200px] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
          
          {/* Left Column: Info & Testimonial */}
          <div className="flex flex-col">
            <span className="text-[#FF5C00] font-sans font-bold text-[11px] tracking-[0.25em] uppercase mb-6">
              SIMPLE RESERVATION PROCESS
            </span>
            
            <h2 className="text-4xl md:text-[52px] font-serif font-medium text-[#1A1A1A] leading-[1.1] mb-12 max-w-xl">
              Reserve your table with just a few clicks
            </h2>

            <div className="pt-4">
              <div className="flex gap-1 mb-4">
                {[1, 2, 3, 4, 5].map((s) => (
                  <Star key={s} size={16} fill="#FF5C00" className="text-[#FF5C00]" />
                ))}
              </div>
              
              <p className="text-[#1A1A1A] text-lg md:text-[20px] font-sans font-medium mb-8 leading-relaxed opacity-80">
                "An unforgettable dining experience! The food was amazing, & the service was crazy"
              </p>

              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full overflow-hidden bg-gray-100 border border-black/5">
                  <img 
                    src="/images/Reservation Process Section/sarah.webp" 
                    alt="Sarah Johnson" 
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <h4 className="text-[#1A1A1A] font-sans font-bold text-[16px]">Sarah Johnson</h4>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Steps */}
          <div className="flex flex-col gap-12">
            {[
              {
                num: "(01)",
                title: "Select your date & time",
                desc: "Choose the date that works best for your dining experience and let us know when you'll be joining us"
              },
              {
                num: "(02)",
                title: "Confirm your reservation",
                desc: "Provide your name, contact info, and number of guests to help us prepare for your arrival and everything"
              },
              {
                num: "(03)",
                title: "Confirmation & preparation",
                desc: "Review all your details carefully and confirm your booking with us for a seamless top dining experience"
              }
            ].map((step, idx) => (
              <motion.div 
                key={idx}
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.2, duration: 0.6 }}
                viewport={{ once: true }}
                className="flex gap-8 group"
              >
                <span className="text-[#FF5C00] font-sans font-bold text-[14px] pt-1">
                  {step.num}
                </span>
                <div>
                  <h3 className="text-2xl md:text-[28px] font-serif font-medium text-[#1A1A1A] mb-3 group-hover:text-[#FF5C00] transition-colors duration-300">
                    {step.title}
                  </h3>
                  <p className="text-[#666666] text-base md:text-[16px] font-sans leading-relaxed opacity-80 max-w-sm">
                    {step.desc}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>

        </div>
      </section>

      {/* Opening Time Section */}
      <section className="py-24 px-6">
        <div className="max-w-[1200px] mx-auto relative h-[600px] md:h-[700px] rounded-[48px] overflow-hidden group">
          {/* Background Image */}
          <Image 
            src="/images/opening time bg/bg.avif" 
            alt="Restaurant Interior" 
            fill
            sizes="(max-width: 1200px) 100vw, 1200px"
            className="object-cover transition-transform duration-1000 group-hover:scale-105"
          />
          
          {/* Overlay for better readability if needed */}
          <div className="absolute inset-0 bg-black/5" />

          {/* Floating Card */}
          <motion.div 
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            viewport={{ once: true }}
            className="absolute right-8 md:right-16 top-1/2 -translate-y-1/2 w-[calc(100%-64px)] md:w-[380px] bg-white rounded-[32px] p-6 md:p-10 shadow-2xl shadow-black/20"
          >
            <h2 className="text-2xl md:text-[32px] font-serif font-medium text-[#1A1A1A] mb-6">
              Opening time:
            </h2>

            <div className="space-y-3 mb-8">
              {[
                { day: "Monday", time: "Closed" },
                { day: "Tuesday", time: "11 AM - 10 PM" },
                { day: "Wednesday", time: "10AM – 08PM" },
                { day: "Thursday", time: "10 AM - 11 PM" },
                { day: "Friday", time: "Closed" },
                { day: "Saturday", time: "11 AM - 10 PM" },
                { day: "Sunday", time: "12 AM - 9 PM" }
              ].map((item, i) => (
                <div key={i} className="flex justify-between items-center pb-3 border-b border-black/5 last:border-0">
                  <span className="text-[#666666] font-sans font-medium text-sm">{item.day}</span>
                  <span className="text-[#1A1A1A] font-sans font-bold text-sm">{item.time}</span>
                </div>
              ))}
            </div>

            <Link 
              href="/book"
              className="group w-full block bg-[#FF5C00] hover:bg-[#E65200] text-white py-4 rounded-full text-[14px] font-bold transition-all text-center"
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
          </motion.div>
        </div>
      </section>

      <ReviewsSection />

      <BlogSection />

      <FaqSection />

      <CTASection />
      <Footer />
    </main>
  );
}
