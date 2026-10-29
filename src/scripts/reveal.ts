// Gentle entrance for below-the-fold sections. Elements are only hidden once this script runs and only
// if they are still below the fold, so content never depends on JavaScript to become visible.

export function initReveal(): void {
  const elements = [...document.querySelectorAll<HTMLElement>('[data-reveal]')];
  if (!elements.length || !('IntersectionObserver' in window)) return;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const reveal = (element: Element) => {
    element.classList.remove('reveal-pending');
    observer.unobserve(element);
  };
  const revealAll = () => document.querySelectorAll('.reveal-pending').forEach(reveal);

  const observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) if (entry.isIntersecting) reveal(entry.target);
    },
    { rootMargin: '0px 0px -40px 0px', threshold: 0 },
  );

  const fold = window.innerHeight * 0.95;
  for (const element of elements) {
    if (element.getBoundingClientRect().top > fold) {
      element.classList.add('reveal-pending');
      observer.observe(element);
    }
  }

  // Safety nets: reaching the end of the page or printing reveals everything.
  const onScroll = () => {
    if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 8) {
      revealAll();
      window.removeEventListener('scroll', onScroll);
    }
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('beforeprint', revealAll);
}
