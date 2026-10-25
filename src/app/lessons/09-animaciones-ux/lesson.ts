// src/app/lessons/09-animaciones-ux/lesson.ts
// Lección 09 · Animaciones y UX de carga
//
// No hay dependencias de animación: las transiciones las gobierna el estado y
// el desmontaje se anima escuchando (animationend). Para la carga usamos
// skeletons y para el bundle, el bloque @defer.
import { Component, DestroyRef, inject, signal } from '@angular/core';

import { requireLesson } from '../../data/lessons';
import { LessonShell } from '../../shared/lesson/lesson-shell';
import { BaseBadge } from '../../shared/ui/base-badge';
import { BaseButton } from '../../shared/ui/base-button';
import { BaseCard } from '../../shared/ui/base-card';
import { CodeBlock } from '../../shared/ui/code-block';
import { EmptyState } from '../../shared/ui/empty-state';
import { LoadingState } from '../../shared/ui/loading-state';
import { DeferredPanel } from './deferred-panel';

interface QueueItem {
  id: number;
  name: string;
  kind: string;
}

const INITIAL_ITEMS: QueueItem[] = [
  { id: 1, name: 'R2-D2', kind: 'droide astromecánico' },
  { id: 2, name: 'BB-8', kind: 'droide esférico' },
  { id: 3, name: 'K-2SO', kind: 'droide de seguridad' },
];

@Component({
  selector: 'app-lesson-09',
  imports: [
    LessonShell,
    BaseCard,
    BaseBadge,
    BaseButton,
    CodeBlock,
    EmptyState,
    LoadingState,
    DeferredPanel,
  ],
  templateUrl: './lesson.html',
  styles: ':host { display: contents; }',
})
export class Lesson09AnimacionesUx {
  protected readonly lesson = requireLesson('09-animaciones-ux');

  private readonly destroyRef = inject(DestroyRef);

  protected readonly items = signal<QueueItem[]>(INITIAL_ITEMS);

  /** Ids que ya no están en la lista pero siguen pintados mientras salen. */
  protected readonly leaving = signal<number[]>([]);
  private nextId = 4;

  protected readonly loading = signal(false);
  protected readonly loaded = signal(false);
  private timer: ReturnType<typeof setTimeout> | undefined;

  constructor() {
    this.destroyRef.onDestroy(() => clearTimeout(this.timer));
  }

  protected isLeaving(id: number): boolean {
    return this.leaving().includes(id);
  }

  protected add(): void {
    const item: QueueItem = {
      id: this.nextId++,
      name: `Droide ${String.fromCharCode(64 + this.nextId)}`,
      kind: 'recién añadido',
    };
    this.items.update((items) => [...items, item]);
  }

  protected remove(id: number): void {
    if (this.isLeaving(id)) return;
    this.leaving.update((ids) => [...ids, id]);
  }

  /**
   * La animación de salida termina y sólo entonces desmontamos el elemento.
   * Sin esta escucha el elemento desaparecería de golpe.
   */
  protected onLeaveEnd(event: AnimationEvent, id: number): void {
    if (!this.isLeaving(id) || event.animationName !== 'l09-out') return;

    this.leaving.update((ids) => ids.filter((item) => item !== id));
    this.items.update((items) => items.filter((item) => item.id !== id));
  }

  /** Simula una carga para enseñar el skeleton. */
  protected simulateLoad(): void {
    clearTimeout(this.timer);
    this.loading.set(true);
    this.loaded.set(false);

    this.timer = setTimeout(() => {
      this.loading.set(false);
      this.loaded.set(true);
    }, 700);
  }

  protected readonly transitionSnippet = `/* La clase la pone el estado del componente */
.collapse {
  opacity: 0;
  transform: translateY(-6px);
  transition: opacity 0.22s ease, transform 0.22s ease;
}
.collapse--open {
  opacity: 1;
  transform: none;
}`;

  protected readonly leaveSnippet = `// 1. Marcamos el elemento como "saliendo"
remove(id: number): void {
  this.leaving.update(ids => [...ids, id]);
}

// 2. Esperamos a que la animación termine
<li
  [class.l09-item--leaving]="isLeaving(item.id)"
  (animationend)="onLeaveEnd($event, item.id)"
>

// 3. Ahora sí lo quitamos del array
onLeaveEnd(event: AnimationEvent, id: number): void {
  if (event.animationName !== 'l09-out') return;
  this.leaving.update(ids => ids.filter(x => x !== id));
  this.items.update(items => items.filter(x => x.id !== id));
}`;

  protected readonly deferSnippet = `@defer (on viewport) {
  <app-deferred-panel />
} @placeholder (minimum 200ms) {
  <p>Desplázate para cargar el panel.</p>
} @loading (minimum 300ms) {
  <app-loading-state label="Cargando chunk..." />
} @error {
  <p>No se pudo cargar el bloque diferido.</p>
}

// Triggers habituales: on viewport, on idle, on interaction,
// on hover, on timer(2s), when condición.`;

  protected readonly reducedMotionSnippet = `/* Respeta la preferencia del sistema */
@media (prefers-reduced-motion: reduce) {
  .l09-item,
  .l09-deferred {
    animation: none;
  }

  /* No dejamos la salida sin animación: sería instantánea, pero
     el evento animationend nunca llegaría y el elemento no se
     desmontaría. Una animación de 0.01ms mantiene el ciclo. */
  .l09-item--leaving {
    animation: l09-out 0.01ms linear forwards;
  }

  * {
    transition-duration: 0.01ms !important;
  }
}`;
}
