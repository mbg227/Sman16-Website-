"use client";

import { useState } from "react";

// PENTING: Taruh file logo asli sekolah di public/logo.png
// Selama file itu belum ada (atau gagal dimuat), komponen ini otomatis
// menampilkan monogram kubus sebagai placeholder agar layout tetap utuh.

export default function Logo({ size = 44, className = "" }) {
  const [failed, setFailed] = useState(false);

  if (!failed) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src="/logo.png"
        alt="Logo SMAN 16 MOJANG"
        width={size}
        height={size}
        className={className}
        onError={() => setFailed(true)}
      />
    );
  }

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 44 44"
      className={className}
      role="img"
      aria-label="Logo SMAN 16 MOJANG (placeholder)"
    >
      <rect x="2" y="2" width="40" height="40" fill="#5C3D26" />
      <rect x="2" y="2" width="40" height="14" fill="#8A5A34" />
      <rect x="8" y="20" width="10" height="10" fill="#F5EDE0" />
      <rect x="20" y="20" width="10" height="10" fill="#C9A876" />
      <rect x="8" y="32" width="22" height="6" fill="#F5EDE0" />
      <text
        x="22"
        y="12"
        textAnchor="middle"
        fontSize="8"
        fontWeight="700"
        fill="#F5EDE0"
        fontFamily="sans-serif"
      >
        16
      </text>
    </svg>
  );
}
