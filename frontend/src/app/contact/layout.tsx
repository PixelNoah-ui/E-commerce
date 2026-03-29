import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Abdi Electronics | Contact Us",
  description:
    "Get in touch with Abdi Electronics for inquiries, support, orders, or assistance. We're here to help you buy, sell, or rent electronics across Ethiopia.",
};

export default function ContactPage({
  children,
}: {
  children: React.ReactNode;
}) {
  return <main>{children}</main>;
}
