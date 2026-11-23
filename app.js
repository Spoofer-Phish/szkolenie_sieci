(() => {
  const deck = document.getElementById("deck");
  const slides = Array.from(document.querySelectorAll(".slide"));
  const totalSlides = slides.length;

  const prevBtn = document.getElementById("prev-btn");
  const nextBtn = document.getElementById("next-btn");
  const counterEl = document.getElementById("slide-counter");
  const progressFill = document.getElementById("progress-fill");
  const announcer = document.getElementById("live-announcer");

  const viewModeBtn = document.getElementById("view-mode-btn");
  const labelSlides = viewModeBtn.querySelector(".btn-label-slides");
  const labelScroll = viewModeBtn.querySelector(".btn-label-scroll");

  const overviewBtn = document.getElementById("overview-btn");
  const overviewDialog = document.getElementById("overview-dialog");
  const overviewList = document.getElementById("overview-list");

  const lightboxDialog = document.getElementById("lightbox-dialog");
  const lightboxImg = document.getElementById("lightbox-img");
  const lightboxCaption = document.getElementById("lightbox-caption");

  const creditsBtn = document.getElementById("credits-btn");
  const creditsDialog = document.getElementById("credits-dialog");

  const themeToggleBtn = document.getElementById("theme-toggle-btn");
  const colorSchemeMeta = document.querySelector('meta[name="color-scheme"]');

  let currentIndex = 0;
  let scrollMode = false;

  function parseSlideFromHash() {
    const match = window.location.hash.match(/^#slajd-(\d+)$/);
    if (!match) return 0;
    const idx = Number.parseInt(match[1], 10) - 1;
    if (idx >= 0 && idx < totalSlides) return idx;
    return 0;
  }

  function buildOverviewList() {
    overviewList.replaceChildren();
    slides.forEach((slide, idx) => {
      const li = document.createElement("li");
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "overview-item-btn";
      btn.dataset.index = String(idx);
      btn.setAttribute("aria-current", idx === currentIndex ? "true" : "false");

      const num = document.createElement("span");
      num.className = "eyebrow";
      num.textContent = `Slajd ${idx + 1}`;

      const title = document.createElement("strong");
      title.textContent = slide.dataset.title || `Slajd ${idx + 1}`;

      btn.append(num, title);
      btn.addEventListener("click", () => {
        overviewDialog.close();
        if (scrollMode) {
          slides[idx].scrollIntoView({ behavior: "smooth", block: "start" });
          slides[idx].querySelector("h1, h2")?.focus();
        } else {
          goToSlide(idx, { focusHeading: true });
        }
      });

      li.append(btn);
      overviewList.append(li);
    });
  }

  function applySlideState(index, { focusHeading = false, updateHash = true } = {}) {
    currentIndex = index;

    slides.forEach((slide, idx) => {
      const active = scrollMode || idx === currentIndex;
      slide.hidden = !active;
      slide.inert = !active;
      slide.classList.toggle("is-active", idx === currentIndex);
    });

    counterEl.textContent = `${currentIndex + 1} / ${totalSlides}`;
    const pct = (((currentIndex + 1) / totalSlides) * 100).toFixed(2) + "%";
    document.documentElement.style.setProperty("--progress-pct", pct);

    prevBtn.disabled = currentIndex === 0;
    nextBtn.disabled = currentIndex === totalSlides - 1;

    const currentTitle = slides[currentIndex].dataset.title || `Slajd ${currentIndex + 1}`;
    announcer.textContent = `Slajd ${currentIndex + 1} z ${totalSlides}: ${currentTitle}`;

    overviewList.querySelectorAll(".overview-item-btn").forEach((btn, idx) => {
      btn.setAttribute("aria-current", idx === currentIndex ? "true" : "false");
    });

    if (updateHash && !scrollMode) {
      history.replaceState(null, "", `#slajd-${currentIndex + 1}`);
    }

    if (focusHeading) {
      const heading = slides[currentIndex].querySelector("h1, h2");
      heading?.focus();
    }
  }

  function goToSlide(targetIndex, options = {}) {
    const clamped = Math.max(0, Math.min(totalSlides - 1, targetIndex));
    if (clamped === currentIndex && !options.force) return;

    const direction = clamped > currentIndex ? "forward" : "backward";

    if (!document.startViewTransition || scrollMode) {
      applySlideState(clamped, options);
      return;
    }

    const transition = document.startViewTransition({
      update: () => applySlideState(clamped, { ...options, focusHeading: false }),
      types: [direction]
    });

    if (options.focusHeading) {
      transition.finished.finally(() => {
        slides[clamped].querySelector("h1, h2")?.focus();
      });
    }
  }

  function toggleViewMode() {
    scrollMode = !scrollMode;
    deck.dataset.view = scrollMode ? "scroll" : "slides";
    viewModeBtn.setAttribute("aria-pressed", String(scrollMode));
    labelSlides.hidden = scrollMode;
    labelScroll.hidden = !scrollMode;

    applySlideState(currentIndex, { updateHash: !scrollMode });
    if (scrollMode) {
      slides[currentIndex].scrollIntoView({ behavior: "auto", block: "start" });
    }
  }

  // Theme Toggle (two-state: system default vs explicit opposite override)
  function getSystemScheme() {
    return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  }

  function getCurrentRenderedScheme() {
    const content = colorSchemeMeta.content;
    if (content === "light" || content === "dark") return content;
    return getSystemScheme();
  }

  themeToggleBtn.addEventListener("click", () => {
    const current = getCurrentRenderedScheme();
    const target = current === "dark" ? "light" : "dark";
    const system = getSystemScheme();

    if (target !== system) {
      try {
        localStorage.setItem("color-scheme", target);
      } catch {}
      colorSchemeMeta.content = target;
    } else {
      try {
        localStorage.removeItem("color-scheme");
      } catch {}
      colorSchemeMeta.content = "light dark";
    }
  });

  window.addEventListener("storage", (event) => {
    if (event.key !== "color-scheme") return;
    if (event.newValue === "light" || event.newValue === "dark") {
      colorSchemeMeta.content = event.newValue;
    } else {
      colorSchemeMeta.content = "light dark";
    }
  });

  // Navigation events
  prevBtn.addEventListener("click", () => goToSlide(currentIndex - 1));
  nextBtn.addEventListener("click", () => goToSlide(currentIndex + 1));
  viewModeBtn.addEventListener("click", toggleViewMode);

  document.querySelectorAll("[data-goto]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const target = Number.parseInt(btn.dataset.goto, 10) - 1;
      goToSlide(target, { focusHeading: true });
    });
  });

  overviewBtn.addEventListener("click", () => {
    buildOverviewList();
    overviewDialog.showModal();
  });

  creditsBtn?.addEventListener("click", () => {
    creditsDialog.showModal();
  });

  // Image Lightbox Zoom (keyboard + pointer accessible via button)
  document.querySelectorAll(".media-zoom-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      const img = btn.querySelector("img");
      if (!img) return;
      lightboxImg.src = img.currentSrc || img.src;
      lightboxImg.alt = img.alt;
      lightboxImg.width = img.naturalWidth || img.width;
      lightboxImg.height = img.naturalHeight || img.height;
      const caption = btn.closest("figure")?.querySelector("figcaption")?.textContent || img.alt;
      lightboxCaption.textContent = caption;
      lightboxDialog.showModal();
    });
  });

  // Keyboard shortcuts
  document.addEventListener("keydown", (event) => {
    if (overviewDialog.open || lightboxDialog.open || creditsDialog.open) return;
    if (event.metaKey || event.ctrlKey || event.altKey) return;

    const target = event.target;
    if (target && target.matches("input, textarea, select, [contenteditable]")) return;

    if (!scrollMode) {
      if (event.key === "ArrowRight" || event.key === "PageDown") {
        event.preventDefault();
        goToSlide(currentIndex + 1);
      } else if (event.key === "ArrowLeft" || event.key === "PageUp") {
        event.preventDefault();
        goToSlide(currentIndex - 1);
      } else if (event.key === "Home") {
        event.preventDefault();
        goToSlide(0);
      } else if (event.key === "End") {
        event.preventDefault();
        goToSlide(totalSlides - 1);
      }
    }
  });

  // Touch swipe for slide mode (vertical scroll preserved)
  let touchStartX = 0;
  let touchStartY = 0;
  deck.addEventListener("touchstart", (event) => {
    if (event.touches.length !== 1) return;
    touchStartX = event.touches[0].clientX;
    touchStartY = event.touches[0].clientY;
  }, { passive: true });

  deck.addEventListener("touchend", (event) => {
    if (scrollMode || event.changedTouches.length !== 1) return;
    const dx = event.changedTouches[0].clientX - touchStartX;
    const dy = event.changedTouches[0].clientY - touchStartY;
    if (Math.abs(dx) > 60 && Math.abs(dx) > Math.abs(dy) * 1.5) {
      goToSlide(dx < 0 ? currentIndex + 1 : currentIndex - 1);
    }
  }, { passive: true });

  window.addEventListener("hashchange", () => {
    const idx = parseSlideFromHash();
    if (!scrollMode) goToSlide(idx, { updateHash: false });
  });

  // Interactive Mini-Quiz (Slide 16)
  const quizCards = document.querySelectorAll(".quiz-card");
  quizCards.forEach((card) => {
    const correctChoice = card.dataset.correct;
    const feedback = card.querySelector(".quiz-feedback");
    const options = card.querySelectorAll(".quiz-opt");

    options.forEach((opt) => {
      opt.addEventListener("click", () => {
        const chosen = opt.dataset.choice;
        options.forEach((o) => {
          o.classList.remove("is-correct", "is-wrong");
          const baseText = o.dataset.baseLabel || o.textContent;
          o.dataset.baseLabel = baseText;
          o.textContent = baseText;
        });

        if (chosen === correctChoice) {
          opt.classList.add("is-correct");
          opt.textContent = `✓ ${opt.dataset.baseLabel}`;
          feedback.hidden = false;
        } else {
          opt.classList.add("is-wrong");
          opt.textContent = `✕ ${opt.dataset.baseLabel}`;
          const rightOpt = card.querySelector(`.quiz-opt[data-choice="${correctChoice}"]`);
          if (rightOpt) {
            rightOpt.dataset.baseLabel = rightOpt.dataset.baseLabel || rightOpt.textContent;
            rightOpt.classList.add("is-correct");
            rightOpt.textContent = `✓ ${rightOpt.dataset.baseLabel}`;
          }
          feedback.hidden = false;
        }
      });
    });
  });

  document.getElementById("quiz-reset-btn")?.addEventListener("click", () => {
    quizCards.forEach((card) => {
      const feedback = card.querySelector(".quiz-feedback");
      feedback.hidden = true;
      card.querySelectorAll(".quiz-opt").forEach((opt) => {
        opt.classList.remove("is-correct", "is-wrong");
        if (opt.dataset.baseLabel) opt.textContent = opt.dataset.baseLabel;
      });
    });
  });

  // Initial render
  buildOverviewList();
  const initialIndex = parseSlideFromHash();
  applySlideState(initialIndex, { updateHash: false });
})();
