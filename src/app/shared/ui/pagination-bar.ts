// src/app/shared/ui/pagination-bar.ts
// Componente "tonto": no guarda la página, la recibe y emite la página destino.
// Es la versión Angular de un componente controlado de React.
import { Component, computed, input, output } from '@angular/core';

import { BaseButton } from './base-button';

@Component({
  selector: 'app-pagination-bar',
  imports: [BaseButton],
  template: `
    <nav class="pagination" aria-label="Paginación">
      <button
        appBaseButton
        size="sm"
        variant="subtle"
        type="button"
        [disabled]="!hasPrevious()"
        (click)="pageChange.emit(1)"
      >
        ⇤ Primera
      </button>
      <button
        appBaseButton
        size="sm"
        type="button"
        [disabled]="!hasPrevious()"
        (click)="pageChange.emit(page() - 1)"
      >
        ← Anterior
      </button>
      <span class="pagination__info muted">Página <strong>{{ page() }}</strong> / {{ totalPages() }}</span>
      <button
        appBaseButton
        size="sm"
        type="button"
        [disabled]="!hasNext()"
        (click)="pageChange.emit(page() + 1)"
      >
        Siguiente →
      </button>
      <button
        appBaseButton
        size="sm"
        variant="subtle"
        type="button"
        [disabled]="!hasNext()"
        (click)="pageChange.emit(totalPages())"
      >
        Última ⇥
      </button>
    </nav>
  `,
  styles: ':host { display: contents; }',
})
export class PaginationBar {
  readonly page = input.required<number>();
  readonly totalPages = input.required<number>();

  protected readonly hasPrevious = computed(() => this.page() > 1);
  protected readonly hasNext = computed(() => this.page() < this.totalPages());

  readonly pageChange = output<number>();
}
