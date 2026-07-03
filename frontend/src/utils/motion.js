// ============================================================
// MOTION DESIGN SYSTEM
// Satu sumber kebenaran untuk semua animasi framer-motion di
// aplikasi ini, supaya easing, durasi, dan gaya transisi terasa
// konsisten di setiap halaman (Home, Destinasi, Detail, Tentang,
// Header, Footer) — bukan didefinisikan ulang beda-beda di tiap file.
//
// Kurva easing ini SAMA dengan --ease / --ease-out di App.css,
// jadi animasi yang digerakkan CSS dan yang digerakkan JS terasa
// senada.
// ============================================================

export const EASE_SMOOTH = [0.16, 1, 0.3, 1];

// ===== Reveal / entrance variants =====
// Dipakai untuk hampir semua elemen yang "muncul" saat mount atau di-scroll.
// `custom={i}` pada motion component akan memberi jeda berurutan (stagger manual).
export const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, delay: i * 0.08, ease: EASE_SMOOTH },
  }),
};

// Versi tanpa pergeseran vertikal — untuk elemen lebar/full-width
// yang lebih pas fade murni daripada naik dari bawah.
export const fadeIn = {
  hidden: { opacity: 0 },
  visible: (i = 0) => ({
    opacity: 1,
    transition: { duration: 0.6, delay: i * 0.08, ease: EASE_SMOOTH },
  }),
};

// Wadah stagger standar — anak-anaknya (yang punya variants fadeUp/fadeIn)
// akan muncul berurutan dengan jeda yang konsisten di semua halaman.
export const staggerContainer = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.08, delayChildren: 0.04 },
  },
};

// Konfigurasi viewport standar untuk whileInView — dipakai di semua
// section supaya "titik pemicu" scroll-reveal terasa sama.
export const viewportOnce = { once: false, amount: 0.2 };

// ===== Micro-interactions (hover / tap) =====
// Dipakai untuk kartu, tombol, dan elemen interaktif lain supaya
// respons hover/tap-nya seragam di seluruh situs.
export const hoverLift = {
  y: -6,
  transition: { duration: 0.35, ease: EASE_SMOOTH },
};

export const hoverScaleSm = {
  scale: 1.03,
  transition: { duration: 0.3, ease: EASE_SMOOTH },
};

export const tapScale = { scale: 0.97 };
