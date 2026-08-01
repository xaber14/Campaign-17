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
| `cara-main-1.png`        | 588 × 553       | Visual langkah 1 (Cara Main)      | `343:4476`  | belum ada |
| `cara-main-2.png`        | 588 × 553       | Visual langkah 2 (Cara Main)      | `343:4476`  | belum ada |
| `cara-main-3.png`        | 588 × 553       | Visual langkah 3 (Cara Main)      | `343:4476`  | belum ada |

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

### Visual "Cara Main" (`cara-main-1..3.png`)

Panel kanan pada section Cara Main **berganti mengikuti langkah yang diklik user**.
Di Figma panel ini (`343:4476`, 588×553) masih frame kosong, jadi asetnya belum ada.

- **Langkah 1–3** memakai slot gambar di atas; selama file belum ada, yang tampil
  placeholder bergaris putus-putus berisi nama file yang dibutuhkan.
- **Langkah 4 tidak butuh gambar** — visualnya adalah mockup artikel + sisipan kuis
  yang dibuat dari HTML/CSS dan bisa diklik (sesuai teks langkah 4: *"lihat contohnya
  di sebelah kanan"*). Kalau `cara-main-4.png` nanti mau dipakai sebagai gambar statis,
  markup-nya perlu diubah dulu.

Keempat visual ini **dipakai bersama** oleh tab Instastory dan Mediopods. Kalau tiap
tab perlu visual berbeda, tambahkan set slot kedua dan filter berdasarkan tab aktif
di `selectStep()` pada `assets/js/main.js`.

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

**Preview kuis di dalam artikel** (`335:518`, 588 × 553) **tidak butuh gambar** — bagian itu
dibangun sebagai mockup HTML/CSS yang benar-benar bisa diklik, supaya sekaligus
memperagakan perubahan state setelah user menjawab.

## Kalau nama file perlu berbeda

- `hero-bg.jpg` → ubah `url('../img/hero-bg.jpg')` di `assets/css/styles.css`
- sisanya → ubah atribut `src` pada `<img class="opt-img">` di `index.html`
