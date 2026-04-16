import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Abdu Electronics | Contact Us",
  description:
    "Get in touch with Abdu Electronics for inquiries, support, orders, or assistance. We're here to help you buy, sell, or rent electronics across Ethiopia.",
  openGraph: {
    title: "Abdu Electronics | Contact Us",
    description:
      "Contact Abdu Electronics for orders, support, and electronics services across Ethiopia.",
    url: "https://abduelectronics.com/contact",
    siteName: "Abdu Electronics",
    locale: "en_ET",
    type: "website",
  },
};

export default function ContactPage({
  children,
}: {
  children: React.ReactNode;
}) {
  return <main>{children}</main>;
}
