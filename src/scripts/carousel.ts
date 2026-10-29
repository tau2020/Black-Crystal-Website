// Manual carousel (no auto-rotation). Controls are revealed only when JavaScript is available.

export function initCarousel(root: HTMLElement): void {
  const slides = [...root.querySelectorAll<HTMLElement>('[data-slide]')];
  const controls = root.querySelector<HTMLElement>('[data-carousel-controls]');
  const status = root.querySelector<HTMLElement>('[data-carousel-status]');
  const indexLabel = root.querySelector<HTMLElement>('[data-carousel-index]');
  if (slides.length < 2 || !controls) return;

  let current = 0;
  controls.hidden = false;

  const show = (next: number, announce = true) => {
    current = (next + slides.length) % slides.length;
    slides.forEach((slide, i) => (slide.hidden = i !== current));
    if (indexLabel) indexLabel.textContent = String(current + 1);
    if (announce && status) {
      const title = slides[current]?.querySelector('h3')?.textContent?.trim() ?? '';
      status.textContent = `Project ${current + 1} of ${slides.length}: ${title}`;
    }
  };

  root.querySelector('[data-carousel-prev]')?.addEventListener('click', () => show(current - 1));
  root.querySelector('[data-carousel-next]')?.addEventListener('click', () => show(current + 1));
  root.addEventListener('keydown', (event) => {
    if ((event.target as HTMLElement).closest('input, textarea')) return;
    if (event.key === 'ArrowRight') show(current + 1);
    if (event.key === 'ArrowLeft') show(current - 1);
  });

  // Swipe support for touch devices.
  let startX = 0;
  let startY = 0;
  root.addEventListener(
    'touchstart',
    (event) => {
      startX = event.touches[0]?.clientX ?? 0;
      startY = event.touches[0]?.clientY ?? 0;
    },
    { passive: true },
  );
  root.addEventListener(
    'touchend',
    (event) => {
      const dx = (event.changedTouches[0]?.clientX ?? 0) - startX;
      const dy = (event.changedTouches[0]?.clientY ?? 0) - startY;
      if (Math.abs(dx) > 48 && Math.abs(dx) > Math.abs(dy) * 1.5) show(current + (dx < 0 ? 1 : -1));
    },
    { passive: true },
  );

  show(0, false);
}
