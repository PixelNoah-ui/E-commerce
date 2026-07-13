import Image from "next/image";
import Link from "next/link";

export default function Logo() {
  return (
    <Link href="/" className="flex items-center gap-3">
      <div className="relative w-10 h-10 rounded-full overflow-hidden bg-white">
        <Image
          src="/icons/logo.svg"
          alt="PixelShop"
          fill
          className="object-contain"
        />
      </div>

      <span className="font-bold text-lg bg-gradient-primary bg-clip-text text-primary">
        PixelShop
      </span>
    </Link>
  );
}
