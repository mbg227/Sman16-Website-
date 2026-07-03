import Link from "next/link";
import { MapPin, Phone, Mail, Clock } from "lucide-react";
import Logo from "@/components/Logo";

export default function Footer() {
  return (
    <footer className="bg-coklat-tua text-krem-light mt-24">
      <div className="container-page py-14 grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <div className="flex items-center gap-3 mb-4">
            <Logo size={38} />
            <p className="font-display font-bold tracking-wide">SMAN 16 MOJANG</p>
          </div>
          <p className="text-sm text-krem/70 leading-relaxed">
            Sekolah Menengah Atas Negeri 16 Mojang — mencetak generasi yang
            berkarakter, berprestasi, dan berbudaya untuk masa depan bangsa.
          </p>
        </div>

        <div>
          <p className="font-display font-semibold mb-4 text-coklat-muda">Tautan</p>
          <ul className="space-y-2.5 text-sm text-krem/80">
            <li><Link href="/informasi" className="hover:text-krem">Informasi</Link></li>
            <li><Link href="/ekstrakurikuler" className="hover:text-krem">Ekstrakurikuler</Link></li>
            <li><Link href="/osis" className="hover:text-krem">OSIS</Link></li>
            <li><Link href="/ppdb" className="hover:text-krem">PPDB Online</Link></li>
          </ul>
        </div>

        <div>
          <p className="font-display font-semibold mb-4 text-coklat-muda">Akun</p>
          <ul className="space-y-2.5 text-sm text-krem/80">
            <li><Link href="/login" className="hover:text-krem">Login Peserta</Link></li>
            <li><Link href="/login/admin" className="hover:text-krem">Login Admin</Link></li>
          </ul>
        </div>

        <div>
          <p className="font-display font-semibold mb-4 text-coklat-muda">Kontak</p>
          <ul className="space-y-3 text-sm text-krem/80">
            <li className="flex gap-2.5"><MapPin size={16} className="shrink-0 mt-0.5" /> Jl. Pendidikan No. 16, Mojang, Indonesia</li>
            <li className="flex gap-2.5"><Phone size={16} className="shrink-0 mt-0.5" /> (021) 1600-1600</li>
            <li className="flex gap-2.5"><Mail size={16} className="shrink-0 mt-0.5" /> info@sman16mojang.sch.id</li>
            <li className="flex gap-2.5"><Clock size={16} className="shrink-0 mt-0.5" /> Senin–Jumat, 07.00–15.00</li>
          </ul>
        </div>
      </div>

      <div className="border-t border-krem/15">
        <div className="container-page py-5 text-xs text-krem/60 flex flex-col sm:flex-row justify-between gap-2">
          <p>© {new Date().getFullYear()} SMAN 16 MOJANG. Seluruh hak cipta dilindungi.</p>
          <p>Berkarakter • Berprestasi • Berbudaya</p>
        </div>
      </div>
    </footer>
  );
}
