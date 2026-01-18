import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Rain Maker - Infrastructure as Clouds",
  description:
    "Rainy with a chance of rogue tech! A rogue-like game where you build DigitalOcean infrastructure and make it rain with Terraform.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  );
}
