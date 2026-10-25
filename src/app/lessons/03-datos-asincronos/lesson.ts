// src/app/lessons/03-datos-asincronos/lesson.ts
// Lección 03 · Datos asíncronos con HttpClient
//
// `httpResource` convierte una petición HTTP en un recurso reactivo: la URL se
// calcula dentro de una función, así que cambiar `id()` relanza la petición y
// cancela la anterior. La plantilla sólo tiene que pintar sus tres estados.
import { httpResource } from '@angular/common/http';
import { Component, computed, effect, signal } from '@angular/core';

import { describeSwapiError } from '../../core/api/swapi-error';
import type { Person } from '../../core/api/swapi-types';
import { requireLesson } from '../../data/lessons';
import { LessonShell } from '../../shared/lesson/lesson-shell';
import { BaseBadge, type BadgeTone } from '../../shared/ui/base-badge';
import { BaseButton } from '../../shared/ui/base-button';
import { BaseCard } from '../../shared/ui/base-card';
import { CodeBlock } from '../../shared/ui/code-block';
import { EmptyState } from '../../shared/ui/empty-state';
import { ErrorState } from '../../shared/ui/error-state';
import { LoadingState } from '../../shared/ui/loading-state';

@Component({
  selector: 'app-lesson-03',
  imports: [
    LessonShell,
    BaseCard,
    BaseBadge,
    BaseButton,
    CodeBlock,
    LoadingState,
    ErrorState,
    EmptyState,
  ],
  templateUrl: './lesson.html',
  styles: ':host { display: contents; }',
})
export class Lesson03DatosAsincronos {
  protected readonly lesson = requireLesson('03-datos-asincronos');

  protected readonly id = signal(1);

  /** El recurso se recalcula cuando cambia `id()`. */
  protected readonly person = httpResource<Person>(() => ({
    url: `/people/${this.id()}/`,
  }));

  /** Un único sitio decide qué estado toca pintar. */
  protected readonly status = computed<'loading' | 'error' | 'success' | 'idle'>(() => {
    if (this.person.isLoading()) return 'loading';
    if (this.person.error()) return 'error';
    if (this.person.hasValue()) return 'success';
    return 'idle';
  });

  protected readonly statusTone = computed<BadgeTone>(() => {
    const status = this.status();
    if (status === 'success') return 'success';
    if (status === 'error') return 'danger';
    if (status === 'loading') return 'primary';
    return 'default';
  });

  protected readonly errorMsg = computed(() => describeSwapiError(this.person.error()));

  /** Milisegundos de la última recarga manual. */
  protected readonly lastRequestMs = signal<number | null>(null);
  private pendingStart: number | null = null;

  constructor() {
    // Cuando la petición deja de estar cargando, medimos cuánto ha tardado.
    effect(() => {
      if (this.person.isLoading()) return;
      const start = this.pendingStart;
      if (start === null) return;

      this.pendingStart = null;
      if (this.person.hasValue() || this.person.error()) {
        this.lastRequestMs.set(Math.round(performance.now() - start));
      }
    });
  }

  protected next(): void {
    this.id.update((value) => (value >= 10 ? 10 : value + 1));
  }

  protected prev(): void {
    this.id.update((value) => (value > 10 ? 10 : Math.max(1, value - 1)));
  }

  protected reload(): void {
    this.pendingStart = performance.now();
    this.person.reload();
  }

  /** El reto final: pedir un id que no existe y leer el 404. */
  protected probar404(): void {
    this.id.set(9999);
  }

  protected readonly httpSnippet = `// app.config.ts
provideHttpClient(
  withFetch(),
  withInterceptors([swapiInterceptor]),
)

// El interceptor pone la base real y los mirrors; el servicio
// escribe rutas relativas: '/people/1/'`;

  protected readonly resourceSnippet = `// En el componente
person = httpResource<Person>(() => ({
  url: \`/people/\${this.id()}/\`,
}));

// Cambiar id() relanza la petición y cancela la anterior
id.set(2);

// Estados
person.isLoading()
person.hasValue()
person.error()
person.value() // Person | undefined

// Recargar manualmente
person.reload();`;

  protected readonly statesSnippet = `// Tres estados que hay que pintar siempre
@if (person.isLoading()) {
  <app-loading-state />
} @else if (person.error()) {
  <app-error-state [message]="errorMsg()" (retry)="reload()" />
} @else if (person.value(); as personaje) {
  <p>{{ personaje.name }}</p>
} @else {
  <app-empty-state title="Sin datos" />
}`;

  protected readonly timingSnippet = `// Medir la recarga sin tocar el recurso
private pendingStart: number | null = null;

reload(): void {
  this.pendingStart = performance.now();
  this.person.reload();
}

// effect() observa cuándo termina la petición
constructor() {
  effect(() => {
    if (this.person.isLoading() || this.pendingStart === null) return;
    const ms = performance.now() - this.pendingStart;
    this.pendingStart = null;
    this.lastRequestMs.set(Math.round(ms));
  });
}`;
}
