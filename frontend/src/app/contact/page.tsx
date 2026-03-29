import ContactSectionForm from "@/components/ContactSectionForm";
import Image from "next/image";

export default function ContactPage() {
  return (
    <div className="w-full">
      <div className="relative h-[70vh] w-full">
        <Image
          src="/images/iphone15.png"
          alt="bg"
          fill
          className="object-cover"
          priority
        />

        {/* Overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/60 to-black/80" />

        {/* Content */}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4">
          {/* ICON ROW */}
          <div className="flex items-center gap-6 mb-6">
            <Image src="/icons/phone.svg" alt="" width={42} height={42} />
            <Image src="/icons/mail.svg" alt="" width={42} height={42} />
            <Image src="/icons/truck.svg" alt="" width={42} height={42} />
          </div>

          {/* TITLE */}
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">
            Contact
          </h1>

          {/* BADGE */}
          <span className="px-6 py-2 rounded-full border border-primary text-primary text-sm font-semibold mb-6">
            Get in Touch
          </span>

          {/* BREADCRUMB */}
          <div className="flex items-center gap-3">
            <span className="bg-primary text-white px-4 py-1 text-sm font-semibold">
              HOME
            </span>
            <span className="text-white/70 text-sm font-semibold">Contact</span>
          </div>
        </div>
      </div>
      <ContactSectionForm />
    </div>
  );
}
