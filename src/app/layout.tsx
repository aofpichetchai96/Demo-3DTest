import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import AuthProvider from "@/components/AuthProvider";
import Navigation from "@/components/Navigation";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "รองเท้านันยาง OEM - ออกแบบรองเท้าตามใจคุณ",
  description: "เว็บไซต์สำหรับออกแบบและสั่งผลิตรองเท้านันยางตามต้องการ พร้อมเครื่องมือ 3D และระบบจัดการครบครอง",
  keywords: ["รองเท้า", "OEM", "นันยาง", "ออกแบบ", "3D", "customization"],
  icons: {
    icon: "/images/logo-nanyang.png",
    shortcut: "/images/logo-nanyang.png",
    apple: "/images/logo-nanyang.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="th">
      <body className={inter.className}>
        <AuthProvider>
          <Navigation />
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
