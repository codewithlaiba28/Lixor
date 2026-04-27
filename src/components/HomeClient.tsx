"use client";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import MenuSection from "@/components/MenuSection";
import StatsSection from "@/components/StatsSection";
import { Star, MapPin } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";
import ReviewsSection from "@/components/ReviewsSection";
import FaqSection from "@/components/FaqSection";
import CTASection from "@/components/CTASection";
import BlogSection from "@/components/BlogSection";

export default function HomeClient() {
  return (
    <main className="bg-white overflow-hidden relative min-h-screen">
      {/* Global Background Glows */}
      <div className="absolute top-[400px] -left-[20vw] w-[50vw] h-[800px] bg-[#FF5C00]/[0.05] rounded-full blur-[150px] pointer-events-none" />
      <div className="absolute top-[400px] -right-[20vw] w-[50vw] h-[800px] bg-[#FF5C00]/[0.05] rounded-full blur-[150px] pointer-events-none" />

      <Navbar />

      {/* Hero Section */}
      <section className="relative pt-32 md:pt-44 pb-4 px-6">
        <div className="max-w-4xl mx-auto flex flex-col items-center text-center z-10 relative">
          <motion.span 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-[#FF5C00] font-sans font-semibold text-[11px] tracking-[0.15em] uppercase mb-4"
          >
            PREMIUM RESTAURANT TEMPLATE
          </motion.span>

          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-[64px] font-serif font-medium text-[#1A1A1A] leading-[1.05] tracking-tight mb-6"
          >
            Where every meal is<br />a chef masterpiece
          </motion.h1>

          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-[#666666] text-base md:text-[18px] max-w-xl mx-auto mb-10 font-sans leading-relaxed"
          >
            We bring you the finest flavors, carefully crafted with<br className="hidden md:block" />the freshest ingredients in every meal.
          </motion.p>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center gap-6"
          >
            <Link
              href="/book"
              className="group inline-block bg-[#FF5C00] hover:bg-[#E65200] text-white px-10 py-4 rounded-full text-[15px] font-bold transition-all shadow-xl shadow-orange-500/20"
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

            <div className="flex items-center gap-2">
              <span className="font-bold text-[#1A1A1A] text-[15px]">(4.9/5)</span>
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={18} fill="#FF5C00" className="text-[#FF5C00]" />
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Featured Dishes Section */}
      <section className="relative px-6 max-w-[1200px] mx-auto mt-20 md:mt-28 pb-8 z-10">
        <div className="grid grid-cols-2 md:flex md:flex-row items-center justify-between gap-8 md:gap-0">
          {[
            { name: "Main Course", img: "main-course.avif", icon: "main-course.svg", offset: false },
            { name: "Desserts", img: "dessert.avif", icon: "desserts.svg", offset: true },
            { name: "Appetizer", img: "appetizer.avif", icon: "appetizer.svg", offset: false },
            { name: "Starter", img: "starter.avif", icon: "starte.svg", offset: true }
          ].map((item, i) => (
            <div key={i} className={`flex flex-col items-center gap-6 ${item.offset ? 'md:-translate-y-12' : ''}`}>
              <div className="relative group w-[140px] md:w-[170px]">
                <div className="w-full aspect-[2/3] bg-neutral-100 rounded-[999px] overflow-hidden shadow-sm relative">
                  <img src={`/images/menu-categories/${item.img}`} alt={item.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                </div>
                <div className="absolute top-[10%] right-[12%] w-10 h-10 bg-[#FF5C00] rounded-full text-white shadow-xl shadow-orange-500/30 transform translate-x-1/2 -translate-y-1/2 z-20 overflow-hidden">
                  <div className="relative w-full h-full">
                    <div className="absolute inset-0 flex items-center justify-center transition-transform duration-0 group-hover:duration-500 ease-[cubic-bezier(0.87,0,0.13,1)] group-hover:-translate-y-full">
                      <img src={`/images/menu-categories/logo/${item.icon}`} alt="" className="w-[18px] h-[18px]" />
                    </div>
                    <div className="absolute inset-0 flex items-center justify-center translate-y-full transition-transform duration-0 group-hover:duration-500 ease-[cubic-bezier(0.87,0,0.13,1)] group-hover:translate-y-0">
                      <img src={`/images/menu-categories/logo/${item.icon}`} alt="" className="w-[18px] h-[18px]" />
                    </div>
                  </div>
                </div>
              </div>
              <span className="font-sans font-medium text-[#1A1A1A] text-[15px] md:text-[17px]">{item.name}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Dining Experience Section */}
      <section className="relative px-6 max-w-[1200px] mx-auto mt-16 md:mt-24 pb-12 z-10 flex flex-col md:flex-row items-center gap-12 md:gap-20">
        <div className="w-full md:w-1/2">
          <div className="rounded-[32px] overflow-hidden aspect-[4/3] shadow-lg">
            <img src="/images/dining-couple.png" alt="Couple dining" className="w-full h-full object-cover" />
          </div>
        </div>

        <div className="w-full md:w-1/2 flex flex-col items-start text-left">
          <div className="flex items-center gap-2 mb-6">
            <img src="/images/about/best-dining-experience.avif" alt="" className="h-[32px] w-auto opacity-80" />
            <span className="text-[#1A1A1A] font-medium text-[15px]">Best Dining Experience</span>
            <img src="/images/about/best-dining-experience1.avif" alt="" className="h-[32px] w-auto opacity-80" />
          </div>

          <h2 className="text-3xl md:text-5xl font-serif font-medium text-[#1A1A1A] leading-[1.15] tracking-tight mb-6">
            Best dining experience<br className="hidden md:block" />with every dish
          </h2>

          <p className="text-[#666666] text-base font-sans leading-relaxed mb-10 max-w-md">
            We believe dining is more than just a meal; it's an experience. Our chefs create dishes that combine the freshest ingredients.
          </p>

          <Link
            href="https://maps.app.goo.gl/JMy8MfM3oyhN46zQ8"
            target="_blank"
            className="inline-flex bg-[#FF5C00] rounded-2xl py-2.5 px-3 pr-5 items-center gap-3 shadow-xl shadow-orange-500/20 hover:-translate-y-1 transition-all group cursor-pointer"
          >
            <div className="w-14 h-14 rounded-md overflow-hidden shrink-0 border border-white/10">
              <img src="/images/about/about.avif" alt="Dish" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-125" />
            </div>
            <div className="flex flex-col">
              <span className="text-white font-serif text-[16px] leading-tight mb-1 text-left">Dastarkhan, Orangi Town</span>
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
      <section className="relative px-6 max-w-[1100px] mx-auto mt-8 md:mt-12 pb-12 md:pb-16 z-10 grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-16 lg:gap-24 text-center">
        {[
          { n: "01", t: "Authentic Flavors", d: "We take pride in offering an array of dishes made with love & quality" },
          { n: "02", t: "Cozy Ambiance", d: "Our restaurant provides the perfect setting to enjoy your food" },
          { n: "03", t: "Exceptional Service", d: "Our team is dedicated to making your dining experience smooth" }
        ].map((f, i) => (
          <div key={i} className="flex flex-col items-center">
            <span className="text-[48px] md:text-[56px] font-serif font-medium text-[#1A1A1A] leading-none mb-6">{f.n}</span>
            <h3 className="text-[20px] font-serif font-medium text-[#1A1A1A] mb-3">{f.t}</h3>
            <p className="text-[#666666] text-[15px] font-sans leading-relaxed max-w-[260px]">
              {f.d}
            </p>
          </div>
        ))}
      </section>

      <MenuSection />

      {/* Why Choose Us Section */}
      <section className="relative px-6 max-w-[1280px] mx-auto mt-16 pb-24 z-10">
        <div className="text-center mb-16">
          <span className="text-[#FF5C00] font-sans font-semibold text-[11px] tracking-[0.15em] uppercase mb-4 block">
            DISCOVER WHAT MAKES US SPECIAL
          </span>
          <h2 className="text-4xl md:text-[48px] font-serif font-medium text-[#1A1A1A] leading-[1.1] tracking-tight">
            Why choose Dastarkhan for<br className="hidden md:block" />your dining expertise
          </h2>
        </div>

        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-24">
          <div className="w-full lg:w-[65%] grid grid-cols-1 md:grid-cols-2 gap-x-16 gap-y-12">
            {[
              { id: 1, t: "Fresh Ingredients", d: "Only the freshest ingredients are used in our dishes daily" },
              { id: 2, t: "Creative Plating", d: "Every meal is beautifully plated, showcasing our culinary art" },
              { id: 3, t: "Artisan Recipes", d: "Each dish is made with our unique, handcrafted artisan recipes" },
              { id: 4, t: "Locally Sourced", d: "We work with local farmers to bring the best ingredients" },
              { id: 5, t: "Sustainable Practices", d: "We focus on reducing food waste while supporting sustainability" },
              { id: 6, t: "Exceptional Service", d: "Delivering personalized service for an unforgettable dining experience" }
            ].map((item) => (
              <div key={item.id} className="flex items-start gap-6 text-left">
                <div className="w-14 h-14 rounded-full bg-[#FFF5F0] flex items-center justify-center shrink-0">
                  <img src={`/images/Why Choose Us Section/logo${item.id}.svg`} alt="" className="w-7 h-7" />
                </div>
                <div>
                  <h3 className="text-[#1A1A1A] font-sans font-semibold text-[20px] md:text-[22px] mb-2 leading-tight">{item.t}</h3>
                  <p className="text-[#666666] text-[15px] md:text-[16px] leading-relaxed max-w-[280px]">{item.d}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="w-full lg:w-[35%] flex justify-center lg:justify-end">
            <div className="rounded-[48px] overflow-hidden shadow-2xl w-full max-w-[380px] aspect-[4/5]">
              <img src="/images/Why Choose Us Section/Why Choose Us Section.avif" alt="Chef" className="w-full h-full object-cover" />
            </div>
          </div>
        </div>
      </section>

      <StatsSection />

      {/* Gallery CTA Section */}
      <section className="py-20 px-6 bg-white flex flex-col items-center text-center">
        <span className="text-[#FF5C00] font-sans font-bold text-[11px] tracking-[0.25em] uppercase mb-6">
          CAPTURED WITH CARE
        </span>
        <h2 className="text-4xl md:text-[52px] font-serif font-medium text-[#1A1A1A] leading-tight mb-6 max-w-2xl">
          Glimpse of our creation
        </h2>
        <p className="text-[#666666] text-base md:text-[18px] font-sans max-w-xl mx-auto mb-10 leading-relaxed opacity-80">
          Take a look at our beautifully crafted memories<br className="hidden md:block" />that showcase the passion and dedication.
        </p>

        <Link 
          href="/gallery"
          className="group inline-block bg-[#FF5C00] hover:bg-[#E65200] text-white px-10 py-4 rounded-full text-[15px] font-bold transition-all shadow-lg shadow-orange-500/20 mb-16"
        >
          <span className="relative block overflow-hidden">
            <span className="block transition-transform duration-0 group-hover:duration-500 ease-[cubic-bezier(0.87,0,0.13,1)] group-hover:-translate-y-full">View All Images</span>
            <span className="absolute inset-0 block translate-y-full transition-transform duration-0 group-hover:duration-500 ease-[cubic-bezier(0.87,0,0.13,1)] group-hover:translate-y-0">View All Images</span>
          </span>
        </Link>

        <div className="w-full max-w-[1200px] mx-auto grid grid-cols-2 md:grid-cols-4 gap-4 px-4">
          {[
            { img: "image1.avif", h: "h-[250px] md:h-[380px]" },
            { img: "image2.avif", h: "h-[200px] md:h-[300px] mt-8" },
            { img: "image3.avif", h: "h-[230px] md:h-[340px]" },
            { img: "image4.avif", h: "h-[180px] md:h-[240px] mt-4" }
          ].map((item, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1, duration: 0.6 }}
              viewport={{ once: true }}
              className={`${item.h} overflow-hidden rounded-[24px] group/img`}
            >
              <img src={`/images/Gallery CTA Section/${item.img}`} alt="" className="w-full h-full object-cover transition-transform duration-700 group-hover/img:scale-110" />
            </motion.div>
          ))}
        </div>
      </section>

      {/* Reservation Process Section */}
      <section className="py-24 px-6 bg-white">
        <div className="max-w-[1200px] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
          <div className="flex flex-col text-left">
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
                &quot;An unforgettable dining experience! The food was amazing, and the service was top-notch.&quot;
              </p>
              <div className="flex items-center gap-4">
                <img src="/images/Reservation Process Section/sarah.webp" alt="Sarah Johnson" className="w-12 h-12 rounded-full overflow-hidden object-cover border border-black/5" />
                <h4 className="text-[#1A1A1A] font-sans font-bold text-[16px]">Sarah Johnson</h4>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-12">
            {[
              { num: "(01)", t: "Select your date & time", d: "Choose the date that works best for your dining experience and let us know when you'll be joining us" },
              { num: "(02)", t: "Confirm your reservation", d: "Provide your name, contact info, and number of guests to help us prepare for your arrival" },
              { num: "(03)", t: "Confirmation & preparation", d: "Review all your details carefully and confirm your booking with us for a seamless dining experience" }
            ].map((step, idx) => (
              <motion.div 
                key={idx}
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.2, duration: 0.6 }}
                viewport={{ once: true }}
                className="flex gap-8 group text-left"
              >
                <span className="text-[#FF5C00] font-sans font-bold text-[14px] pt-1">{step.num}</span>
                <div>
                  <h3 className="text-2xl md:text-[28px] font-serif font-medium text-[#1A1A1A] mb-3 group-hover:text-[#FF5C00] transition-colors duration-300">{step.t}</h3>
                  <p className="text-[#666666] text-base font-sans leading-relaxed opacity-80 max-w-sm">{step.d}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Opening Time Section */}
      <section className="py-24 px-6">
        <div className="max-w-[1200px] mx-auto relative h-[600px] md:h-[700px] rounded-[32px] md:rounded-[48px] overflow-hidden group">
          <img src="/images/opening time bg/bg.avif" alt="Restaurant Interior" className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105" />
          <div className="absolute inset-0 bg-black/10" />
          <motion.div 
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            viewport={{ once: true }}
            className="absolute right-4 md:right-16 top-1/2 -translate-y-1/2 w-[calc(100%-32px)] md:w-[380px] bg-white rounded-[32px] p-8 md:p-10 shadow-2xl shadow-black/20"
          >
            <h2 className="text-2xl md:text-[32px] font-serif font-medium text-[#1A1A1A] mb-6 text-left">Opening time:</h2>
            <div className="space-y-3 mb-8">
              {[
                { d: "Monday", t: "Closed" }, { d: "Tuesday", t: "11 AM - 10 PM" }, { d: "Wednesday", t: "10AM – 08PM" }, { d: "Thursday", t: "10 AM - 11 PM" }, { d: "Friday", t: "Closed" }, { d: "Saturday", t: "11 AM - 10 PM" }, { d: "Sunday", t: "12 AM - 9 PM" }
              ].map((item, i) => (
                <div key={i} className="flex justify-between items-center pb-3 border-b border-black/5 last:border-0">
                  <span className="text-[#666666] font-sans font-medium text-sm">{item.d}</span>
                  <span className="text-[#1A1A1A] font-sans font-bold text-sm">{item.t}</span>
                </div>
              ))}
            </div>
            <Link href="/book" className="group w-full block bg-[#FF5C00] hover:bg-[#E65200] text-white py-4 rounded-full text-[14px] font-bold transition-all text-center">
              <span className="relative block overflow-hidden">
                <span className="block transition-transform duration-0 group-hover:duration-500 ease-[cubic-bezier(0.87,0,0.13,1)] group-hover:-translate-y-full">Book a table</span>
                <span className="absolute inset-0 block translate-y-full transition-transform duration-0 group-hover:duration-500 ease-[cubic-bezier(0.87,0,0.13,1)] group-hover:translate-y-0">Book a table</span>
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
