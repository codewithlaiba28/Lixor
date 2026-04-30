import type { Metadata } from "next";
import "./globals.css";
import { Fraunces, Outfit } from "next/font/google";
import NextTopLoader from "nextjs-toploader";
import { Toaster } from "sonner";

const fraunces = Fraunces({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-fraunces",
  weight: ["400", "500", "600", "700"],
});

const outfit = Outfit({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-outfit",
  weight: ["300", "400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: "Lixor Restaurant | Fine Dining",
  description: "Experience the art of fine dining at Lixor.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${fraunces.variable} ${outfit.variable}`}>
      <body className="antialiased">
        <NextTopLoader 
          color="#FF5C00"
          initialPosition={0.08}
          crawlSpeed={200}
          height={3}
          crawl={true}
          showSpinner={false}
          easing="ease"
          speed={200}
          shadow="0 0 10px #FF5C00,0 0 5px #FF5C00"
        />
        <Toaster position="bottom-right" richColors theme="dark" />
        {children}
      </body>
    </html>
  );
}
