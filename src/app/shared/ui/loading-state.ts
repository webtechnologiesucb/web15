// src/app/shared/ui/loading-state.ts
// Carga con dos variantes: spinner para fichas y rejilla de "skeletons" para
// listados (lección 09).
import { Component, computed, input } from '@angular/core';

export type LoadingVariant = 'spinner' | 'skeleton';

@Component({
  selector: 'app-loading-state',
  template: `
    @if (variant() === 'skeleton') {
      <div class="grid" role="status" aria-live="polite">
        @for (row of rows(); track row) {
          <div class="sk" aria-hidden="true">
            <div class="sk__line sk__line--title"></div>
            <div class="sk__line"></div>
            <div class="sk__line sk__line--short"></div>
          </div>
        }
        <span class="visually-hidden">{{ label() }}</span>
      </div>
    } @else {
      <div class="spinner-wrap" role="status" aria-live="polite">
        <span class="spinner" aria-hidden="true"></span>
        <span class="muted">{{ label() }}</span>
      </div>
    }
  `,
  styles: ':host { display: contents; }',
})
export class LoadingState {
  readonly label = input('Cargando…');
  readonly variant = input<LoadingVariant>('spinner');
  readonly count = input(6);

  protected readonly rows = computed(() =>
    Array.from({ length: Math.max(1, this.count()) }, (_, index) => index),
  );
}
