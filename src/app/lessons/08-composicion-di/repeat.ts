// src/app/lessons/08-composicion-di/repeat.ts
// Directiva estructural: crea N copias del template anfitrión.
//
// Es la versión mínima de *ngFor: recibe un TemplateRef (el contenido) y un
// ViewContainerRef (dónde insertarlo). El asterisco del microsintaxis lo pone
// Angular al usar `*appRepeat="3"`.
import {
  Directive,
  TemplateRef,
  ViewContainerRef,
  effect,
  inject,
  input,
  numberAttribute,
} from '@angular/core';

@Directive({ selector: '[appRepeat]' })
export class RepeatDirective {
  private readonly template = inject(TemplateRef<unknown>);
  private readonly viewContainer = inject(ViewContainerRef);

  readonly appRepeat = input(1, { transform: numberAttribute });

  constructor() {
    effect(() => {
      const count = Math.max(0, this.appRepeat());
      this.viewContainer.clear();
      for (let index = 0; index < count; index += 1) {
        this.viewContainer.createEmbeddedView(this.template, { $implicit: index });
      }
    });
  }
}
