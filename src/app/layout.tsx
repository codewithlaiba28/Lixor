import type { Metadata } from "next";
import "./globals.css";
import { Fraunces, Outfit } from "next/font/google";
import NextTopLoader from "nextjs-toploader";
import { Toaster } from "sonner";
import ChatWidget from "@/components/ChatWidget";

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
  title: "Lixor Restaurant | Fine Dining & Authentic Flavors",
  description: "Experience the art of fine dining at Lixor. Authentic flavors, cozy ambiance, and exceptional service in the heart of the city. Book your table today!",
  keywords: ["restaurant", "fine dining", "Lixor", "authentic flavors", "food", "dining experience", "book a table"],
  authors: [{ name: "Lixor Team" }],
  creator: "Lixor",
  publisher: "Lixor Restaurant",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL("https://lixor-restaurant.vercel.app"), // Placeholder, update with actual domain if known
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Lixor Restaurant | Fine Dining & Authentic Flavors",
    description: "Experience the art of fine dining at Lixor. Authentic flavors, cozy ambiance, and exceptional service.",
    url: "https://lixor-restaurant.vercel.app",
    siteName: "Lixor Restaurant",
    images: [
      {
        url: "/images/og-image.jpg", // We should create this or use an existing one
        width: 1200,
        height: 630,
        alt: "Lixor Restaurant Interior",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Lixor Restaurant | Fine Dining",
    description: "Experience the art of fine dining at Lixor.",
    images: ["/images/og-image.jpg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
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
        <ChatWidget />
      </body>
    </html>
  );
}
