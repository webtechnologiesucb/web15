// src/app/shared/ui/base-card.ts
// Tarjeta con cabecera opcional y dos puntos de proyección (lección 08):
//   <app-base-card>…</app-base-card>            -> cuerpo
//   <app-base-card><div cardActions>…</div></app-base-card> -> acciones
import { Component, booleanAttribute, input } from '@angular/core';

@Component({
  selector: 'app-base-card',
  template: `
    <div class="card" [class.card--flush]="flush()" [class.card--hover]="hover()">
      @if (title() || subtitle()) {
        <div class="card__header">
          @if (title()) {
            <h3 class="card__title">{{ title() }}</h3>
          }
          @if (subtitle()) {
            <p class="card__subtitle">{{ subtitle() }}</p>
          }
        </div>
      }
      <div class="card__body">
        <ng-content />
      </div>
      <ng-content select="[cardActions]" />
    </div>
  `,
  // El host no crea caja: la `.card` de la plantilla es la que participa del layout.
  styles: ':host { display: contents; }',
})
export class BaseCard {
  readonly title = input('');
  readonly subtitle = input('');
  readonly flush = input(false, { transform: booleanAttribute });
  readonly hover = input(false, { transform: booleanAttribute });
}
