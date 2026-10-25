// src/app/lessons/09-animaciones-ux/deferred-panel.ts
// Componente cargado con @defer: Angular lo descarga en su propio chunk
// cuando el bloque entra en el viewport (o cuando se cumple el trigger).
import { Component } from '@angular/core';

@Component({
  selector: 'app-deferred-panel',
  template: `
    <div class="l09-deferred">
      <span aria-hidden="true">📦</span>
      <div class="stack-sm">
        <strong>Panel cargado de forma diferida</strong>
        <p class="dim">
          Este componente no viajaba en el bundle inicial: se ha descargado en su propio chunk al
          entrar en el viewport.
        </p>
      </div>
    </div>
  `,
  styles: `
    :host {
      display: contents;
    }
    .l09-deferred {
      display: flex;
      align-items: center;
      gap: 0.8rem;
      padding: 0.9rem 1rem;
      border: 1px solid var(--success);
      border-radius: var(--radius);
      background: var(--success-soft);
      animation: l09-in 0.3s ease;
    }
    .l09-deferred p {
      margin: 0;
    }
  `,
})
export class DeferredPanel {}
