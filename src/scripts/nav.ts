// Desktop header: scrolled state + mega-menus.
// Mega-menus open on mouse hover (with intent delay), on click/tap of the chevron toggle, and on ArrowDown
// from the toggle. Hover-opened menus close when the pointer leaves; clicking the toggle of a hover-opened menu
// pins it open instead of closing it. Any menu closes on Escape, outside click or focus leaving the header.

const OPEN_DELAY = 140;
const SWITCH_DELAY = 40;
const CLOSE_DELAY = 260;
const TRANSITION_MS = 240;

export function initHeader(): void {
  const header = document.querySelector<HTMLElement>('[data-site-header]');
  if (!header) return;

  let ticking = false;
  const syncScrolled = () => header.classList.toggle('is-scrolled', window.scrollY > 4);
  window.addEventListener(
    'scroll',
    () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        syncScrolled();
        ticking = false;
      });
    },
    { passive: true },
  );
  syncScrolled();

  initMegaMenus(header);
}

function initMegaMenus(header: HTMLElement): void {
  const backdrop = document.querySelector<HTMLElement>('[data-mega-backdrop]');
  const desktop = window.matchMedia('(min-width: 1024px)');
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const toggles = [...header.querySelectorAll<HTMLButtonElement>('[data-mega-toggle]')];
  if (!toggles.length) return;

  let openId: string | null = null;
  let openedBy: 'hover' | 'click' = 'click';
  let openTimer = 0;
  let closeTimer = 0;

  const panel = (id: string) => header.querySelector<HTMLElement>(`[data-mega-panel="${id}"]`);
  const toggle = (id: string) => header.querySelector<HTMLButtonElement>(`[data-mega-toggle="${id}"]`);
  const item = (id: string) => header.querySelector<HTMLElement>(`[data-nav-item="${id}"]`);

  // The intended state is recorded on the element so that a late animation frame or timer can never
  // re-open a panel that was dismissed in the meantime (e.g. a quick click-then-click-away on a slow device).
  const reveal = (el: HTMLElement) => {
    el.dataset.want = 'open';
    el.hidden = false;
    // Two frames so the transition starts from the closed state after `display` changes.
    requestAnimationFrame(() =>
      requestAnimationFrame(() => {
        if (el.dataset.want === 'open') el.classList.add('is-open');
      }),
    );
  };
  const conceal = (el: HTMLElement, immediate = false) => {
    el.dataset.want = 'closed';
    el.classList.remove('is-open');
    const finish = () => {
      if (el.dataset.want === 'closed') el.hidden = true;
    };
    if (immediate || reducedMotion.matches) finish();
    else window.setTimeout(finish, TRANSITION_MS);
  };

  const setState = (id: string, expanded: boolean) => {
    toggle(id)?.setAttribute('aria-expanded', String(expanded));
    item(id)?.classList.toggle('is-open', expanded);
  };

  function open(id: string, focusFirstLink = false, via: 'hover' | 'click' = 'click'): void {
    window.clearTimeout(closeTimer);
    window.clearTimeout(openTimer);
    if (via === 'click') openedBy = 'click';
    if (openId === id) {
      if (focusFirstLink) panel(id)?.querySelector<HTMLAnchorElement>('a')?.focus();
      return;
    }
    const next = panel(id);
    if (!next) return;
    if (openId) {
      const previous = panel(openId);
      if (previous) conceal(previous, true);
      setState(openId, false);
    }
    openedBy = via;
    reveal(next);
    setState(id, true);
    if (backdrop) reveal(backdrop);
    openId = id;
    if (focusFirstLink) requestAnimationFrame(() => next.querySelector<HTMLAnchorElement>('a')?.focus());
  }

  function close(returnFocus = false): void {
    window.clearTimeout(openTimer);
    window.clearTimeout(closeTimer);
    if (!openId) return;
    const id = openId;
    openId = null;
    const current = panel(id);
    if (current) conceal(current);
    if (backdrop) conceal(backdrop);
    setState(id, false);
    if (returnFocus) toggle(id)?.focus();
  }

  const scheduleClose = () => {
    window.clearTimeout(closeTimer);
    if (openedBy !== 'hover') return; // pinned by a click: stays open until dismissed
    closeTimer = window.setTimeout(() => close(), CLOSE_DELAY);
  };

  for (const btn of toggles) {
    const id = btn.dataset.megaToggle!;
    btn.hidden = false;
    btn.addEventListener('click', () => {
      if (openId === id && openedBy === 'click') close();
      else open(id); // opens, or pins a menu that hover already opened
    });
    btn.addEventListener('keydown', (event) => {
      if (event.key === 'ArrowDown') {
        event.preventDefault();
        open(id, true);
      }
    });
  }

  for (const li of header.querySelectorAll<HTMLElement>('[data-nav-item]')) {
    const id = li.dataset.navItem;
    li.addEventListener('pointerenter', (event) => {
      if (event.pointerType !== 'mouse' || !desktop.matches) return;
      window.clearTimeout(closeTimer);
      window.clearTimeout(openTimer);
      if (!id) return;
      if (openId && openedBy === 'click' && openId !== id) return; // don't hijack a pinned menu
      openTimer = window.setTimeout(() => open(id, false, 'hover'), openId ? SWITCH_DELAY : OPEN_DELAY);
    });
    li.addEventListener('pointerleave', (event) => {
      if (event.pointerType !== 'mouse') return;
      window.clearTimeout(openTimer);
      if (openId) scheduleClose();
    });
  }

  for (const p of header.querySelectorAll<HTMLElement>('[data-mega-panel]')) {
    p.addEventListener('pointerenter', (event) => {
      if (event.pointerType === 'mouse') window.clearTimeout(closeTimer);
    });
    p.addEventListener('pointerleave', (event) => {
      if (event.pointerType === 'mouse') scheduleClose();
    });
    p.addEventListener('keydown', (event) => {
      if (!['ArrowDown', 'ArrowUp'].includes(event.key)) return;
      const links = [...p.querySelectorAll<HTMLAnchorElement>('a')];
      const index = links.indexOf(document.activeElement as HTMLAnchorElement);
      if (index === -1) return;
      event.preventDefault();
      const nextIndex =
        event.key === 'ArrowDown' ? Math.min(index + 1, links.length - 1) : Math.max(index - 1, 0);
      links[nextIndex]?.focus();
    });
  }

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && openId) {
      const focusInside = header.contains(document.activeElement);
      close(focusInside);
    }
  });
  document.addEventListener('pointerdown', (event) => {
    if (openId && !header.contains(event.target as Node)) close();
  });
  header.addEventListener('focusout', (event) => {
    const next = event.relatedTarget as Node | null;
    if (openId && next && !header.contains(next)) close();
  });
  desktop.addEventListener('change', () => close());
}
