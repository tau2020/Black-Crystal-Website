// Client-side filtering of the documented project list, synchronised with the URL query string
// (?sector=&category=&period=&service=&q=). Unfiltered, the list is revealed in pages of PAGE_SIZE so the
// mobile page stays a manageable length. Without JavaScript every project remains listed.

const PAGE_SIZE = 24;

type FilterKey = 'sector' | 'category' | 'period' | 'service' | 'q';
const KEYS: FilterKey[] = ['q', 'sector', 'category', 'period', 'service'];
const LABELS: Record<FilterKey, string> = {
  q: 'Keyword',
  sector: 'Sector',
  category: 'Service category',
  period: 'Period',
  service: 'Service',
};

export function initProjectFilters(): void {
  const form = document.querySelector<HTMLFormElement>('[data-project-filters]');
  const list = document.querySelector<HTMLElement>('[data-project-list]');
  const count = document.querySelector<HTMLElement>('[data-filter-count]');
  const empty = document.querySelector<HTMLElement>('[data-filter-empty]');
  const chips = form?.querySelector<HTMLElement>('[data-filter-chips]');
  const more = document.querySelector<HTMLElement>('[data-show-more]');
  const moreButton = more?.querySelector<HTMLButtonElement>('button');
  if (!form || !list || !count || !empty || !chips || !more || !moreButton) return;

  const countEl: HTMLElement = count;
  const emptyEl: HTMLElement = empty;
  const cards = [...list.querySelectorAll<HTMLElement>('[data-project]')];
  const serviceLabels: Record<string, string> = JSON.parse(form.dataset.serviceLabels ?? '{}');
  const field = (key: FilterKey) =>
    form.elements.namedItem(key) as HTMLInputElement | HTMLSelectElement | null;
  let searchTimer = 0;
  let chipSignature = '';
  let limit = PAGE_SIZE;
  let lastSignature: string | null = null;

  const read = (): Record<FilterKey, string> =>
    Object.fromEntries(KEYS.map((k) => [k, (field(k)?.value ?? '').trim()])) as Record<FilterKey, string>;

  const optionLabel = (key: FilterKey, value: string) => {
    if (key === 'service') return serviceLabels[value] ?? value;
    if (key === 'q') return `“${value}”`;
    const select = field(key);
    if (select instanceof HTMLSelectElement)
      return [...select.options].find((o) => o.value === value)?.text ?? value;
    return value;
  };

  function apply(updateUrl = true): void {
    const f = read();
    const terms = f.q.toLowerCase().split(/\s+/).filter(Boolean);
    const active = KEYS.filter((k) => f[k]);
    const signature = active.map((k) => `${k}=${f[k]}`).join('&');
    if (signature !== lastSignature) limit = PAGE_SIZE; // a new filter set starts from the first page
    lastSignature = signature;

    const matches = cards.filter((card) => {
      const d = card.dataset;
      return (
        (!f.sector || (d.sectors ?? '').split(' ').includes(f.sector)) &&
        (!f.category || (d.categories ?? '').split(' ').includes(f.category)) &&
        (!f.period || d.period === f.period) &&
        (!f.service || (d.services ?? '').split(' ').includes(f.service)) &&
        terms.every((t) => (d.search ?? '').includes(t))
      );
    });
    // Filtered results are short enough to show in full; the unfiltered list is paged.
    const visibleCount = active.length ? matches.length : Math.min(limit, matches.length);
    const visible = new Set(matches.slice(0, visibleCount));
    for (const card of cards) card.hidden = !visible.has(card);

    countEl.textContent =
      visibleCount === cards.length
        ? `Showing all ${cards.length} projects`
        : `Showing ${visibleCount} of ${cards.length} projects`;
    emptyEl.hidden = matches.length > 0;
    const remaining = matches.length - visibleCount;
    more!.hidden = remaining <= 0;
    moreButton!.textContent = `Show ${Math.min(PAGE_SIZE, remaining)} more projects`;

    // Only rebuild the chips when they change: replacing them mid-click (e.g. when the keyword box blurs)
    // would swallow the click on the chip under the pointer.
    if (signature !== chipSignature) {
      chipSignature = signature;
      chips!.replaceChildren(
        ...active.map((key) => {
          const button = document.createElement('button');
          button.type = 'button';
          button.dataset.clear = key;
          button.textContent = `${LABELS[key]}: ${optionLabel(key, f[key])}`;
          const x = document.createElement('span');
          x.setAttribute('aria-hidden', 'true');
          x.textContent = '×';
          button.append(x);
          button.setAttribute('aria-label', `Remove filter ${LABELS[key]}: ${optionLabel(key, f[key])}`);
          return button;
        }),
      );
    }

    if (updateUrl) {
      const params = new URLSearchParams();
      for (const k of active) params.set(k, f[k]);
      const query = params.toString();
      history.replaceState(null, '', `${location.pathname}${query ? `?${query}` : ''}${location.hash}`);
    }
  }

  // Initialise from the URL.
  const params = new URLSearchParams(location.search);
  for (const k of KEYS) {
    const value = params.get(k);
    const control = field(k);
    if (value && control) {
      if (control instanceof HTMLSelectElement && ![...control.options].some((o) => o.value === value))
        continue;
      if (k === 'service' && !serviceLabels[value]) continue;
      control.value = value;
    }
  }

  form.hidden = false;
  form.addEventListener('submit', (event) => {
    event.preventDefault();
    apply();
  });
  form.addEventListener('change', (event) => {
    // The keyword box is handled by its debounced input listener.
    if (event.target !== field('q')) apply();
  });
  field('q')?.addEventListener('input', () => {
    window.clearTimeout(searchTimer);
    searchTimer = window.setTimeout(() => apply(), 160);
  });
  form.addEventListener('reset', () =>
    window.setTimeout(() => {
      const service = field('service');
      if (service) service.value = '';
      apply();
    }),
  );
  chips.addEventListener('click', (event) => {
    const button = (event.target as HTMLElement).closest<HTMLButtonElement>('[data-clear]');
    if (!button) return;
    const control = field(button.dataset.clear as FilterKey);
    if (control) control.value = '';
    apply();
  });
  moreButton.addEventListener('click', () => {
    const firstNew = cards.filter((c) => c.hidden)[0];
    limit += PAGE_SIZE;
    apply(false);
    // Move keyboard focus to the first newly revealed project.
    firstNew?.querySelector<HTMLAnchorElement>('a')?.focus();
  });

  apply(false);
}
