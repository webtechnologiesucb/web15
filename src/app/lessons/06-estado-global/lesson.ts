// src/app/lessons/06-estado-global/lesson.ts
// Lección 06 · Estado global con servicios y signals
//
// Los tres stores de la aplicación (favoritos, progreso y tema) son servicios
// `providedIn: 'root'`. Cualquier componente que los inyecte ve el mismo estado;
// los signals privados y `asReadonly()` impiden escrituras desde fuera.
import { Component, computed, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';

import { requireLesson } from '../../data/lessons';
import { LessonShell } from '../../shared/lesson/lesson-shell';
import { BaseBadge } from '../../shared/ui/base-badge';
import { BaseButton } from '../../shared/ui/base-button';
import { BaseCard } from '../../shared/ui/base-card';
import { CodeBlock } from '../../shared/ui/code-block';
import { EmptyState } from '../../shared/ui/empty-state';
import { FAVORITES_STORAGE_KEY, FavoritesStore } from '../../store/favorites-store';
import { PROGRESS_STORAGE_KEY, ProgressStore } from '../../store/progress-store';
import { ThemeService } from '../../core/theme/theme-service';

interface Candidate {
  url: string;
  name: string;
  detail: string;
}

const CANDIDATES: Candidate[] = [
  { url: '/people/1/', name: 'Luke Skywalker', detail: 'Personaje · Tatooine' },
  { url: '/planets/3/', name: 'Yavin IV', detail: 'Planeta · base rebelde' },
  { url: '/films/1/', name: 'A New Hope', detail: 'Película · episodio IV' },
];

@Component({
  selector: 'app-lesson-06',
  imports: [LessonShell, RouterLink, BaseCard, BaseBadge, BaseButton, CodeBlock, EmptyState],
  templateUrl: './lesson.html',
  styles: ':host { display: contents; }',
})
export class Lesson06EstadoGlobal {
  protected readonly lesson = requireLesson('06-estado-global');

  private readonly favorites = inject(FavoritesStore);
  private readonly progress = inject(ProgressStore);
  protected readonly theme = inject(ThemeService);

  protected readonly candidates = CANDIDATES;
  protected readonly storageKeys = [FAVORITES_STORAGE_KEY, PROGRESS_STORAGE_KEY];

  /** Estado de sólo lectura expuesto por los stores. */
  protected readonly favoriteItems = this.favorites.items;
  protected readonly favoriteCount = this.favorites.count;
  protected readonly done = this.progress.done;
  protected readonly total = this.progress.total;
  protected readonly percent = this.progress.percent;
  protected readonly nextPending = this.progress.nextPending;

  protected readonly completed = computed(() => this.progress.isCompleted(this.lesson.id));
  protected readonly themeLabel = computed(() =>
    this.theme.theme() === 'dark' ? 'Oscuro' : 'Claro',
  );

  /** Última acción: demuestra que varios componentes comparten el mismo store. */
  protected readonly lastAction = signal('Todavía no has cambiado nada.');

  protected readonly favoriteRows = computed(() =>
    this.favoriteItems().map((url) => {
      const candidate = CANDIDATES.find((item) => item.url === url);
      return { url, name: candidate?.name ?? url };
    }),
  );

  /** Lo que el effect acaba de escribir en localStorage (para verlo en vivo). */
  protected readonly storedPreview = computed(
    () => `${FAVORITES_STORAGE_KEY} → ${JSON.stringify(this.favoriteItems())}`,
  );

  protected isFavorite(url: string): boolean {
    return this.favorites.isFavorite(url);
  }

  protected toggleFavorite(candidate: Candidate): void {
    this.favorites.toggle(candidate.url);
    this.lastAction.set(
      this.isFavorite(candidate.url)
        ? `Añadido a favoritos: ${candidate.name}`
        : `Quitado de favoritos: ${candidate.name}`,
    );
  }

  protected clearFavorites(): void {
    this.favorites.clear();
    this.lastAction.set('Lista de favoritos vaciada.');
  }

  protected resetProgress(): void {
    this.progress.reset();
    this.lastAction.set('Progreso de la ruta reiniciado.');
  }

  protected toggleTheme(): void {
    this.theme.toggle();
    this.lastAction.set(`Tema cambiado a ${this.theme.theme()}.`);
  }

  protected readonly storeSnippet = `@Injectable({ providedIn: 'root' })
export class FavoritesStore {
  // Estado privado: sólo el servicio puede escribir en él
  private readonly urls = signal<string[]>(
    readStoredJson(FAVORITES_STORAGE_KEY, [], isStringArray),
  );

  // Estado público de sólo lectura
  readonly items = this.urls.asReadonly();
  readonly count = computed(() => this.urls().length);

  constructor() {
    // Un effect persiste cada cambio
    effect(() => writeStoredJson(FAVORITES_STORAGE_KEY, this.urls()));
  }

  toggle(url: string): void {
    this.urls.update((urls) =>
      urls.includes(url) ? urls.filter((item) => item !== url) : [...urls, url],
    );
  }
}`;

  protected readonly consumerSnippet = `// Cualquier componente inyecta el mismo singleton
private readonly favorites = inject(FavoritesStore);

readonly items = this.favorites.items;   // Signal<string[]>
readonly count = this.favorites.count;   // Signal<number>

// La plantilla se actualiza sola cuando cambia el store
@for (item of items(); track item) {
  <li>{{ item }}</li>
}`;

  protected readonly progressSnippet = `// Estado derivado: no se guarda, se calcula
readonly done = computed(() => this.ids().length);
readonly percent = computed(() =>
  Math.round((this.done() / lessons.length) * 100),
);
readonly nextPending = computed(() =>
  lessons.find((lesson) => !this.ids().includes(lesson.id)) ?? null,
);`;

  protected readonly signalStoreSnippet = `// Si el estado crece, NgRx SignalStore ofrece una estructura:
export const FavoritesStore = signalStore(
  { providedIn: 'root' },
  withState<{ urls: string[] }>({ urls: [] }),
  withComputed(({ urls }) => ({ count: computed(() => urls().length) })),
  withMethods((store) => ({
    toggle(url: string) {
      store.urls.update((urls) => /* ... */);
    },
  })),
  withHooks({ onInit: (store) => /* persistencia */ }),
);

// Para este proyecto, un servicio con signals es suficiente.`;

  protected readonly linkedSignalNote = `// Alternativa al effect() de persistencia: linkedSignal
// Se usa cuando el valor debe reaccionar a otro estado pero seguir siendo
// escribible. Para escribir en localStorage, un effect() es más directo:
// el efecto es precisamente "haz algo cuando cambie el estado".`;
}
