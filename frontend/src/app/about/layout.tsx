import type { Metadata } from "next";
import AboutHero from "./page";

export const metadata: Metadata = {
  title: "About Us | PixelShop",
  description:
    "Learn more about PixelShop, your trusted online electronics store in Ethiopia. Discover our mission, service, and commitment to quality.",
  keywords: [
    "About PixelShop",
    "electronics company Ethiopia",
    "online electronics Addis Ababa",
    "tech marketplace Ethiopia",
    "electronics services Ethiopia",
  ],
  authors: [{ name: "PixelShop" }],
  creator: "PixelShop",
  openGraph: {
    title: "About PixelShop",
    description:
      "Discover the story behind PixelShop and how we make buying electronics simple, affordable, and reliable in Ethiopia.",
    url: "https://abduelectronics.com/about",
    siteName: "PixelShop",
    locale: "en_ET",
    type: "website",
  },
};

export default function AboutPage() {
  return (
    <main>
      <AboutHero />
    </main>
  );
}
