/* ==========================================================================
   Kuis Spesial Kemerdekaan 2026 — Dengar Stori | Kompas.com
   Landing page behaviour.
   ========================================================================== */
(function () {
  'use strict';

  /* ------------------------------------------------------------------------
     KONFIGURASI KAMPANYE
     Ubah nilai di blok ini saja — tidak perlu menyentuh bagian lain.
     ------------------------------------------------------------------------ */
  var CAMPAIGN = {
    // Periode kuis (WIB / UTC+7).
    startAt: '2026-08-12T00:00:00+07:00',
    endAt:   '2026-08-17T23:59:59+07:00',

    // Kapan section "Pengumuman Pemenang" mulai tampil.
    winnersAnnouncedAt: '2026-08-17T12:00:00+07:00',

    // Tujuan CTA.
    links: {
      instagram: 'https://www.instagram.com/kompascom/',
      mediopods: 'https://www.kompas.com/mediopods'
    }
  };

  /* ------------------------------------------------------------------------
     Util
     ------------------------------------------------------------------------ */
  function $(sel, scope) { return (scope || document).querySelector(sel); }
  function $$(sel, scope) { return Array.prototype.slice.call((scope || document).querySelectorAll(sel)); }

  // Query string, dipakai untuk preview: ?preview=winners | ?preview=running
  var params = new URLSearchParams(window.location.search);
  var previewMode = params.get('preview');

  var reduceMotion = !!(window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches);

  // Fade-through kecil dipakai untuk pergantian konten (bukan section reveal):
  // showEl muncul, hideEls hilang, tanpa keduanya kelihatan bertumpuk sekaligus.
  // Kalau reduced-motion aktif, langsung tukar tanpa delay/animasi.
  function crossfade(showEl, hideEls) {
    if (!showEl) return;
    if (reduceMotion) {
      hideEls.forEach(function (el) { el.hidden = true; });
      showEl.hidden = false;
      return;
    }

    var OUT_MS = 160;
    var anyLeaving = false;
    hideEls.forEach(function (el) {
      if (el.hidden) return;
      anyLeaving = true;
      el.classList.add('is-swapping');
    });

    window.setTimeout(function () {
      hideEls.forEach(function (el) { el.hidden = true; el.classList.remove('is-swapping'); });
      showEl.hidden = false;
      showEl.classList.add('is-swapping');
      void showEl.offsetWidth; // paksa reflow supaya penghapusan class di bawah benar-benar dianimasikan
      showEl.classList.remove('is-swapping');
    }, anyLeaving ? OUT_MS : 0);
  }

  /* ------------------------------------------------------------------------
     1. CTA — arahkan tombol ke tujuan dari CAMPAIGN.links
     ------------------------------------------------------------------------ */
  $$('[data-link]').forEach(function (el) {
    var href = CAMPAIGN.links[el.getAttribute('data-link')];
    if (href) el.setAttribute('href', href);
  });

  /* ------------------------------------------------------------------------
     2. Gambar opsional — tampilkan fallback sampai file asli tersedia
     ------------------------------------------------------------------------ */
  $$('[data-optional-img]').forEach(function (wrap) {
    var img = $('.opt-img', wrap);
    if (!img) return;

    function markLoaded() { wrap.classList.add('is-loaded'); }

    // Gambar bisa saja sudah selesai dimuat sebelum script ini jalan.
    if (img.complete && img.naturalWidth > 0) markLoaded();
    else img.addEventListener('load', markLoaded, { once: true });
    // Kalau gagal: biarkan fallback tetap tampil (tanpa ikon broken image).
  });

  /* ------------------------------------------------------------------------
     3b. Langkah "Cara Main" — klik nomor untuk mengganti visual di kanan
     ------------------------------------------------------------------------ */
  function selectStep(stepNumber, skipAnim) {
    // Sorot langkah terpilih di SEMUA panel, supaya saat tab berganti
    // langkah aktifnya tetap sinkron.
    $$('.step').forEach(function (step) {
      var on = step.getAttribute('data-step') === String(stepNumber);
      step.classList.toggle('is-active', on);
      if (on) step.setAttribute('aria-current', 'step');
      else step.removeAttribute('aria-current');
    });

    var showItem = null;
    var hideItems = [];
    $$('[data-showcase-step]').forEach(function (item) {
      if (item.getAttribute('data-showcase-step') === String(stepNumber)) showItem = item;
      else hideItems.push(item);
    });

    if (skipAnim) {
      hideItems.forEach(function (item) { item.hidden = true; });
      if (showItem) showItem.hidden = false;
    } else {
      crossfade(showItem, hideItems);
    }
  }

  (function initSteps() {
    var steps = $$('.step');
    if (!steps.length) return;

    steps.forEach(function (step) {
      step.addEventListener('click', function () {
        selectStep(step.getAttribute('data-step'));
      });
    });

    selectStep('1', true);
  })();

  /* ------------------------------------------------------------------------
     3. Tab "Cara Main" — Instastory / Mediopods
     ------------------------------------------------------------------------ */
  (function initTabs() {
    var tabs = $$('.switch__btn');
    if (!tabs.length) return;

    function activate(index, moveFocus) {
      tabs.forEach(function (tab, i) {
        var selected = i === index;
        var panel = document.getElementById(tab.getAttribute('aria-controls'));

        tab.classList.toggle('is-active', selected);
        tab.setAttribute('aria-selected', String(selected));
        tab.tabIndex = selected ? 0 : -1;
        if (panel) panel.hidden = !selected;
      });
      // Mulai lagi dari langkah 1 setiap kali cara mainnya berganti.
      selectStep('1');
      if (moveFocus) tabs[index].focus();
    }

    tabs.forEach(function (tab, i) {
      tab.addEventListener('click', function () { activate(i, false); });

      tab.addEventListener('keydown', function (event) {
        var next = null;
        if (event.key === 'ArrowRight') next = (i + 1) % tabs.length;
        else if (event.key === 'ArrowLeft') next = (i - 1 + tabs.length) % tabs.length;
        else if (event.key === 'Home') next = 0;
        else if (event.key === 'End') next = tabs.length - 1;

        if (next !== null) {
          event.preventDefault();
          activate(next, true);
        }
      });
    });
  })();

  /* ------------------------------------------------------------------------
     4. Demo sisipan kuis — memperagakan perubahan state setelah menjawab
     ------------------------------------------------------------------------ */
  (function initQuizDemo() {
    var quiz = $('[data-quiz]');
    if (!quiz) return;

    var ask  = $('[data-quiz-state="ask"]', quiz);
    var done = $('[data-quiz-state="done"]', quiz);
    var timer = null;

    function show(state) {
      if (state === 'done') crossfade(done, [ask]);
      else crossfade(ask, [done]);
    }

    $$('[data-quiz-option]', quiz).forEach(function (option) {
      option.addEventListener('click', function () {
        $$('[data-quiz-option]', quiz).forEach(function (o) { o.classList.remove('is-picked'); });
        option.classList.add('is-picked');

        clearTimeout(timer);
        timer = setTimeout(function () { show('done'); }, 420);
      });
    });

    var reset = $('[data-quiz-reset]', quiz);
    if (reset) {
      reset.addEventListener('click', function () {
        $$('[data-quiz-option]', quiz).forEach(function (o) { o.classList.remove('is-picked'); });
        show('ask');
      });
    }
  })();

  /* ------------------------------------------------------------------------
     5. Gating section Pengumuman Pemenang
        Tampil hanya setelah CAMPAIGN.winnersAnnouncedAt.
        Preview manual: ?preview=winners (paksa tampil)
                        ?preview=running (paksa sembunyi)

     ⚠️ SEMENTARA DINONAKTIFKAN untuk keperluan review desain & konten.
     Section akan SELALU tampil terlepas dari tanggal, sampai flag di bawah
     ini dikembalikan ke `false`. JANGAN lupa set balik sebelum go-live —
     tanpa ini, pemenang akan terlihat publik sebelum periode kuis berakhir.
     ------------------------------------------------------------------------ */
  var DEV_ALWAYS_SHOW_WINNERS = true;

  (function initWinnersGate() {
    var section = $('[data-winners]');
    if (!section) return;

    var announceAt = new Date(CAMPAIGN.winnersAnnouncedAt).getTime();
    var shouldShow;

    if (DEV_ALWAYS_SHOW_WINNERS) shouldShow = true;
    else if (previewMode === 'winners') shouldShow = true;
    else if (previewMode === 'running') shouldShow = false;
    else shouldShow = isFinite(announceAt) && Date.now() >= announceAt;

    section.hidden = !shouldShow;
  })();

  /* ------------------------------------------------------------------------
     6. Scroll reveal — elemen ber-atribut [data-reveal] muncul saat masuk viewport.
        Dilewati total kalau reduced-motion aktif — CSS-nya sendiri (lihat
        styles.css §14) membuat semua elemen tampil penuh di luar
        `prefers-reduced-motion: no-preference`, jadi tanpa blok ini pun
        halaman tetap benar, cuma tanpa animasi.
     ------------------------------------------------------------------------ */
  (function initScrollReveal() {
    if (reduceMotion) return;

    var items = $$('[data-reveal]');
    if (!items.length) return;

    if (!('IntersectionObserver' in window)) {
      items.forEach(function (el) { el.classList.add('is-visible'); });
      return;
    }

    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-visible');
        io.unobserve(entry.target);
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -10% 0px' });

    items.forEach(function (el) { io.observe(el); });
  })();

  /* ------------------------------------------------------------------------
     7. Newsletter footer — placeholder submit
        Ganti dengan endpoint langganan yang sebenarnya.
     ------------------------------------------------------------------------ */
  (function initNewsletter() {
    var form = $('.fnews');
    if (!form) return;

    form.addEventListener('submit', function (event) {
      event.preventDefault();
      var input = $('.fnews__input', form);
      var value = input ? input.value.trim() : '';

      if (!value || value.indexOf('@') === -1) {
        if (input) input.focus();
        return;
      }
      // TODO: hubungkan ke endpoint langganan Kompas.com.
      var btn = $('.fnews__btn', form);
      if (btn) btn.textContent = 'Terkirim';
    });
  })();

})();
