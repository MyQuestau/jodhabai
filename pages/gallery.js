/* ============================================================
   Gallery — left-to-right sequential reveal.
   As the user scrolls through the .snake-gallery section, each
   cell is added to .is-visible in DOM order — which is the
   natural grid flow (row 1 L→R, row 2 L→R, row 3 L→R).
   ============================================================ */
(function () {
  const gallery = document.querySelector(".snake-gallery");
  if (!gallery) return;

  const inner = gallery.querySelector(".snake-gallery__inner");

  const cells = gallery.querySelectorAll(".snake-cell");
  if (!cells.length) return;

  function clamp(v, a, b) {
    return Math.max(a, Math.min(b, v));
  }

  // Read the grid's actual column count (3 on desktop, 2 on mobile per
  // gallery.css) so reveals always land on a full row instead of
  // stopping mid-row.
  function getColumns() {
    if (!inner) return 3;
    const cols = getComputedStyle(inner)
      .gridTemplateColumns.split(" ")
      .filter(Boolean).length;
    return cols || 3;
  }

  let ticking = false;

  function update() {
    const winH = window.innerHeight;
    const gRect = gallery.getBoundingClientRect();
    const gH = gallery.offsetHeight || 1;

    // Reveal stays paused until the gallery's top crosses ~40% of the
    // viewport — so cells stay hidden on page load and only fade in
    // once the user actively scrolls down.
    const start = winH * 0.4;
    const span = gH * 0.7;
    const scrolled = (winH - gRect.top) - start;
    const progress = clamp(scrolled / span, 0, 1);

    const total = cells.length;
    // Pack each cell's trigger inside 0..0.85 so the last cell pops
    // before the section finishes — keeps the cadence brisk while
    // giving each fade room to breathe.
    const triggerSpread = 0.85;
    let visibleCount = 0;
    for (let i = 0; i < total; i++) {
      const trigger = (i / total) * triggerSpread;
      if (progress >= trigger) visibleCount = i + 1;
    }

    // Round up to the nearest full row so a row never appears half-revealed.
    const columns = getColumns();
    visibleCount = Math.min(total, Math.ceil(visibleCount / columns) * columns);

    for (let i = 0; i < total; i++) {
      if (i < visibleCount) {
        cells[i].classList.add("is-visible");
      } else {
        cells[i].classList.remove("is-visible");
      }
    }

    ticking = false;
  }

  function onScroll() {
    if (!ticking) {
      window.requestAnimationFrame(update);
      ticking = true;
    }
  }

  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", onScroll);

  // Run once on load to set the correct initial state
  update();
})();
