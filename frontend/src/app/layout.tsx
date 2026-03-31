import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import Providers from "./Provider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Abdi Electronics | Buy & Rent Electronics in Ethiopia",
  description:
    "Abdi Electronics is your trusted platform to buy, sell, and rent electronics in Ethiopia. Discover laptops, phones, cameras, and more at affordable prices.",
  keywords: [
    "Abdi Electronics",
    "electronics Ethiopia",
    "buy electronics Addis Ababa",
    "rent electronics Ethiopia",
    "laptops Ethiopia",
    "phones Ethiopia",
    "camera rental Addis Ababa",
  ],
  authors: [{ name: "Abdi Electronics" }],
  creator: "Abdi Electronics",
  openGraph: {
    title: "Abdi Electronics",
    description:
      "Buy, sell, and rent electronics easily in Ethiopia. Affordable, reliable, and fast.",
    url: "https://abdielectronics.com",
    siteName: "Abdi Electronics",
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
      </body>
    </html>
  );
}
