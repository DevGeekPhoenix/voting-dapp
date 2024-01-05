import type { Metadata } from "next";
import { Noto_Sans_Georgian } from "next/font/google";
import "./globals.css";
import Toast from "@/src/components/Toast";

const inter = Noto_Sans_Georgian({ subsets: ["georgian"] });

export const metadata: Metadata = {
  title: "Voting Dapp",
  description: "Developed by DevGeekPhoenix",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Toast />
        {children}
      </body>
    </html>
  );
}
