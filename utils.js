import clsx from "clsx";

export function cn(...inputs) {
  return clsx(...inputs);
}

// Nomor pendaftaran format: PPDB-2026-XXXXXX
export function generateNomorPendaftaran() {
  const year = new Date().getFullYear();
  const rand = Math.floor(100000 + Math.random() * 900000);
  return `PPDB-${year}-${rand}`;
}

export function formatTanggal(dateInput) {
  if (!dateInput) return "-";
  const date =
    typeof dateInput?.toDate === "function" ? dateInput.toDate() : new Date(dateInput);
  return date.toLocaleDateString("id-ID", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
}

export function formatTanggalWaktu(dateInput) {
  if (!dateInput) return "-";
  const date =
    typeof dateInput?.toDate === "function" ? dateInput.toDate() : new Date(dateInput);
  return date.toLocaleString("id-ID", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export const STATUS_LABEL = {
  menunggu: "Menunggu",
  lolos: "Lolos",
  tidak_lolos: "Tidak Lolos",
};

export const STATUS_STYLE = {
  menunggu: "bg-amber-100 text-amber-800 border-amber-300",
  lolos: "bg-emerald-100 text-emerald-800 border-emerald-300",
  tidak_lolos: "bg-rose-100 text-rose-800 border-rose-300",
};

export function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export function isValidNISN(nisn) {
  return /^\d{10}$/.test(nisn);
}

export function isValidNIK(nik) {
  return /^\d{16}$/.test(nik);
}

export function isValidPhone(phone) {
  return /^(\+62|62|0)8[1-9][0-9]{6,10}$/.test(phone);
}
