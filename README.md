# Parahyangan

Sistem rekomendasi destinasi wisata Bandung Raya. Dibuat untuk tugas akhir Teknik Informatika, Universitas Islam Nusantara.

Aplikasi ini membantu pengguna menemukan tempat wisata yang cocok bisa dengan memilih destinasi favorit lalu mencari yang mirip, atau menuliskan apa yang diinginkan dalam bahasa bebas seperti *"tempat sejuk dengan pemandangan gunung"*.

Metode yang dipakai: Content-Based Filtering dengan TF-IDF dan Cosine Similarity pada deskripsi destinasi berbahasa Indonesia. Preprocessing teks pakai Sastrawi (case folding, cleaning, tokenization, stopword removal, stemming).

## Cakupan

Dataset final berisi 331 destinasi di 3 wilayah:

- Kabupaten Bandung — 126 destinasi
- Kota Bandung — 118 destinasi
- Bandung Barat — 87 destinasi

Kategori terbanyak adalah Wisata Alam (157), disusul Taman Kota (36), Pusat Perbelanjaan (21), Wisata Kuliner (19), dan Taman Hiburan (18).

Dataset ini dibersihkan dari 377 entri awal. 46 entri duplikat/tumpang tindih dihapus (misal "Situ Patengan" dan "Situ Patenggang" yang sebenarnya tempat yang sama).

## Stack

Backend pakai Flask + scikit-learn + Sastrawi. Frontend pakai React 18, React Router, Framer Motion, dan Tailwind CSS. Model TF-IDF dan matriks Cosine Similarity disimpan sebagai file `.pkl` yang dimuat backend saat startup.

## Struktur folder

```
skripsi_wisata_bandung/
├── backend/
│   └── app.py                              
├── frontend/
│   ├── public/images/destinations/         
│   └── src/
│       ├── pages/                          
│       ├── components/                     
│       ├── card/DestinationCard.js
│       └── utils/                          
├── machineLearning/
│   ├── data/
│   │   ├── dataset_wisata_clean.csv        
│   │   └── dataset_preprocessed.csv        
│   ├── notebook/
│   │   └── 01_preprocessing_modeling.ipynb 
│   ├── model/                              
│   ├── output/                             
│   ├── docs/                               
│   └── requirements.txt
├── package.json                            
└── README.md
```

## Prasyarat

- Python 3.10 atau lebih baru
- Node.js 18 atau lebih baru

## Instalasi

Pertama kali clone repo ini, dari root folder jalankan:

```bash
pip install -r machineLearning/requirements.txt
npm install
cd frontend && npm install && cd ..
```

## Menjalankan

Dari root folder:

```bash
npm run dev
```

Perintah ini menyalakan backend dan frontend sekaligus. Tunggu sampai muncul dua indikator ini di terminal:

- Backend (log berprefix `[0]`):
  ```
  Model berhasil dimuat! (331 destinasi)
   * Running on http://localhost:5000
  ```
- Frontend (log berprefix `[1]`):
  ```
  Compiled successfully!
  Local: http://localhost:3000
  ```

Buka browser ke http://localhost:3000. Untuk berhenti, tekan Ctrl+C di terminal yang sama.

## API

Endpoint tersedia di `http://localhost:5000`:

| Method | Endpoint | Kegunaan |
|--------|----------|----------|
| GET | `/` | Info API |
| GET | `/api/destinations` | Semua destinasi |
| GET | `/api/categories` | Daftar kategori |
| GET | `/api/cities` | Daftar wilayah |
| POST | `/api/recommendations` | Rekomendasi berdasar nama destinasi |
| POST | `/api/recommendations-by-text` | Rekomendasi berdasar query teks bebas |

Contoh body untuk `/api/recommendations-by-text`:

```json
{
  "query": "tempat sejuk dengan pemandangan gunung",
  "city": "Bandung Barat",
  "category": "Wisata Alam",
  "top_n": 5
}
```

## Melatih ulang model

Kalau dataset diubah, jalankan notebook `machineLearning/notebook/01_preprocessing_modeling.ipynb` lalu Run All. Notebook akan:

1. Memuat dataset
2. Menjalankan preprocessing (Sastrawi)
3. Menghitung matriks TF-IDF dan Cosine Similarity
4. Menyimpan model ke `machineLearning/model/`
5. Menghitung Precision@5, Precision@10, dan MAP → `machineLearning/output/`
6. Membuat grafik untuk laporan → `machineLearning/docs/`

Setelah selesai, restart `npm run dev` supaya backend memuat model baru.

## Hasil evaluasi

Model diuji pakai 5 query: `museum`, `pemandian air panas`, `alun-alun`, `curug`, dan `taman kota`. Nilai Mean Average Precision (MAP) yang diperoleh adalah 98,5%. Detail perhitungannya ada di `machineLearning/output/hasil_precision_map.xlsx`, dan detail top-10 rekomendasi per query ada di file `detail_top10_rekomendasi_dan_relevansi.xlsx`.

## Catatan

`Place_Id` di dataset final tidak berurutan karena entri yang dihapus tidak diganti nomornya. Nilai maksimumnya 360, bukan 331. Ini tidak masalah karena backend dan frontend hanya melihat ID mana yang ada, bukan urutan.

## Troubleshooting

**`'react-scripts' is not recognized`** dependency frontend belum ter-install. Jalankan `cd frontend && npm install`.

**Backend gagal load model** cek apakah folder `machineLearning/model/` berisi keempat file `.pkl`. Kalau belum, jalankan notebook.

**Halaman menampilkan `0 destinasi ditemukan`** backend belum siap. Cek log terminal, pastikan `Model berhasil dimuat!` sudah muncul.

**Foto destinasi tidak muncul** cek apakah file yang direferensikan di `PHOTO_MAP` (di `frontend/src/utils/utils.js`) benar ada di folder `frontend/public/images/destinations/`.

## Penulis

Mira Aldina
NIM 41037006221007
Teknik Informatika — Universitas Islam Nusantara, 2026