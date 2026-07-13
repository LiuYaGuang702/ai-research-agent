import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "AI 科研智能体",
  description: "基于通用智能体的 AI 科研辅助系统",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="zh-CN" suppressHydrationWarning>
      <body suppressHydrationWarning className="min-h-screen">{children}</body>
    </html>
  );
}