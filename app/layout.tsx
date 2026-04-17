import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "RifCut",
  description: "HD background remover with BiRefNet v2"
};

export default function RootLayout({
  children
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}