// Single outline icon family: 24×24, round caps/joins, currentColor.
// Pack icons (07-ui) are reproduced verbatim; the remainder are drawn to the same style.
export const icons: Record<string, string> = {
  // From the Black Crystal asset pack (07-ui)
  leaf: '<path d="M21 3c-9 0-17 4-17 13 0 4 3 6 7 6 9 0 10-10 10-19Z"/><path d="M3 21c5-7 9-10 15-13"/>',
  users:
    '<circle cx="8" cy="8" r="3"/><circle cx="17" cy="9" r="2.5"/><path d="M2 21v-3a6 6 0 0 1 12 0v3M15 15a5 5 0 0 1 7 4v2"/>',
  book: '<path d="M12 5C8 2 4 3 2 4v16c4-2 7-2 10 0 3-2 6-2 10 0V4c-3-2-7-2-10 1Z"/><path d="M12 5v15"/>',
  cog: '<circle cx="12" cy="12" r="3.5"/><path d="M10 2h4l1 3 3 1 3-1 2 4-2 2v2l2 2-2 4-3-1-3 1-1 3h-4l-1-3-3-1-3 1-2-4 2-2v-2L1 9l2-4 3 1 3-1Z"/>',
  mountain: '<path d="M2 21 10 4l5 10 2-4 5 11H2Z"/><path d="m7 12 3 2 2-2"/>',
  wind: '<path d="M2 8h12c5 0 5-6 1-6-2 0-3 1-3 3M2 13h17c4 0 4 6 0 6-2 0-3-1-3-3M2 18h7c4 0 4 5 1 5"/>',
  road: '<path d="M9 2 4 22M15 2l5 20M12 4v3m0 4v3m0 4v3"/>',
  house: '<path d="m2 11 10-8 10 8v10H2V11Z"/><path d="M9 21v-7h6v7"/>',
  water: '<path d="M12 2C10 7 5 11 5 16a7 7 0 0 0 14 0c0-5-5-9-7-14Z"/>',
  shield: '<path d="M12 2 21 6v7c0 5-3 8-9 10C6 21 3 18 3 13V6l9-4Z"/><path d="m8 12 3 3 5-6"/>',
  map: '<path d="m2 5 6-3 8 3 6-3v17l-6 3-8-3-6 3V5Z"/><path d="M8 2v17m8-14v17"/>',
  recycle:
    '<path d="m7 2 3 5H5l2-5Z M17 9l5 3-4 4-1-7ZM5 17l2 5 4-3-6-2Z"/><path d="M10 5h5l3 4M18 15l-3 5H8M5 17l-2-5 3-5"/>',
  // Drawn to match
  calendar: '<rect x="3" y="4.5" width="18" height="16.5" rx="2"/><path d="M3 9.5h18M8 2.5v4M16 2.5v4"/>',
  layers:
    '<path d="M12 2.5 21.5 7.5 12 12.5 2.5 7.5Z"/><path d="m2.5 12 9.5 5 9.5-5"/><path d="m2.5 16.5 9.5 5 9.5-5"/>',
  search: '<circle cx="10.5" cy="10.5" r="6.5"/><path d="m15.5 15.5 6 6"/>',
  menu: '<path d="M3 6h18M3 12h18M3 18h18"/>',
  close: '<path d="M5 5l14 14M19 5 5 19"/>',
  'chevron-down': '<path d="m6 9 6 6 6-6"/>',
  'chevron-right': '<path d="m9 6 6 6-6 6"/>',
  'chevron-left': '<path d="m15 6-6 6 6 6"/>',
  'arrow-right': '<path d="M4 12h15M13 6l6 6-6 6"/>',
  'arrow-left': '<path d="M20 12H5M11 6l-6 6 6 6"/>',
  'arrow-down': '<path d="M12 4v15M6 13l6 6 6-6"/>',
  'arrow-up': '<path d="M12 20V5M6 11l6-6 6 6"/>',
  'arrow-up-right': '<path d="M7 17 17 7M8 7h9v9"/>',
  play: '<path d="M7.5 4.5v15l12-7.5-12-7.5Z"/>',
  pause: '<path d="M8.5 5v14M15.5 5v14"/>',
  mail: '<rect x="2.5" y="4.5" width="19" height="15" rx="2"/><path d="m3 6.5 9 6.5 9-6.5"/>',
  phone:
    '<path d="M5 3h3.5l1.5 5-2.5 1.5a12 12 0 0 0 7 7L16 14l5 1.5V19a2 2 0 0 1-2 2A17 17 0 0 1 3 5a2 2 0 0 1 2-2Z"/>',
  'map-pin':
    '<path d="M12 21.5s7-6.2 7-12a7 7 0 0 0-14 0c0 5.8 7 12 7 12Z"/><circle cx="12" cy="9.5" r="2.5"/>',
  'check-circle': '<circle cx="12" cy="12" r="9.5"/><path d="m7.5 12.5 3 3 6-6.5"/>',
  check: '<path d="m5 12.5 4.5 4.5L19 7"/>',
  filter: '<path d="M3 5h18l-7 8.5V20l-4-2v-4.5L3 5Z"/>',
  award: '<circle cx="12" cy="9" r="6"/><path d="m8.5 13.8-1.5 7.7 5-2.6 5 2.6-1.5-7.7"/>',
  compass: '<circle cx="12" cy="12" r="9.5"/><path d="m15.5 8.5-2 5-5 2 2-5 5-2Z"/>',
  heart: '<path d="M12 20.5s-8.5-5-8.5-11A4.5 4.5 0 0 1 12 6.5a4.5 4.5 0 0 1 8.5 3c0 6-8.5 11-8.5 11Z"/>',
  'heart-pulse':
    '<path d="M12 20.5s-8.5-5-8.5-11A4.5 4.5 0 0 1 12 6.5a4.5 4.5 0 0 1 8.5 3c0 6-8.5 11-8.5 11Z"/><path d="M5.5 12h3l1.5-2.5 2.5 5 1.5-2.5h4.5"/>',
  zap: '<path d="M13 2 4 14h7l-1 8 9-12h-7l1-8Z"/>',
  sprout:
    '<path d="M12 21v-9"/><path d="M12 12c0-4-3-6.5-7.5-6.5 0 4.5 3 6.5 7.5 6.5Z"/><path d="M12 10.5c0-3.5 2.5-6 7-6 0 4-2.5 6-7 6Z"/>',
  'badge-check':
    '<path d="m12 2.5 2.4 1.8 3-.2.9 2.9 2.4 1.8-1 2.8 1 2.8-2.4 1.8-.9 2.9-3-.2-2.4 1.8-2.4-1.8-3 .2-.9-2.9-2.4-1.8 1-2.8-1-2.8 2.4-1.8.9-2.9 3 .2Z"/><path d="m8.5 12 2.5 2.5 4.5-5"/>',
  clock: '<circle cx="12" cy="12" r="9.5"/><path d="M12 7v5l3.5 2"/>',
  'clipboard-check':
    '<rect x="5" y="4" width="14" height="17.5" rx="2"/><path d="M9 2.5h6v3H9z"/><path d="m9 13 2 2 4-4.5"/>',
  'clipboard-list':
    '<rect x="5" y="4" width="14" height="17.5" rx="2"/><path d="M9 2.5h6v3H9z"/><path d="M9 11h6M9 15h6"/>',
  scale:
    '<path d="M12 3v18M7.5 21h9M4 7h16"/><path d="M4 7 1.5 13a2.6 2.6 0 0 0 5 0Z"/><path d="m20 7-2.5 6a2.6 2.6 0 0 0 5 0Z"/>',
  landmark:
    '<path d="M3 21h18M5 21V10.5M9.7 21V10.5M14.3 21V10.5M19 21V10.5"/><path d="M2.5 10.5 12 3.5l9.5 7Z"/>',
  'file-search':
    '<path d="M14 2.5H6.5a2 2 0 0 0-2 2v15a2 2 0 0 0 2 2H17a2 2 0 0 0 2-2v-12l-5-5Z"/><path d="M14 2.5v5h5"/><circle cx="11" cy="14" r="2.5"/><path d="m13 16 2 2"/>',
  binoculars:
    '<circle cx="6.5" cy="16" r="4"/><circle cx="17.5" cy="16" r="4"/><path d="M10.5 16h3M3.5 13.5 6 5h3l1 8.5M20.5 13.5 18 5h-3l-1 8.5"/>',
  globe: '<circle cx="12" cy="12" r="9.5"/><path d="M2.5 12h19M12 2.5c3 3 3 16 0 19M12 2.5c-3 3-3 16 0 19"/>',
  'external-link':
    '<path d="M14 3.5h6.5V10M20.5 3.5 11 13"/><path d="M18 13.5V19a1.5 1.5 0 0 1-1.5 1.5H5A1.5 1.5 0 0 1 3.5 19V7.5A1.5 1.5 0 0 1 5 6h5.5"/>',
  info: '<circle cx="12" cy="12" r="9.5"/><path d="M12 11v5.5M12 7.5v.5"/>',
  alert: '<path d="M12 3 2 20.5h20L12 3Z"/><path d="M12 10v4.5M12 17.5v.5"/>',
  building:
    '<rect x="4" y="2.5" width="16" height="19" rx="1"/><path d="M9 21.5v-4h6v4M8 6.5h2M14 6.5h2M8 10.5h2M14 10.5h2M8 14.5h2M14 14.5h2"/>',
};

/** SVG markup for client-side rendering (decorative). */
export function iconSvg(name: string, size = 20): string {
  const inner = icons[name];
  if (!inner) throw new Error(`Unknown icon "${name}"`);
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.65" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">${inner}</svg>`;
}
