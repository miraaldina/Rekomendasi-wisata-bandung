# UPDATE: Dataset Bersih Tanpa Duplikat (331 Destinasi)

Anda berhasil menghapus 46 duplikat dari dataset! Dataset sekarang dari 377 jadi **331 destinasi unik**.

## Apa yang Berubah

✅ Dataset clean (377 → 331 destinasi)
✅ ML model di-train ulang (TF-IDF + Cosine Similarity) berdasarkan dataset yang sudah bersih
✅ Backend Flask tidak perlu diubah (otomatis pakai model baru)

**Catatan:** Place_Id **tidak** direset berurutan — ID asli (1–377) tetap dipakai untuk destinasi yang bertahan, jadi setelah 46 destinasi dihapus akan ada celah nomor (Place_Id tertinggi yang tersisa adalah 360, bukan 331). Ini tidak masalah karena baik backend maupun frontend mengambil data berdasarkan Place_Id yang ada, bukan mengasumsikan urutan berurutan.

## Cara Apply (Penting - Ikuti Berurutan!)

### LANGKAH 1: Stop Server

Di terminal yang menjalankan `npm run dev`, tekan **Ctrl+C** (ini akan menghentikan backend dan frontend sekaligus, karena keduanya dijalankan lewat `concurrently`).

### LANGKAH 2: Replace Dataset

Buka folder: `C:\Users\HP\Documents\UNINUS\skripsi_wisata_bandung\machineLearning\data\`

**Replace** file `dataset_wisata_clean.csv` dengan yang ada di folder `machineLearning/data/` dari zip ini.

### LANGKAH 3: Replace Model Files

Buka folder: `C:\Users\HP\Documents\UNINUS\skripsi_wisata_bandung\machineLearning\model\`

**Replace** keempat file berikut dari folder `machineLearning/model/` di zip:
- `tfidf_vectorizer.pkl`
- `tfidf_matrix.pkl`
- `cosine_sim_matrix.pkl`
- `dataset_processed.pkl`

### LANGKAH 4: Jalankan Ulang

Dari root folder project (`C:\Users\HP\Documents\UNINUS\skripsi_wisata_bandung`), jalankan:

```
npm run dev
```

Perintah ini otomatis menjalankan backend (`python backend/app.py`) dan frontend (`npm --prefix frontend start`) sekaligus lewat `concurrently`.

Tunggu sampai muncul (biasanya di log dengan prefix `[0]`, yaitu proses backend):
```
Model berhasil dimuat! (331 destinasi)
```

dan log dengan prefix `[1]` (proses frontend) menampilkan `Compiled successfully!` serta alamat `http://localhost:3000`.

## Verifikasi

Setelah jalan, buka browser di `localhost:3000`. Cek:
- ✅ Halaman beranda / daftar destinasi menampilkan **331 destinasi ditemukan** (bukan 377 lagi)
- ✅ Cari "Situ Patenggang" → tidak ada lagi (yang ada hanya "Situ Patengan")
- ✅ Cari "Tangkuban Perahu" → cuma "Gunung Tangkuban Perahu" yang tersisa
- ✅ Klik destinasi → foto muncul dengan benar

**Catatan tentang foto:** `PHOTO_MAP` di `frontend/src/utils/utils.js` saat ini masih menyimpan 361 entri (termasuk 41 entri lama untuk destinasi yang sudah dihapus dari dataset). Ini tidak menyebabkan error — entri yang tidak lagi punya pasangan destinasi hanya menjadi mubazir/tidak terpakai — tapi kalau mau benar-benar rapi, entri untuk Place_Id yang sudah dihapus (lihat daftar di bawah) bisa ikut dibersihkan dari `PHOTO_MAP`.

## Daftar 46 Destinasi yang Dihapus

| Place_Id | Nama |
|---|---|
| 75 | Taman Sejarah Bandung |
| 82 | Taman Balai Kota Bandung |
| 140 | Curug Penganten (duplikat Curug Panganten) |
| 158 | Bukit Moko Bandung |
| 166 | Cukul Campsite |
| 170 | Cukul Atas |
| 173 | Situ Cileunca Pangalengan Bandung |
| 177 | Wayang Windu Village |
| 193 | Situ Cileunca Lake |
| 204 | Taman Hutan Raya Ir. H. Djuanda |
| 205 | Situ Patenggang (duplikat Situ Patengan) |
| 209 | Curug Batu Templek Cisanggarung |
| 234 | Curug Tilu Leuwi Opat |
| 241 | Maribaya Natural Hotspring Resort |
| 242 | Terminal Wisata Grafika Cikole |
| 248 | Farm House Susu Lembang |
| 250 | Float Market Lembang, West Bandung, West Java |
| 261 | Tebing Karaton |
| 277 | Foresto Jayagiri Lembang |
| 281 | Jungle Milk Jayagiri |
| 291 | Lembang Park & Zoo |
| 293 | Sanghyang Poek Bandung Purba |
| 294 | Taman Lalu Lintas Ade Irma Suryani |
| 301 | Taman Foto |
| 316 | Punclut |
| 319 | Saung Udjo Heritage |
| 326 | Kawah Putih Ciwidey |
| 328 | Pemandian Air Panas Cimanggu |
| 330 | Kawah Rengganis |
| 331 | Kebun Teh Rancabali |
| 348 | Farmhouse Susu Lembang |
| 349 | Kampung Gajah Wonderland |
| 350 | Tangkuban Perahu (duplikat Gunung Tangkuban Perahu) |
| 352 | Curug Layung |
| 353 | Curug Omas Maribaya |
| 354 | Maribaya Natural Hot Spring |
| 355 | Stone Garden Padalarang |
| 356 | Goa Pawon (duplikat Guha Pawon) |
| 358 | Observatorium Bosscha |
| 359 | Kampung Daun Culture Gallery |
| 360 | Lembang Park and Zoo (duplikat Lembang Park & Zoo) |
| 362 | Terminal Wisata Grafika |
| 363 | Punclut Bandung Barat |
| 365 | Sapu Lidi Resort |
| 376 | Kampung Cai Ranca Upas |
| 377 | Bandung Adventure Park |

## Catatan untuk Skripsi

Di BAB IV (Hasil dan Pembahasan) bagian "Pengumpulan Data", Anda bisa tulis:

> "Setelah proses pengumpulan, dataset awal terdiri dari 377 destinasi. Setelah dilakukan proses pembersihan data (data cleaning) dengan mengidentifikasi entri duplikat berdasarkan kemiripan nama menggunakan algoritma fuzzy string matching, ditemukan 46 entri duplikat dan tidak relevan yang merepresentasikan destinasi yang sama dengan penulisan berbeda (misalnya 'Situ Patengan' dan 'Situ Patenggang') maupun entri yang tumpang tindih dengan destinasi lain. Setelah penghapusan, dataset final yang digunakan untuk pelatihan model adalah **331 destinasi unik**."