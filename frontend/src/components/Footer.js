import React from "react";

function Footer() {
  return (
    <footer className="bg-[#4A4745] text-white">
      <div className="mx-auto max-w-6xl px-6 py-4">

        {/* Top */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-[1.5fr_1fr_1fr_1fr]">

          {/* Logo */}
          <div>
            <div className="flex items-center gap-3">

              <div className="flex h-7 w-7 items-center justify-center rounded-md bg-[#D97A45]">
                <svg
                  viewBox="0 0 24 24"
                  width="13"
                  height="13"
                  fill="currentColor"
                >
                  <path d="M3 18L9 10L13 13L15 11L21 18Z" />
                  <circle cx="16" cy="7" r="2" />
                </svg>
              </div>

              <h2 className="text-xl font-semibold">
                Parahyangan
              </h2>

            </div>

            <p className="mt-2 max-w-[210px] text-[13px] leading-5 text-white/60">
              Sistem rekomendasi destinasi wisata Bandung Raya
              berbasis machine learning.
            </p>

          </div>

          {/* Penelitian */}
          <div>

            <h4 className="mb-2 text-[11px] font-semibold tracking-[0.18em] uppercase text-white">
              Penelitian
            </h4>

            <div className="space-y-1 text-[13px] text-white/60">
              <p>Tugas Akhir</p>
              <p>Teknik Informatika</p>
            </div>

          </div>

          {/* Universitas */}
          <div>

            <h4 className="mb-2 text-[11px] font-semibold tracking-[0.18em] uppercase text-white">
              Universitas
            </h4>

            <div className="space-y-1 text-[13px] text-white/60">
              <p>Universitas Islam Nusantara</p>
              <p>2026</p>
            </div>

          </div>

          {/* Metode */}
          <div>

            <h4 className="mb-2 text-[11px] font-semibold tracking-[0.18em] uppercase text-white">
              Metode
            </h4>

            <div className="space-y-1 text-[13px] text-white/60">
              <p>Content-Based Filtering</p>
              <p>TF-IDF + Cosine Similarity</p>
            </div>

          </div>

        </div>

        {/* Divider */}

        <div className="my-4 h-px bg-white/10"></div>

        {/* Bottom */}

        <div className="flex flex-col items-center justify-between gap-2 md:flex-row">

          <p className="text-xs text-white/45">
            © 2026 <span className="font-medium text-white/70">Mira Aldina</span>
          </p>

          <div className="flex items-center gap-3 text-xs text-white/45">

            <span className="h-px w-8 bg-white/15"></span>

            <span>
              Crafted with
              <span className="mx-1 text-[#866F56]">♥</span>
              in Bandung
            </span>

            <span className="h-px w-8 bg-white/15"></span>

          </div>

        </div>

      </div>
    </footer>
  );
}

export default Footer;