# Parahyangan — Sistem Rekomendasi Destinasi Wisata Bandung Raya

Aplikasi web rekomendasi destinasi wisata di kawasan Bandung Raya (Kota Bandung, Kabupaten Bandung, Bandung Barat) yang dibangun sebagai tugas akhir Program Studi Teknik Informatika, Universitas Islam Nusantara (2026).

Sistem menggunakan pendekatan **Content-Based Filtering** dengan pembobotan **TF-IDF** dan pengukuran kemiripan **Cosine Similarity** pada deskripsi destinasi berbahasa Indonesia (dengan pipeline preprocessing Sastrawi: *case folding → cleaning → tokenization → stopword removal → stemming*).

---

## Fitur Utama

- **Pencarian berdasarkan tempat** pilih satu destinasi, sistem menampilkan destinasi lain yang paling mirip (berdasarkan deskripsi).
- **Pencarian berdasarkan cerita bebas** pengguna menulis apa yang diinginkan (mis. *"tempat sejuk dengan pemandangan pegunungan"*), sistem mencocokkan ke destinasi paling relevan.
- **Filter wilayah dan kategori** yang bisa dikombinasikan dengan kedua mode pencarian di atas.
- **Halaman detail** dengan rekomendasi destinasi serupa.
- **Katalog lengkap** semua destinasi dengan filter interaktif.

---

## Arsitektur

```
┌─────────────────┐      HTTP/JSON      ┌──────────────────┐
│  React Frontend │ ◄─────────────────► │   Flask Backend  │
│  (port 3000)    │                     │   (port 5000)    │
└─────────────────┘                     └────────┬─────────┘
                                                 │ load pkl
                                                 ▼
                                        ┌──────────────────┐
                                        │  Model TF-IDF +  │
                                        │  Cosine Matrix   │
                                        │  (331 destinasi) │
                                        └──────────────────┘
```

---

## Stack Teknologi

**Backend**
- Python 3, Flask 3, Flask-CORS
- scikit-learn (TF-IDF, Cosine Similarity)
- Sastrawi (stemming & stopwords Bahasa Indonesia)

**Frontend**
- React 18, React Router 6
- Framer Motion (animasi & transisi halaman)
- Tailwind CSS

**Data & ML**
- Jupyter Notebook untuk preprocessing, training, dan evaluasi
- Model tersimpan sebagai file `.pkl` yang dimuat backend saat startup

---

## Struktur Folder

```
skripsi_wisata_bandung/
├── backend/
│   └── app.py                              # Server Flask + endpoint REST
├── frontend/
│   ├── public/
│   │   └── images/destinations/            # Foto tiap destinasi
│   └── src/
│       ├── pages/                          # HomePage, DestinasiPage, DetailPage, TentangPage
│       ├── components/                     # Header, Footer
│       ├── card/DestinationCard.js         # Kartu destinasi (dipakai di beberapa halaman)
│       └── utils/                          # motion.js (preset animasi), utils.js (API + PHOTO_MAP)
├── machineLearning/
│   ├── data/
│   │   ├── dataset_wisata_clean.csv        # Dataset final (331 destinasi)
│   │   └── dataset_preprocessed.csv        # Dataset mentah sebelum dibersihkan
│   ├── notebook/
│   │   └── 01_preprocessing_modeling.ipynb # Notebook end-to-end: preprocessing → training → evaluasi → visualisasi
│   ├── model/                              # Artefak model (.pkl) yang dimuat backend
│   ├── output/                             # Hasil evaluasi (Precision@K, MAP) dalam format .xlsx
│   ├── docs/                               # Grafik untuk laporan BAB IV
│   └── requirements.txt
├── package.json                            # Script `npm run dev` untuk jalankan backend + frontend sekaligus
└── README.md
```

---

## Prasyarat

- **Node.js** ≥ 18 (untuk frontend + `concurrently`)
- **Python** ≥ 3.10
- **pip** untuk install dependency Python

---

## Instalasi (Pertama Kali)

Dari root folder project, jalankan berurutan:

```bash
# 1. Install Python dependencies
pip install -r machineLearning/requirements.txt

# 2. Install dependencies script npm run dev di root
npm install

# 3. Install dependencies frontend
cd frontend
npm install
cd ..
```

---

## Menjalankan Aplikasi

Dari root folder project:

```bash
npm run dev
```

Perintah ini menjalankan **backend dan frontend sekaligus** lewat `concurrently`. Tunggu sampai muncul indikator siap:

- Log berprefix `[0]` (backend):
  ```
  Model berhasil dimuat! (331 destinasi)
   * Running on http://localhost:5000
  ```
- Log berprefix `[1]` (frontend):
  ```
  Compiled successfully!
  Local: http://localhost:3000
  ```

Buka browser di **http://localhost:3000**.

Untuk menghentikan keduanya sekaligus, tekan **Ctrl+C** di terminal yang sama.

---

## API Endpoints (Backend)

Semua endpoint diekspos di `http://localhost:5000`.

| Method | Endpoint | Deskripsi |
|--------|----------|-----------|
| GET | `/` | Info API & jumlah destinasi |
| GET | `/api/destinations` | Daftar semua destinasi |
| GET | `/api/categories` | Daftar kategori wisata |
| GET | `/api/cities` | Daftar wilayah |
| POST | `/api/recommendations` | Rekomendasi berdasarkan nama destinasi |
| POST | `/api/recommendations-by-text` | Rekomendasi berdasarkan query teks bebas |

**Contoh body request** untuk `/api/recommendations-by-text`:
```json
{
  "query": "tempat sejuk dengan pemandangan gunung",
  "city": "Bandung Barat",
  "category": "Wisata Alam",
  "top_n": 5
}
```

---

## Menjalankan Ulang Training (Opsional)

Jika Anda mengubah `dataset_wisata_clean.csv`, latih ulang model dengan menjalankan notebook:

```
machineLearning/notebook/01_preprocessing_modeling.ipynb
```

Klik **Run All** — notebook akan otomatis:
1. Memuat dataset
2. Menjalankan text preprocessing (Sastrawi)
3. Menghitung matriks TF-IDF & Cosine Similarity
4. Menyimpan artefak `.pkl` ke `machineLearning/model/`
5. Menghitung Precision@5, Precision@10, dan MAP (disimpan ke `machineLearning/output/`)
6. Menghasilkan grafik untuk laporan skripsi (disimpan ke `machineLearning/docs/`)

Setelah itu **restart** `npm run dev` supaya backend memuat model yang baru.

---

## Dataset

Dataset final berisi **331 destinasi unik** dari 3 wilayah Bandung Raya, hasil pembersihan dari dataset awal 377 destinasi (46 entri duplikat/tumpang tindih dihapus).

Sebaran per wilayah:
- Kabupaten Bandung: 126 destinasi
- Kota Bandung: 118 destinasi
- Bandung Barat: 87 destinasi

Sebaran per kategori teratas: Wisata Alam (157), Taman Kota (36), Pusat Perbelanjaan (21), Wisata Kuliner (19), Taman Hiburan (18).

> **Catatan tentang Place_Id:** karena entri duplikat dihapus tanpa penomoran ulang, `Place_Id` di dataset final **tidak berurutan** (max = 360, bukan 331) ada celah nomor untuk ID yang dihapus. Backend dan frontend tidak bergantung pada urutan berurutan, jadi ini aman.

---

## Hasil Evaluasi

Evaluasi dilakukan pada 5 query uji dengan metrik Precision@5, Precision@10, dan Mean Average Precision (MAP). Hasil lengkap tersimpan di `machineLearning/output/hasil_precision_map.xlsx`.

**Ringkasan:** MAP mencapai **98,5%** pada 5 query pengujian (`museum`, `pemandian air panas`, `alun-alun`, `curug`, `taman kota`).

Detail hasil top-10 rekomendasi per query untuk lampiran skripsi tersimpan di `machineLearning/output/detail_top10_rekomendasi_dan_relevansi.xlsx`.

---

## Troubleshooting

**`'react-scripts' is not recognized`** dependencies frontend belum ter-install. Jalankan `cd frontend && npm install`.

**Backend gagal load model (`FileNotFoundError`)** — pastikan folder `machineLearning/model/` berisi keempat file `.pkl`. Kalau belum ada, jalankan notebook untuk generate ulang.

**Halaman utama menampilkan `0 destinasi ditemukan`** — backend belum jalan atau belum siap. Cek log terminal, pastikan `Model berhasil dimuat! (331 destinasi)` sudah muncul.

**Foto destinasi tidak muncul** pastikan folder `frontend/public/images/destinations/` berisi file gambar yang direferensikan di `frontend/src/utils/utils.js` (`PHOTO_MAP`).

---

## Penulis

**Mira Aldina**
NIM 41037006221007
Teknik Informatika — Universitas Islam Nusantara
2026