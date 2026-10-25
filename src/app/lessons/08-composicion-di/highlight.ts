// src/app/lessons/08-composicion-di/highlight.ts
// Directiva de atributo con host bindings.
//
// No crea un componente ni envuelve nada: decora el elemento que la usa. El
// componente padre puede consultarla con contentChild() (ver composed-card.ts).
import { Directive, computed, input } from '@angular/core';

export type HighlightTone = 'accent' | 'primary' | 'danger';

@Directive({
  selector: '[appHighlight]',
  host: {
    '[class.l08-highlight]': 'true',
    '[style.border-color]': 'color()',
    '[style.color]': 'color()',
    '[attr.data-tone]': 'appHighlight()',
  },
})
export class HighlightDirective {
  /** El nombre coincide con el selector: `appHighlight="primary"`. */
  readonly appHighlight = input<HighlightTone>('accent');

  protected readonly color = computed(() => {
    switch (this.appHighlight()) {
      case 'primary':
        return 'var(--primary)';
      case 'danger':
        return 'var(--danger)';
      default:
        return 'var(--accent)';
    }
  });
}
