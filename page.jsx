"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { QRCodeCanvas } from "qrcode.react";
import toast from "react-hot-toast";
import {
  Upload,
  Check,
  ChevronRight,
  ChevronLeft,
  Loader2,
  PartyPopper,
  Download,
} from "lucide-react";
import { db, storage } from "@/lib/firebase";
import {
  generateNomorPendaftaran,
  isValidEmail,
  isValidNISN,
  isValidNIK,
  isValidPhone,
  cn,
} from "@/lib/utils";
import CubeGridBg from "@/components/CubeGridBg";

const EMPTY_BIODATA = {
  namaLengkap: "",
  nisn: "",
  nik: "",
  tempatLahir: "",
  tanggalLahir: "",
  jenisKelamin: "",
  agama: "",
  alamat: "",
  nomorHp: "",
  email: "",
  asalSekolah: "",
  namaOrangTua: "",
  nomorOrangTua: "",
  nilaiRataRata: "",
  hobi: "",
  keahlian: "",
};

const EKSKUL_OPTIONS = ["Pramuka", "PMR", "Paskibra", "Futsal", "Basket", "Coding", "DKV", "Band", "English Club", "Multimedia"];
const KEGIATAN_OPTIONS = ["Membaca / Menulis", "Olahraga", "Bermain Game / Teknologi", "Seni & Musik", "Organisasi / Kepanitiaan"];

export default function PpdbPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [submitting, setSubmitting] = useState(false);
  const [biodata, setBiodata] = useState(EMPTY_BIODATA);
  const [files, setFiles] = useState({ pasFoto: null, kartuKeluarga: null, aktaLahir: null, sertifikat: null });
  const [minat, setMinat] = useState({ bidang: "", kegiatan: "", minatOrganisasi: 5, ekskul: [] });
  const [result, setResult] = useState(null);
  const [errors, setErrors] = useState({});

  function updateBiodata(field, value) {
    setBiodata((prev) => ({ ...prev, [field]: value }));
  }

  function updateFile(field, file) {
    setFiles((prev) => ({ ...prev, [field]: file }));
  }

  function toggleEkskul(name) {
    setMinat((prev) => ({
      ...prev,
      ekskul: prev.ekskul.includes(name)
        ? prev.ekskul.filter((e) => e !== name)
        : [...prev.ekskul, name],
    }));
  }

  function validateStep1() {
    const req = ["namaLengkap", "nisn", "nik", "tempatLahir", "tanggalLahir", "jenisKelamin", "agama", "alamat", "nomorHp", "email", "asalSekolah", "namaOrangTua", "nomorOrangTua", "nilaiRataRata"];
    const newErrors = {};
    req.forEach((f) => {
      if (!String(biodata[f]).trim()) newErrors[f] = "Wajib diisi";
    });
    if (biodata.nisn && !isValidNISN(biodata.nisn)) newErrors.nisn = "NISN harus 10 digit angka";
    if (biodata.nik && !isValidNIK(biodata.nik)) newErrors.nik = "NIK harus 16 digit angka";
    if (biodata.email && !isValidEmail(biodata.email)) newErrors.email = "Format email tidak valid";
    if (biodata.nomorHp && !isValidPhone(biodata.nomorHp)) newErrors.nomorHp = "Nomor HP tidak valid";
    if (!files.pasFoto) newErrors.pasFoto = "Wajib diunggah";
    if (!files.kartuKeluarga) newErrors.kartuKeluarga = "Wajib diunggah";
    if (!files.aktaLahir) newErrors.aktaLahir = "Wajib diunggah";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  function handleNextFromStep1() {
    if (!validateStep1()) {
      toast.error("Lengkapi data yang wajib diisi terlebih dahulu.");
      return;
    }
    setStep(2);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function handleSubmit() {
    if (!minat.bidang || !minat.kegiatan) {
      toast.error("Lengkapi tes minat terlebih dahulu.");
      return;
    }
    setSubmitting(true);
    try {
      const nomorPendaftaran = generateNomorPendaftaran();
      const uploaded = {};
      for (const [key, file] of Object.entries(files)) {
        if (!file) continue;
        const storageRef = ref(storage, `pendaftar/${nomorPendaftaran}/${key}-${file.name}`);
        await uploadBytes(storageRef, file);
        uploaded[`${key}Url`] = await getDownloadURL(storageRef);
      }

      const payload = {
        ...biodata,
        ...uploaded,
        minat,
        nomorPendaftaran,
        status: "menunggu",
        createdAt: serverTimestamp(),
      };

      await setDoc(doc(db, "pendaftar", nomorPendaftaran), payload);
      // Index email -> nomor pendaftaran, dipakai saat peserta login memakai email.
      await setDoc(doc(db, "email_index", biodata.email.trim().toLowerCase()), {
        nomorPendaftaran,
      });

      setResult({ nomorPendaftaran, namaLengkap: biodata.namaLengkap });
      setStep(3);
      toast.success("Pendaftaran berhasil!");
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (err) {
      console.error(err);
      toast.error("Gagal mengirim pendaftaran. Pastikan konfigurasi Firebase sudah benar.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div>
      <section className="relative border-b border-coklat-muda/25 overflow-hidden">
        <CubeGridBg />
        <div className="container-page relative py-14 text-center">
          <p className="text-xs font-semibold tracking-widest text-coklat-muda uppercase mb-2">
            Penerimaan Peserta Didik Baru
          </p>
          <h1 className="text-3xl sm:text-4xl font-bold text-coklat-tua dark:text-krem-light">
            Pendaftaran PPDB Online
          </h1>
        </div>
      </section>

      <section className="container-page py-14 max-w-3xl">
        {/* Stepper */}
        <div className="flex items-center justify-center gap-2 sm:gap-4 mb-12">
          {[
            { n: 1, label: "Biodata" },
            { n: 2, label: "Tes Minat" },
            { n: 3, label: "Selesai" },
          ].map((s, i) => (
            <div key={s.n} className="flex items-center gap-2 sm:gap-4">
              <div className="flex flex-col items-center gap-1.5">
                <div
                  className={cn(
                    "w-9 h-9 flex items-center justify-center font-display font-bold text-sm border-2 transition-colors",
                    step >= s.n ? "bg-coklat-tua text-krem-light border-coklat-tua" : "border-coklat-muda/50 text-coklat-muda"
                  )}
                >
                  {step > s.n ? <Check size={16} /> : s.n}
                </div>
                <span className="text-[11px] text-tinta/60 dark:text-krem-light/60">{s.label}</span>
              </div>
              {i < 2 && <div className={cn("w-8 sm:w-16 h-0.5", step > s.n ? "bg-coklat-tua" : "bg-coklat-muda/30")} />}
            </div>
          ))}
        </div>

        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div key="step1" initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -16 }} transition={{ duration: 0.3 }}>
              <Step1Biodata biodata={biodata} updateBiodata={updateBiodata} files={files} updateFile={updateFile} errors={errors} />
              <div className="flex justify-end mt-8">
                <button onClick={handleNextFromStep1} className="btn-primary">
                  Selanjutnya <ChevronRight size={16} />
                </button>
              </div>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div key="step2" initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -16 }} transition={{ duration: 0.3 }}>
              <Step2TesMinat minat={minat} setMinat={setMinat} toggleEkskul={toggleEkskul} />
              <div className="flex justify-between mt-8">
                <button onClick={() => setStep(1)} className="btn-secondary">
                  <ChevronLeft size={16} /> Kembali
                </button>
                <button onClick={handleSubmit} disabled={submitting} className="btn-primary">
                  {submitting ? <Loader2 size={16} className="animate-spin" /> : <Check size={16} />}
                  {submitting ? "Mengirim..." : "Kirim Pendaftaran"}
                </button>
              </div>
            </motion.div>
          )}

          {step === 3 && result && (
            <motion.div key="step3" initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.4 }}>
              <div className="card-surface p-10 text-center">
                <PartyPopper className="mx-auto text-coklat-muda mb-4" size={40} />
                <h2 className="text-2xl font-bold text-coklat-tua dark:text-krem-light mb-2">Pendaftaran berhasil.</h2>
                <p className="text-tinta/65 dark:text-krem-light/65 mb-8">
                  Terima kasih, {result.namaLengkap}. Simpan nomor pendaftaran dan QR Code di bawah ini.
                </p>

                <div className="flex flex-col items-center gap-4 mb-8">
                  <div className="bg-white p-4 border-2 border-coklat-muda/40">
                    <QRCodeCanvas value={result.nomorPendaftaran} size={160} fgColor="#5C3D26" />
                  </div>
                  <div>
                    <p className="text-xs text-tinta/50 dark:text-krem-light/50 uppercase tracking-widest">Nomor Pendaftaran</p>
                    <p className="font-display text-xl font-bold text-coklat-tua dark:text-krem-light">{result.nomorPendaftaran}</p>
                  </div>
                  <span className="inline-flex items-center px-3 py-1 text-xs font-semibold border bg-amber-100 text-amber-800 border-amber-300">
                    Status: Menunggu Seleksi
                  </span>
                </div>

                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <button onClick={() => window.print()} className="btn-secondary">
                    <Download size={16} /> Cetak Bukti Pendaftaran
                  </button>
                  <button onClick={() => router.push("/login")} className="btn-primary">
                    Masuk ke Halaman Status
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </section>
    </div>
  );
}

function Field({ label, error, children }) {
  return (
    <div>
      <label className="label-field">{label}</label>
      {children}
      {error && <p className="text-xs text-rose-600 mt-1">{error}</p>}
    </div>
  );
}

function Step1Biodata({ biodata, updateBiodata, files, updateFile, errors }) {
  return (
    <div className="card-surface p-6 sm:p-8 space-y-8">
      <div>
        <h3 className="font-display font-semibold text-coklat-tua dark:text-krem-light mb-4">Data Diri</h3>
        <div className="grid sm:grid-cols-2 gap-5">
          <Field label="Nama Lengkap" error={errors.namaLengkap}>
            <input className="input-field" value={biodata.namaLengkap} onChange={(e) => updateBiodata("namaLengkap", e.target.value)} />
          </Field>
          <Field label="NISN" error={errors.nisn}>
            <input className="input-field" value={biodata.nisn} onChange={(e) => updateBiodata("nisn", e.target.value)} maxLength={10} />
          </Field>
          <Field label="NIK" error={errors.nik}>
            <input className="input-field" value={biodata.nik} onChange={(e) => updateBiodata("nik", e.target.value)} maxLength={16} />
          </Field>
          <Field label="Tempat Lahir" error={errors.tempatLahir}>
            <input className="input-field" value={biodata.tempatLahir} onChange={(e) => updateBiodata("tempatLahir", e.target.value)} />
          </Field>
          <Field label="Tanggal Lahir" error={errors.tanggalLahir}>
            <input type="date" className="input-field" value={biodata.tanggalLahir} onChange={(e) => updateBiodata("tanggalLahir", e.target.value)} />
          </Field>
          <Field label="Jenis Kelamin" error={errors.jenisKelamin}>
            <select className="input-field" value={biodata.jenisKelamin} onChange={(e) => updateBiodata("jenisKelamin", e.target.value)}>
              <option value="">Pilih</option>
              <option value="Laki-laki">Laki-laki</option>
              <option value="Perempuan">Perempuan</option>
            </select>
          </Field>
          <Field label="Agama" error={errors.agama}>
            <select className="input-field" value={biodata.agama} onChange={(e) => updateBiodata("agama", e.target.value)}>
              <option value="">Pilih</option>
              {["Islam", "Kristen", "Katolik", "Hindu", "Buddha", "Khonghucu"].map((a) => (
                <option key={a} value={a}>{a}</option>
              ))}
            </select>
          </Field>
          <Field label="Nomor HP" error={errors.nomorHp}>
            <input className="input-field" value={biodata.nomorHp} onChange={(e) => updateBiodata("nomorHp", e.target.value)} placeholder="08xxxxxxxxxx" />
          </Field>
          <Field label="Email" error={errors.email}>
            <input type="email" className="input-field" value={biodata.email} onChange={(e) => updateBiodata("email", e.target.value)} />
          </Field>
          <Field label="Asal Sekolah" error={errors.asalSekolah}>
            <input className="input-field" value={biodata.asalSekolah} onChange={(e) => updateBiodata("asalSekolah", e.target.value)} />
          </Field>
          <Field label="Nilai Rata-rata" error={errors.nilaiRataRata}>
            <input type="number" step="0.01" className="input-field" value={biodata.nilaiRataRata} onChange={(e) => updateBiodata("nilaiRataRata", e.target.value)} />
          </Field>
        </div>
        <div className="mt-5">
          <Field label="Alamat" error={errors.alamat}>
            <textarea className="input-field" rows={2} value={biodata.alamat} onChange={(e) => updateBiodata("alamat", e.target.value)} />
          </Field>
        </div>
      </div>

      <div>
        <h3 className="font-display font-semibold text-coklat-tua dark:text-krem-light mb-4">Data Orang Tua</h3>
        <div className="grid sm:grid-cols-2 gap-5">
          <Field label="Nama Orang Tua" error={errors.namaOrangTua}>
            <input className="input-field" value={biodata.namaOrangTua} onChange={(e) => updateBiodata("namaOrangTua", e.target.value)} />
          </Field>
          <Field label="Nomor Orang Tua" error={errors.nomorOrangTua}>
            <input className="input-field" value={biodata.nomorOrangTua} onChange={(e) => updateBiodata("nomorOrangTua", e.target.value)} />
          </Field>
        </div>
      </div>

      <div>
        <h3 className="font-display font-semibold text-coklat-tua dark:text-krem-light mb-4">Hobi & Keahlian</h3>
        <div className="grid sm:grid-cols-2 gap-5">
          <Field label="Hobi">
            <input className="input-field" value={biodata.hobi} onChange={(e) => updateBiodata("hobi", e.target.value)} />
          </Field>
          <Field label="Keahlian">
            <input className="input-field" value={biodata.keahlian} onChange={(e) => updateBiodata("keahlian", e.target.value)} />
          </Field>
        </div>
      </div>

      <div>
        <h3 className="font-display font-semibold text-coklat-tua dark:text-krem-light mb-4">Berkas Unggahan</h3>
        <div className="grid sm:grid-cols-2 gap-5">
          <FileUpload label="Pas Foto" error={errors.pasFoto} file={files.pasFoto} onChange={(f) => updateFile("pasFoto", f)} />
          <FileUpload label="Kartu Keluarga" error={errors.kartuKeluarga} file={files.kartuKeluarga} onChange={(f) => updateFile("kartuKeluarga", f)} />
          <FileUpload label="Akta Lahir" error={errors.aktaLahir} file={files.aktaLahir} onChange={(f) => updateFile("aktaLahir", f)} />
          <FileUpload label="Sertifikat (opsional)" file={files.sertifikat} onChange={(f) => updateFile("sertifikat", f)} />
        </div>
      </div>
    </div>
  );
}

function FileUpload({ label, error, file, onChange }) {
  return (
    <div>
      <label className="label-field">{label}</label>
      <label className={cn(
        "flex items-center gap-3 border-2 border-dashed px-4 py-3 cursor-pointer transition-colors",
        error ? "border-rose-400" : "border-coklat-muda/50 hover:border-coklat-tua"
      )}>
        <Upload size={16} className="text-coklat-muda shrink-0" />
        <span className="text-sm text-tinta/70 dark:text-krem-light/70 truncate">
          {file ? file.name : "Pilih file (JPG, PNG, PDF)"}
        </span>
        <input
          type="file"
          className="hidden"
          accept="image/*,application/pdf"
          onChange={(e) => onChange(e.target.files?.[0] || null)}
        />
      </label>
      {error && <p className="text-xs text-rose-600 mt-1">{error}</p>}
    </div>
  );
}

function Step2TesMinat({ minat, setMinat, toggleEkskul }) {
  return (
    <div className="card-surface p-6 sm:p-8 space-y-10">
      <div>
        <p className="label-field mb-3">1. Bidang apa yang paling kamu minati? (Radio Button)</p>
        <div className="grid sm:grid-cols-2 gap-3">
          {["IPA / Sains", "IPS / Sosial", "Bahasa", "Seni & Kreativitas"].map((opt) => (
            <label key={opt} className={cn(
              "flex items-center gap-3 border px-4 py-3 cursor-pointer transition-colors",
              minat.bidang === opt ? "border-coklat-tua bg-coklat-muda/15" : "border-coklat-muda/40"
            )}>
              <input type="radio" name="bidang" checked={minat.bidang === opt} onChange={() => setMinat((p) => ({ ...p, bidang: opt }))} className="accent-[#5C3D26]" />
              <span className="text-sm">{opt}</span>
            </label>
          ))}
        </div>
      </div>

      <div>
        <p className="label-field mb-3">2. Kegiatan favoritmu saat waktu luang? (Pilihan Ganda)</p>
        <div className="space-y-2">
          {KEGIATAN_OPTIONS.map((opt) => (
            <label key={opt} className={cn(
              "flex items-center gap-3 border px-4 py-3 cursor-pointer transition-colors",
              minat.kegiatan === opt ? "border-coklat-tua bg-coklat-muda/15" : "border-coklat-muda/40"
            )}>
              <input type="radio" name="kegiatan" checked={minat.kegiatan === opt} onChange={() => setMinat((p) => ({ ...p, kegiatan: opt }))} className="accent-[#5C3D26]" />
              <span className="text-sm">{opt}</span>
            </label>
          ))}
        </div>
      </div>

      <div>
        <p className="label-field mb-3">
          3. Seberapa tertarik kamu mengikuti kegiatan organisasi (OSIS/Ekskul)? (Slider Nilai)
        </p>
        <input
          type="range"
          min={0}
          max={10}
          value={minat.minatOrganisasi}
          onChange={(e) => setMinat((p) => ({ ...p, minatOrganisasi: Number(e.target.value) }))}
          className="w-full accent-[#5C3D26]"
        />
        <div className="flex justify-between text-xs text-tinta/50 dark:text-krem-light/50 mt-1">
          <span>Tidak tertarik</span>
          <span className="font-display font-bold text-coklat-tua dark:text-krem-light text-sm">{minat.minatOrganisasi}</span>
          <span>Sangat tertarik</span>
        </div>
      </div>

      <div>
        <p className="label-field mb-3">4. Ekstrakurikuler mana saja yang ingin kamu ikuti? (Checkbox)</p>
        <div className="grid sm:grid-cols-3 gap-2.5">
          {EKSKUL_OPTIONS.map((opt) => (
            <label key={opt} className={cn(
              "flex items-center gap-2.5 border px-3 py-2.5 cursor-pointer transition-colors text-sm",
              minat.ekskul.includes(opt) ? "border-coklat-tua bg-coklat-muda/15" : "border-coklat-muda/40"
            )}>
              <input type="checkbox" checked={minat.ekskul.includes(opt)} onChange={() => toggleEkskul(opt)} className="accent-[#5C3D26]" />
              {opt}
            </label>
          ))}
        </div>
      </div>
    </div>
  );
}
