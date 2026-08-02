# Slot gambar

Dua aset raster dari Figma (`hero-bg.jpg`, `logo-dengar-stori.png`) sudah terpasang.
Sisanya masih pakai fallback yang rapi, jadi tetap tampil utuh tanpa file-file itu.
Begitu file aslinya ditaruh di folder ini dengan nama di bawah, gambar akan otomatis
dipakai dan fallback-nya hilang — tanpa perlu mengubah kode.

| Nama file                | Ukuran          | Dipakai di                        | Node Figma  | Status |
| ------------------------ | --------------- | --------------------------------- | ----------- | ------ |
| `hero-bg.jpg`            | 1440 × 740      | Latar foto Hero                   | `343:1313`  | ✅ terpasang |
| `section2-bg.jpg`        | 1440 × 907      | Latar bawah Section 2             | `343:4435`  | ✅ terpasang |
| `winners-map.png`        | 1440 × 431      | Latar peta titik-titik Pengumuman Pemenang | `335:2291` | ✅ terpasang |
| `logo-dengar-stori.png`  | 166 × 148       | Logo "Dengar Stori" di Hero       | `335:69`    | ✅ terpasang |
| `hadiah-podium.png`      | 333 × 222       | Foto podium hadiah (transparan) di kartu "Menangkan Hadiah" | `362:1834` | ✅ terpasang |
| `cara-main-1.jpg`        | 1100 × 1100     | Visual langkah 1, tab **Instastory** | —        | ✅ terpasang |
| `cara-main-2.jpg`        | 1100 × 1100     | Visual langkah 2, tab **Instastory** | —        | ✅ terpasang |
| `cara-main-3.jpg`        | 1100 × 1100     | Visual langkah 3, tab **Instastory** | —        | ✅ terpasang |
| `cara-main-mediopods-1.jpg` | 1100 × 1100  | Visual langkah 1, tab **Mediopods**  | —        | ✅ terpasang |
| `cara-main-mediopods-2.jpg` | 1100 × 1100  | Visual langkah 2, tab **Mediopods**  | —        | ✅ terpasang |
| `cara-main-mediopods-3.jpg` | 1100 × 1100  | Visual langkah 3, tab **Mediopods**  | —        | ✅ terpasang |
| `cara-main-4.jpg`        | 1100 × 1100     | Visual langkah 4 — **dipakai bersama** kedua tab | — | ✅ terpasang |
| `footer-logo.png`        | 275 × 55        | Logo Kompas.com di footer          | `1:405` (file `Wpib0…`) | ✅ terpasang |
| `footer-store-appstore.png` | 196 × 66     | Badge "Download di App Store"     | `1:436`     | ✅ terpasang |
| `footer-store-googleplay.png` | 222 × 66   | Badge "Temukan di Google Play"    | `1:437`     | ✅ terpasang |
| `footer-award-wowbrand.png` | 70 × 55      | Badge "Progress WOW Brand 2019"   | `1:441`     | ✅ terpasang |
| `footer-award-superbrands.png` | 63 × 60   | Badge "Superbrands Indonesia's Choice" | `1:442` | ✅ terpasang |
| `footer-award-factchecking.png` | 65 × 65  | Badge "Internews Fact-checking Signatory" | `1:443` | ✅ terpasang |
| `footer-icon-facebook.svg` | 16 × 16       | Ikon sosial Facebook (inline jadi `#i-facebook`) | `1:411` | ✅ dipakai |
| `footer-icon-x.svg`      | 16 × 16.31      | Ikon sosial X (inline jadi `#i-x`)  | `1:415`     | ✅ dipakai |
| `footer-icon-instagram.svg` | 20 × 20      | Referensi ikon Instagram footer (tidak dipakai langsung — dipetakan ke `#i-instagram` yang sudah ada) | `1:419` | referensi |
| `footer-icon-linkedin.svg` | 16.79 × 16    | Ikon sosial **LINE** (nama file keliru saat diunduh — isinya logo blob LINE, bukan LinkedIn; inline jadi `#i-line`) | `1:426` | ✅ dipakai |
| `footer-icon-tiktok.svg` | 32 × 32         | Referensi ikon TikTok (inline jadi `#i-tiktok`, self-contained — lingkaran + logo satu unit) | `1:432` | referensi |
| `footer-icon-mail.svg`   | 24 × 24         | Referensi ikon amplop tombol newsletter (inline jadi `#i-mail`) | `1:448` | referensi |
| `footer-line.svg`        | 1440 × 4        | Garis pembatas atas footer — **tidak dipakai sebagai file**, diganti `border-top` CSS (`#515151`, 4px) karena hasilnya identik dan lebih ringan | `1:475` | tidak dipakai |

## Catatan per slot

**`hero-bg.jpg`** — markup-nya di `index.html` (`.hero__photo` → `<img class="hero__photo-img">`),
style di `assets/css/styles.css`.

> ⚠️ **Penting:** file ini adalah **export komposit final** dari frame Hero di Figma
> (1440×740, persis ukuran frame). Opacity 70% foto, gradient veil gelap, dan glow
> ellipse **semuanya sudah ter-bake ke dalam pixel-nya**. Sudah diverifikasi: baris
> paling bawah gambar terukur `rgb(27,26,22)` — itu warna veil `#1C1A16`.
>
> Jadi gambar ini **harus digambar apa adanya**: opacity 1, tanpa overlay veil, tanpa
> glow. Kalau treatment itu diterapkan lagi di CSS, Hero jadi gelap dua kali dan tidak
> lagi cocok dengan Figma.

Dipakai sebagai elemen `<img>` (bukan CSS `background-image`) supaya bisa memakai
`object-fit: cover` + `object-position: center bottom`. Anchor ke bawah dipilih supaya
fade gelap yang sudah ter-bake selalu menyentuh dasar Hero, sehingga sambungan ke section
di bawahnya tetap mulus di layar yang lebih lebar dari 1440px.

Kalau nanti aset diganti dengan foto mentah (belum ada veil-nya), treatment veil +
opacity perlu dikembalikan ke CSS agar teks tetap terbaca.

Transisi ke Section 2 **bukan** dari gambar ini, tapi dari `.hero__blend` — ellipse
`#1C1A16` ber-blur (Figma "Ellipse 3", node `343:1315`) yang di-CSS murni, tanpa aset.

**`section2-bg.jpg`** — latar bawah Section 2 (node `343:4435`).

Di Figma node-nya berukuran 1440×1440 di `y=318`, tapi Section 2 (tinggi 1225)
memotongnya, jadi yang benar-benar terlihat hanya **1440×907** — dan itu persis
ukuran aset yang diexport (`1225 − 318 = 907`). Karena itu gambar ini dipasang
**menempel ke dasar Section 2** dengan tinggi tetap 907px (`.slab__bg`).

Sama seperti aset Hero, fade ke warna section **sudah ter-bake**: baris paling atas
gambar terukur `rgb(27,26,22)` = `#1C1A16`. Jadi tidak perlu veil tambahan, dan
sisa area Section 2 di atasnya cukup solid `#1C1A16` — sambungannya tak terlihat.

### Visual "Cara Main" (`cara-main-*.jpg`)

Panel kanan pada section Cara Main **berganti mengikuti langkah yang diklik user**
(lihat `selectStep()` di `assets/js/main.js`). Sumbernya file `Instastory_1.png` ..
`Instastory_4.png` di root folder — mockup foto HP berlatar gelap, masing-masing
1254×1254 (2–2,1 MB). Di-resize ke 1100px + dikompres JPEG kualitas 82 (turun ke
~105–170 KB per file) karena sumbernya opaque (tanpa transparansi).

> ⚠️ **Perubahan struktural (riwayat):** sebelumnya langkah 4 memakai mockup HTML/CSS
> interaktif (frame browser palsu + kartu kuis yang bisa diklik, menunjukkan state
> "sebelum menjawab" → "sudah selesai"). Markup itu (`.preview`, `.quiz`, dst.) sudah
> dihapus total dari `index.html`, `styles.css`, dan `main.js` — digantikan gambar
> statis langkah 4 (`cara-main-4.jpg`, sebuah screenshot asli tampilan kuis di
> artikel). Kalau demo interaktifnya masih diinginkan, tinggal minta.

**Instastory dan Mediopods sekarang punya set visual sendiri-sendiri** untuk langkah
1–3 (awalnya sempat berbagi 1 set gambar, tapi tidak akurat karena flow keduanya
beda — Mediopods lewat homepage→kategori podcast→player, bukan lewat Instastory).
Strukturnya di `index.html`:

- Desktop: dua `<div class="showcase">` terpisah — `#showcase-instastory` dan
  `#showcase-mediopods` — di dalam `.play__body` yang sama. Hanya satu yang
  `hidden=false` di satu waktu, ditentukan oleh tab yang aktif (`initTabs()` di
  `main.js` men-toggle `hidden`-nya, mirip pola `#panel-instastory`/`#panel-mediopods`).
  `selectStep()` sengaja dibatasi query-nya ke `.showcase:not([hidden]) [data-showcase-step]`
  supaya klik langkah di satu tab tidak menyentuh showcase tab lainnya.
- Mobile: `#carousel-instastory` dan `#carousel-mediopods` (lihat bagian carousel di
  bawah) masing-masing punya 4 `<img>` slide sendiri.

**Langkah 4 tetap satu gambar yang sama** (`cara-main-4.jpg`) untuk kedua tab — sudah
tepat begitu, karena "Jawab kuis di artikel" adalah titik temu kedua flow (baik dari
Instastory maupun Mediopods, user berakhir di artikel yang sama), jadi tidak perlu
gambar terpisah.

**`winners-map.png`** — latar peta dunia bertitik di section Pengumuman Pemenang
(Figma "Maps", node `335:2291`).

Di Figma, layer ini sebenarnya terdiri dari **ratusan vector kecil** (tiap titik peta
adalah shape terpisah) — tidak ada satu aset gambar yang bisa langsung dipakai. Karena
itu diexport sebagai **satu file PNG flattened** lewat `download_assets` (bukan hasil
rekonstruksi manual titik demi titik).

File-nya **opaque** (bukan transparan): base fill `#262523` dengan titik-titik sedikit
lebih terang `#2E2C2A` sudah ter-bake jadi satu. `#262523` ini juga dipakai sebagai
`background-color` section (`--winners-bg`), jadi kalau gambar gagal dimuat pun,
warnanya tetap menyatu — tidak ada kotak putih pecah.

Posisinya: di Figma layer ini di-clip oleh section (tinggi section 534, layer mulai di
`y=103`), sehingga bagian yang benar-benar terlihat cuma **1440×431** — dan itu persis
ukuran hasil export (`103 + 431 = 534`, pas di tepi bawah section). Karena itu dipasang
menempel ke dasar section (`bottom: 0`, tinggi tetap 431px), sama seperti pola di
`hero-bg.jpg` dan `section2-bg.jpg`.

> Catatan: section ini awalnya sempat salah dibangun dengan tema terang (platinum/putih)
> di iterasi sebelumnya sebelum node Figma-nya benar-benar dicek. Setelah dicek ulang,
> section ini **gelap** (`#262523`, kartu `#3A3836`) — sudah dikoreksi.

**`logo-dengar-stori.png`** — PNG transparan, sudah pas di frame 166×148.

**`hadiah-podium.png`** — foto podium (piala + kotak hadiah + bendera Merah Putih),
menggantikan ilustrasi SVG buatan sendiri di iterasi sebelumnya sekarang bahwa Figma
sudah menyediakan aset sungguhan (`362:1834`) untuk slot ini.

**PNG dengan alpha transparan** — dicek langsung lewat pixel (sudut kanvas `A=0`,
area kotak hadiah `A=255`), bukan foto dengan background solid. Sumbernya
`Asset Banner Hadiah.png` di root folder (bukan hasil `download_assets` Figma yang
pertama kali dipakai — versi itu ternyata punya background emas solid dan sudah
diganti). Di-resize dari 1536×1024 ke 750×500 (~2,25× ukuran render 333×222, cukup
untuk retina) sambil mempertahankan channel alpha; PNG hasil resize tidak dikompres
seagresif JPEG (format lossless demi transparansi) jadi ukurannya ~490 KB — lebih
besar dari versi JPEG lama, tapi itu konsekuensi yang perlu diterima demi transparansi.

Karena kini transparan, `.prize__media` **tidak lagi punya background sendiri** —
kotak hadiah dimaksudkan mengambang langsung di atas gradient card (dan di depan
`.prize__glow`), bukan duduk di dalam kotak abu-abu. Kalau nanti aset diganti lagi
dengan foto ber-background solid, kembalikan `background: var(--surface-1)` di
`.prize__media` (styles.css) supaya area sebelum gambar termuat tetap terlihat rapi.

Card sekarang juga punya `.prize__glow` — ellipse gelap `#312B21` (345×465) yang
sengaja bocor melewati tepi kiri card lalu ter-clip oleh `overflow:hidden` pada
`.prize`. **Catatan jujur:** export SVG Figma untuk shape ini tidak membawa filter
blur sama sekali (sudah dicek langsung ke file SVG mentahnya), padahal screenshot
Figma menunjukkan tepi yang jelas lembut/blur. Kemungkinan besar itu efek "layer
blur" di Figma yang tidak ikut ter-export. `blur(48px)` di CSS adalah kalibrasi visual
manual terhadap screenshot referensi, **bukan** angka yang terbaca langsung dari Figma
— satu-satunya bagian dari update ini yang tidak 100% presisi by-the-numbers.

### Footer (`footer-*`)

Semua aset footer diunduh dari file Figma terpisah (`Wpib0W14AVOuahrL5rJXNL`, node
`1:4891`) — bukan file utama campaign ini. `download_assets` tidak menjamin urutan
`rawImages` sama dengan urutan konstanta `imgImage`, `imgImage1`... di kode referensi,
jadi setiap file dicek ulang (rasio aspek dibandingkan ke ukuran presisi yang tertulis
di kode Figma) sebelum diberi nama final — beberapa sempat salah nama di percobaan
pertama (badge App Store/Google Play dan 3 badge penghargaan sempat tertukar posisi).

**`footer-icon-linkedin.svg` sebenarnya adalah logo LINE**, bukan LinkedIn — nama filenya
dipertahankan apa adanya (tidak di-rename ulang) supaya jejak unduhan tetap jelas, tapi
di kode (`index.html`) sudah dipakai dengan benar sebagai simbol `#i-line` dengan
`aria-label="LINE"`. Ini masuk akal secara konteks: Kompas.com (media Indonesia)
lazimnya mencantumkan kanal LINE, bukan LinkedIn, di deretan sosial medianya.

Ikon TikTok (`footer-icon-tiktok.svg`, dipetakan ke path internal `#i-tiktok`) di kode
Figma-nya diberi nama layer `pinterest` meski frame pembungkusnya bernama `tik_tok` dan
posisinya di urutan ikon sosial (setelah LINE) — kemungkinan sisa salin-tempel dari
komponen lain di file Figma tersebut. Path-nya tetap direplikasi persis seperti yang
diberikan Figma (bukan diganti dengan logo TikTok generik), konsisten dengan prinsip
mengikuti Figma apa adanya di proyek ini; url tautan tetap mengarah ke TikTok karena
itu jelas maksud penempatannya.

## Kalau nama file perlu berbeda

- `hero-bg.jpg` → ubah `url('../img/hero-bg.jpg')` di `assets/css/styles.css`
- sisanya → ubah atribut `src` pada `<img class="opt-img">` di `index.html`
