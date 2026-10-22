// src/app/shared/demo/collapse.ts
// Envoltorio que aparece y desaparece con una transición CSS.
// Al no destruir el contenido (sólo cambia una clase) la salida se puede animar.
import { Component, booleanAttribute, input } from '@angular/core';

@Component({
  selector: 'app-collapse',
  template: `
    <div class="collapse" [class.collapse--open]="open()">
      <ng-content />
    </div>
  `,
  styles: ':host { display: contents; }',
})
export class Collapse {
  readonly open = input(false, { transform: booleanAttribute });
}
