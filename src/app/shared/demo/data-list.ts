// src/app/shared/demo/data-list.ts
// Lista presentacional mínima: recibe datos y los pinta con @for.
import { Component, input } from '@angular/core';

@Component({
  selector: 'app-data-list',
  template: `
    <ul class="data-list">
      @for (item of items(); track item) {
        <li class="data-list__item">{{ item }}</li>
      } @empty {
        <li class="data-list__item dim">Nada que mostrar.</li>
      }
    </ul>
  `,
  styles: ':host { display: contents; }',
})
export class DataList {
  readonly items = input<readonly string[]>([]);
}
