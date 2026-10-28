// Site search backed by a static index generated at build time (/search-index.json).
// No third-party service; the index is fetched on first open only.

export interface SearchEntry {
  t: string; // title
  u: string; // url
  k: 'Page' | 'Service' | 'Sector' | 'Project' | 'Insight';
  d: string; // description
  x?: string; // extra keywords
}

const KIND_WEIGHT: Record<SearchEntry['k'], number> = {
  Service: 5,
  Sector: 5,
  Page: 4,
  Insight: 3,
  Project: 2,
};
const MAX_RESULTS = 12;

const normalise = (value: string) => value.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');

export function searchIndex(entries: SearchEntry[], query: string): SearchEntry[] {
  const terms = normalise(query)
    .split(/[^a-z0-9.+]+/)
    .filter((t) => t.length > 1 || /\d/.test(t));
  if (!terms.length) return [];
  const scored: { entry: SearchEntry; score: number }[] = [];
  for (const entry of entries) {
    const title = normalise(entry.t);
    const desc = normalise(entry.d);
    const extra = normalise(entry.x ?? '');
    let score = 0;
    let matchedAll = true;
    for (const term of terms) {
      let s = 0;
      if (title.includes(term)) s += title.startsWith(term) || title.includes(` ${term}`) ? 12 : 8;
      if (extra.includes(term)) s += 4;
      if (desc.includes(term)) s += 2;
      if (!s) {
        matchedAll = false;
        break;
      }
      score += s;
    }
    if (matchedAll) scored.push({ entry, score: score + KIND_WEIGHT[entry.k] });
  }
  return scored
    .sort((a, b) => b.score - a.score || a.entry.t.localeCompare(b.entry.t))
    .slice(0, MAX_RESULTS)
    .map((s) => s.entry);
}

function highlight(text: string, query: string): DocumentFragment {
  const fragment = document.createDocumentFragment();
  const terms = normalise(query)
    .split(/[^a-z0-9.+]+/)
    .filter((t) => t.length > 1);
  if (!terms.length) {
    fragment.append(text);
    return fragment;
  }
  const lower = normalise(text);
  const marks: [number, number][] = [];
  for (const term of terms) {
    let from = 0;
    let at: number;
    while ((at = lower.indexOf(term, from)) !== -1) {
      marks.push([at, at + term.length]);
      from = at + term.length;
    }
  }
  marks.sort((a, b) => a[0] - b[0]);
  let cursor = 0;
  for (const [start, end] of marks) {
    if (start < cursor) continue;
    fragment.append(text.slice(cursor, start));
    const mark = document.createElement('mark');
    mark.textContent = text.slice(start, end);
    fragment.append(mark);
    cursor = end;
  }
  fragment.append(text.slice(cursor));
  return fragment;
}

export function initSearch(): void {
  const dialog = document.querySelector<HTMLDialogElement>('[data-search-dialog]');
  const openers = [...document.querySelectorAll<HTMLButtonElement>('[data-search-open]')];
  if (!dialog || typeof dialog.showModal !== 'function' || !openers.length) return;

  const form = dialog.querySelector<HTMLFormElement>('[data-search-form]')!;
  const input = dialog.querySelector<HTMLInputElement>('[data-search-input]')!;
  const results = dialog.querySelector<HTMLUListElement>('[data-search-results]')!;
  const status = dialog.querySelector<HTMLElement>('[data-search-status]')!;
  const suggest = dialog.querySelector<HTMLElement>('[data-search-suggest]')!;

  let index: SearchEntry[] | null = null;
  let loading: Promise<SearchEntry[]> | null = null;
  let renderTimer = 0;

  const load = () =>
    (loading ??= fetch('/search-index.json', { headers: { accept: 'application/json' } })
      .then((r) => {
        if (!r.ok) throw new Error(`Search index ${r.status}`);
        return r.json() as Promise<SearchEntry[]>;
      })
      .then((data) => (index = data)));

  const open = () => {
    if (dialog.open) return;
    dialog.showModal();
    document.documentElement.classList.add('is-scroll-locked');
    input.focus();
    input.select();
    load()
      .then(() => render())
      .catch(() => {
        loading = null;
        status.textContent = 'Search is unavailable right now. Please use the menu to browse the site.';
      });
  };

  for (const button of openers) {
    button.hidden = false;
    button.addEventListener('click', open);
  }
  document.addEventListener('keydown', (event) => {
    const target = event.target as HTMLElement;
    const typing = target.closest('input, textarea, select, [contenteditable="true"]');
    if (event.key === '/' && !typing && !dialog.open && !event.metaKey && !event.ctrlKey) {
      event.preventDefault();
      open();
    }
  });

  dialog.addEventListener('close', () => document.documentElement.classList.remove('is-scroll-locked'));
  dialog.querySelector('[data-search-close]')?.addEventListener('click', () => dialog.close());
  dialog.addEventListener('click', (event) => {
    if (event.target === dialog) dialog.close();
  });

  function render(): void {
    const query = input.value.trim();
    results.replaceChildren();
    suggest.hidden = query.length > 0;
    if (!query) {
      status.textContent = '';
      return;
    }
    if (!index) {
      status.textContent = 'Loading search…';
      return;
    }
    const found = searchIndex(index, query);
    status.textContent = found.length
      ? `${found.length}${found.length === MAX_RESULTS ? '+' : ''} result${found.length === 1 ? '' : 's'} for “${query}”`
      : `No results for “${query}”. Try a service, sector, client or place name.`;
    for (const entry of found) {
      const li = document.createElement('li');
      const a = document.createElement('a');
      a.href = entry.u;
      const title = document.createElement('span');
      title.className = 'sr-title';
      title.append(highlight(entry.t, query));
      const kind = document.createElement('span');
      kind.className = 'sr-kind';
      kind.textContent = entry.k;
      const desc = document.createElement('span');
      desc.className = 'sr-desc';
      desc.textContent = entry.d;
      a.append(title, kind, desc);
      li.append(a);
      results.append(li);
    }
  }

  input.addEventListener('input', () => {
    window.clearTimeout(renderTimer);
    renderTimer = window.setTimeout(render, 80);
  });
  form.addEventListener('submit', (event) => {
    event.preventDefault();
    results.querySelector('a')?.click();
  });
  input.addEventListener('keydown', (event) => {
    if (event.key === 'ArrowDown') {
      event.preventDefault();
      results.querySelector<HTMLAnchorElement>('a')?.focus();
    }
  });
  results.addEventListener('keydown', (event) => {
    if (!['ArrowDown', 'ArrowUp'].includes(event.key)) return;
    const links = [...results.querySelectorAll<HTMLAnchorElement>('a')];
    const index = links.indexOf(document.activeElement as HTMLAnchorElement);
    event.preventDefault();
    if (event.key === 'ArrowUp' && index <= 0) input.focus();
    else links[event.key === 'ArrowDown' ? Math.min(index + 1, links.length - 1) : index - 1]?.focus();
  });
  for (const chip of suggest.querySelectorAll<HTMLButtonElement>('[data-search-suggestion]')) {
    chip.addEventListener('click', () => {
      input.value = chip.dataset.searchSuggestion ?? '';
      input.focus();
      render();
    });
  }
}
