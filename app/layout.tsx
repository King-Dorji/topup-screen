import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Betika | Best online sports betting and casino in kenya",
  description: "Betika | Best online sports betting and casino in kenya",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full">
      <body className="min-h-full">{children}</body>
    </html>
  );
}
