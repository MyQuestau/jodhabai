/* ============================================================
   Header — menu open/close behaviour.

   The header markup is inlined directly in each page (so it works
   when opened via file:// as well as over http://). This script
   wires up the open/close interactions for the full-screen menu.
   ============================================================ */
(function () {
  function init() {
    const openBtn = document.getElementById("menuOpen");
    const closeBtn = document.getElementById("menuClose");
    const overlay = document.getElementById("menuOverlay");
    const body = document.body;

    if (!openBtn || !closeBtn || !overlay) return;

    function openMenu() {
      overlay.classList.add("is-open");
      overlay.setAttribute("aria-hidden", "false");
      openBtn.setAttribute("aria-expanded", "true");
      body.classList.add("menu-open");
      // Move focus into the overlay so keyboard users land in the menu
      closeBtn.focus();
    }

    function closeMenu() {
      overlay.classList.remove("is-open");
      overlay.setAttribute("aria-hidden", "true");
      openBtn.setAttribute("aria-expanded", "false");
      body.classList.remove("menu-open");
      // Return focus to the control that opened the menu
      openBtn.focus();
    }

    // Focus trap — keep Tab cycling inside the open overlay
    // (mirrors the legal modal's trap in footer.js)
    overlay.addEventListener("keydown", function (e) {
      if (e.key !== "Tab" || !overlay.classList.contains("is-open")) return;
      var focusable = Array.prototype.slice.call(
        overlay.querySelectorAll('a[href], button:not([disabled])')
      );
      if (!focusable.length) return;
      var first = focusable[0];
      var last = focusable[focusable.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    });

    openBtn.addEventListener("click", openMenu);
    closeBtn.addEventListener("click", closeMenu);

    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && overlay.classList.contains("is-open")) {
        closeMenu();
      }
    });

    overlay.querySelectorAll(".menu-link").forEach((link) => {
      link.addEventListener("click", closeMenu);
    });

    document.dispatchEvent(new CustomEvent("header:ready"));
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();

/* ---- Scroll-to-top button ---- */
(function () {
  const btn = document.createElement("button");
  btn.className = "back-to-top";
  btn.setAttribute("aria-label", "Back to top");
  btn.innerHTML = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><polyline points="18 15 12 9 6 15"/></svg>`;
  document.body.appendChild(btn);

  window.addEventListener("scroll", function () {
    btn.classList.toggle("is-visible", window.scrollY > 500);
  }, { passive: true });

  btn.addEventListener("click", function () {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
})();
