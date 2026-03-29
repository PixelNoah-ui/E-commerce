import CategoryProducts from "@/components/feature/CategoriesProduct";
import HeroSection from "@/components/feature/Hero";
import NewArriveProducts from "@/components/feature/NewArrive";

export default function Home() {
  return (
    <div className="space-y-16 ">
      <HeroSection />
      <NewArriveProducts />
      <CategoryProducts />
    </div>
  );
}
