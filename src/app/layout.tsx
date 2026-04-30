import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Lixor Restaurant | Fine Dining",
  description: "Experience the art of fine dining at Lixor.",
};

import NextTopLoader from "nextjs-toploader";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,100..900;1,9..144,100..900&family=Outfit:wght@100..900&display=swap" rel="stylesheet" />
      </head>
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
        {children}
      </body>
    </html>
  );
}

