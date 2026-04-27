import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Aerial Technology Cup",
  description: "Excellence in autonomous UAV technology.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-dvh antialiased">{children}</body>
    </html>
  );
}
