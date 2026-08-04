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
tools/
  serve.ps1              ← local preview server (opsional)
  build-hero-tema2.ps1   ← bangun ulang latar Hero Tema 2 dari aset sumber
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
5. **Pengumuman Pemenang** — 2 kondisi, "Ongoing" (belum ada pemenang) / "Winner"
   (pemenang sudah ada), default-nya ikut tanggal `winnersAnnouncedAt`, bisa
   di-override manual lewat navbar (lihat bagian Section Pemenang di bawah)
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

### Section Pemenang: 2 kondisi — "Ongoing" / "Winner"

Section ini **selalu ada di DOM** (tidak pernah `hidden` total seperti sebelumnya) —
yang berubah adalah KONTENnya, lewat atribut `data-winners-state` pada `.slab--winners`
(`"ongoing"` atau `"winner"`), diatur `initWinnersState()` di `assets/js/main.js`
(styles.css §17 untuk toggle CSS-nya, §10 untuk markup & komponennya):

- **Ongoing** (Figma file "Backup Kuis 17an" `BbdQ2sSITixKR7raGXSOw5`, node `23:13634`)
  — kampanye masih berjalan, daftar pemenang belum ada. Menampilkan 6 kartu tanggal
  berisi skeleton placeholder (bukan nama pemenang beneran) + countdown "Akan
  diumumkan dalam" yang menghitung mundur ke `CAMPAIGN.winnersAnnouncedAt`.
- **Winner** (node `23:12296`) — daftar pemenang sudah tersedia. 6 kartu tanggal
  yang sama, isinya 4 email pemenang (tersamar) per hari.

Default state-nya ditentukan sama seperti gating lama (tanggal `winnersAnnouncedAt`),
plus **2 tombol baru di navbar** ("Ongoing"/"Winner", `.state-switch` — independen dari
Tema 1/2 yang sudah dilepas, ini soal WAKTU kampanye bukan varian desain) untuk override
manual saat preview — **tidak disimpan ke localStorage**, cuma untuk sesi saat itu.

Query string preview lama tetap berlaku:

| URL                       | Hasil                                  |
| ------------------------- | -------------------------------------- |
| `index.html`              | otomatis — ikut tanggal hari ini        |
| `index.html?preview=winners` | paksa default **"winner"**          |
| `index.html?preview=running` | paksa default **"ongoing"**         |

Nama & email pemenang saat ini masih placeholder (`agus***wati09@gmail.com`) persis seperti
di Figma. Isi datanya di `index.html`, bagian `.winners--winner .winner-day`.

Catatan: karena state-nya berjalan di browser, markup KEDUA kondisi (termasuk placeholder
email pemenang) tetap ada di HTML sejak awal, terlepas dari tanggal. Kalau daftar pemenang
harus benar-benar rahasia sampai hari-H, render section ini dari sisi server (atau ambil
datanya via API setelah tanggal pengumuman) — bukan lewat CSS `display:none` di HTML statis.

> ⚠️ **Data placeholder di Figma untuk kondisi "Winner" identik di semua 24 slot**
> (`agus***wati09@gmail.com` diulang di 6 kartu × 4 pemenang) — jelas data contoh/lorem
> dari Figma, bukan pemenang beneran. Diikuti apa adanya sesuai konvensi proyek ini
> (ikuti Figma literal, flag kalau ada yang aneh) — pastikan diganti data asli sebelum
> go-live.
>
> Countdown "Akan diumumkan dalam" dan Hero "Dimulai dalam" sekarang berbagi satu
> komponen (`initCountdowns()`, generalisasi dari `initCountdown()` yang lama) — tiap
> instance independen lewat atribut `data-countdown-target` (nama key di `CAMPAIGN`,
> bukan tanggal literal), jadi menambah countdown baru di tempat lain cukup taruh markup
> yang sama + atribut itu, tidak perlu sentuh JS.

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

> **Tema 2 (aktif sekarang) TIDAK memakai carousel ini** (diputuskan 4 Agustus
> 2026). Markup-nya masih ada (`#carousel-podcast`, `.steps-carousel--tema-2`,
> §9), tapi `styles.css` §16 men-set `display: none` untuk itu di SEMUA lebar
> layar, termasuk ≤640px — sebelumnya ada bug tanpa sengaja (spesifisitas
> `[data-theme="tema-2"] .play__body--tema-2` mengalahkan `.play__body { display:
> none }` di §13) yang membuat blok `.steps`+`.showcase` desktop dan carousel
> mobile ini **tampil bersamaan** di mobile — dua tampilan "cara main" bertumpuk.
> Setelah dicek, layout desktop (`.steps`+`.showcase`, sudah 1 kolom di ≤1060px
> lewat §13) ternyata sudah cukup pas dipakai langsung di mobile, jadi
> keputusannya: pakai itu saja di semua lebar layar untuk Tema 2, carousel-nya
> dimatikan permanen (bukan cuma dibiarkan lolos dari bug). Tema 1 tidak
> terpengaruh — dua carousel-nya (`#carousel-instastory`/`#carousel-mediopods`)
> tetap seperti dijelaskan di atas.

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
`assets/js/main.js` (§5 `initScrollReveal`). Elemen yang berurutan (4 langkah Cara Main,
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

> Efek ini cuma berlaku di foto Hero **Tema 1** (`hero-bg.jpg`). Foto Hero **Tema 2**
> (`hero-bg-tema2.jpg`, yang aktif sekarang) sengaja **tidak** ikut Ken Burns (dilepas
> 4 Agustus 2026) — ada mockup HP dengan teks/UI kecil di dalam foto itu, dan teks itu
> jadi kurang nyaman dibaca saat ikut ter-scale. Tema 2 tetap punya animasi masuknya
> sendiri (`heroSlideInRight`, sekali saat termuat) — lihat `styles.css` §14.

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

## Tema — Tema 2 permanen (switcher sudah dilepas)

Situs ini sempat punya 2 tombol kecil di navbar (`.theme-switch`, "Tema 1" /
"Tema 2") untuk ganti tema tampilan secara langsung. **Tombol itu sudah
dilepas atas permintaan** — sekarang **Tema 2 permanen**, satu-satunya
tampilan yang aktif. `<html>` di `index.html` di-hardcode
`data-theme="tema-2"`; tidak ada lagi JS yang mengubahnya, tidak ada
localStorage yang perlu disinkronkan, dan navbar cuma menyisakan ikon akun.

Mekanisme `data-theme` di baliknya **tetap dipertahankan** (bukan disatukan ke
rule dasar) — bukan bug, ini keputusan sadar: markup & CSS **Tema 1 masih ada**
di `index.html`/`styles.css`/`main.js`, cuma disembunyikan permanen lewat
mekanisme yang sama seperti dulu (`[data-theme="tema-2"] .xxx--tema-1 {
display: none; }`, lihat `styles.css` §16). Alasannya:

1. Tema 1 sudah lebih dulu jadi (Hero, Cara Main dengan tab Instastory/
   Mediopods, Banner Hadiah versi podium) — menghapusnya total berarti
   membuang pekerjaan yang sudah diverifikasi berkali-kali sepanjang sesi ini,
   untuk keuntungan yang tidak jelas kalau ternyata dibutuhkan lagi nanti.
2. Kalau suatu saat Tema 2 perlu dijadikan opsional lagi (switcher balik),
   tinggal balik 3 baris (hardcode `data-theme` + hapus/pulihkan tombol +
   `initThemeSwitch`) — bukan membangun ulang dari nol.

> ⚠️ **Konsekuensinya**: markup Tema 1 (duplikat penuh untuk Hero, Cara Main,
> Banner Hadiah) tetap ada di HTML final, cuma `display:none`. Ini menambah
> ukuran halaman & bisa terindeks mesin pencari sebagai teks tersembunyi,
> walau tidak pernah terlihat pengguna. Kalau Tema 2 memang final permanen
> (tidak akan ada kebutuhan balik ke Tema 1 atau dijadikan opsional lagi),
> membersihkan total markup Tema 1 adalah pekerjaan lanjutan yang terpisah —
> cukup besar (menyentuh index.html, styles.css, main.js), jadi belum
> dikerjakan di sesi ini kecuali diminta.

Sebelumnya (masih relevan, sekadar tidak lagi bisa dipilih manual):

- **Tema 1** = desain default yang sudah dibangun di seluruh `styles.css` (semua
  variabel warna di §1 Tokens). Tidak ada override khusus untuk tema ini — dia
  memang nilai default-nya.
- **Tema 2** = warnanya masih placeholder kosong di `styles.css` §16 ("Tema") —
  daftar variabel yang perlu diisi (dan nilai default Tema 1-nya untuk
  perbandingan) ada di komentar `[data-theme="tema-2"]` di situ. Begitu desain
  warna Tema 2 siap, cukup isi variabelnya di situ — tidak perlu ubah HTML/JS.
  Walau sekarang permanen aktif, **tampilan warnanya masih identik Tema 1**
  sampai token ini diisi — bedanya baru di konten (copy Hero, Cara Main, dst.).

### Konten yang beda per tema (bukan cuma warna) — Hero

Untuk bagian yang copy/layout-nya beda antar tema (bukan sekadar warna), polanya
sama seperti dua panel Instastory/Mediopods (§9): **duplikat markup**, satu per
tema, lalu di-toggle lewat CSS — bukan JS yang menukar teks. Hero section
sekarang punya dua versi (Tema 2 mengikuti Figma node **`44:6649`**, file
`Wpib0W14AVOuahrL5rJXNL`):

| Elemen | Tema 1 | Tema 2 (`44:6649`) |
| ------ | ------ | ------------------ |
| Logo Dengar Stori | tampil | **tidak ada** |
| Perataan | center | **rata kiri**, blok 615px, center vertikal |
| Headline | "Rayakan Kemerdekaan…" | "Dengar Podcastnya, Dapatkan **Hadiahnya**" (highlight kotak emas) |
| Sub-headline | 1 paragraf | diawali "**Rayakan kemerdekaanmu**" (cream, semibold) |
| CTA | 2 tombol + "atau" | **1 tombol** "Dengarkan Podcast" |
| Fact | 3 (Periode, Pemenang, Total Hadiah) | **2** (Periode, Pemenang) + ikon dalam badge bundar |
| Separator antar-fact | titik bulat 5px | **garis vertikal** 1×35px, putih 15% opacity |
| Foto latar | `hero-bg.jpg` | `hero-bg-tema2.jpg` (lihat `assets/img/README.md`) |

Class-nya berpasangan `--tema-1` / `--tema-2`: `.hero__photo-img--*`,
`.hero__logo--tema-1`, `.hero__copy--*`, `.hero__actions--*`, `.hero__facts--*`.
Semua toggle-nya di `styles.css` §16.

> **4 Agustus 2026 — Hero Tema 2 pindah ke Figma `16:4171` (frame 810px).**
> Dua hal digabung di sini karena keduanya berasal dari akar yang sama:
> teks episode podcast di screenshot mockup HP-nya salah, dan tombol "Ikuti Kuis
> Dengar Stori" di dalam mockup itu tertutup zona `.hero__blend`. Yang kedua
> ternyata tidak bisa dibetulkan di frame 740px — menggeser aset ke atas supaya
> tombolnya lolos justru membuat puncak HP kepotong navbar. Figma sendiri sudah
> merevisi tinggi Hero jadi **810px**, dan itu yang memberi ruang untuk keduanya.
>
> Yang berubah: `min-height` `.hero` Tema 2 → 810px, `.hero__blend` → `bottom:
> -292px`, dan `hero-bg-tema2.jpg` dibangun ulang jadi 2880×1620 dari tiga layer
> **mentah** (gradient-nya sekarang dihitung skrip, bukan di-export per node).
> Detail + hasil pengukurannya di `assets/img/README.md`.
>
> **Belum diikuti dari node ini:** di `16:4171` tombol CTA "Dengarkan Podcast"
> dan dua fact (Periode/Pemenang) ada di **satu baris**, sedangkan implementasi
> sekarang masih menumpuknya (CTA di `.hero__body`, fact di baris terpisah
> dengan `margin-top: 40px`). Konten juga diposisikan lebih ke bawah di Figma
> (blok konten mulai di y=296, countdown di y=668 — absolut, bukan mengalir).
> Keduanya perubahan layout tersendiri di luar perbaikan mockup HP, jadi
> sengaja tidak disentuh.

### Banner Hadiah — Figma `57:2458`

Pola duplikat-markup yang sama dipakai juga di kartu "Menangkan Hadiah"
(`.prize__media--*`, `.prize__copy--*`):

| Elemen | Tema 1 | Tema 2 (`57:2458`) |
| ------ | ------ | ------------------ |
| Visual kiri | foto podium (`hadiah-podium.png`, 333×222) | **tumpukan kartu notifikasi GoPay** (`hadiah-gopay.png`, dirender 357×181) |
| Judul | "…Rp50.000 untuk 4 orang pemenang…" | "…**GoPay** Rp50.000 untuk 4 orang pemenang…" |
| Poin 1 | Instagram @kompascom **atau** Podcast | **podcast saja**: "Cukup dengan dengarkan Podcast Dengar Stori di Kompas.com…" |
| Poin 2 | "…kamu **mengikuti** dan menjawab kuis…" | "…kamu **mendengarkan** dan menjawab kuis…" |
| "AYO TUNGGU APA LAGI!!" | ada | **tidak ada** (tidak ada di node ini) |
| Titik bullet | 12px, rata tengah | **8px, rata atas** (pusat 9px dari puncak teks) |
| Gradient kartu | `#25221D → #2D2519` | `#22201B → #2D2519` |
| Glow ellipse | pas di tengah | **30px di bawah** tengah |
| Padding vertikal | 40px | **35,5px** |

Dua nilai terakhir + gradient sengaja diikuti walau selisihnya kecil, karena
node ini memang menyebut angka yang berbeda dari node Tema 1 (`356:1806`, file
Figma yang lain — dari situlah `#25221D` dan padding 40px berasal).

Terverifikasi terhadap Figma di 1440px: tumpukan kartu **x=50, w=317, h=133 —
selisih 0px**, blok teks **x=413, w=617 — selisih 0px**. Tinggi banner 273px vs
271px di Figma; selisih 2,4px itu murni pembulatan `line-height` (Figma
membulatkan tinggi teks ke 72+104, sedangkan render nyatanya 72,8+105,6) dan
tidak bisa dihilangkan tanpa mengunci tinggi manual — yang justru rapuh kalau
copy-nya berubah.

### Countdown "Dimulai dalam" — Tema 2 saja (Figma `65:5494`)

Ditaruh tepat di bawah baris fact Periode/Pemenang di Hero Tema 2 (`.countdown`,
styles.css §5 untuk tampilannya, §16 untuk toggle tampil/sembunyinya, §7
`initCountdown` di `assets/js/main.js` untuk logic hitung mundurnya). **Cuma
untuk Tema 2** — atas permintaan eksplisit, Tema 1 tidak disentuh.

- Menghitung mundur ke `CAMPAIGN.startAt` (config yang sama dipakai gating
  section Pemenang), update setiap detik lewat `setInterval`.
- **Hari tidak dipad, Jam/Menit/Detik dipad 2 digit.** Figma cuma menunjukkan
  nilai sesaat (5/10/3/31) di mockup-nya, bukan aturan padding yang disengaja —
  tanpa pad, lebar kotak 56px yang sama untuk semua unit akan membuat digitnya
  "loncat" posisi tiap kali nilai jam/menit/detik melewati batas 10.
- **Hilang otomatis** (bukan berhenti di "0 Hari 0 Jam...") begitu
  `CAMPAIGN.startAt` terlewati — label "Dimulai dalam" tidak lagi relevan
  setelah kuisnya mulai. Diverifikasi lewat logic terisolasi (startAt di masa
  lalu → elemen langsung `hidden`), bukan lewat menunggu tanggal aslinya.
- Warna kotak (`#292723`) dan separator (`#333`) ditulis literal, tidak
  dipetakan ke token §1 Tokens — nilai spesifik komponen ini saja.
- **Mobile (≤640px)**: label ditumpuk di atas kotak-kotak (bukan disamping),
  karena keduanya berdampingan lebih lebar dari viewport mobile dan Figma tidak
  menyediakan varian mobile untuk komponen ini.

Terverifikasi di 1440px: kotak 56×65, separator 8×65, gap label→kotak 24px,
rata kiri sejajar dengan baris fact di atasnya (`x` sama persis) — semua sesuai
Figma. Di 375px, baris kotak (272px) muat nyaman tanpa horizontal overflow.

Beberapa keputusan implementasi yang menyimpang dari Figma **dengan sengaja**,
karena Figma-nya hanya presisi untuk satu lebar viewport:

- **Highlight "Hadiahnya"** di Figma adalah rect absolute (`left: 222px`), di
  sini `<span class="hero__highlight">` yang `inline` mengikuti alur teks, jadi
  tetap benar di semua ukuran layar. Padding-nya em (bukan px) supaya ikut
  mengecil bareng `--h1`; vertikal jauh lebih kecil dari horizontal karena
  tinggi content-box elemen inline ditentukan metrik font, bukan `font-size`
  (detailnya di komentar CSS-nya).
- **Tepi kiri konten** disamakan dengan container global (185px @1440) lewat
  `max-width: var(--content)`, bukan offset 202px hardcoded dari Figma —
  selisih 17px, tapi jadi konsisten dengan section lain & tetap responsif.
- **Center vertikal** lewat `display: flex` + `padding-block` simetris pada
  `.hero`. Di 1440×740 hasilnya tepi atas konten di y≈183px, sama dengan Figma.
  Di ≤900px `.hero` sudah `min-height: 0`, jadi centering otomatis jadi no-op
  (kembali rata atas seperti Tema 1) tanpa aturan tambahan.
- **Badge ikon fact** diposisikan `absolute` terhadap `.fact`, bukan pakai div
  pembungkus — `dl > div` hanya boleh berisi `dt`/`dd`, jadi menambah div lagi
  akan membuat HTML tidak valid.
- **Separator antar-fact** (`.fact__sep`) tetap elemen yang sama dengan Tema 1
  (titik bulat), cuma tampilannya di-override jadi garis vertikal lewat CSS —
  bukan class/markup baru. Karena container-nya (`.hero__facts--tema-2`)
  `align-items: flex-start` (supaya blok ikon+label rata atas), separator perlu
  `align-self: center` tersendiri, kalau tidak garisnya ikut ke atas alih-alih
  center terhadap tinggi baris seperti Figma.

> ⚠️ **Dua typo di Figma `44:6649` tidak saya ikut-ikutkan**, karena jelas tidak
> disengaja: (1) headline-nya tertulis `Dengar Podcastnya , Dapatkan` — ada
> spasi sebelum koma; (2) tanggal Periode tertulis `12 –1 7 Agustus 2026` —
> spasinya salah tempat. Keduanya saya tulis normal. Tolong dikonfirmasi.
>
> Ikon fact di Figma memakai varian **outline** (`CalendarBlank`, `UsersFour`),
> tapi di sini tetap varian **Fill** (`#i-calendar-dots-fill`,
> `#i-users-four-fill`) mengikuti permintaan sebelumnya untuk pakai Phosphor
> style Fill di seluruh fact Hero.
>
> Di render Figma, sub-headline Tema 2 terlihat **terpotong** di tengah kata
> ("Setiap ep|") karena foto kanan + gradient-nya digambar di atas teks. Itu
> artefak layering di file Figma-nya; di implementasi ini teks selalu di atas
> layer latar sehingga terbaca penuh.

### Bagaimana Cara Mainnya — Tema 2: podcast-only, tanpa tab

Atas permintaan langsung (bukan dari Figma): Tema 2 fokus ke **1 metode saja**
(podcast), jadi switcher tab Instastory/Mediopods dilepas total, dan langkahnya
jadi **3** (bukan 4):

1. **Masuk ke Podcast Kompas.com atau masuk melalui notifikasi** — gambar dari
   `Asset Step 1.jpg` (root folder) → `assets/img/cara-main-podcast-1.jpg`
2. **Dengarkan Podcast Dengar Stori** — `Asset Step 2.jpg` → `cara-main-podcast-2.jpg`
3. **Jawab kuis di artikel** — `Asset Step 3.jpg` → `cara-main-podcast-3.jpg`

Ketiga gambar punya slot & aset sendiri (tidak ada yang dipakai bersama Tema 1
atau placeholder) — detail isinya ada di `assets/img/README.md`.

Markup-nya duplikat penuh: `.play__head--tema-2` (judul saja, tanpa
`.switch`), `.play__body--tema-2` (1 `ol.steps` + 1 `.showcase`, id
`panel-podcast`/`showcase-podcast`), dan `.steps-carousel--tema-2` (mobile, id
`carousel-podcast`) — pola yang sama dengan Hero & Banner Hadiah, di-toggle
lewat `data-theme` di `styles.css` §16.

**Perubahan JS yang menyertainya** (bukan cuma CSS) — karena sebelum ini
section "Cara Main" cuma pernah punya SATU dimensi switching (tab, lewat
atribut `hidden`); sekarang ada DUA dimensi (tab di dalam Tema 1, DAN tema itu
sendiri, lewat CSS `display:none`) yang bisa sama-sama menyembunyikan sebuah
showcase/carousel:

- `activeShowcase()` / `activeCarouselRoot()` (§3e di `assets/js/main.js`) —
  pengganti `$('.showcase:not([hidden])')` yang lama. Query lama itu cuma
  mengecek atribut `hidden` (mekanisme tab), sehingga showcase Tema 2 yang
  TIDAK punya atribut itu (disembunyikan lewat CSS tema, bukan atribut) akan
  ikut lolos bersamaan dengan showcase Tema 1 yang sedang aktif — dua showcase
  "aktif" sekaligus. Fix-nya menambah pengecekan `offsetParent !== null`, yang
  otomatis benar untuk KEDUA mekanisme (attribute ATAU CSS display, dari
  ancestor mana pun) tanpa perlu tahu mekanisme mana yang sedang dipakai.
- `syncActivePlayMedia()` — dipanggil dari gerbang scroll (§3f) begitu section
  ini pertama kali kelihatan: reset ke langkah 1 (konsisten dengan perilaku
  ganti tab yang sudah ada), matikan semua timer, nyalakan lagi cuma yang
  showcase/carousel-nya benar-benar aktif.

> Fungsi-fungsi ini awalnya juga dipanggil dari theme switcher (waktu tema
> masih bisa diganti manual lewat tombol navbar) — sekarang switcher-nya sudah
> dilepas (lihat bagian "Tema" di atas), tapi `activeShowcase()`/
> `activeCarouselRoot()` **tetap diperlukan** selama markup Tema 1 masih ada
> di DOM (dormant, disembunyikan permanen): tanpa keduanya, query lama
> `$('.showcase:not([hidden])')` akan salah pilih showcase Tema 1 yang secara
> ATRIBUT tidak `hidden` (cuma disembunyikan lewat CSS tema), bersamaan dengan
> showcase Tema 2 yang aktif sungguhan.

**Latar `.hero` Tema 2 = `--bg` (#1C1A16) datar**, bukan gradient hangat
`--bg-hero` milik Tema 1 — sesuai root Figma `44:6649` yang `bg-[#1c1a16]`.
Bukan cuma soal fidelity: warna inilah yang sempat terlihat sebagai **"gap
cokelat"**, karena ujung atas `--bg-hero` terang (#8E867E) dan menyembul di dua
momen — (1) selama animasi slide-in, saat foto masih bergeser 72px ke kanan
sehingga tepi kiri sesaat belum tertutup, dan (2) sesaat setelah tombol "Tema 2"
diklik, karena aset latarnya `loading="lazy"` jadi ada jeda sebelum termuat.
Dengan `#1C1A16` — praktis sama dengan tepi kiri/atas aset komposit-nya
(terukur #1A1915) — dua momen itu jadi tak terlihat.

**Mockup HP-nya digeser turun 40px** dari posisi asli Figma. Sebabnya: frame Hero
di Figma mulai dari y=0 puncak halaman tanpa navbar, jadi mockup-nya cuma
**25,5px** dari tepi atas (terukur dari alpha aset sumbernya, lalu dipetakan lewat
transform `object-cover` Figma-nya). Di implementasi ini ada `.topbar` 50px
sebelum `.hero`, sehingga 25,5px itu jatuh tepat di bawah navbar dan mockup-nya
terlihat kepotong. Setelah digeser, jaraknya jadi ~65px dari navbar.

Geserannya **dibakar ke dalam aset** oleh `tools/build-hero-tema2.ps1`, bukan
lewat `margin-top` di CSS. Ini penting: `margin-top` pada `<img>`-nya pernah
dicoba dan justru menggeser box `<img>` sehingga strip atas `.hero__photo` tidak
tertutup gambar — itu sumber "gap cokelat" yang kedua. Dengan dibakar ke aset,
`<img>`-nya tetap full-bleed sehingga gap semacam itu **secara struktural tidak
mungkin** terjadi (terverifikasi: gap atas/bawah/kiri/kanan semuanya 0px).
Skrip build-nya punya assertion supaya besaran geserannya tidak pernah sampai
memotong mockup HP di tepi bawah.

**Foto latar Tema 2 juga slide-in dari kanan** sekali setiap kali halaman
dimuat (`heroSlideInRight`, §14) — animasi CSS biasa yang jalan otomatis saat
elemennya pertama kali dirender, tidak perlu logic JS tambahan. Animasi ini jalan **berbarengan** dengan Ken
Burns yang sudah ada — bisa begitu karena keduanya didaftarkan di properti CSS
yang berbeda (`translate` untuk slide-in, `transform: scale()` untuk Ken Burns),
bukan properti yang sama, jadi tidak saling menimpa. Ikut dinonaktifkan total
oleh `prefers-reduced-motion: reduce` seperti animasi lain di proyek ini —
geseran posisinya (`margin-top` 64px) tetap berlaku terlepas dari itu, karena
itu perbaikan layout, bukan animasi.

> Detail teknis di atas (`initThemeSwitch`, localStorage key `kuisTheme`, inline
> `<script>` anti-kedipan di `<head>`) sudah **tidak ada lagi** — semuanya
> dihapus sekaligus dengan tombol switcher-nya, karena tidak ada lagi pilihan
> yang perlu disimpan atau disinkronkan. `data-theme="tema-2"` sekarang cuma
> atribut statis di `index.html`.

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
