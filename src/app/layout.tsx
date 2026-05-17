import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Hệ Thống Chữ Ký Số Nội Bộ",
  description: "Xác thực văn bản nội bộ",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi">
      <body className={inter.className}>
        <main className="min-h-screen flex flex-col p-8 items-center">
          {children}
        </main>
      </body>
    </html>
  );
}
