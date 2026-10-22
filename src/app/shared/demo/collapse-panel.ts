// src/app/shared/demo/collapse-panel.ts
// Envoltorio que anima su apertura y su cierre con transiciones CSS.
// Los estilos del componente están encapsulados: sólo afectan a este archivo
// (ejemplo real de `styles` + encapsulación de la lección 08).
import { Component, input, model } from '@angular/core';

@Component({
  selector: 'app-collapse-panel',
  template: `
    <section class="collapse-panel">
      <button class="collapse-panel__toggle" type="button" (click)="toggle()">
        <span>{{ expanded() ? '▾' : '▸' }}</span>
        <span>{{ title() }}</span>
        <small>{{ expanded() ? 'ocultar' : 'mostrar' }}</small>
      </button>
      <div class="collapse-panel__body" [class.collapse-panel__body--open]="expanded()">
        <ng-content />
      </div>
    </section>
  `,
  styles: `
    /* El host no crea caja: el elemento raíz de la plantilla es el que se pinta. */
    :host {
      display: contents;
    }
    .collapse-panel {
      border: 1px solid var(--border);
      border-radius: var(--radius-sm);
      background: var(--surface-2);
      overflow: hidden;
    }
    .collapse-panel__toggle {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      width: 100%;
      padding: 0.6rem 0.8rem;
      border: none;
      background: none;
      color: var(--text);
      font: inherit;
      font-weight: 600;
      text-align: left;
      cursor: pointer;
    }
    .collapse-panel__toggle small {
      margin-left: auto;
      color: var(--text-dim);
      font-weight: 400;
    }
    .collapse-panel__body {
      display: grid;
      grid-template-rows: 0fr;
      padding: 0 0.8rem;
      transition: grid-template-rows 0.25s ease, padding 0.22s ease;
    }
    .collapse-panel__body--open {
      grid-template-rows: 1fr;
      padding-bottom: 0.8rem;
    }
    .collapse-panel__body > * {
      overflow: hidden;
      min-height: 0;
    }
  `,
})
export class CollapsePanel {
  readonly title = input('Detalles');
  /** `model()` permite abrirlo desde dentro y enlazarlo con [(expanded)]. */
  readonly expanded = model(false);

  protected toggle(): void {
    this.expanded.update((open) => !open);
  }
}
