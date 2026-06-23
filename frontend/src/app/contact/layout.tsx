import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Meqdii Electronics | Contact Us",
  description:
    "Get in touch with Meqdii Electronics for inquiries, support, orders, or assistance. We're here to help you buy, sell, or rent electronics across Ethiopia.",
  openGraph: {
    title: "Meqdii Electronics | Contact Us",
    description:
      "Contact Meqdii Electronics for orders, support, and electronics services across Ethiopia.",
    url: "https://abduelectronics.com/contact",
    siteName: "Meqdii Electronics",
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
