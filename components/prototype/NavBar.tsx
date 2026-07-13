"use client";
import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

const navItems = [
  { href: "/", label: "首页", icon: "\u{1F3E0}" },
  { href: "/literature", label: "文献检索", icon: "\u{1F4DA}" },
  { href: "/review", label: "综述生成", icon: "\u270D\uFE0F" },
  { href: "/data-analysis", label: "数据分析", icon: "\u{1F4CA}" },
  { href: "/reference", label: "参考文献", icon: "\u{1F4DD}" },
];

export default function NavBar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  return (
    <nav className="fixed top-0 left-0 right-0 z-50">
      <div className="absolute inset-0 bg-[#0C111F]/80 backdrop-blur-xl border-b border-white/[0.06]" />
      <div className="relative max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-teal-400 to-cyan-500 flex items-center justify-center text-white font-bold text-sm">AI</div>
            <span className="text-white font-semibold text-lg hidden sm:block">科研智能体</span>
          </Link>
          <div className="hidden md:flex items-center gap-1">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link key={item.href} href={item.href} className={"relative px-4 py-2 rounded-lg text-sm font-medium transition-all " + (isActive ? "text-white" : "text-gray-400 hover:text-gray-200 hover:bg-white/[0.05]")}>
                  {isActive && <motion.div layoutId="nav-pill" className="absolute inset-0 bg-white/[0.08] rounded-lg border border-white/[0.1]" transition={{ type: "spring", stiffness: 400, damping: 30 }} />}
                  <span className="relative z-10 flex items-center gap-1.5"><span>{item.icon}</span>{item.label}</span>
                </Link>
              );
            })}
          </div>
          <button onClick={() => setMobileOpen(!mobileOpen)} className="md:hidden text-gray-400 hover:text-white p-2">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={mobileOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} /></svg>
          </button>
        </div>
      </div>
      <AnimatePresence>
        {mobileOpen && (
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="md:hidden absolute top-16 left-0 right-0 bg-[#0C111F]/95 backdrop-blur-xl border-b border-white/[0.06]">
            <div className="px-4 py-3 space-y-1">
              {navItems.map((item) => (
                <Link key={item.href} href={item.href} onClick={() => setMobileOpen(false)} className={"flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all " + (pathname === item.href ? "bg-white/[0.08] text-white" : "text-gray-400 hover:text-white hover:bg-white/[0.05]")}>
                  <span>{item.icon}</span>{item.label}
                </Link>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}