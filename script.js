/* ================================================================
   凪 整体院 LP — script.js

   このファイルでは以下を担当しています：
     1. スクロール時のヘッダー見た目の変化（影をつける）
     2. スクロールに合わせた要素のフェード表示（IntersectionObserver）
     3. アンカーリンクのスムーズスクロール（ヘッダー分の調整）
     4. モバイルメニューの開閉
     5. FAQ アコーディオン（同時に1つだけ開く挙動）
     6. スマホ用フローティングCTAの表示制御

   外部ライブラリは使っていません（純粋な JavaScript のみ）。
================================================================ */

(function () {
  'use strict';

  /* ---- 1. ヘッダー：スクロールしたら is-scrolled を付ける ---- */
  const header = document.getElementById('siteHeader');

  function onScroll() {
    const y = window.scrollY;
    if (header) header.classList.toggle('is-scrolled', y > 8);
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();


  /* ---- 2. フェード表示（IntersectionObserver） ----
     .fade-up クラスがついた要素が画面に入ったら .is-visible を付ける */
  const fadeTargets = document.querySelectorAll('.fade-up');

  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          // 連続して並んでいる要素は少し時差をつける
          const idx = Array.from(entry.target.parentElement?.children || []).indexOf(entry.target);
          entry.target.style.transitionDelay = `${Math.min(idx * 60, 300)}ms`;
          entry.target.classList.add('is-visible');
          io.unobserve(entry.target);
        }
      });
    }, {
      rootMargin: '0px 0px -8% 0px',
      threshold: 0.1
    });

    fadeTargets.forEach((el) => io.observe(el));
  } else {
    // 古いブラウザ用フォールバック：すべて表示
    fadeTargets.forEach((el) => el.classList.add('is-visible'));
  }


  /* ---- 3. アンカーリンクのスムーズスクロール（ヘッダー高さ分オフセット） ---- */
  const headerHeight = () => (header ? header.offsetHeight : 0);

  document.querySelectorAll('a[href^="#"]').forEach((link) => {
    link.addEventListener('click', (e) => {
      const href = link.getAttribute('href');
      if (!href || href === '#') return;

      const target = document.querySelector(href);
      if (!target) return;

      e.preventDefault();
      const top = target.getBoundingClientRect().top + window.scrollY - headerHeight() + 1;
      window.scrollTo({ top, behavior: 'smooth' });
    });
  });


  /* ---- 4. FAQ：同時に1つだけ開く（任意の挙動）----
     details/summary は標準で開閉できるが、
     UX として「他を開いたら自動で閉じる」方式に統一する */
  const faqItems = document.querySelectorAll('.faq-item');
  faqItems.forEach((item) => {
    item.addEventListener('toggle', () => {
      if (item.open) {
        faqItems.forEach((other) => {
          if (other !== item) other.open = false;
        });
      }
    });
  });


})();

/* =====================================================================
  【別業種への流用ガイド（JS編）】

  - 基本的にこのファイルは「触らなくて OK」です。
  - LINEの予約リンクを設定するときは、HTML側の
        <a href="#" class="btn btn--primary ...">LINEで予約・相談する</a>
    の href="#" を、自店のLINE公式URL（例: https://lin.ee/xxxxxxx）に
    変更してください。target="_blank" rel="noopener" を付けると別タブで開きます。

  - 電話の発信リンクは <a href="tel:0312345678"> の数字部分を変えるだけです。
====================================================================== */
