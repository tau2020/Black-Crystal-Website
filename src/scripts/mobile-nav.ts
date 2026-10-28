// Mobile drawer built on a modal <dialog>: native focus containment, inert background and Escape to close.
// Without JavaScript the menu trigger is a plain link to the footer navigation.

const PANEL_MS = 300;

export function initMobileNav(): void {
  const dialog = document.querySelector<HTMLDialogElement>('[data-mobile-nav]');
  const triggers = [...document.querySelectorAll<HTMLAnchorElement>('[data-mobile-open]')];
  if (!dialog || typeof dialog.showModal !== 'function' || !triggers.length) return;

  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const root = dialog.querySelector<HTMLElement>('[data-mnav-panel="root"]')!;
  const closeButton = dialog.querySelector<HTMLButtonElement>('[data-mobile-close]')!;
  let activePanel: HTMLElement | null = null;
  let activeTrigger: HTMLButtonElement | null = null;

  for (const trigger of triggers) {
    trigger.setAttribute('role', 'button');
    trigger.setAttribute('aria-haspopup', 'dialog');
    trigger.setAttribute('aria-controls', 'mobile-nav');
    trigger.setAttribute('aria-expanded', 'false');
    trigger.addEventListener('click', (event) => {
      event.preventDefault();
      openDrawer(trigger);
    });
    trigger.addEventListener('keydown', (event) => {
      if (event.key === ' ') {
        event.preventDefault();
        openDrawer(trigger);
      }
    });
  }

  function openDrawer(trigger: HTMLElement): void {
    resetPanels();
    dialog!.showModal();
    document.documentElement.classList.add('is-scroll-locked');
    trigger.setAttribute('aria-expanded', 'true');
    closeButton.focus();
  }

  dialog.addEventListener('close', () => {
    document.documentElement.classList.remove('is-scroll-locked');
    triggers.forEach((t) => t.setAttribute('aria-expanded', 'false'));
  });
  closeButton.addEventListener('click', () => dialog.close());
  dialog.addEventListener('click', (event) => {
    // Clicks on the ::backdrop are dispatched to the dialog element itself.
    if (event.target === dialog) {
      dialog.close();
      return;
    }
    const link = (event.target as Element).closest('a');
    if (link && link.hash && link.pathname === window.location.pathname) dialog.close();
  });

  for (const button of dialog.querySelectorAll<HTMLButtonElement>('[data-mnav-open]')) {
    button.addEventListener('click', () => openPanel(button));
  }
  for (const back of dialog.querySelectorAll<HTMLButtonElement>('[data-mnav-back]')) {
    back.addEventListener('click', () => backToRoot());
  }

  function openPanel(trigger: HTMLButtonElement): void {
    const panel = dialog!.querySelector<HTMLElement>(`[data-mnav-panel="${trigger.dataset.mnavOpen}"]`);
    if (!panel) return;
    panel.hidden = false;
    panel.scrollTop = 0;
    panel.classList.add('is-entering');
    requestAnimationFrame(() =>
      requestAnimationFrame(() => {
        if (activePanel !== panel) return; // went back before the animation started
        panel.classList.remove('is-entering');
        root.classList.add('is-behind');
      }),
    );
    root.inert = true;
    trigger.setAttribute('aria-expanded', 'true');
    activePanel = panel;
    activeTrigger = trigger;
    panel.querySelector<HTMLButtonElement>('[data-mnav-back]')?.focus();
  }

  function backToRoot(): void {
    if (!activePanel || !activeTrigger) return;
    const panel = activePanel;
    const trigger = activeTrigger;
    activePanel = null;
    activeTrigger = null;
    root.inert = false;
    root.classList.remove('is-behind');
    panel.classList.add('is-entering');
    trigger.setAttribute('aria-expanded', 'false');
    trigger.focus();
    window.setTimeout(
      () => {
        if (activePanel === panel) return; // re-opened in the meantime
        panel.hidden = true;
        panel.classList.remove('is-entering');
      },
      reducedMotion.matches ? 0 : PANEL_MS,
    );
  }

  function resetPanels(): void {
    for (const panel of dialog!.querySelectorAll<HTMLElement>(
      '[data-mnav-panel]:not([data-mnav-panel="root"])',
    )) {
      panel.hidden = true;
      panel.classList.remove('is-entering');
    }
    for (const button of dialog!.querySelectorAll('[data-mnav-open]'))
      button.setAttribute('aria-expanded', 'false');
    root.classList.remove('is-behind');
    root.inert = false;
    activePanel = null;
    activeTrigger = null;
  }

  window.matchMedia('(min-width: 1024px)').addEventListener('change', (event) => {
    if (event.matches && dialog.open) dialog.close();
  });
}
