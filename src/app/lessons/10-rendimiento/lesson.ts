// src/app/lessons/10-rendimiento/lesson.ts
// Lección 10 · Rendimiento y zoneless
//
// La demo mide algo concreto: cuántas veces Angular comprueba un hijo OnPush.
// Cambiar estado que ese hijo no lee no debería provocar ningún render suyo.
import { Component, computed, signal } from '@angular/core';

import { requireLesson } from '../../data/lessons';
import { LessonShell } from '../../shared/lesson/lesson-shell';
import { BaseBadge } from '../../shared/ui/base-badge';
import { BaseButton } from '../../shared/ui/base-button';
import { BaseCard } from '../../shared/ui/base-card';
import { CodeBlock } from '../../shared/ui/code-block';
import { DemoItem, RenderCounter } from './render-counter';

const ITEMS: DemoItem[] = [
  { id: 1, name: 'Luke Skywalker', role: 'Jedi' },
  { id: 2, name: 'C-3PO', role: 'Droide de protocolo' },
  { id: 3, name: 'R2-D2', role: 'Droide astromecánico' },
  { id: 4, name: 'Leia Organa', role: 'Princesa de Alderaan' },
  { id: 5, name: 'Han Solo', role: 'Contrabandista' },
  { id: 6, name: 'Chewbacca', role: 'Copiloto' },
];

@Component({
  selector: 'app-lesson-10',
  imports: [LessonShell, BaseCard, BaseBadge, BaseButton, CodeBlock, RenderCounter],
  templateUrl: './lesson.html',
  styles: ':host { display: contents; }',
})
export class Lesson10Rendimiento {
  protected readonly lesson = requireLesson('10-rendimiento');

  protected readonly items = ITEMS;

  /** Sólo el id del seleccionado; el objeto se deriva con computed(). */
  protected readonly selectedId = signal(1);
  protected readonly selected = computed(
    () => ITEMS.find((item) => item.id === this.selectedId()) ?? ITEMS[0],
  );

  /** Estado que el hijo OnPush no lee: cambiar esto NO debe renderizarlo. */
  protected readonly unrelatedClicks = signal(0);

  /** Orden de la lista: demuestra `track` por id. */
  private readonly order = signal(ITEMS.map((item) => item.id));
  protected readonly orderedItems = computed(() =>
    this.order().map((id) => ITEMS.find((item) => item.id === id) ?? ITEMS[0]),
  );
  protected readonly firstOrdered = computed(() => this.orderedItems()[0]);

  protected select(id: number): void {
    this.selectedId.set(id);
  }

  protected bumpUnrelated(): void {
    this.unrelatedClicks.update((count) => count + 1);
  }

  /** Rota el orden para que se vea cómo `track item.id` reutiliza nodos. */
  protected rotate(): void {
    this.order.update((ids) => [...ids.slice(1), ids[0]]);
  }

  protected readonly onPushSnippet = `@Component({
  selector: 'app-render-counter',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: \`{{ item().name }} · {{ renderCount }} render(s)\`,
})
export class RenderCounter {
  readonly item = input.required<DemoItem>();
  renderCount = 0;

  ngDoCheck(): void {
    this.renderCount += 1;
  }
}`;

  protected readonly zonelessSnippet = `// app.config.ts
provideZonelessChangeDetection();

// Sin zone.js, Angular no "parchea" setTimeout ni addEventListener.
// La detección de cambios se dispara por:
//   - signals leídos en la plantilla
//   - eventos del template (click, input...)
//   - inputs que cambian
//   - markForCheck() explícito

// Por eso los signals y OnPush encajan tan bien.`;

  protected readonly trackSnippet = `// track por id: Angular mueve el nodo, no lo recrea
@for (item of items(); track item.id) {
  <li>{{ item.name }}</li>
}

// track por índice: al reordenar, Angular reutiliza por posición
// y puede repintar contenido que no ha cambiado.
@for (item of items(); track $index) {
  <li>{{ item.name }}</li>
}`;

  protected readonly checklistSnippet = `// Checklist antes de optimizar
// 1. Mide (Angular DevTools > Profiler, Performance panel).
// 2. ¿Hay renders de más? Revisa inputs que cambian de referencia.
// 3. Usa OnPush en componentes hoja con inputs/signals.
// 4. No crees arrays u objetos nuevos en la plantilla si no hace falta.
// 5. Usa track estable en los @for.
// 6. Deja @defer para lo que no se ve al arrancar.
// 7. Optimiza sólo lo que la medición señale: no a ciegas.`;

  protected readonly deferSnippet = `// El chunk diferido no se descarga en el arranque
@defer (on viewport) {
  <app-pesado />
} @placeholder {
  <p>Contenido ligero mientras tanto</p>
}

// En DevTools > Network comprueba que el chunk aparece
// sólo al hacer scroll.`;
}
