// src/app/shared/lesson/challenge-list.ts
// Retos de una lección: una lista ordenada y poco más.
import { Component, input } from '@angular/core';

@Component({
  selector: 'app-challenge-list',
  template: `
    @if (items().length > 0) {
      <div class="challenges">
        <h2 class="challenges__title muted">{{ title() }}</h2>
        <ol class="challenges__list">
          @for (item of items(); track item) {
            <li>{{ item }}</li>
          }
        </ol>
      </div>
    }
  `,
  styles: ':host { display: contents; }',
})
export class ChallengeList {
  readonly items = input<readonly string[]>([]);
  readonly title = input('Retos propuestos');
}
