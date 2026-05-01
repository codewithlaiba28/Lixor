"use client";

import Link from "next/link";
import { motion } from "framer-motion";

export default function Footer() {
  return (
    <footer className="bg-white pt-24 pb-6 px-6 border-t border-black/5">
      <div className="max-w-[1200px] mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 lg:gap-8">
        
        {/* Brand Column */}
        <div className="lg:col-span-2">
          <h2 className="text-[32px] font-serif font-bold text-[#1A1A1A] mb-6">
            Lixor
          </h2>
          <p className="text-[#666666] text-lg max-w-[280px] mb-10 leading-relaxed font-sans">
            A modern Framer template for premium Restaurants
          </p>
          <div className="flex items-center gap-4">
            <span className="text-[#1A1A1A] font-sans font-bold text-[15px]">Follow us</span>
            <div className="flex gap-3">
              {[
                { name: 'X', path: 'M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z' },
                { name: 'Instagram', path: 'M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.266.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0c-3.263 0-3.67.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.277-.073 1.684-.073 4.948 0 3.263.014 3.67.072 4.947.2 4.358 2.618 6.78 6.98 6.98 1.277.058 1.684.073 4.948.073 3.263 0 3.67-.014 4.947-.072 4.354-.2 6.78-2.618 6.98-6.98.058-1.277.072-1.684.072-4.948 0-3.263-.014-3.67-.072-4.947-.2-4.358-2.618-6.78-6.98-6.98-1.277-.058-1.684-.072-4.948-.072zM12 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4.162 4.162 0 110-8.324 4.162 4.162 0 010 8.324zM18.406 3.594a1.44 1.44 0 100 2.88 1.44 1.44 0 000-2.88z' },
                { name: 'Facebook', path: 'M22.675 0h-21.35c-.732 0-1.325.593-1.325 1.325v21.351c0 .731.593 1.324 1.325 1.324h11.495v-8.783h-2.954v-3.429h2.954v-2.527c0-2.925 1.787-4.516 4.396-4.516 1.25 0 2.324.093 2.637.135v3.057h-1.81c-1.419 0-1.694.675-1.694 1.664v2.187h3.384l-.441 3.429h-2.943v8.783h6.113c.731 0 1.325-.593 1.325-1.324v-21.351c0-.732-.593-1.325-1.325-1.325z' },
                { name: 'TikTok', path: 'M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.9-.32-1.98-.23-2.81.33-.85.51-1.44 1.43-1.58 2.41-.14.99.13 2.02.74 2.8.65.82 1.65 1.34 2.67 1.41 1.28.1 2.6-.47 3.32-1.55.54-.82.68-1.81.65-2.77.01-4.75.01-9.51 0-14.27z' }
              ].map((social, i) => (
                <motion.div
                  key={social.name}
                  initial={{ opacity: 0, scale: 0 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ 
                    type: "spring", 
                    stiffness: 260, 
                    damping: 20, 
                    delay: i * 0.1 
                  }}
                  viewport={{ once: true }}
                >
                  <Link href="#" className="w-8 h-8 rounded-full border border-black/5 flex items-center justify-center hover:bg-black hover:text-white transition-all">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                      <path d={social.path} />
                    </svg>
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        {/* Menu Column */}
        <div>
          <h3 className="text-[17px] font-sans font-bold text-[#1A1A1A] mb-6">Menu</h3>
          <div className="flex flex-col gap-4">
            {[
              { name: 'Home', href: '/' },
              { name: 'About', href: '/about' },
              { name: 'Book a table', href: '/book' },
              { name: 'Gallery', href: '/gallery' },
              { name: 'Error 404', href: '/404' }
            ].map((item) => (
              <Link 
                key={item.name} 
                href={item.href} 
                className="text-[#666666] text-[15px] hover:text-[#FF5C00] transition-all hover:tracking-wider duration-500 font-sans"
              >
                {item.name}
              </Link>
            ))}
          </div>
        </div>


        {/* CMS Pages Column */}
        <div>
          <h3 className="text-[17px] font-sans font-bold text-[#1A1A1A] mb-6">CMS Pages</h3>
          <div className="flex flex-col gap-4">
            {[
              { name: 'Menu', href: '/menu' },
              { name: 'Chef', href: '/chef' },
              { name: 'Blog', href: '/blog' }
            ].map((item) => (
              <Link key={item.name} href={item.href} className="text-[#666666] text-[15px] hover:text-[#FF5C00] transition-colors font-sans">
                {item.name}
              </Link>
            ))}
          </div>
        </div>

        {/* Contact Column */}
        <div>
          <h3 className="text-[17px] font-sans font-bold text-[#1A1A1A] mb-6">Contact</h3>
          <div className="flex flex-col gap-5">
            <Link href="mailto:testing@gmail.com" className="flex items-center gap-3 text-[#666666] text-[15px] hover:text-[#FF5C00] transition-colors font-sans">
              <div className="w-8 h-8 rounded-full bg-orange-50 flex items-center justify-center text-[#FF5C00]">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/></svg>
              </div>
              testing@gmail.com
            </Link>
            <Link href="tel:+123456789" className="flex items-center gap-3 text-[#666666] text-[15px] hover:text-[#FF5C00] transition-colors font-sans">
              <div className="w-8 h-8 rounded-full bg-orange-50 flex items-center justify-center text-[#FF5C00]">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/></svg>
              </div>
              +123 456 789
            </Link>
            <div className="flex items-center gap-3 text-[#666666] text-[15px] font-sans">
              <div className="w-8 h-8 rounded-full bg-orange-50 flex items-center justify-center text-[#FF5C00]">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
              </div>
              Los Angeles
            </div>
          </div>
        </div>

      </div>

      {/* Bottom Bar */}
      <div className="max-w-[1200px] mx-auto mt-12 pt-0 flex flex-col md:flex-row justify-between items-center gap-6 text-[#999] text-[13px] font-sans">
        <p>© 2025 Lixor. All rights reserved.</p>
      </div>
    </footer>
  );
}
