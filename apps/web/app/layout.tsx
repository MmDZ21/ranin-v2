import DirectionProvider from "@/components/layout/DirectionProvider";
import "./globals.css";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fa" dir="rtl">
      <body
        className={`antialiased`}
      >
        <DirectionProvider>
          {children}
        </DirectionProvider>
      </body>
    </html>
  );
}
