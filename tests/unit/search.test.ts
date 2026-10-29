import { describe, expect, it } from 'vitest';
import { searchIndex, type SearchEntry } from '../../src/scripts/search';

const entries: SearchEntry[] = [
  { t: 'Environmental & Social Impact Assessment', u: '/services/esia/', k: 'Service', d: 'ESIA', x: 'ESIA' },
  {
    t: 'Platinum mining ESIA to IFC standards — Karo Platinum',
    u: '/projects/karo/',
    k: 'Project',
    d: 'Chegutu',
  },
  { t: 'Mining', u: '/sectors/mining/', k: 'Sector', d: 'Platinum, gold, chrome' },
];

describe('searchIndex', () => {
  it('requires every term to match and ranks title matches first', () => {
    expect(searchIndex(entries, 'karo platinum').map((e) => e.u)).toEqual(['/projects/karo/']);
    expect(searchIndex(entries, 'mining')[0]?.u).toBe('/sectors/mining/');
  });
  it('is accent- and case-insensitive and ignores empty queries', () => {
    expect(searchIndex(entries, 'ÉSIA').length).toBeGreaterThan(0);
    expect(searchIndex(entries, '   ')).toEqual([]);
  });
});
