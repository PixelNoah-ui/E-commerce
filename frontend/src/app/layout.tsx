import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import Providers from "./Provider";
import { Toaster } from "@/components/ui/sonner";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "AbdulJelil Electronics | Buy & Rent Electronics in Ethiopia",
  description:
    "AbdulJelil Electronics is your trusted platform to buy, sell, and rent electronics in Ethiopia. Discover laptops, phones, cameras, and more at affordable prices.",
  keywords: [
    "AbdulJelil Electronics",
    "electronics Ethiopia",
    "buy electronics Addis Ababa",
    "rent electronics Ethiopia",
    "laptops Ethiopia",
    "phones Ethiopia",
    "camera rental Addis Ababa",
  ],
  icons: {
    icon: "/icons/logo.svg",
  },
  authors: [{ name: "AbdulJelil Electronics" }],
  creator: "AbdulJelil Electronics",
  openGraph: {
    title: "AbdulJelil Electronics",
    description:
      "Buy, sell, and rent electronics easily in Ethiopia. Affordable, reliable, and fast.",
    url: "https://abduelectronics.com",
    siteName: "AbdulJelil Electronics",
    locale: "en_ET",
    type: "website",
  },
};
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="">
        <Providers>
          <Header />
          {children}
          <Footer />
        </Providers>
        <Toaster richColors />
      </body>
    </html>
  );
}
