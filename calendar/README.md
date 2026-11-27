# Holst Bento Calendar — Frontend Showcase

Eksplorasi desain antarmuka (UI/UX) kalender **frontend-only** tanpa backend, dibuat untuk menampilkan pendekatan tata letak **Asymmetric Bento Grid**, palet warna **Holst**, dan transisi interaksi ringan (`<300ms`).

## Preview Antarmuka

### Desktop View (7-Day Bento Matrix)
![Desktop View](screenshots\desktop\dashboard.png) | ![Modal View](screenshots\desktop\new-event.png) |

### Mobile View & Custom Event Modal
| Mobile Adaptive View | Custom Holst Modal & Date Picker |
| :---: | :---: |
| ![Mobile View](screenshots\mobile\new-event-m.png) | ![Modal View](screenshots\mobile\dashboar-m.png) |

## Sorotan Desain & Teknis
- **Frontend Showcase Tanpa Backend:** Menggunakan state lokal dan `localStorage` browser sebagai penyimpanan sementara sehingga aman dibagikan secara publik tanpa risiko kebocoran data.
- **Holst Color Palette:** Menggunakan skema warna datar (*flat solid tones* tanpa gradasi 3D): `#F7F0E7`, `#E6D8C9`, `#35534A`, `#4F7568`, `#6F9988`, `#98BCAE`, dan `#C8BEAD`.
- **Semantic HTML & Data-Attributes:** Struktur komponen dibangun menggunakan elemen HTML semantik (`<main>`, `<header>`, `<section>`, `<article>`, `<dialog>`) dan token CSS murni tanpa tumpukan `<div>` berlebih.
- **Adaptive Responsive Layout:** Tampilan otomatis menyesuaikan antara fokus harian (*Daily Focused View*) pada layar ponsel dan matriks mingguan 7 hari penuh pada tablet/desktop.
- **Interaksi & Komponen Kustom:** Dilengkapi animasi *liquid pill*, pemilih tanggal kustom bertema Holst, filter kategori real-time, pencarian agenda, serta input waktu manual berformat AM/PM.

## Tech Stack
- **Framework:** React + TypeScript (Vite)
- **Styling:** Tailwind CSS v4 + CSS Design Tokens
- **Utilities:** `date-fns`, `lucide-react`

## Cara Menjalankan di Lokal
```bash
cd calendar
npm install
npm run dev
