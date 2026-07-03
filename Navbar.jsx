"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, Moon, Sun, ChevronRight } from "lucide-react";
import Logo from "@/components/Logo";
import { cn } from "@/lib/utils";

const LINKS = [
  { href: "/", label: "Beranda" },
  { href: "/informasi", label: "Informasi" },
  { href: "/ekstrakurikuler", label: "Ekstrakurikuler" },
  { href: "/osis", label: "OSIS" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [dark, setDark] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const stored = localStorage.getItem("theme");
    const prefersDark = stored
      ? stored === "dark"
      : window.matchMedia("(prefers-color-scheme: dark)").matches;
    setDark(prefersDark);
    document.documentElement.classList.toggle("dark", prefersDark);
  }, []);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  function toggleDark() {
    const next = !dark;
    setDark(next);
    document.documentElement.classList.toggle("dark", next);
    localStorage.setItem("theme", next ? "dark" : "light");
  }

  return (
    <header
      className={cn(
        "sticky top-0 z-50 transition-all",
        scrolled
          ? "bg-krem-light/95 dark:bg-[#1B140D]/95 backdrop-blur border-b border-coklat-muda/30 shadow-sm"
          : "bg-transparent"
      )}
    >
      <nav className="container-page flex items-center justify-between py-3">
        <Link href="/" className="flex items-center gap-3">
          <Logo size={40} />
          <div className="leading-tight">
            <p className="font-display font-bold text-coklat-tua dark:text-krem-light text-sm sm:text-base tracking-wide">
              SMAN 16 MOJANG
            </p>
            <p className="text-[10px] sm:text-xs text-coklat dark:text-coklat-muda">
              Berkarakter • Berprestasi • Berbudaya
            </p>
          </div>
        </Link>

        <div className="hidden md:flex items-center gap-8">
          {LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "text-sm font-medium transition-colors hover:text-coklat-tua dark:hover:text-coklat-muda",
                pathname === link.href
                  ? "text-coklat-tua dark:text-coklat-muda font-semibold"
                  : "text-tinta/70 dark:text-krem-light/70"
              )}
            >
              {link.label}
            </Link>
          ))}
        </div>

        <div className="hidden md:flex items-center gap-3">
          <button
            onClick={toggleDark}
            aria-label="Ganti mode gelap"
            className="p-2 text-coklat-tua dark:text-krem-light hover:bg-coklat-muda/20 transition-colors"
          >
            {dark ? <Sun size={18} /> : <Moon size={18} />}
          </button>
          <Link href="/login" className="btn-secondary text-sm py-2 px-4">
            Login
          </Link>
          <Link href="/ppdb" className="btn-primary text-sm py-2 px-4">
            Daftar Sekarang
          </Link>
        </div>

        <button
          className="md:hidden p-2 text-coklat-tua dark:text-krem-light"
          onClick={() => setOpen(!open)}
          aria-label="Buka menu"
        >
          {open ? <X size={24} /> : <Menu size={24} />}
        </button>
      </nav>

      {open && (
        <div className="md:hidden bg-krem-light dark:bg-[#1B140D] border-t border-coklat-muda/30">
          <div className="container-page py-4 flex flex-col gap-1">
            {LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="flex items-center justify-between py-3 border-b border-coklat-muda/20 text-tinta dark:text-krem-light"
              >
                {link.label}
                <ChevronRight size={16} className="text-coklat-muda" />
              </Link>
            ))}
            <div className="flex gap-3 mt-4">
              <Link href="/login" className="btn-secondary flex-1 text-sm py-2.5">
                Login
              </Link>
              <Link href="/ppdb" className="btn-primary flex-1 text-sm py-2.5">
                Daftar
              </Link>
            </div>
            <button
              onClick={toggleDark}
              className="flex items-center gap-2 mt-4 text-sm text-coklat-tua dark:text-krem-light"
            >
              {dark ? <Sun size={16} /> : <Moon size={16} />} Mode{" "}
              {dark ? "Terang" : "Gelap"}
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
