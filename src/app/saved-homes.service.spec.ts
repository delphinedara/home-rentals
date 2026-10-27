import { SavedHomesService } from './saved-homes.service';

describe('SavedHomesService', () => {
  const storageKey = 'home-rentals-saved-v1';
  let service: SavedHomesService;

  beforeEach(() => {
    localStorage.clear();
    service = new SavedHomesService();
  });

  afterEach(() => {
    localStorage.clear();
  });

  it('starts with an empty shortlist', () => {
    expect(service.savedIds$.value).toEqual([]);
  });

  it('saves a property and persists its ID', () => {
    service.toggle(1);

    expect(service.isSaved(1)).toBe(true);
    expect(JSON.parse(localStorage.getItem(storageKey))).toEqual([1]);
  });

  it('removes an already saved property', () => {
    service.toggle(1);
    service.toggle(1);

    expect(service.isSaved(1)).toBe(false);
    expect(service.savedIds$.value).toEqual([]);
  });

  it('supports multiple saved properties', () => {
    service.toggle(1);
    service.toggle(2);

    expect(service.savedIds$.value).toEqual([1, 2]);
  });

  it('restores saved properties from localStorage', () => {
    localStorage.setItem(storageKey, '[2,5]');

    const restored = new SavedHomesService();

    expect(restored.savedIds$.value).toEqual([2, 5]);
  });

  it('removes duplicate and invalid stored IDs', () => {
    localStorage.setItem(storageKey, '[1,1,-2,0,3,"4",null,2.5]');

    const restored = new SavedHomesService();

    expect(restored.savedIds$.value).toEqual([1, 3]);
  });

  it('handles malformed JSON safely', () => {
    localStorage.setItem(storageKey, '{invalid-json');

    const restored = new SavedHomesService();

    expect(restored.savedIds$.value).toEqual([]);
  });

  it('handles non-array stored values safely', () => {
    localStorage.setItem(storageKey, '{"id":1}');

    const restored = new SavedHomesService();

    expect(restored.savedIds$.value).toEqual([]);
  });

  it('clears saved properties and storage', () => {
    service.toggle(1);
    service.toggle(2);
    service.clear();

    expect(service.savedIds$.value).toEqual([]);
    expect(localStorage.getItem(storageKey)).toBeNull();
  });

  it('continues working in memory when storage writes fail', () => {
    spyOn(localStorage, 'setItem').and.throwError('Storage unavailable');

    service.toggle(1);

    expect(service.isSaved(1)).toBe(true);
  });

  it('continues clearing in memory when storage removal fails', () => {
    service.toggle(1);
    spyOn(localStorage, 'removeItem').and.throwError('Storage unavailable');

    service.clear();

    expect(service.savedIds$.value).toEqual([]);
  });
});
