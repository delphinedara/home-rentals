import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SavedHomesService {
  private readonly storageKey = 'home-rentals-saved-v1';

  savedIds$ = new BehaviorSubject<number[]>(this.readSavedIds());

  private readSavedIds(): number[] {
    try {
      const stored = localStorage.getItem(this.storageKey);
      const parsed = stored ? JSON.parse(stored) : [];

      if (!Array.isArray(parsed)) {
        return [];
      }

      return parsed.filter((id, index) =>
        Number.isInteger(id) &&
        id > 0 &&
        parsed.indexOf(id) === index
      );
    } catch {
      return [];
    }
  }

  isSaved(id: number): boolean {
    return this.savedIds$.value.includes(id);
  }

  toggle(id: number): void {
    const current = this.savedIds$.value;

    const updated = current.includes(id)
      ? current.filter(savedId => savedId !== id)
      : [...current, id];

    this.savedIds$.next(updated);

    try {
      localStorage.setItem(this.storageKey, JSON.stringify(updated));
    } catch {
      // The shortlist still works in memory if storage is unavailable.
    }
  }

  clear(): void {
    this.savedIds$.next([]);

    try {
      localStorage.removeItem(this.storageKey);
    } catch {
      // Ignore unavailable storage.
    }
  }
}
