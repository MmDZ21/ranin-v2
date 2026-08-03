import type { Metadata } from "next";
import localFont from "next/font/local";
import DirectionProvider from "@/components/layout/DirectionProvider";
import "./globals.css";

const iranSans = localFont({
  src: [
    { path: "../public/fonts/IranSansRegular.ttf", weight: "400", style: "normal" },
    { path: "../public/fonts/IranSansBold.ttf", weight: "700", style: "normal" },
  ],
  variable: "--font-iran-sans",
  display: "swap",
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
const siteName = "رانین فرایند";
const description =
  "تأمین و عرضه رله‌های حفاظتی و تجهیزات حفاظت الکتریکی صنعتی برای پست‌ها و تابلوهای برق.";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: `${siteName} | تجهیزات حفاظت الکتریکی صنعتی`,
    template: `%s | ${siteName}`,
  },
  description,
  applicationName: siteName,
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "fa_IR",
    siteName,
    url: siteUrl,
    title: `${siteName} | تجهیزات حفاظت الکتریکی صنعتی`,
    description,
  },
  twitter: {
    card: "summary_large_image",
    title: `${siteName} | تجهیزات حفاظت الکتریکی صنعتی`,
    description,
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fa" dir="rtl">
      <body className={`${iranSans.variable} antialiased`}>
        <DirectionProvider>{children}</DirectionProvider>
      </body>
    </html>
  );
}
