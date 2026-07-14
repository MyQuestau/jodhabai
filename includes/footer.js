/* ============================================================
   Footer — parallax brand drift.

   Desktop (>1024px): footer is position:fixed; the brand drifts
   upward as the last cream section lifts to reveal the footer.

   Mobile/tablet (≤1024px): footer flows in the document; the
   brand starts below its natural position and rises into place
   as the footer scrolls into the viewport — classic parallax.
   ============================================================ */
(function () {
  function clamp(v, a, b) {
    return Math.max(a, Math.min(b, v));
  }

  function initFooter() {
    const footer      = document.querySelector(".site-footer");
    const footerBrand = document.querySelector(".site-footer__brand");
    const footerTop   = document.querySelector(".site-footer__top");
    const footerCols  = document.querySelector(".site-footer__cols");
    const footerLegal = document.querySelector(".site-footer__legal");
    const trigger     = document.querySelector("[data-footer-trigger]") ||
                        document.getElementById("amenities");

    if (!footerBrand) return;

    // Reduced motion: skip the parallax entirely — everything static
    // and fully visible. The legal modal still initialises below.
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      initLegalModal();
      document.dispatchEvent(new CustomEvent("footer:ready"));
      return;
    }

    const mql = window.matchMedia("(max-width: 1024px)");

    // Helper — apply a parallax shift + opacity fade to an element.
    function applyLayer(el, shift, opacity) {
      if (!el) return;
      el.style.transform = "translateY(" + shift.toFixed(1) + "px)";
      el.style.opacity = opacity.toFixed(2);
    }

    function clearLayers() {
      [footerTop, footerCols, footerLegal].forEach(function (el) {
        if (!el) return;
        el.style.transform = "";
        el.style.opacity = "";
      });
    }

    // ── Desktop ──────────────────────────────────────────────
    // Brand drifts up as the fixed footer is revealed beneath
    // the last cream section.
    function desktopUpdate() {
      if (!trigger) return;
      const winH     = window.innerHeight;
      const aRect    = trigger.getBoundingClientRect();
      const progress = clamp(1 - aRect.bottom / winH, 0, 1);
      const shift    = progress * 36;
      footerBrand.style.setProperty("--footer-shift", (-shift).toFixed(1));
      footerBrand.style.transform = "";
      clearLayers();
    }

    // ── Mobile / tablet ──────────────────────────────────────
    // Multi-layer parallax: each footer element starts below its
    // natural position and rises into place at its own rate as the
    // footer scrolls into the viewport. Different magnitudes create
    // the depth illusion classic to a parallax footer.
    function mobileUpdate() {
      if (!footer) return;
      const winH    = window.innerHeight;
      const rect    = footer.getBoundingClientRect();
      // 0 = footer top just reached viewport bottom (not yet visible)
      // 1 = footer has fully entered (its bottom is flush with the
      // viewport bottom — the page can't scroll any further, since the
      // footer is the last element). Dividing by rect.height instead of
      // winH is what makes 1 actually reachable: on mobile the footer is
      // usually shorter than the viewport, so footer.top can never reach
      // 0 — dividing by winH left entered permanently short of 1, which
      // left the brand mark stuck mid-parallax and clipped by the
      // footer's overflow:hidden.
      const entered = clamp((winH - rect.top) / rect.height, 0, 1);
      const inv     = 1 - entered;

      // Brand — biggest motion, foreground layer
      footerBrand.style.removeProperty("--footer-shift");
      footerBrand.style.transform = "translateY(" + (inv * 140).toFixed(1) + "px)";
      footerBrand.style.opacity = clamp(entered * 1.6, 0, 1).toFixed(2);

      // Columns — mid layer
      applyLayer(footerCols, inv * 60, clamp(entered * 1.5, 0, 1));
      // Legal — also mid layer, slightly stronger to feel grounded
      applyLayer(footerLegal, inv * 90, clamp(entered * 1.35, 0, 1));
      // Top row — background layer, subtlest
      applyLayer(footerTop,   inv * 30, clamp(entered * 1.7, 0, 1));
    }

    let ticking = false;
    function onScroll() {
      if (!ticking) {
        window.requestAnimationFrame(function () {
          mql.matches ? mobileUpdate() : desktopUpdate();
          ticking = false;
        });
        ticking = true;
      }
    }

    // Re-run if viewport crosses the 1024px threshold (e.g. rotation)
    mql.addEventListener("change", function () {
      if (mql.matches) {
        mobileUpdate();
      } else {
        footerBrand.style.transform = "";
        footerBrand.style.opacity = "";
        clearLayers();
        desktopUpdate();
      }
    });

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);

    // Run once on load to set the correct initial state
    mql.matches ? mobileUpdate() : desktopUpdate();

    initLegalModal();

    document.dispatchEvent(new CustomEvent("footer:ready"));
  }

  // ── Legal modal ──────────────────────────────────────────────
  function initLegalModal() {
    var modal    = document.getElementById("legalModal");
    if (!modal) return;

    var backdrop = document.getElementById("legalBackdrop");
    var closeBtn = document.getElementById("legalModalClose");
    var tabs     = modal.querySelectorAll(".legal-modal__tab");
    var panes    = modal.querySelectorAll(".legal-modal__pane");
    var ink      = modal.querySelector(".legal-modal__tab-ink");
    var triggers = document.querySelectorAll(".legal-trigger");

    // Position the sliding ink underline beneath a given tab button
    function positionInk(tab) {
      ink.style.left  = tab.offsetLeft + "px";
      ink.style.width = tab.offsetWidth + "px";
    }

    // Activate a tab and show its corresponding pane
    function activateTab(targetTab) {
      tabs.forEach(function (t) {
        var active = t === targetTab;
        t.setAttribute("aria-selected", active ? "true" : "false");
      });
      panes.forEach(function (p) {
        var active = p.id === "lp-" + targetTab.dataset.tab;
        p.classList.toggle("is-active", active);
        p.setAttribute("aria-hidden", active ? "false" : "true");
      });
      positionInk(targetTab);
    }

    // Open the modal, pre-selecting the tab that matches tabKey
    function openModal(tabKey) {
      var target = modal.querySelector('[data-tab="' + tabKey + '"]');
      activateTab(target || tabs[0]);
      modal.setAttribute("aria-hidden", "false");
      modal.classList.add("is-open");
      document.body.style.overflow = "hidden";
      closeBtn.focus();
    }

    function closeModal() {
      modal.classList.remove("is-open");
      modal.setAttribute("aria-hidden", "true");
      document.body.style.overflow = "";
    }

    // Footer trigger buttons open modal at matching tab
    triggers.forEach(function (btn) {
      btn.addEventListener("click", function () {
        openModal(btn.dataset.legal);
      });
    });

    // In-modal tab switching
    tabs.forEach(function (tab) {
      tab.addEventListener("click", function () {
        activateTab(tab);
      });
    });

    closeBtn.addEventListener("click", closeModal);
    backdrop.addEventListener("click", closeModal);

    // ESC closes modal
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && modal.classList.contains("is-open")) {
        closeModal();
      }
    });

    // Basic focus trap — keeps Tab cycling inside the modal
    modal.addEventListener("keydown", function (e) {
      if (e.key !== "Tab") return;
      var focusable = Array.prototype.slice.call(
        modal.querySelectorAll(
          "button, [href], input, select, textarea, [tabindex]:not([tabindex=\"-1\"])"
        )
      ).filter(function (el) { return !el.disabled; });
      var first = focusable[0];
      var last  = focusable[focusable.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    });

    // Set initial ink position once layout is stable
    requestAnimationFrame(function () { positionInk(tabs[0]); });

    // Re-position ink if the viewport is resized (e.g. orientation change)
    window.addEventListener("resize", function () {
      var activeTab = modal.querySelector(".legal-modal__tab[aria-selected=\"true\"]");
      if (activeTab) positionInk(activeTab);
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initFooter);
  } else {
    initFooter();
  }
})();
