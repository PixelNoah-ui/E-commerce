import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import Providers from "./Provider";
import { Toaster } from "@/components/ui/sonner";
import { GoogleOAuthProvider } from "@react-oauth/google";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Meqdii Electronics | Buy & Rent Electronics in Ethiopia",
  description:
    "Meqdii Electronics is your trusted platform to buy, sell, and rent electronics in Ethiopia. Discover laptops, phones, cameras, and more at affordable prices.",
  keywords: [
    "Meqdii Electronics",
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
  authors: [{ name: "Meqdii Electronics" }],
  creator: "Meqdii Electronics",
  openGraph: {
    title: "Meqdii Electronics",
    description:
      "Buy, sell, and rent electronics easily in Ethiopia. Affordable, reliable, and fast.",
    url: "https://abduelectronics.com",
    siteName: "Meqdii Electronics",
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
          <GoogleOAuthProvider
            clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID!}
          >
            {children}
          </GoogleOAuthProvider>
          <Footer />
        </Providers>
        <Toaster richColors />
      </body>
    </html>
  );
}
