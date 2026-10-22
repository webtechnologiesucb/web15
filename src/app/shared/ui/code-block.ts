// src/app/shared/ui/code-block.ts
// Bloque de código con botón de copiar.
// `code` es obligatorio: input.required<string>() lo garantiza en compilación.
import { Component, input, signal } from '@angular/core';

import { BaseButton } from './base-button';

@Component({
  selector: 'app-code-block',
  imports: [BaseButton],
  template: `
    <figure class="code">
      <figcaption class="code__bar">
        <span class="code__title">{{ title() }}</span>
        <button appBaseButton size="sm" variant="ghost" type="button" (click)="copy()">
          {{ copied() ? '¡Copiado!' : 'Copiar' }}
        </button>
      </figcaption>
      <pre class="code__pre"><code>{{ code() }}</code></pre>
    </figure>
  `,
  styles: ':host { display: contents; }',
})
export class CodeBlock {
  readonly title = input('Código');
  readonly code = input.required<string>();

  protected readonly copied = signal(false);

  protected async copy(): Promise<void> {
    try {
      await navigator.clipboard?.writeText(this.code());
      this.copied.set(true);
      setTimeout(() => this.copied.set(false), 1500);
    } catch {
      /* el portapapeles puede estar bloqueado: no es crítico */
    }
  }
}
