# Landing Page — Kuis Spesial Kemerdekaan 2026 (Dengar Stori)

Landing page campaign HUT RI untuk Kompas.com. Periode kuis **12 – 17 Agustus 2026**,
4 pemenang, total hadiah Rp2.000.000.

Implementasi dari Figma: **Corat-Coret-Aja › Frame 16** (`node-id=335:468`).

## Stack

Static site — HTML + CSS + JavaScript, **tanpa build step dan tanpa dependency**.
Tidak ada `npm install`, tidak ada bundler. Cukup upload isi folder ini ke web server
mana pun (atau taruh di CDN / static hosting).

```
index.html
assets/
  css/styles.css
  js/main.js
  img/            ← slot gambar, lihat assets/img/README.md
tools/serve.ps1   ← local preview server (opsional)
```

## Cara preview

Buka `index.html` langsung di browser — sudah cukup untuk sebagian besar kasus.

Kalau butuh via `http://` (misal untuk tes yang sensitif terhadap protokol `file://`),
jalankan server kecil berbasis PowerShell (tidak butuh Node/Python):

```bash
powershell -NoProfile -ExecutionPolicy Bypass -File "tools/serve.ps1"
```

Lalu buka `http://localhost:8123/`.

## Struktur section

Urutan section mengikuti Figma:

1. **Top bar** — logogram Kompas + ikon akun
2. **Hero** — judul, deskripsi, 2 CTA (Instastory / Mediopods), dan 3 fakta campaign
   (Periode, Pemenang, Total Hadiah)
3. **Menangkan Hadiah Menarik** — kartu info hadiah
4. **Bagaimana Cara Mainnya?** — 4 langkah dengan tab **Instastory** / **Mediopods**,
   plus preview interaktif sisipan kuis di dalam artikel
5. **Pengumuman Pemenang** — 4 pemenang; *tampil hanya di akhir periode* (lihat di bawah)
6. **Syarat dan Ketentuan** — 6 poin
7. **Footer** — footer Kompas.com

## Konfigurasi

Semua yang perlu diubah ada di satu blok, di atas `assets/js/main.js`:

```js
var CAMPAIGN = {
  startAt: '2026-08-12T00:00:00+07:00',
  endAt:   '2026-08-17T23:59:59+07:00',

  // Kapan section "Pengumuman Pemenang" mulai tampil
  winnersAnnouncedAt: '2026-08-17T12:00:00+07:00',

  links: {
    instagram: 'https://www.instagram.com/kompascom/',
    mediopods: 'https://www.kompas.com/mediopods'
  }
};
```

> Tautan Instagram & Mediopods di atas adalah dugaan — **tolong dicek** dan disesuaikan
> dengan URL kanal yang benar.

### Section Pemenang: muncul otomatis di akhir periode

Sesuai requirement, section ini **tidak muncul** selama kuis masih berlangsung. Gating-nya
berbasis tanggal (`winnersAnnouncedAt`), dievaluasi di sisi browser.

Untuk keperluan review / QA, state-nya bisa dipaksa lewat query string:

| URL                       | Hasil                                  |
| ------------------------- | -------------------------------------- |
| `index.html`              | otomatis — ikut tanggal hari ini        |
| `index.html?preview=winners` | paksa **tampil**                    |
| `index.html?preview=running` | paksa **sembunyi**                  |

Nama & email pemenang saat ini masih placeholder (`agus***wati09@gmail.com`) persis seperti
di Figma. Isi datanya di `index.html`, bagian `.winners__grid`.

Catatan: karena gating berjalan di browser, markup pemenang tetap ada di HTML sebelum tanggal
pengumuman. Kalau daftar pemenang harus benar-benar rahasia sampai hari-H, render section ini
dari sisi server (atau ambil datanya via API setelah tanggal pengumuman) — bukan lewat
`hidden` di HTML statis.

## Hal yang perlu diperhatikan

**Copy yang masih perlu diisi/diperbaiki** — ikut apa adanya dari Figma, jadi tolong direview:

- S&K poin 5 menyebut *"tanggal 22 Agustus **2025**"* dan poin 4 menyebut *"hasil **TTS**"* —
  dua-duanya kemungkinan sisa dari campaign sebelumnya, karena campaign ini tahun **2026**
  dan formatnya kuis, bukan TTS.
- Langkah-langkah untuk tab **Mediopods** tidak ada di Figma (hanya Instastory yang dibuat),
  jadi 4 langkahnya saya tulis berdasarkan alur yang kamu jelaskan. Silakan disesuaikan.

**Gambar** — 4 aset raster dari Figma belum bisa diunduh. Detail slot & ukurannya ada di
[`assets/img/README.md`](assets/img/README.md). Halaman tetap tampil utuh tanpa file-file itu.

**Footer** — komponen footer di Figma adalah instance library yang isinya tidak terekspos,
jadi footer di sini direkonstruksi dari screenshot: logo, sosial media, badge aplikasi,
kolom Kanal & Network, form langganan, dan bar legal. Daftar link masih `href="#"`.

**Ikon** — di Figma memakai Phosphor Icons untuk sebagian besar section. Di sini ikonnya
inline SVG buatan sendiri dengan bentuk yang setara, supaya tidak menambah dependency.
Kalau mau presisi, ganti isi `<symbol>` di sprite pada `index.html` dengan SVG Phosphor
yang asli. Pengecualian: ikon akun (`#i-user-circle`) di navbar sudah memakai path asli
dari Figma (diunduh via `download_assets`), bukan buatan sendiri.

**Logogram Kompas** — sudah pakai logogram resmi (diunduh dari Figma `335:2278`), inline
langsung di `.topbar__brand` pada `index.html`, bukan file/placeholder terpisah.

**Form langganan newsletter** di footer belum terhubung ke endpoint mana pun (submit-nya
di-`preventDefault`). Lihat `initNewsletter()` di `assets/js/main.js`.

## Motion / Animasi

Halaman punya dua lapis motion, keduanya di-skip total kalau OS user mengaktifkan
"reduce motion" (lihat bagian Aksesibilitas):

**1. Scroll reveal** — elemen ber-atribut `data-reveal="up|scale|fade"` di `index.html`
muncul (fade + gerak halus) saat masuk viewport, lewat `IntersectionObserver` di
`assets/js/main.js` (§6 `initScrollReveal`). Elemen yang berurutan (4 langkah Cara Main,
4 kartu pemenang, 6 poin S&K) diberi `data-reveal-delay="0..6"` supaya muncul
bergantian, bukan serentak — nilainya dikalikan `--reveal-step` (default 70ms,
dikhususkan 110ms untuk grid pemenang lewat `.winners__grid` supaya terasa seperti
"diumumkan satu per satu").

Sistemnya progressive enhancement murni: kalau JS gagal jalan atau
`prefers-reduced-motion: reduce` aktif, CSS-nya sendiri (`styles.css` §14) tidak pernah
menyembunyikan elemen — semua tetap tampil penuh sejak awal. Jadi aman menambah/memindah
elemen baru: kasih `data-reveal`, atau biarkan tanpa atribut itu kalau tidak perlu animasi.

**2. Signature motion** — foto arsip di Hero (`assets/img/hero-bg.jpg`) di-zoom perlahan
("Ken Burns", 26 detik, `@keyframes heroKenBurns`) meniru bahasa visual film dokumenter,
cocok untuk tema "Dengar Stori". Ini satu-satunya gerakan yang dibuat mencolok — bagian
lain sengaja dibuat tenang & seragam.

**3. Transisi konten** — pergantian visual di panel Cara Main (klik langkah 1-4) dan
state kuis (tanya → selesai) pakai fade-through singkat (`crossfade()` di main.js),
bukan potongan instan.

Kalau mau menambah elemen baru ke sistem reveal: tambahkan `data-reveal="up"` (paling
umum), `="scale"` (untuk kartu/gambar), atau `="fade"` (untuk teks kecil/caption).
Untuk grup yang perlu muncul bertahap, tambahkan `data-reveal-delay="0"`, `="1"`, dst.
sesuai urutan.

## Aksesibilitas

- Tab "Cara Main" pakai pola ARIA tablist penuh — navigasi panah kiri/kanan, Home, End.
- Ada skip link ke konten utama.
- `prefers-reduced-motion` dihormati — scroll reveal, Ken Burns, dan fade-through
  semuanya nonaktif total (bukan cuma dipercepat) saat preferensi ini aktif.
- Semua elemen dekoratif diberi `aria-hidden`.

## Responsif

Breakpoint: `1060px` (kolom jadi bertumpuk), `900px` (tablet), `640px` (mobile).
Sudah dites di 1440 / 768 / 375 — tidak ada horizontal scroll.
Desain Figma hanya menyediakan versi desktop 1440px, jadi layout mobile-nya adalah
adaptasi — kalau ada desain mobile-nya, bisa disesuaikan.
