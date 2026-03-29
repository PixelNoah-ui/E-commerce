import type { Metadata } from "next";
import AboutHero from "./page";

export const metadata: Metadata = {
  title: "About Us | Abdi Electronics",
  description:
    "Learn more about Abdi Electronics, your trusted platform for buying, selling, and renting electronics in Ethiopia. Discover our mission, vision, and commitment to quality service.",
  keywords: [
    "About Abdi Electronics",
    "electronics company Ethiopia",
    "buy and rent electronics Addis Ababa",
    "tech marketplace Ethiopia",
    "electronics services Ethiopia",
  ],
  authors: [{ name: "Abdi Electronics" }],
  creator: "Abdi Electronics",
  openGraph: {
    title: "About Abdi Electronics",
    description:
      "Discover the story behind Abdi Electronics and how we make buying, selling, and renting electronics simple and affordable in Ethiopia.",
    url: "https://abdielectronics.com/about",
    siteName: "Abdi Electronics",
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
