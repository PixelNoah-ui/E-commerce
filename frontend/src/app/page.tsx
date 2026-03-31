import CategoryProducts from "@/components/feature/CategoriesProduct";
import HeroSection from "@/components/feature/Hero";
import NewArriveProducts from "@/components/feature/NewArrive";
import OurProcess from "@/components/feature/OurProcess";

export default function Home() {
  return (
    <div className="space-y-16 ">
      <HeroSection />
      <OurProcess />
      <CategoryProducts />
      <NewArriveProducts />
    </div>
  );
}
