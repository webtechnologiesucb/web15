// src/app/shared/ui/error-state.ts
// Panel de error con acción de reintento (output<void>).
import { Component, input, output } from '@angular/core';

import { BaseButton } from './base-button';

@Component({
  selector: 'app-error-state',
  imports: [BaseButton],
  template: `
    <div class="error" role="alert">
      <span class="error__icon" aria-hidden="true">⚠️</span>
      <div>
        <h3 class="error__title">{{ title() }}</h3>
        <p class="error__msg">{{ message() }}</p>
      </div>
      <span class="spacer"></span>
      <button appBaseButton variant="ghost" size="sm" type="button" (click)="retry.emit()">
        Reintentar
      </button>
    </div>
  `,
  styles: ':host { display: contents; }',
})
export class ErrorState {
  readonly title = input('No se pudieron cargar los datos');
  readonly message = input('Vuelve a intentarlo en unos segundos.');
  readonly retry = output<void>();
}
