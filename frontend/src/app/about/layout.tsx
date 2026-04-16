import type { Metadata } from "next";
import AboutHero from "./page";

export const metadata: Metadata = {
  title: "About Us | AbdulJelil Electronics",
  description:
    "Learn more about AbdulJelil Electronics, your trusted platform for buying, selling, and renting electronics in Ethiopia. Discover our mission, vision, and commitment to quality service.",
  keywords: [
    "About AbdulJelil Electronics",
    "electronics company Ethiopia",
    "buy and rent electronics Addis Ababa",
    "tech marketplace Ethiopia",
    "electronics services Ethiopia",
  ],
  authors: [{ name: "AbdulJelil Electronics" }],
  creator: "AbdulJelil Electronics",
  openGraph: {
    title: "About AbdulJelil Electronics",
    description:
      "Discover the story behind AbdulJelil Electronics and how we make buying, selling, and renting electronics simple and affordable in Ethiopia.",
    url: "https://abduelectronics.com/about",
    siteName: "AbdulJelil Electronics",
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
