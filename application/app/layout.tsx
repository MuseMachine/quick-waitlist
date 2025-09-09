import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { Toaster } from "react-hot-toast";

const dmSans = localFont({
  src: "DMSans-VariableFont_opsz,wght.ttf",
});

const siteName = process.env.NEXT_PUBLIC_SITE_NAME ?? "Quick Waitlist";
const siteDescription =
  process.env.NEXT_PUBLIC_SITE_DESCRIPTION ??
  "Quick Waitlist and coming soon page for your SAAS and website.";

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
        <main className="flex justify-center items-center min-h-screen">
          {children}
        </main>
        <Toaster />
      </body>
    </html>
  );
}
