import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "PixelShop | Contact Us",
  description:
    "Get in touch with PixelShop for inquiries, support, orders, or assistance. We're here to help you shop electronics across Ethiopia.",
  openGraph: {
    title: "PixelShop | Contact Us",
    description:
      "Contact PixelShop for orders, support, and electronics services across Ethiopia.",
    url: "https://abduelectronics.com/contact",
    siteName: "PixelShop",
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
