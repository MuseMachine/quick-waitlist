import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { Toaster } from "react-hot-toast";

const dmSans = localFont({
  src: "DMSans-VariableFont_opsz,wght.ttf",
});

const siteName = process.env.NEXT_PUBLIC_SITE_NAME ?? "MuseBoard Waitlist";
const siteDescription =
  process.env.NEXT_PUBLIC_SITE_DESCRIPTION ?? "Waitlist for MuseBoard";

export const metadata: Metadata = {
  title: siteName,
  description: siteDescription,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${dmSans.className}`}>
        <main className="flex justify-center items-center min-h-screen px-8">
          {children}
        </main>
        <Toaster />
      </body>
    </html>
  );
}
