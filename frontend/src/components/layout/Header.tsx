import { getUser } from "@/app/(api)/getAuthUser";
import MainNav from "./mainNav";
import TopBar from "./TopBar";

export default async function Header() {
  const user = await getUser();

  return (
    <div className="sticky top-0 z-50 border-b border-slate-200 bg-white/95 backdrop-blur-xl shadow-sm">
      <TopBar />
      <MainNav user={user} />
    </div>
  );
}
