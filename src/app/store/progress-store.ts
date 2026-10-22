// src/app/store/progress-store.ts
// Progreso de la ruta de aprendizaje (lección 06).
//
// Mismo patrón que FavoritesStore: signals + acciones + persistencia, pero aquí
// el estado derivado (porcentaje, lección pendiente) se calcula con computed().
import { Injectable, computed, effect, signal } from '@angular/core';

import { isStringArray, readStoredJson, writeStoredJson } from '../core/storage/stored-json';
import { lessons } from '../data/lessons';

export const PROGRESS_STORAGE_KEY = 'web15-completed-lessons';

@Injectable({ providedIn: 'root' })
export class ProgressStore {
  private readonly ids = signal<string[]>(
    readStoredJson<string[]>(PROGRESS_STORAGE_KEY, [], isStringArray),
  );

  readonly completed = this.ids.asReadonly();
  readonly total = lessons.length;

  readonly done = computed(() => this.ids().length);
  readonly percent = computed(() =>
    this.total === 0 ? 0 : Math.round((this.done() / this.total) * 100),
  );
  readonly nextPending = computed(() => lessons.find((lesson) => !this.ids().includes(lesson.id)) ?? null);

  constructor() {
    effect(() => writeStoredJson(PROGRESS_STORAGE_KEY, this.ids()));
  }

  isCompleted(id: string): boolean {
    return this.ids().includes(id);
  }

  toggle(id: string): void {
    this.ids.update((ids) => (ids.includes(id) ? ids.filter((item) => item !== id) : [...ids, id]));
  }

  reset(): void {
    this.ids.set([]);
  }
}
