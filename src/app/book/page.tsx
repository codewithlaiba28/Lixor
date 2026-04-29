"use client";

import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import FaqSection from "@/components/FaqSection";
import { Phone, Mail, MapPin } from "lucide-react";

export default function BookPage() {
  return (
    <main className="bg-white min-h-screen">
      <Navbar />

      {/* Hero Section */}
      <section className="pt-32 pb-16 px-6 text-center">
        <motion.span 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-[#FF5C00] font-sans font-bold text-[11px] tracking-[0.2em] uppercase mb-4 block"
        >
          RESERVE YOUR TABLE
        </motion.span>
        <motion.h1 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-4xl md:text-[56px] font-serif font-medium text-[#1A1A1A] leading-tight mb-6"
        >
          Book your table & enjoy<br />a memorable meal
        </motion.h1>
        <motion.p 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-[#666666] text-[16px] max-w-2xl mx-auto leading-relaxed opacity-80"
        >
          Choose your date, time, and number of guests to enjoy a delightful dining<br className="hidden md:block" />
          experience at Lixor with exceptional flavors and ambiance.
        </motion.p>
      </section>

      {/* Booking Form Section */}
      <section className="pb-24 px-6 max-w-[1200px] mx-auto">
        <div className="flex flex-col lg:flex-row gap-12 items-stretch">
          {/* Left Side: Image */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="w-full lg:w-1/3 rounded-[32px] overflow-hidden min-h-[500px]"
          >
            <img 
              src="/images/pages/about/image3.avif" 
              alt="Dining Experience" 
              className="w-full h-full object-cover"
            />
          </motion.div>

          {/* Right Side: Form */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="w-full lg:w-2/3 flex flex-col justify-between"
          >
            <form className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-10">
              {/* Full Name */}
              <div className="flex flex-col gap-2">
                <label className="text-[#1A1A1A] font-bold text-[13px] uppercase tracking-wider">Full Name</label>
                <input 
                  type="text" 
                  placeholder="Please enter your full name" 
                  className="bg-transparent border-b border-[#E5E5E5] py-3 text-[16px] outline-none focus:border-[#FF5C00] transition-colors"
                />
              </div>

              {/* Phone Number */}
              <div className="flex flex-col gap-2">
                <label className="text-[#1A1A1A] font-bold text-[13px] uppercase tracking-wider">Phone Number</label>
                <input 
                  type="tel" 
                  placeholder="Please enter your phone number" 
                  className="bg-transparent border-b border-[#E5E5E5] py-3 text-[16px] outline-none focus:border-[#FF5C00] transition-colors"
                />
              </div>

              {/* Number of Guests */}
              <div className="flex flex-col gap-2">
                <label className="text-[#1A1A1A] font-bold text-[13px] uppercase tracking-wider">Number of Guests</label>
                <input 
                  type="text" 
                  placeholder="Number of guests attending (1-10)" 
                  className="bg-transparent border-b border-[#E5E5E5] py-3 text-[16px] outline-none focus:border-[#FF5C00] transition-colors"
                />
              </div>

              {/* Pick a Date */}
              <div className="flex flex-col gap-2">
                <label className="text-[#1A1A1A] font-bold text-[13px] uppercase tracking-wider">Pick your Date</label>
                <input 
                  type="date" 
                  className="bg-transparent border-b border-[#E5E5E5] py-3 text-[16px] outline-none focus:border-[#FF5C00] transition-colors appearance-none"
                />
              </div>

              {/* Occasion/Event Type */}
              <div className="flex flex-col gap-2 md:col-span-2">
                <label className="text-[#1A1A1A] font-bold text-[13px] uppercase tracking-wider">Occasion/Event Type</label>
                <select 
                  className="bg-transparent border-b border-[#E5E5E5] py-3 text-[16px] outline-none focus:border-[#FF5C00] transition-colors appearance-none"
                >
                  <option value="">Select...</option>
                  <option value="birthday">Birthday</option>
                  <option value="anniversary">Anniversary</option>
                  <option value="corporate">Corporate</option>
                  <option value="other">Other</option>
                </select>
              </div>

              {/* Special Requests */}
              <div className="flex flex-col gap-2 md:col-span-2">
                <label className="text-[#1A1A1A] font-bold text-[13px] uppercase tracking-wider">Special Requests</label>
                <textarea 
                  rows={2}
                  placeholder="Please provide any special requests or dietary preferences" 
                  className="bg-transparent border-b border-[#E5E5E5] py-3 text-[16px] outline-none focus:border-[#FF5C00] transition-colors resize-none"
                />
              </div>

              <div className="md:col-span-2 pt-4">
                <button 
                  type="submit"
                  className="bg-[#FF5C00] hover:bg-[#E65200] text-white px-10 py-4 rounded-full text-[16px] font-bold transition-all shadow-xl shadow-orange-500/20"
                >
                  Submit your request
                </button>
              </div>
            </form>

            {/* Contact Info Row */}
            <div className="flex flex-wrap items-center gap-10 mt-16 pt-10 border-t border-[#F5F5F5]">
              <div className="flex items-center gap-3">
                <div className="w-5 h-5 flex items-center justify-center text-[#FF5C00]">
                  <Phone size={18} />
                </div>
                <div className="flex flex-col">
                  <span className="text-[#1A1A1A] font-bold text-[12px] uppercase tracking-wider">Phone Number</span>
                  <span className="text-[#666666] text-[15px]">+1 123 456 789</span>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-5 h-5 flex items-center justify-center text-[#FF5C00]">
                  <Mail size={18} />
                </div>
                <div className="flex flex-col">
                  <span className="text-[#1A1A1A] font-bold text-[12px] uppercase tracking-wider">Email Address</span>
                  <span className="text-[#666666] text-[15px]">booking@gmail.com</span>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-5 h-5 flex items-center justify-center text-[#FF5C00]">
                  <MapPin size={18} />
                </div>
                <div className="flex flex-col">
                  <span className="text-[#1A1A1A] font-bold text-[12px] uppercase tracking-wider">Location</span>
                  <span className="text-[#666666] text-[15px]">Orangi Town</span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <FaqSection />
      <Footer />
    </main>
  );
}
