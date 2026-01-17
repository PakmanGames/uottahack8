import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Papa's DO-eria - DigitalOcean Infrastructure Game",
  description:
    "A Papa's Freezeria-style game where you complete Kubernetes ops tickets!",
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
