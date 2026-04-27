"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const faqData = [
  { q: "How can I book a table at Lixor?", a: "You can book a table directly through our website by clicking the 'Book a Table' button or by calling us at +1 234 567 890." },
  { q: "Are there vegetarian options available on the menu?", a: "Yes, we offer a wide variety of vegetarian and vegan dishes. Check our menu section for specific items marked with a leaf icon." },
  { q: "What makes your sauces special?", a: "Our sauces are made from scratch daily using fresh, locally sourced ingredients and our secret blend of traditional spices." },
  { q: "Who are the chefs at Lixor?", a: "Our kitchen is led by a team of world-class chefs specializing in Mediterranean and global fusion cuisine." },
  { q: "Can I request a special dish for an event?", a: "Absolutely! We offer customized menus for private events. Please contact our events team at least two weeks in advance." },
  { q: "Do you offer gluten-free options?", a: "Yes, many of our dishes can be prepared gluten-free. Please inform your server about any allergies or dietary restrictions." }
];

export default function FaqSection() {
  const [activeFaq, setActiveFaq] = useState<number | null>(null);

  return (
    <section className="py-12 px-6 bg-white flex flex-col items-center text-center">
      <span className="text-[#FF5C00] font-sans font-bold text-[11px] tracking-[0.25em] uppercase mb-6">
        YOUR QUESTIONS, ANSWERED
      </span>
      
      <h2 className="text-4xl md:text-[52px] font-serif font-medium text-[#1A1A1A] leading-tight mb-20 max-w-2xl">
        Answers to your most<br />common questions
      </h2>

      <div className="w-full max-w-[800px] mx-auto flex flex-col">
        {faqData.map((faq, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1, duration: 0.5 }}
            viewport={{ once: true }}
            className="border-b border-black/5 flex flex-col"
          >
            <div 
              className="flex items-center justify-between py-6 group cursor-pointer"
              onClick={() => setActiveFaq(activeFaq === i ? null : i)}
            >
              <span className={`text-[16px] md:text-[18px] font-sans font-medium transition-colors duration-300 ${activeFaq === i ? 'text-[#FF5C00]' : 'text-[#1A1A1A]'} group-hover:text-[#FF5C00]`}>
                {faq.q}
              </span>
              <div className={`w-8 h-8 rounded-full bg-[#FF5C00] flex items-center justify-center text-white transition-all duration-300 shadow-lg shadow-orange-500/20 ${activeFaq === i ? 'rotate-90' : ''}`}>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </div>
            </div>
            <AnimatePresence>
              {activeFaq === i && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3, ease: "easeInOut" }}
                  className="overflow-hidden"
                >
                  <p className="text-[#666666] font-sans text-[15px] leading-relaxed pb-6 text-left max-w-2xl">
                    {faq.a}
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
