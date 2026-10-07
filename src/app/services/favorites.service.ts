import { Injectable, computed, effect, signal } from '@angular/core';
import { Photo } from '../models/photo';

const KEY = 'museu-desejadas';

@Injectable({ providedIn: 'root' })
export class FavoritesService {
  private readonly _items = signal<Photo[]>(this.load());

  readonly items = this._items.asReadonly();
  readonly count = computed(() => this._items().length);
  private readonly ids = computed(() => new Set(this._items().map((p) => p.id)));

  constructor() {
    effect(() => {
      try { localStorage.setItem(KEY, JSON.stringify(this._items())); } catch { /* storage indisponível */ }
    });
  }

  has(id: number): boolean {
    return this.ids().has(id);
  }

  toggle(photo: Photo): void {
    this._items.update((list) =>
      list.some((p) => p.id === photo.id) ? list.filter((p) => p.id !== photo.id) : [...list, photo],
    );
  }

  private load(): Photo[] {
    try { return JSON.parse(localStorage.getItem(KEY) ?? '[]'); } catch { return []; }
  }
}
