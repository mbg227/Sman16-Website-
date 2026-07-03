"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  Megaphone,
  Trophy,
  Users2,
  Image as ImageIcon,
  Settings,
  LogOut,
  Menu,
  X,
  Loader2,
} from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import Logo from "@/components/Logo";
import { cn } from "@/lib/utils";

const MENU = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/pendaftar", label: "Data Pendaftar", icon: Users },
  { href: "/admin/informasi", label: "Informasi", icon: Megaphone },
  { href: "/admin/ekstrakurikuler", label: "Ekstrakurikuler", icon: Trophy },
  { href: "/admin/osis", label: "OSIS", icon: Users2 },
  { href: "/admin/galeri", label: "Galeri", icon: ImageIcon },
  { href: "/admin/pengaturan", label: "Pengaturan Website", icon: Settings },
];

export default function AdminLayout({ children }) {
  const { user, isAdmin, loading, signOut } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    if (!loading && !isAdmin) {
      router.replace("/login/admin");
    }
  }, [loading, isAdmin, router]);

  if (loading || !isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-krem">
        <Loader2 className="animate-spin text-coklat-tua" size={28} />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex bg-krem dark:bg-[#1B140D]">
      {/* Sidebar */}
      <aside
        className={cn(
          "fixed lg:static z-40 inset-y-0 left-0 w-64 bg-coklat-tua text-krem-light flex flex-col transition-transform lg:translate-x-0",
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex items-center gap-3 px-6 py-5 border-b border-krem/10">
          <Logo size={36} />
          <div>
            <p className="font-display font-bold text-sm leading-tight">SMAN 16 MOJANG</p>
            <p className="text-[11px] text-krem/60">Panel Admin</p>
          </div>
        </div>

        <nav className="flex-1 px-3 py-6 space-y-1 overflow-y-auto">
          {MENU.map((item) => {
            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setSidebarOpen(false)}
                className={cn(
                  "flex items-center gap-3 px-3.5 py-2.5 text-sm font-medium transition-colors",
                  active ? "bg-krem-light text-coklat-tua" : "text-krem/75 hover:bg-krem/10"
                )}
              >
                <item.icon size={17} /> {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="px-3 py-4 border-t border-krem/10">
          <p className="px-3.5 text-xs text-krem/50 mb-2 truncate">{user?.email}</p>
          <button
            onClick={() => signOut().then(() => router.push("/login/admin"))}
            className="flex items-center gap-3 px-3.5 py-2.5 text-sm font-medium text-krem/75 hover:bg-krem/10 w-full transition-colors"
          >
            <LogOut size={17} /> Logout
          </button>
        </div>
      </aside>

      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-30 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main */}
      <div className="flex-1 min-w-0">
        <div className="lg:hidden flex items-center justify-between px-4 py-3 bg-coklat-tua text-krem-light">
          <div className="flex items-center gap-2">
            <Logo size={28} />
            <span className="font-display font-semibold text-sm">Panel Admin</span>
          </div>
          <button onClick={() => setSidebarOpen(!sidebarOpen)}>
            {sidebarOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
        <main className="p-5 sm:p-8">{children}</main>
      </div>
    </div>
  );
}
