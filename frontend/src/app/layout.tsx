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
  title: "PixelShop | Electronics E-commerce in Ethiopia",
  description:
    "PixelShop is your trusted online destination for electronics in Ethiopia. Discover laptops, phones, cameras, and more at competitive prices.",
  keywords: [
    "PixelShop",
    "electronics Ethiopia",
    "buy electronics Addis Ababa",
    "online electronics Ethiopia",
    "laptops Ethiopia",
    "phones Ethiopia",
    "camera shop Ethiopia",
  ],
  icons: {
    icon: "/icons/logo.svg",
  },
  authors: [{ name: "PixelShop" }],
  creator: "PixelShop",
  openGraph: {
    title: "PixelShop",
    description:
      "Shop electronics online in Ethiopia with fast delivery, trusted products, and great deals.",
    url: "https://abduelectronics.com",
    siteName: "PixelShop",
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
