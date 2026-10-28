// Client-side filtering of the documented project list, synchronised with the URL query string
// (?sector=&category=&period=&service=&q=). Without JavaScript every project remains listed.

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
  if (!form || !list || !count || !empty || !chips) return;

  const countEl: HTMLElement = count;
  const emptyEl: HTMLElement = empty;
  const cards = [...list.querySelectorAll<HTMLElement>('[data-project]')];
  const serviceLabels: Record<string, string> = JSON.parse(form.dataset.serviceLabels ?? '{}');
  const field = (key: FilterKey) =>
    form.elements.namedItem(key) as HTMLInputElement | HTMLSelectElement | null;
  let searchTimer = 0;
  let chipSignature = '';

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
    let shown = 0;
    for (const card of cards) {
      const d = card.dataset;
      const visible =
        (!f.sector || (d.sectors ?? '').split(' ').includes(f.sector)) &&
        (!f.category || (d.categories ?? '').split(' ').includes(f.category)) &&
        (!f.period || d.period === f.period) &&
        (!f.service || (d.services ?? '').split(' ').includes(f.service)) &&
        terms.every((t) => (d.search ?? '').includes(t));
      card.hidden = !visible;
      if (visible) shown++;
    }
    const active = KEYS.filter((k) => f[k]);
    countEl.textContent = active.length
      ? `Showing ${shown} of ${cards.length} projects`
      : `Showing all ${cards.length} projects`;
    emptyEl.hidden = shown > 0;

    // Only rebuild the chips when they change: replacing them mid-click (e.g. when the keyword box blurs)
    // would swallow the click on the chip under the pointer.
    const signature = active.map((k) => `${k}=${f[k]}`).join('&');
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
    count.focus?.();
  });

  apply(false);
}
