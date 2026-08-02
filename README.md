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
4. **Bagaimana Cara Mainnya?** — 4 langkah dengan tab **Instastory** / **Mediopods**.
   Desktop/tablet (>640px): visual di kanan **auto-slide tiap 5 detik** (loop 1→4→1),
   plus chevron kiri/kanan di atas gambar dan titik indikator di bawahnya (lihat bagian
   Showcase Desktop di bawah). Mobile (≤640px): tampil sebagai **carousel** — gambar
   dulu, judul & deskripsi di bawahnya, geser otomatis tiap 5 detik atau swipe manual
   (lihat bagian Carousel Mobile di bawah)
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
    mediopods: 'https://mediopods.kompas.com/'
  }
};
```

> Tautan Mediopods sudah dikonfirmasi (`https://mediopods.kompas.com/`). Tautan Instagram
> masih dugaan — **tolong dicek** dan disesuaikan dengan URL kanal yang benar kalau perlu.

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

**Footer** — dibangun ulang persis dari Figma file terpisah `Wpib0W14AVOuahrL5rJXNL`,
node `1:4891` ("footer - desktop"): logo, 5 ikon sosial (Facebook, X, Instagram, LINE,
TikTok), 2 badge unduh aplikasi, 3 badge penghargaan/sertifikat, tombol newsletter,
kolom **Kanal** (3 sub-kolom × 12/12/11 link), kolom **Network** (13 link), dan bar
legal (7 link + copyright). Semua warna & ukuran mengikuti variabel yang sudah ada di
`styles.css` (`--platinum`, `--platinum-light`, `--charcoal-light`, `--yale-blue-50`,
dst.) — tidak ada token baru. Daftar link Kanal/Network/legal masih `href="#"` (Figma
tidak menyediakan URL tujuan).

> ⚠️ **Copyright tahun di Figma tertulis "2008 - 2023"**, bukan tahun campaign ini
> (2026). Diikuti apa adanya sesuai Figma — tolong konfirmasi apakah perlu diubah ke
> tahun berjalan.

Ikon sosial Facebook/X/LINE dibuat sebagai `<symbol>` baru di sprite SVG (`#i-facebook`,
`#i-x`, `#i-line`) memakai path persis dari Figma (lihat `assets/img/README.md` untuk
provenance file mentahnya). Instagram memakai simbol yang sudah ada (`#i-instagram`,
sengaja tidak dibuat duplikat karena bentuknya sudah setara). TikTok (`#i-tiktok`)
dibuat self-contained (lingkaran + logo jadi satu unit), **tidak** dibungkus lingkaran
bordered seperti 4 ikon lainnya — sesuai struktur asli di Figma di mana `tik_tok` adalah
satu grup mandiri, bukan ikon di dalam frame lingkaran terpisah.

**Ikon** — di Figma memakai Phosphor Icons untuk sebagian besar section. Di sini ikonnya
inline SVG buatan sendiri dengan bentuk yang setara, supaya tidak menambah dependency.
Kalau mau presisi, ganti isi `<symbol>` di sprite pada `index.html` dengan SVG Phosphor
yang asli. Pengecualian: ikon akun (`#i-user-circle`) di navbar sudah memakai path asli
dari Figma (diunduh via `download_assets`), bukan buatan sendiri.

**Logogram Kompas** — sudah pakai logogram resmi (diunduh dari Figma `335:2278`), inline
langsung di `.topbar__brand` pada `index.html`, bukan file/placeholder terpisah.

**Form langganan newsletter** di footer belum terhubung ke endpoint mana pun (submit-nya
di-`preventDefault`). Lihat `initNewsletter()` di `assets/js/main.js`.

## Carousel mobile — Bagaimana Cara Mainnya (≤640px)

Di layar ≤640px, section Cara Main **tidak** memakai layout desktop (list langkah +
satu visual bersama di kanan). Sebagai gantinya tampil carousel: tiap slide berisi
**gambar dulu, lalu judul dan deskripsi di bawahnya** — geser otomatis tiap 5 detik,
atau bisa digeser manual (swipe, drag, atau klik titik pagination).

Markup-nya ada di `index.html`: dua blok `.steps-carousel` (`#carousel-instastory` dan
`#carousel-mediopods`), masing-masing 4 slide `<li class="steps-carousel__slide">`.
Kontennya **sengaja diduplikasi** dari `.steps` di atasnya (bukan digenerate lewat
JS) — konsisten dengan pola dua panel Instastory/Mediopods yang memang sudah
duplikat sejak awal. **Kalau copy salah satu langkah diubah, ubah juga di sini.**

Perilakunya diatur `initStepsCarousel` (bagian §3d) di `assets/js/main.js`:

- **Auto-geser** tiap 5 detik lewat `setInterval`, berhenti selagi track disentuh
  (`pointerdown`) dan lanjut lagi 5 detik dari awal setelah dilepas (`pointerup`).
- **Swipe manual** memakai native CSS `scroll-snap` (`overflow-x:auto` +
  `scroll-snap-type:x mandatory`) — bukan kode drag/touch sendiri, supaya terasa
  seperti scroll asli (momentum, dsb.) dan otomatis jalan di trackpad/mouse-drag juga.
- **Titik pagination** dibuat otomatis oleh JS (bukan hardcoded di HTML) mengikuti
  jumlah slide, dan disinkronkan balik ke posisi scroll asli lewat event `scroll`
  (jadi tetap benar walau user swipe manual, bukan cuma lewat klik titik).
- **`prefers-reduced-motion: reduce`** — auto-geser dimatikan total (bukan cuma
  dipercepat), geser manual (klik titik) jadi instan tanpa animasi smooth-scroll.
- Ganti tab Instastory ↔ Mediopods otomatis mengganti carousel yang tampil dan
  me-reset ke slide 1, menyalakan timer carousel yang baru aktif dan mematikan
  timer carousel yang disembunyikan (supaya tidak ada dua timer jalan bersamaan
  untuk carousel yang lagi tidak terlihat).
- **Baru mulai auto-geser setelah section ini benar-benar scroll ke viewport**
  (lihat §3e `initPlaySectionAutoplayGate` — sama dengan showcase desktop di
  bawah, penjelasan lengkapnya ada di situ).

> Breakpoint 640px dipilih supaya konsisten dengan definisi "mobile" yang sudah
> dipakai di breakpoint lain pada file ini (bukan breakpoint 1060px tempat layout
> desktop biasanya sudah stack jadi satu kolom — di rentang 641–1060px, section ini
> tetap pakai layout list+visual-bersama seperti desktop, cuma disusun vertikal).

## Showcase desktop — Bagaimana Cara Mainnya (>640px)

Visual di kanan section Cara Main (`.showcase`) auto-slide tiap **5 detik**, loop
1→2→3→4→1, dengan chevron kiri/kanan di atas gambar untuk ganti manual dan titik
indikator (non-klik, sekadar penanda posisi) di bawahnya. Diatur di bagian §3c
`assets/js/main.js` (`showcaseAutoplay`, satu registry per elemen `.showcase`, keyed
by `id`):

- Chevron manual dan auto-advance sama-sama lewat `selectStep()` — sumber kebenaran
  yang sama dipakai daftar langkah kiri, showcase kanan, dan titik indikator, jadi
  ketiganya selalu sinkron dari kontrol mana pun.
- **Hover pause** — arahkan kursor ke showcase menghentikan timer; menjauhkan kursor
  melanjutkan hitungan 5 detik dari awal.
- Ganti tab (Instastory ↔ Mediopods) menghentikan timer showcase yang disembunyikan
  dan menyalakan timer showcase yang baru aktif (tidak pernah dua timer jalan
  bersamaan untuk showcase yang tidak terlihat).
- Klik langkah di daftar kiri me-restart hitungan 5 detik, sama seperti klik chevron.
- `prefers-reduced-motion: reduce` mematikan auto-advance total (bukan cuma
  dipercepat) — chevron & klik langkah tetap berfungsi.
- **Auto-advance baru mulai setelah user scroll sampai section ini kelihatan**,
  bukan langsung jalan sejak halaman dimuat — supaya tidak ada slide yang
  "kelewat" sebelum sempat dilihat. Diatur `initPlaySectionAutoplayGate` (§3e di
  `assets/js/main.js`): satu `IntersectionObserver` mengamati `.play` (section
  pembungkus, bukan showcase/carousel-nya langsung — supaya aman walau salah
  satu di antaranya `display:none` lewat breakpoint), lalu menyalakan timer
  showcase **atau** carousel yang sedang aktif begitu section masuk viewport
  (threshold 15%, `rootMargin` -10% sama seperti `initScrollReveal`), lalu
  observer-nya langsung berhenti mengamati (sekali jalan saja). Setelah itu,
  perilaku hover-pause / ganti-tab / klik-manual tetap seperti biasa.

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

**3. Transisi konten** — pergantian gambar di panel Cara Main (klik langkah 1-4) pakai
fade-through singkat (`crossfade()` di main.js), bukan potongan instan.

**4. Shimmer banner Hadiah** — garis cahaya cream tipis (16% lebar kartu) dan redup,
dimiringkan 20° dan di-blur tebal (28px), yang menyapu kartu "Menangkan Hadiah
Menarik" (`.prize`) dari kiri ke kanan (`@keyframes shimmerSweep`, siklus 2,8 detik:
~1,5 detik menyapu + ~1,3 detik diam). Warnanya cream `rgba(255,230,176,.08)` —
bukan putih — supaya menyatu dengan gradient card yang sudah keemasan, bukan
berkesan sorotan lampu. Easing custom (`cubic-bezier(.45,0,.55,1)`) membuat
gerakannya melandai di kedua ujung, bukan meluncur lalu berhenti mendadak. Semua
ukurannya pakai persen (relatif ke `.prize` sendiri) supaya otomatis menyesuaikan
saat kartu berubah proporsi antara desktop dan mobile.

Kalau mau menambah elemen baru ke sistem reveal: tambahkan `data-reveal="up"` (paling
umum), `="scale"` (untuk kartu/gambar), atau `="fade"` (untuk teks kecil/caption).
Untuk grup yang perlu muncul bertahap, tambahkan `data-reveal-delay="0"`, `="1"`, dst.
sesuai urutan.

## Aksesibilitas

- Tab "Cara Main" pakai pola ARIA tablist penuh — navigasi panah kiri/kanan, Home, End.
- Ada skip link ke konten utama.
- `prefers-reduced-motion` dihormati — scroll reveal, Ken Burns, fade-through, shimmer
  banner Hadiah, auto-geser carousel mobile, dan auto-slide showcase desktop semuanya
  nonaktif total (bukan cuma dipercepat) saat preferensi ini aktif.
- Carousel mobile berhenti auto-geser selagi disentuh (tap-and-hold/drag), dan showcase
  desktop berhenti auto-slide selagi kursor di atasnya (hover) — sesuai prinsip WCAG
  "pause, stop, hide" untuk konten yang bergerak otomatis.
- Semua elemen dekoratif diberi `aria-hidden`.

## Responsif

Breakpoint: `1060px` (kolom jadi bertumpuk), `900px` (tablet), `640px` (mobile).
Sudah dites di 1440 / 768 / 375 — tidak ada horizontal scroll.
Desain Figma hanya menyediakan versi desktop 1440px, jadi layout mobile-nya adalah
adaptasi — kalau ada desain mobile-nya, bisa disesuaikan.
