import type { Metadata } from "next";
import AboutHero from "./page";

export const metadata: Metadata = {
  title: "About Us | Meqdii Electronics",
  description:
    "Learn more about Meqdii Electronics, your trusted platform for buying, selling, and renting electronics in Ethiopia. Discover our mission, vision, and commitment to quality service.",
  keywords: [
    "About Meqdii Electronics",
    "electronics company Ethiopia",
    "buy and rent electronics Addis Ababa",
    "tech marketplace Ethiopia",
    "electronics services Ethiopia",
  ],
  authors: [{ name: "Meqdii Electronics" }],
  creator: "Meqdii Electronics",
  openGraph: {
    title: "About Meqdii Electronics",
    description:
      "Discover the story behind Meqdii Electronics and how we make buying, selling, and renting electronics simple and affordable in Ethiopia.",
    url: "https://abduelectronics.com/about",
    siteName: "Meqdii Electronics",
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
