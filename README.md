# UPDATE: Dataset Bersih Tanpa Duplikat (361 Destinasi)

Anda berhasil menghapus 16 duplikat dari dataset! Dataset sekarang dari 377 jadi **361 destinasi unik**.

## Apa yang Berubah

✅ Dataset clean (377 → 361 destinasi)
✅ Place_Id direset 1-361 berurutan
✅ ML model di-train ulang (TF-IDF + Cosine Similarity)
✅ Photo mapping di-update sesuai Place_Id baru
✅ Backend Flask tidak perlu diubah (otomatis pakai model baru)
✅ Frontend utils.js sudah diupdate dengan PHOTO_MAP baru

## Cara Apply (Penting - Ikuti Berurutan!)

### LANGKAH 1: Stop Flask & React

Di terminal yang menjalankan Flask, tekan **Ctrl+C**.  
Di terminal yang menjalankan React, tekan **Ctrl+C**.

### LANGKAH 2: Replace Dataset

Buka folder: `C:\Users\HP\Documents\skripsi_wisata_bandung\data\`

**Replace** file `dataset_wisata_clean.csv` dengan yang ada di folder `data/` dari zip ini.

### LANGKAH 3: Replace Model Files

Buka folder: `C:\Users\HP\Documents\skripsi_wisata_bandung\model\`

**Replace** keempat file berikut dari folder `model/` di zip:
- `tfidf_vectorizer.pkl`
- `tfidf_matrix.pkl`
- `cosine_sim_matrix.pkl`
- `dataset_processed.pkl`

### LANGKAH 4: Replace Frontend Files

Buka folder: `C:\Users\HP\Documents\skripsi_wisata_bandung\frontend\src\`

**Replace** semua 11 file dari folder `frontend_src/` di zip:
- App.css
- App.js
- DestinasiPage.js
- DestinationCard.js
- DetailPage.js
- Footer.js
- HasilPage.js
- Header.js
- HomePage.js
- TentangPage.js
- utils.js

### LANGKAH 5: Jalankan Ulang

Buka 2 terminal di VS Code:

**Terminal 1 - Backend:**
```
cd backend
python app.py
```

Tunggu sampai muncul: "Model berhasil dimuat! (361 destinasi)"

**Terminal 2 - Frontend:**
```
cd frontend
npm start
```

## Verifikasi

Setelah jalan, buka browser di `localhost:3000`. Cek:
- ✅ Halaman beranda menampilkan **361 Destinasi** (bukan 377 lagi)
- ✅ Cari "Situ Patenggang" → tidak ada lagi (yang ada hanya "Situ Patengan")
- ✅ Cari "Tangkuban Perahu" → cuma 1 hasil
- ✅ Klik destinasi → foto muncul dengan benar

## Daftar 16 Destinasi yang Dihapus

| ID Lama | Nama |
|---|---|
| 205 | Situ Patenggang (duplikat Situ Patengan) |
| 140 | Curug Penganten (duplikat Curug Panganten) |
| 360 | Lembang Park and Zoo (duplikat Lembang Park & Zoo) |
| 204 | Taman Hutan Raya Ir. H. Djuanda |
| 356 | Goa Pawon (duplikat Guha Pawon) |
| 354 | Maribaya Natural Hot Spring |
| 193 | Situ Cileunca Lake |
| 82 | Taman Balai Kota Bandung |
| 301 | Taman Foto |
| 294 | Taman Lalu Lintas Ade Irma Suryani |
| 331 | Kebun Teh Rancabali |
| 350 | Tangkuban Perahu |
| 330 | Kawah Rengganis |
| 359 | Kampung Daun Culture Gallery |
| 377 | Bandung Adventure Park |
| 362 | Terminal Wisata Grafika |

## Catatan untuk Skripsi

Di BAB IV (Hasil dan Pembahasan) bagian "Pengumpulan Data", Anda bisa tulis:

> "Setelah proses pengumpulan, dataset awal terdiri dari 377 destinasi. Setelah dilakukan proses pembersihan data (data cleaning) dengan mengidentifikasi entri duplikat berdasarkan kemiripan nama menggunakan algoritma fuzzy string matching, ditemukan 16 entri duplikat yang merepresentasikan destinasi yang sama dengan penulisan berbeda (misalnya 'Situ Patengan' dan 'Situ Patenggang'). Setelah penghapusan duplikat, dataset final yang digunakan untuk pelatihan model adalah **361 destinasi unik**."
