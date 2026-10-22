// src/app/shared/demo/rating-stars.ts
// Valoración con estrellas. `model()` crea un input de doble sentido:
// el componente puede leerlo y escribir en él ([(value)]="rating").
import { Component, computed, input, model } from '@angular/core';

@Component({
  selector: 'app-rating-stars',
  template: `
    <div class="rating" role="radiogroup" [attr.aria-label]="label()">
      @for (star of stars(); track star) {
        <button
          class="rating__star"
          type="button"
          [class.rating__star--on]="star <= value()"
          [attr.aria-label]="'Valorar con ' + star"
          (click)="value.set(star)"
        >
          ★
        </button>
      }
      <span class="rating__value muted">{{ value() }} / {{ max() }}</span>
    </div>
  `,
  styles: ':host { display: contents; }',
})
export class RatingStars {
  readonly max = input(5);
  readonly label = input('Valoración');
  readonly value = model(0);

  protected readonly stars = computed(() =>
    Array.from({ length: Math.max(1, this.max()) }, (_, index) => index + 1),
  );
}
