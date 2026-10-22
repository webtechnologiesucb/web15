// src/app/store/favorites-store.ts
// Estado global de favoritos (lección 06).
//
// Es el equivalente Angular del store de Zustand de web14: un servicio
// singleton con signals privados, acciones públicas y persistencia.
import { Injectable, computed, effect, signal } from '@angular/core';

import { isStringArray, readStoredJson, writeStoredJson } from '../core/storage/stored-json';

export const FAVORITES_STORAGE_KEY = 'web15-favorites';

@Injectable({ providedIn: 'root' })
export class FavoritesStore {
  /** Estado privado: sólo este servicio puede escribir en él. */
  private readonly urls = signal<string[]>(
    readStoredJson<string[]>(FAVORITES_STORAGE_KEY, [], isStringArray),
  );

  /** Estado público de sólo lectura. */
  readonly items = this.urls.asReadonly();
  readonly count = computed(() => this.urls().length);

  constructor() {
    // Persistimos cada cambio: el effect se suscribe a `urls`.
    effect(() => writeStoredJson(FAVORITES_STORAGE_KEY, this.urls()));
  }

  isFavorite(url: string): boolean {
    return this.urls().includes(url);
  }

  toggle(url: string): void {
    this.urls.update((urls) => (urls.includes(url) ? urls.filter((item) => item !== url) : [...urls, url]));
  }

  remove(url: string): void {
    this.urls.update((urls) => urls.filter((item) => item !== url));
  }

  clear(): void {
    this.urls.set([]);
  }
}
