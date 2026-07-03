import { Space_Grotesk, Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/lib/auth-context";
import { Toaster } from "react-hot-toast";
import SiteChrome from "@/components/SiteChrome";

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  variable: "--font-space-grotesk",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata = {
  title: "SMAN 16 MOJANG — Berkarakter, Berprestasi, Berbudaya",
  description:
    "Website resmi SMAN 16 MOJANG. Informasi sekolah, ekstrakurikuler, OSIS, dan Penerimaan Peserta Didik Baru (PPDB) online.",
  keywords: [
    "SMAN 16 MOJANG",
    "PPDB",
    "sekolah negeri",
    "penerimaan siswa baru",
  ],
  openGraph: {
    title: "SMAN 16 MOJANG",
    description: "Berkarakter • Berprestasi • Berbudaya",
    type: "website",
    locale: "id_ID",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="id" className={`${spaceGrotesk.variable} ${inter.variable}`}>
      <body>
        <AuthProvider>
          <SiteChrome>{children}</SiteChrome>
          <Toaster
            position="top-center"
            toastOptions={{
              style: {
                background: "#5C3D26",
                color: "#F5EDE0",
                fontFamily: "var(--font-inter)",
                fontSize: "14px",
              },
            }}
          />
        </AuthProvider>
      </body>
    </html>
  );
}
