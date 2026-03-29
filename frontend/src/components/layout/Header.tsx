import MainNav from "./mainNav";
import TopBar from "./TopBar";

export default function Header() {
  return (
    <div className="sticky top-0 z-50 border-b border-slate-200 bg-white/95 backdrop-blur-xl shadow-sm">
      <TopBar />
      <MainNav />
    </div>
  );
}
