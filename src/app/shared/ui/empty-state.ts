// src/app/shared/ui/empty-state.ts
// Estado vacío con contenido proyectado para las acciones.
import { Component, input } from '@angular/core';

@Component({
  selector: 'app-empty-state',
  template: `
    <div class="empty">
      <span class="empty__icon" aria-hidden="true">{{ icon() }}</span>
      <h3 class="empty__title">{{ title() }}</h3>
      @if (message()) {
        <p class="muted">{{ message() }}</p>
      }
      <ng-content />
    </div>
  `,
  styles: ':host { display: contents; }',
})
export class EmptyState {
  readonly icon = input('🛰️');
  readonly title = input.required<string>();
  readonly message = input('');
}
