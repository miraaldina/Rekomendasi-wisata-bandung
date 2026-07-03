import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useParams, useNavigate } from 'react-router-dom';
import { API_URL, Icons } from '../utils/utils';
import { fadeUp, staggerContainer, viewportOnce, hoverLift, EASE_SMOOTH } from '../utils/motion';
import DestinationCard from '../card/DestinationCard';

// ===== Konten dinamis per kategori =====
const CATEGORY_INFO = {
  'Wisata Alam': {
    duration: '3-6 jam', bestTime: 'Pagi (06:00–10:00)', crowd: 'Akhir pekan ramai', type: 'Outdoor',
    activities: [
      { icon: 'hike', title: 'Trekking & menjelajah alam', desc: 'Jalur trekking dengan pemandangan menawan dan udara segar pegunungan.' },
      { icon: 'camera', title: 'Fotografi pemandangan', desc: 'Spot foto Instagramable dengan latar belakang alam yang memukau.' },
      { icon: 'leaf', title: 'Menikmati udara segar', desc: 'Bersantai dan menghirup udara sejuk khas Bandung yang menyegarkan.' },
    ],
    tips: [
      { title: 'Waktu kunjungan terbaik', desc: 'Datang pagi hari untuk menikmati udara segar dan menghindari kabut. Cuaca cerah biasanya berlangsung sampai siang sebelum berkabut atau hujan.' },
      { title: 'Perlengkapan yang dibawa', desc: 'Jaket hangat, sepatu trekking yang nyaman, topi, sunscreen, air minum, dan kamera. Bawa juga jas hujan kecil karena cuaca di gunung mudah berubah.' },
      { title: 'Akses dan transportasi', desc: 'Disarankan menggunakan kendaraan pribadi atau menyewa kendaraan karena lokasi cenderung jauh dari pusat kota dan minim transportasi umum.' },
    ],
  },
  'Taman Hiburan': {
    duration: '4-8 jam', bestTime: 'Pagi atau sore', crowd: 'Sangat ramai weekend', type: 'Outdoor & Indoor',
    activities: [
      { icon: 'ride', title: 'Bermain wahana', desc: 'Aneka wahana seru untuk anak-anak hingga dewasa, dari yang lembut sampai memacu adrenalin.' },
      { icon: 'camera', title: 'Foto bersama keluarga', desc: 'Banyak spot foto menarik dengan tema beragam di seluruh area.' },
      { icon: 'food', title: 'Kuliner & jajanan', desc: 'Beragam pilihan makanan, minuman, dan jajanan tersedia di area.' },
    ],
    tips: [
      { title: 'Hindari antrian panjang', desc: 'Datang saat hari kerja (weekday) atau pas waktu pembukaan. Akhir pekan dan hari libur biasanya sangat padat pengunjung.' },
      { title: 'Persiapan tiket', desc: 'Beli tiket online untuk harga lebih murah dan menghindari antrian loket. Beberapa wahana memerlukan reservasi terpisah.' },
      { title: 'Bawa perlengkapan harian', desc: 'Pakaian nyaman, sepatu yang enak untuk berjalan jauh, topi, kacamata hitam, dan power bank untuk handphone.' },
    ],
  },
  'Taman Kota': {
    duration: '1-2 jam', bestTime: 'Pagi atau sore', crowd: 'Cukup ramai weekend', type: 'Outdoor',
    activities: [
      { icon: 'walk', title: 'Jogging & jalan santai', desc: 'Area yang nyaman untuk berolahraga ringan atau jalan santai bersama keluarga.' },
      { icon: 'family', title: 'Piknik bersama keluarga', desc: 'Tempat sempurna untuk piknik dengan suasana hijau dan teduh.' },
      { icon: 'camera', title: 'Foto santai', desc: 'Berbagai sudut menarik untuk dokumentasi keseharian.' },
    ],
    tips: [
      { title: 'Cocok untuk piknik keluarga', desc: 'Bawa tikar atau kursi lipat untuk bersantai. Banyak yang memiliki area bermain anak dan jogging track.' },
      { title: 'Akses transportasi mudah', desc: 'Terletak di tengah kota, bisa diakses dengan kendaraan pribadi, ojek online, atau angkutan umum.' },
      { title: 'Kuliner sekitar', desc: 'Banyak penjual makanan dan minuman di sekitar area taman. Cocok untuk wisata sambil mencicipi jajanan khas.' },
    ],
  },
  'Wisata Kuliner': {
    duration: '1-2 jam', bestTime: 'Jam makan', crowd: 'Ramai jam makan', type: 'Indoor / Outdoor',
    activities: [
      { icon: 'food', title: 'Mencicipi menu signature', desc: 'Cicipi menu khas yang menjadi favorit pengunjung.' },
      { icon: 'camera', title: 'Food photography', desc: 'Hidangan dan tempat yang Instagramable untuk konten kuliner.' },
      { icon: 'family', title: 'Quality time bersama orang terdekat', desc: 'Suasana nyaman untuk berkumpul sambil menikmati hidangan.' },
    ],
    tips: [
      { title: 'Datang di jam tepat', desc: 'Untuk makan siang, datang sekitar 11:30 atau setelah 13:30. Untuk makan malam, sekitar 17:00 atau setelah 20:00 agar tidak terlalu ramai.' },
      { title: 'Cek menu rekomendasi', desc: 'Setiap tempat biasanya memiliki menu signature. Cek rating dan review di Google Maps sebelum datang untuk menu favorit.' },
      { title: 'Reservasi untuk grup', desc: 'Kalau datang bersama keluarga atau rombongan, sebaiknya reservasi terlebih dahulu, terutama untuk akhir pekan.' },
    ],
  },
  'Pusat Perbelanjaan': {
    duration: '2-4 jam', bestTime: 'Siang–sore', crowd: 'Sangat ramai weekend', type: 'Indoor',
    activities: [
      { icon: 'shop', title: 'Belanja kebutuhan', desc: 'Beragam toko mulai dari fashion, elektronik, hingga kebutuhan harian.' },
      { icon: 'food', title: 'Kuliner di food court', desc: 'Banyak pilihan makanan dari berbagai cita rasa di area food court.' },
      { icon: 'movie', title: 'Hiburan keluarga', desc: 'Bioskop, area bermain anak, dan fasilitas hiburan lainnya tersedia.' },
    ],
    tips: [
      { title: 'Manfaatkan promo dan diskon', desc: 'Cek website atau media sosial mall untuk info promo, terutama saat ada event seasonal seperti midnight sale atau weekend deal.' },
      { title: 'Fasilitas lengkap', desc: 'Tersedia food court, bioskop, area bermain anak, dan layanan ATM. Bisa jadi tujuan one-stop untuk seharian.' },
      { title: 'Parkir dan akses', desc: 'Datang lebih awal saat akhir pekan untuk mendapat tempat parkir. Alternatifnya gunakan transportasi online.' },
    ],
  },
  'Wisata Edukasi': {
    duration: '2-3 jam', bestTime: 'Pagi (09:00–12:00)', crowd: 'Ramai saat liburan sekolah', type: 'Indoor',
    activities: [
      { icon: 'book', title: 'Wisata edukatif', desc: 'Belajar sambil bermain melalui aktivitas yang menyenangkan dan informatif.' },
      { icon: 'family', title: 'Liburan keluarga edukatif', desc: 'Pengalaman menyenangkan untuk anak sekaligus menambah pengetahuan.' },
      { icon: 'camera', title: 'Dokumentasi keluarga', desc: 'Banyak spot menarik untuk foto kenang-kenangan bersama keluarga.' },
    ],
    tips: [
      { title: 'Cocok untuk keluarga & sekolah', desc: 'Sangat edukatif untuk anak-anak dan pelajar. Banyak menyediakan paket wisata edukasi dengan pemandu.' },
      { title: 'Cek jadwal operasional', desc: 'Sebagian tutup di hari Senin atau saat hari besar. Pastikan cek jam buka sebelum berkunjung.' },
      { title: 'Manfaatkan tour guide', desc: 'Mintalah pemandu atau ikuti tur jika tersedia, informasinya akan lebih lengkap dan mendalam.' },
    ],
  },
  'Wisata Sejarah': {
    duration: '1-2 jam', bestTime: 'Pagi atau sore', crowd: 'Cukup tenang', type: 'Outdoor / Indoor',
    activities: [
      { icon: 'book', title: 'Belajar sejarah', desc: 'Menyusuri jejak sejarah dengan pemandu atau tour yang tersedia.' },
      { icon: 'camera', title: 'Fotografi arsitektur', desc: 'Bangunan klasik dan arsitektur unik yang sangat fotogenik.' },
      { icon: 'walk', title: 'Jelajah area bersejarah', desc: 'Berkeliling area sambil menikmati nilai historisnya.' },
    ],
    tips: [
      { title: 'Hargai nilai sejarahnya', desc: 'Jangan menyentuh artefak atau menulisi dinding. Jaga ketenangan dan ikuti aturan lokasi.' },
      { title: 'Dokumentasi diperbolehkan', desc: 'Sebagian besar tempat memperbolehkan foto, tapi tanpa flash di area dalam ruangan untuk menjaga keawetan artefak.' },
      { title: 'Ikuti tur sejarah', desc: 'Beberapa lokasi menyediakan tur dengan pemandu lokal yang bisa menceritakan latar belakang sejarah lebih detail.' },
    ],
  },
  'Wisata Olahraga': {
    duration: '2-4 jam', bestTime: 'Pagi (06:00–10:00)', crowd: 'Ramai akhir pekan', type: 'Outdoor',
    activities: [
      { icon: 'sport', title: 'Aktivitas olahraga outdoor', desc: 'Aneka aktivitas seperti hiking, paragliding, atau olahraga ekstrem lainnya.' },
      { icon: 'camera', title: 'Action photography', desc: 'Momen seru saat beraktivitas yang bisa diabadikan.' },
      { icon: 'leaf', title: 'Menikmati alam', desc: 'Sambil berolahraga, nikmati keindahan alam sekitar.' },
    ],
    tips: [
      { title: 'Persiapan fisik', desc: 'Lakukan pemanasan sebelum beraktivitas. Cukup istirahat dan minum air sebelum mulai untuk menghindari kelelahan.' },
      { title: 'Perlengkapan olahraga', desc: 'Bawa pakaian olahraga yang nyaman, sepatu yang sesuai, dan perlengkapan khusus jika diperlukan (helm, sarung tangan, dll).' },
      { title: 'Cek kondisi cuaca', desc: 'Untuk aktivitas outdoor seperti hiking atau paragliding, pastikan cuaca mendukung dan tidak hujan.' },
    ],
  },
  'Museum': {
    duration: '1-2 jam', bestTime: 'Pagi (09:00–12:00)', crowd: 'Tenang weekday', type: 'Indoor',
    activities: [
      { icon: 'book', title: 'Tur edukatif', desc: 'Pelajari sejarah dan koleksi melalui tur dengan pemandu profesional.' },
      { icon: 'camera', title: 'Fotografi koleksi', desc: 'Abadikan koleksi unik (sebagian besar memperbolehkan foto tanpa flash).' },
      { icon: 'shop', title: 'Souvenir museum', desc: 'Beli kenang-kenangan unik dari museum shop.' },
    ],
    tips: [
      { title: 'Hari weekday lebih tenang', desc: 'Datang di hari kerja untuk pengalaman lebih nyaman tanpa keramaian. Akhir pekan biasanya ramai pengunjung.' },
      { title: 'Aturan dokumentasi', desc: 'Hindari menggunakan flash saat memotret koleksi untuk menjaga keawetan. Beberapa area mungkin melarang foto.' },
      { title: 'Manfaatkan audio guide', desc: 'Jika tersedia, gunakan audio guide atau ikuti tur dengan pemandu untuk pengalaman yang lebih mendalam.' },
    ],
  },
  'Wisata Budaya': {
    duration: '2-3 jam', bestTime: 'Pagi–sore', crowd: 'Cukup ramai', type: 'Outdoor / Indoor',
    activities: [
      { icon: 'art', title: 'Apresiasi seni & budaya', desc: 'Menikmati pertunjukan, tari, atau pameran budaya yang autentik.' },
      { icon: 'shop', title: 'Belanja souvenir lokal', desc: 'Dukung pengrajin lokal dengan membeli kerajinan tangan asli.' },
      { icon: 'camera', title: 'Dokumentasi budaya', desc: 'Abadikan momen menarik dari pertunjukan dan aktivitas budaya.' },
    ],
    tips: [
      { title: 'Hormati adat dan budaya', desc: 'Berpakaian sopan dan ikuti adat istiadat setempat. Tanyakan kepada pemandu jika ada hal yang perlu diketahui.' },
      { title: 'Cek jadwal pertunjukan', desc: 'Beberapa tempat memiliki pertunjukan budaya tertentu (tari, musik, kerajinan) di waktu tertentu. Cek jadwalnya.' },
      { title: 'Beli souvenir lokal', desc: 'Dukung pengrajin lokal dengan membeli souvenir asli. Cocok untuk oleh-oleh dengan nilai budaya yang kuat.' },
    ],
  },
  'Wisata Religi': {
    duration: '1-2 jam', bestTime: 'Pagi atau sore', crowd: 'Ramai saat ibadah', type: 'Indoor / Outdoor',
    activities: [
      { icon: 'heart', title: 'Ibadah & ziarah', desc: 'Beribadah dan merasakan ketenangan spiritual di tempat yang sakral.' },
      { icon: 'camera', title: 'Fotografi arsitektur religi', desc: 'Abadikan keindahan arsitektur tempat ibadah (di luar jam ibadah).' },
      { icon: 'book', title: 'Wisata religi keluarga', desc: 'Belajar nilai-nilai spiritual bersama keluarga.' },
    ],
    tips: [
      { title: 'Berpakaian sopan', desc: 'Gunakan pakaian sopan yang menutup aurat. Sebagian tempat menyediakan pinjaman penutup kepala atau sarung.' },
      { title: 'Hormati jam ibadah', desc: 'Hindari kunjungan saat jam ibadah berlangsung kecuali Anda ingin ikut beribadah. Jaga ketenangan di area suci.' },
      { title: 'Wisata religi keluarga', desc: 'Cocok untuk wisata bersama keluarga sambil belajar nilai-nilai spiritual dan sejarah keagamaan.' },
    ],
  },
  'Wisata Seni': {
    duration: '1-2 jam', bestTime: 'Sore (15:00–18:00)', crowd: 'Tenang', type: 'Indoor',
    activities: [
      { icon: 'art', title: 'Menikmati karya seni', desc: 'Apresiasi karya seniman lokal dari berbagai aliran dan tema.' },
      { icon: 'book', title: 'Workshop seni', desc: 'Ikuti kelas atau workshop singkat untuk pengalaman lebih interaktif.' },
      { icon: 'camera', title: 'Photo session', desc: 'Galeri seni yang sangat Instagramable untuk konten kreatif.' },
    ],
    tips: [
      { title: 'Cek pameran yang sedang berlangsung', desc: 'Pameran sering berganti tema. Cek website atau media sosial untuk info pameran terkini sebelum berkunjung.' },
      { title: 'Workshop dan kelas seni', desc: 'Sebagian tempat menawarkan workshop singkat atau kelas seni. Cocok untuk pengalaman lebih interaktif.' },
      { title: 'Apresiasi karya seniman lokal', desc: 'Banyak karya seniman Bandung yang dipamerkan. Bisa menjadi inspirasi atau koleksi pribadi.' },
    ],
  },
  'Desa Wisata': {
    duration: '3-5 jam', bestTime: 'Pagi (08:00–11:00)', crowd: 'Tenang', type: 'Outdoor',
    activities: [
      { icon: 'leaf', title: 'Wisata pertanian', desc: 'Belajar bertani, memetik hasil kebun, dan aktivitas pedesaan autentik.' },
      { icon: 'food', title: 'Kuliner tradisional', desc: 'Cicipi masakan lokal yang dibuat oleh warga desa langsung.' },
      { icon: 'art', title: 'Workshop kerajinan', desc: 'Belajar membuat kerajinan tradisional khas desa setempat.' },
    ],
    tips: [
      { title: 'Pengalaman autentik', desc: 'Cobalah berinteraksi langsung dengan warga desa untuk memahami budaya dan kehidupan sehari-hari yang sesungguhnya.' },
      { title: 'Aktivitas yang ditawarkan', desc: 'Banyak desa wisata menawarkan paket aktivitas seperti memasak tradisional, kerajinan, atau bertani. Cek paketnya.' },
      { title: 'Bawa uang tunai', desc: 'Beberapa desa belum tersedia pembayaran digital. Bawa uang tunai secukupnya untuk pembelian souvenir atau jajanan.' },
    ],
  },
};

const DEFAULT_INFO = {
  duration: '2-4 jam', bestTime: 'Pagi atau sore', crowd: 'Bervariasi', type: 'Bervariasi',
  activities: [
    { icon: 'walk', title: 'Eksplorasi tempat', desc: 'Menjelajahi setiap sudut destinasi untuk pengalaman terbaik.' },
    { icon: 'camera', title: 'Fotografi', desc: 'Abadikan momen indah di destinasi ini.' },
    { icon: 'family', title: 'Quality time keluarga', desc: 'Habiskan waktu berkualitas bersama orang terdekat.' },
  ],
  tips: [
    { title: 'Waktu kunjungan terbaik', desc: 'Datang pagi atau sore hari untuk pengalaman yang lebih nyaman dan menghindari keramaian.' },
    { title: 'Persiapan', desc: 'Bawa pakaian nyaman, air minum, kamera untuk dokumentasi, dan uang tunai secukupnya.' },
    { title: 'Akses lokasi', desc: 'Gunakan kendaraan pribadi atau ojek online. Cek rute terbaik melalui aplikasi peta untuk menghindari macet.' },
  ],
};

// ===== SVG Icons untuk aktivitas =====
const ActivityIcon = ({ name }) => {
  const icons = {
    hike: <svg width="22" height="22" viewBox="0 0 24 24" fill="none"><circle cx="13" cy="4" r="2" stroke="currentColor" strokeWidth="1.5"/><path d="M10 21 L12 14 L15 16 L13 21 M12 14 L9 12 L7 17 M15 16 L17 11 L20 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>,
    camera: <svg width="22" height="22" viewBox="0 0 24 24" fill="none"><rect x="3" y="6" width="18" height="14" rx="2" stroke="currentColor" strokeWidth="1.5"/><circle cx="12" cy="13" r="4" stroke="currentColor" strokeWidth="1.5"/><path d="M8 6 L9.5 4 H14.5 L16 6" stroke="currentColor" strokeWidth="1.5"/></svg>,
    leaf: <svg width="22" height="22" viewBox="0 0 24 24" fill="none"><path d="M5 19 C5 11 11 5 19 5 C19 13 13 19 5 19 Z M5 19 L12 12" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" strokeLinecap="round"/></svg>,
    ride: <svg width="22" height="22" viewBox="0 0 24 24" fill="none"><path d="M5 16 H19 L17 9 H7 Z M9 16 V12 M12 16 V12 M15 16 V12 M4 19 L7 16 M20 19 L17 16" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/><circle cx="12" cy="5" r="1.5" fill="currentColor"/></svg>,
    food: <svg width="22" height="22" viewBox="0 0 24 24" fill="none"><path d="M4 11 H20 V13 A6 6 0 0 1 14 19 H10 A6 6 0 0 1 4 13 Z M3 11 H21 M7 8 V11 M12 8 V11 M17 8 V11 M5 21 H19" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>,
    walk: <svg width="22" height="22" viewBox="0 0 24 24" fill="none"><circle cx="13" cy="4" r="2" stroke="currentColor" strokeWidth="1.5"/><path d="M9 21 L11 14 L13 15 L11 21 M13 15 L15 12 L17 14 L20 13 M11 14 L8 12 L7 8 L11 8 L13 11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>,
    family: <svg width="22" height="22" viewBox="0 0 24 24" fill="none"><circle cx="8" cy="7" r="3" stroke="currentColor" strokeWidth="1.5"/><circle cx="16" cy="7" r="3" stroke="currentColor" strokeWidth="1.5"/><path d="M3 19 C3 16 5 14 8 14 C11 14 13 16 13 19 M11 19 C11 16 13 14 16 14 C19 14 21 16 21 19" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>,
    book: <svg width="22" height="22" viewBox="0 0 24 24" fill="none"><path d="M5 4 H11 A2 2 0 0 1 13 6 V20 A2 2 0 0 0 11 18 H5 Z M19 4 H13 A2 2 0 0 0 11 6 V20 A2 2 0 0 1 13 18 H19 Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/></svg>,
    shop: <svg width="22" height="22" viewBox="0 0 24 24" fill="none"><path d="M5 7 H19 L18 20 H6 Z M8 7 V5 A4 4 0 0 1 16 5 V7" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/></svg>,
    movie: <svg width="22" height="22" viewBox="0 0 24 24" fill="none"><rect x="3" y="5" width="18" height="14" rx="2" stroke="currentColor" strokeWidth="1.5"/><path d="M10 9 L15 12 L10 15 Z" fill="currentColor"/></svg>,
    sport: <svg width="22" height="22" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.5"/><path d="M3 12 H21 M12 3 V21 M5.5 5.5 L18.5 18.5 M18.5 5.5 L5.5 18.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/></svg>,
    art: <svg width="22" height="22" viewBox="0 0 24 24" fill="none"><path d="M12 3 C7 3 3 7 3 12 C3 15 5 17 7 17 C8 17 9 17.5 9 19 C9 20.5 10 21 11.5 21 H12 C17 21 21 17 21 12 C21 7 17 3 12 3 Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/><circle cx="7" cy="10" r="1.5" fill="currentColor"/><circle cx="11" cy="7" r="1.5" fill="currentColor"/><circle cx="16" cy="9" r="1.5" fill="currentColor"/><circle cx="17" cy="14" r="1.5" fill="currentColor"/></svg>,
    heart: <svg width="22" height="22" viewBox="0 0 24 24" fill="none"><path d="M12 21 C12 21 4 16 4 10 A4 4 0 0 1 12 7 A4 4 0 0 1 20 10 C20 16 12 21 12 21 Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/></svg>,
  };
  return icons[name] || null;
};

function DetailPage({ destinations }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const [destination, setDestination] = useState(null);
  const [similar, setSimilar] = useState([]);
  const [loadingSimilar, setLoadingSimilar] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  }, [id]);

  useEffect(() => {
    if (destinations.length === 0) return;
    const placeId = parseInt(id);
    const found = destinations.find(d => d.place_id === placeId);
    if (!found) { setNotFound(true); return; }
    setDestination(found);
    setNotFound(false);
    setLoadingSimilar(true);
    fetch(`${API_URL}/recommendations`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ place_name: found.place_name, top_n: 6 }),
    })
      .then(res => res.json())
      .then(data => { if (!data.error) setSimilar(data.recommendations); })
      .catch(err => console.error(err))
      .finally(() => setLoadingSimilar(false));
  }, [id, destinations]);

  if (destinations.length === 0) {
    return (
      <div className="dp-loading">
        <div className="spin-big"></div>
        <p>Memuat destinasi...</p>
      </div>
    );
  }

  if (notFound) {
    return (
      <section className="dp-notfound">
        <div>
          <h1>Destinasi tidak ditemukan</h1>
          <p>Destinasi dengan ID #{id} tidak ada dalam database kami.</p>
          <button onClick={() => navigate('/destinasi')}>← Kembali ke daftar destinasi</button>
        </div>
      </section>
    );
  }

  if (!destination) return null;

  const mapsQuery = encodeURIComponent(`${destination.place_name} ${destination.city}`);
  const info = CATEGORY_INFO[destination.category] || DEFAULT_INFO;

  // Ambil kutipan dari deskripsi (kalimat pertama atau yang paling menarik)
  const shortQuote = destination.description.split('.')[0] + '.';

  return (
    <article className="dp">
      {/* ===== HEADER (editorial: nama + quote dalam 1 unit) ===== */}
      <motion.header
  className="dp-header"
  initial={{ opacity: 0 }}
  animate={{ opacity: 1 }}
  transition={{ duration: 0.6 }}
>
  <div className="dp-container">

<motion.button
  onClick={() => navigate(-1)}
  className="
    inline-flex items-center gap-2
    text-sm text-slate-500
    hover:text-slate-800
    transition-colors
    mb-10
  "
>
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
    <path
      d="M15 18L9 12L15 6"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
  Kembali
</motion.button>

    <motion.div
      className="dp-eyebrow"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.1 }}
    >
      <span className="dp-cat">{destination.category}</span>
      <span className="dp-loc">
        {Icons.pin(13)} {destination.city}
      </span>
    </motion.div>

    <motion.h1
      className="dp-title"
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.7,
        delay: 0.15,
        ease: EASE_SMOOTH
      }}
    >
      {destination.place_name}
    </motion.h1>

    <motion.div
      className="dp-rule"
      initial={{ scaleX: 0 }}
      animate={{ scaleX: 1 }}
      transition={{
        duration: 0.6,
        delay: 0.3
      }}
      style={{ transformOrigin: 'left' }}
    />

    <motion.blockquote
      className="dp-lead-quote"
      initial={{ opacity: 0, y: 25 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.6,
        delay: 0.35
      }}
    >
      <span className="dp-quote-mark">&ldquo;</span>
      {shortQuote}
      <span className="dp-quote-mark-end">&rdquo;</span>
    </motion.blockquote>

  </div>
</motion.header>

      {/* ===== MAIN CONTENT (2 COLUMN) ===== */}
      <div className="dp-container">
        <div className="dp-layout">

          {/* LEFT: Konten utama */}
          <main className="dp-main">

            {/* Aktivitas */}
            <motion.section
              className="dp-block"
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: false, amount: 0.15 }}
              transition={{ duration: 0.6 }}
            >
              <div className="dp-block-head">
                <span className="dp-eyebrow-text">Pengalaman</span>
                <h2>Aktivitas yang bisa dilakukan</h2>
                <p>Berbagai pengalaman menarik yang menanti Anda.</p>
              </div>

                <motion.div
                  className="dp-activities"
                  variants={staggerContainer}
                  initial="hidden"
                  whileInView="visible"
                  viewport={viewportOnce}
                >
                {info.activities.map((act, i) => (
                  <motion.div
                    key={i}
                    className="dp-activity"
                    variants={fadeUp}
                    custom={i}
                    whileHover={hoverLift}
                  >
                    <div className="dp-activity-icon">
                      <ActivityIcon name={act.icon} />
                    </div>

                    <div className="dp-activity-body">
                      <h3>{act.title}</h3>
                      <p>{act.desc}</p>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            </motion.section>

            {/* Tips */}
            <section className="dp-block">
              <div className="dp-block-head">
                <span className="dp-eyebrow-text">Panduan</span>
                <h2>Tips berkunjung</h2>
                <p>Hal-hal yang perlu dipersiapkan sebelum berangkat.</p>
              </div>

              <motion.ol
                className="dp-tips"
                variants={staggerContainer}
                initial="hidden"
                whileInView="visible"
                viewport={viewportOnce}
              >
                {info.tips.map((tip, i) => (
                  <motion.li
                    key={i}
                    className="dp-tip"
                    variants={fadeUp}
                    custom={i}
                  >
                    <div className="dp-tip-num">
                      {String(i + 1).padStart(2, '0')}
                    </div>

                    <div className="dp-tip-body">
                      <h3>{tip.title}</h3>
                      <p>{tip.desc}</p>
                    </div>
                  </motion.li>
                ))}
              </motion.ol>
            </section>

          </main>

          {/* RIGHT: Sticky sidebar */}
            <motion.aside
              className="dp-side"
              initial={{ opacity: 0, x: 40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={viewportOnce}
              transition={{
                duration: 0.6,
                ease: EASE_SMOOTH,
              }}
            >
              <div className="dp-side-sticky">

              {/* Info Card */}
              <div className="dp-card">
                <div className="dp-card-header">
                  <h3>Informasi kunjungan</h3>
                </div>
                <ul className="dp-info-list">
                  <li>
                    <span className="dp-info-key">Durasi</span>
                    <span className="dp-info-val">{info.duration}</span>
                  </li>
                  <li>
                    <span className="dp-info-key">Waktu terbaik</span>
                    <span className="dp-info-val">{info.bestTime}</span>
                  </li>
                  <li>
                    <span className="dp-info-key">Keramaian</span>
                    <span className="dp-info-val">{info.crowd}</span>
                  </li>
                  <li>
                    <span className="dp-info-key">Tipe lokasi</span>
                    <span className="dp-info-val">{info.type}</span>
                  </li>
                </ul>
              </div>

              {/* CTA Card */}
              <div className="dp-card dp-cta">
                <h3>Tertarik berkunjung?</h3>
                <p>Buka lokasi di peta untuk arah perjalanan.</p>

                <a
                  href={`https://www.google.com/maps/search/?api=1&query=${mapsQuery}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="dp-btn dp-btn-primary"
                >
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <path d="M8 1 C5 1 2.5 3.5 2.5 6.5 C2.5 11 8 15 8 15 C8 15 13.5 11 13.5 6.5 C13.5 3.5 11 1 8 1 Z" stroke="currentColor" strokeWidth="1.4"/>
                    <circle cx="8" cy="6.5" r="2" stroke="currentColor" strokeWidth="1.4"/>
                  </svg>
                  Buka di Google Maps
                </a>

                <button
                  onClick={() => document.querySelector('.dp-similar')?.scrollIntoView({ behavior: 'smooth' })}
                  className="dp-btn dp-btn-ghost"
                >
                  {Icons.sparkle(13)} Destinasi serupa
                </button>
              </div>

              {/* Share */}
              <div className="dp-card dp-share">
                <h3>Bagikan</h3>
                <div className="dp-share-btns">
                  <button onClick={() => navigator.clipboard.writeText(window.location.href)} title="Salin link" aria-label="Salin link">
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                      <rect x="5" y="5" width="9" height="9" rx="1.5" stroke="currentColor" strokeWidth="1.4"/>
                      <path d="M11 5 V3.5 A1.5 1.5 0 0 0 9.5 2 H3.5 A1.5 1.5 0 0 0 2 3.5 V9.5 A1.5 1.5 0 0 0 3.5 11 H5" stroke="currentColor" strokeWidth="1.4"/>
                    </svg>
                  </button>
                  <a
                    href={`https://wa.me/?text=${encodeURIComponent(`Lihat destinasi ${destination.place_name} di ${window.location.href}`)}`}
                    target="_blank" rel="noopener noreferrer" title="WhatsApp" aria-label="WhatsApp"
                  >
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                      <path d="M13.6 2.3 A8 8 0 0 0 2.4 13.7 L2 14.5 L1.4 17 L4 16.4 L4.6 16 A8 8 0 0 0 13.6 2.3 Z M9 13.5 A5.5 5.5 0 0 1 5 12 L4.7 11.8 L3.2 12.2 L3.6 10.8 L3.4 10.5 A5.5 5.5 0 1 1 9 13.5 Z M11 9.5 C10.8 9.4 9.9 9 9.7 8.9 C9.5 8.8 9.4 8.8 9.3 9 C9.1 9.2 8.8 9.6 8.6 9.8 C8.5 9.9 8.4 9.9 8.2 9.8 C7.4 9.4 6.8 9 6.4 8.1 C6.3 7.9 6.4 7.8 6.5 7.7 C6.6 7.6 6.7 7.5 6.8 7.4 C6.9 7.3 6.9 7.2 7 7 C7.1 6.9 7 6.8 7 6.7 C6.9 6.6 6.6 5.8 6.5 5.5 C6.4 5.2 6.2 5.3 6.1 5.3 H5.7 C5.6 5.3 5.4 5.3 5.3 5.5 C5.1 5.7 4.7 6.1 4.7 6.9 C4.7 7.7 5.3 8.5 5.4 8.6 C5.5 8.7 6.6 10.4 8.3 11.1 C8.7 11.3 9 11.4 9.3 11.5 C9.6 11.6 10 11.6 10.2 11.5 C10.4 11.5 11.1 11.1 11.2 10.8 C11.3 10.5 11.3 10.2 11.3 10.2 C11.3 10.1 11.2 10 11 9.5 Z"/>
                    </svg>
                  </a>
                  <a
                    href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(`${destination.place_name} - ${destination.city}`)}&url=${encodeURIComponent(window.location.href)}`}
                    target="_blank" rel="noopener noreferrer" title="Twitter" aria-label="Twitter"
                  >
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="currentColor">
                      <path d="M9.5 1 H11.5 L7.6 5.5 L12 12 H8.5 L5.8 8.4 L2.7 12 H0.7 L4.9 7.2 L0.7 1 H4.3 L6.7 4.3 L9.5 1 Z M8.8 10.8 H9.9 L3.5 2.1 H2.3 L8.8 10.8 Z"/>
                    </svg>
                  </a>
                </div>
              </div>

            </div>
          </motion.aside>
        </div>
      </div>

      {/* ===== SIMILAR ===== */}
      <section className="dp-similar">
        <div className="dp-container">
              <motion.div
                className="dp-section-header dp-section-header-center"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{
                  once: false,
                  amount: 0.3,
                }}
                transition={{
                  duration: 0.6,
                  ease: EASE_SMOOTH,
                }}
              >
                <span className="dp-eyebrow-text">
                  Mungkin Anda juga suka
                </span>

                <h2>Destinasi serupa lainnya</h2>

                <p>
                  Berdasarkan analisis Content-Based Filtering,
                  ini destinasi yang paling mirip.
                </p>
              </motion.div>

          {loadingSimilar ? (
            <div className="dp-similar-loading">
              <div className="spin-big"></div>
              <p>Menghitung kemiripan...</p>
            </div>
          ) : similar.length > 0 ? (
            <motion.div
                  className="cards-grid"
                  variants={staggerContainer}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{
                    once: false,
                    amount: 0.1,
                  }}
                >
              {similar.map((rec, i) => (
                <motion.div
                  key={rec.place_id}
                  variants={fadeUp}
                  custom={i}
                >
                  <DestinationCard
                  destination={{
                    place_id: rec.place_id,
                    place_name: rec.place_name,
                    description: rec.description,
                    category: rec.category,
                    city: rec.city,
                  }}
                  onClick={() => navigate(`/destinasi/${rec.place_id}`)}
                />
                </motion.div>
              ))}
            </motion.div>
          ) : (
            <p className="dp-similar-empty">Tidak ada rekomendasi serupa.</p>
          )}
        </div>
      </section>
    </article>
  );
}

export default DetailPage;
