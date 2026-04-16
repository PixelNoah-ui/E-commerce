import CategoryProducts from "@/components/feature/CategoriesProduct";
import HeroSection from "@/components/feature/Hero";
import NewArriveProducts from "@/components/feature/NewArrive";
import OurProcess from "@/components/feature/OurProcess";
import WhyChooseUs from "@/components/whyChooseUs";
import { Button } from "@/components/ui/button";
import { Send } from "lucide-react";
import Link from "next/link";

export default function Home() {
  return (
    <div className="space-y-16 ">
      <HeroSection />
      <OurProcess />
      <CategoryProducts />
      <NewArriveProducts />
      <WhyChooseUs />
      <div className="fixed bottom-6 right-6 z-50">
        {/* Wave Animation */}
        <span className="absolute inline-flex h-full w-full rounded-full bg-orange-500 opacity-75 animate-ping"></span>

        {/* Main Button */}
        <Button
          asChild
          size="icon"
          className="relative h-14 w-14 rounded-full py-4 bg-gradient-to-r from-orange-500 to-orange-600 shadow-lg hover:scale-110 transition-all duration-300"
        >
          <Link
            href="https://t.me/Abduljelilshemsu"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Send className="h-6 w-6 text-white" />
          </Link>
        </Button>
      </div>
    </div>
  );
}
