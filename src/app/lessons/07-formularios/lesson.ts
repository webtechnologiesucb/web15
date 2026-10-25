// src/app/lessons/07-formularios/lesson.ts
// Lección 07 · Formularios reactivos
//
// Un FormGroup es la fuente de verdad del formulario. La búsqueda escucha
// valueChanges, espera a que el usuario deje de escribir (debounceTime) y
// cancela la petición anterior si llega otra (switchMap).
import { Component, computed, inject, signal } from '@angular/core';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import {
  catchError,
  debounceTime,
  distinctUntilChanged,
  map,
  of,
  startWith,
  switchMap,
} from 'rxjs';

import { describeSwapiError } from '../../core/api/swapi-error';
import { SwapiService } from '../../core/api/swapi-service';
import {
  RESOURCE_META,
  RESOURCE_NAMES,
  type ResourceName,
  type SwapiItem,
} from '../../core/api/swapi-types';
import { requireLesson } from '../../data/lessons';
import { LessonShell } from '../../shared/lesson/lesson-shell';
import { ResourceCard } from '../../shared/swapi/resource-card';
import { BaseBadge, type BadgeTone } from '../../shared/ui/base-badge';
import { BaseCard } from '../../shared/ui/base-card';
import { CodeBlock } from '../../shared/ui/code-block';
import { EmptyState } from '../../shared/ui/empty-state';
import { ErrorState } from '../../shared/ui/error-state';
import { LoadingState } from '../../shared/ui/loading-state';
import { FavoritesStore } from '../../store/favorites-store';

type SearchState = 'idle' | 'invalid' | 'loading' | 'success' | 'error';

@Component({
  selector: 'app-lesson-07',
  imports: [
    LessonShell,
    ReactiveFormsModule,
    ResourceCard,
    BaseCard,
    BaseBadge,
    CodeBlock,
    LoadingState,
    ErrorState,
    EmptyState,
  ],
  templateUrl: './lesson.html',
  styles: ':host { display: contents; }',
})
export class Lesson07Formularios {
  protected readonly lesson = requireLesson('07-formularios');

  private readonly swapi = inject(SwapiService);
  private readonly favorites = inject(FavoritesStore);

  protected readonly resources = RESOURCE_NAMES;
  protected readonly meta = RESOURCE_META;

  /** El formulario: dos campos y una casilla, todos tipados. */
  protected readonly form = new FormGroup({
    resource: new FormControl<ResourceName>('people', { nonNullable: true }),
    query: new FormControl('', {
      nonNullable: true,
      validators: [Validators.minLength(3)],
    }),
    onlyFavorites: new FormControl(false, { nonNullable: true }),
  });

  protected readonly onlyFavorites = toSignal(
    this.form.controls.onlyFavorites.valueChanges,
    { initialValue: false },
  );

  protected readonly state = signal<SearchState>('idle');
  protected readonly results = signal<SwapiItem[]>([]);
  protected readonly total = signal(0);
  protected readonly errorMsg = signal('');
  protected readonly requestCount = signal(0);

  /** Filtro local: no vuelve a pedir nada al servidor. */
  protected readonly visibleResults = computed(() => {
    const items = this.results();
    return this.onlyFavorites()
      ? items.filter((item) => this.favorites.isFavorite(item.url))
      : items;
  });

  protected readonly statusTone = computed<BadgeTone>(() => {
    const state = this.state();
    if (state === 'success') return 'success';
    if (state === 'error' || state === 'invalid') return 'danger';
    if (state === 'loading') return 'primary';
    return 'default';
  });

  constructor() {
    this.form.valueChanges
      .pipe(
        startWith(this.form.getRawValue()),
        // Sólo nos interesan los campos de búsqueda, no la casilla.
        distinctUntilChanged(
          (previous, current) =>
            previous.resource === current.resource && previous.query === current.query,
        ),
        debounceTime(400),
        switchMap(({ resource, query }) => {
          const term = (query ?? '').trim();

          if (term.length === 0) {
            this.state.set('idle');
            this.results.set([]);
            return of(null);
          }

          if (term.length < 3) {
            this.state.set('invalid');
            this.results.set([]);
            return of(null);
          }

          this.state.set('loading');
          this.requestCount.update((count) => count + 1);

          return this.swapi.list(resource ?? 'people', 1, term).pipe(
            map((page) => ({ page, error: null })),
            catchError((error: unknown) => of({ page: null, error })),
          );
        }),
        takeUntilDestroyed(),
      )
      .subscribe((outcome) => {
        if (outcome === null) return;

        if (outcome.error !== null) {
          this.errorMsg.set(describeSwapiError(outcome.error));
          this.state.set('error');
          this.results.set([]);
          return;
        }

        if (outcome.page !== null) {
          this.results.set(outcome.page.results);
          this.total.set(outcome.page.count);
          this.state.set('success');
        }
      });
  }

  protected readonly formSnippet = `// Formulario tipado: cada control tiene su tipo
form = new FormGroup({
  resource: new FormControl<ResourceName>('people', { nonNullable: true }),
  query: new FormControl('', {
    nonNullable: true,
    validators: [Validators.minLength(3)],
  }),
  onlyFavorites: new FormControl(false, { nonNullable: true }),
});

// En la plantilla: [formGroup] y formControlName
<form [formGroup]="form">
  <input formControlName="query" />
</form>`;

  protected readonly pipelineSnippet = `this.form.valueChanges.pipe(
  startWith(this.form.getRawValue()),
  distinctUntilChanged((a, b) => a.resource === b.resource && a.query === b.query),
  debounceTime(400),   // espera a que el usuario deje de escribir
  switchMap(({ resource, query }) => {
    if (query.trim().length < 3) return of(null);
    return this.swapi.list(resource, 1, query);
  }),
  takeUntilDestroyed(), // cancela todo al destruir el componente
).subscribe(...);`;

  protected readonly statusSnippet = `// El formulario expone su propio estado
form.valid
form.controls.query.touched
form.controls.query.dirty
form.controls.query.hasError('minlength')

// No hace falta duplicarlo en signals: la plantilla lo lee directamente.`;

  protected readonly onlyFavoritesSnippet = `// Filtro local sobre los resultados ya cargados
visibleResults = computed(() => {
  const items = this.results();
  return this.onlyFavorites()
    ? items.filter((item) => this.favorites.isFavorite(item.url))
    : items;
});`;
}
