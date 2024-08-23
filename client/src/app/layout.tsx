import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { TrainingPlanProvider } from "@/lib/context/plan-context";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Stride",
  description: "A platform to generate marathon training plans for any kind of runner.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <TrainingPlanProvider>
        <body className={inter.className}>{children}</body>
      </TrainingPlanProvider>
    </html>
  );
}
