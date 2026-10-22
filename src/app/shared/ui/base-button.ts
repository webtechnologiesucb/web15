// src/app/shared/ui/base-button.ts
// Botón polimórfico: funciona sobre <button> y sobre <a> (con routerLink).
//
// Es una buena excusa para conocer los **host bindings**: el componente no
// envuelve nada, decora el propio elemento con clases y atributos.
import { Component, booleanAttribute, input } from '@angular/core';

export type ButtonVariant = 'ghost' | 'primary' | 'accent' | 'subtle' | 'danger';
export type ButtonSize = 'sm' | 'md';

@Component({
  selector: 'button[appBaseButton], a[appBaseButton]',
  template: '<ng-content />',
  host: {
    '[class.btn]': 'true',
    '[class.btn--sm]': "size() === 'sm'",
    '[class.btn--block]': 'block()',
    '[class.btn--primary]': "variant() === 'primary'",
    '[class.btn--accent]': "variant() === 'accent'",
    '[class.btn--ghost]': "variant() === 'ghost'",
    '[class.btn--subtle]': "variant() === 'subtle'",
    '[class.btn--danger]': "variant() === 'danger'",
    '[attr.disabled]': 'disabledAttribute()',
    '[attr.aria-disabled]': 'ariaDisabled()',
  },
})
export class BaseButton {
  readonly variant = input<ButtonVariant>('ghost');
  readonly size = input<ButtonSize>('md');
  readonly block = input(false, { transform: booleanAttribute });
  readonly disabled = input(false, { transform: booleanAttribute });

  /** Atributo (y no propiedad) para que funcione igual en <a> que en <button>. */
  protected disabledAttribute(): string | null {
    return this.disabled() ? '' : null;
  }

  protected ariaDisabled(): true | null {
    return this.disabled() ? true : null;
  }
}
