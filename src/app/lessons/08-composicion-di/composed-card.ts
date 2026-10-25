// src/app/lessons/08-composicion-di/composed-card.ts
// Componente de composición: varios slots con `select`, contenido por defecto
// y una content query para saber si el consumidor puso la directiva destacada.
import {
  Component,
  ViewEncapsulation,
  computed,
  contentChild,
  input,
} from '@angular/core';

import { HighlightDirective } from './highlight';

@Component({
  selector: 'app-composed-card',
  template: `
    <section class="composed-card" [class.composed-card--marked]="marked()">
      <header class="composed-card__head">
        <ng-content select="[card-icon]" />

        <div class="composed-card__titles">
          <h3 class="composed-card__title">{{ title() }}</h3>
          @if (highlight(); as directive) {
            <small class="composed-card__query">
              contentChild detectado · tono {{ directive.appHighlight() }}
            </small>
          }
        </div>

        <span class="spacer"></span>
        <ng-content select="[card-actions]" />
      </header>

      <div class="composed-card__body">
        <ng-content />
      </div>

      <footer class="composed-card__foot">
        <ng-content select="[card-footer]" />
      </footer>
    </section>
  `,
  // Los estilos afectan sólo a este template: `.composed-card` está encapsulada.
  encapsulation: ViewEncapsulation.Emulated,
  styles: `
    :host {
      display: contents;
    }
    .composed-card {
      border: 1px solid var(--border);
      border-radius: var(--radius);
      background: var(--surface-2);
      overflow: hidden;
    }
    .composed-card--marked {
      border-color: var(--border-strong);
    }
    .composed-card__head {
      display: flex;
      align-items: center;
      gap: 0.65rem;
      padding: 0.85rem 1rem;
      border-bottom: 1px solid var(--border);
      background: var(--surface-3);
    }
    .composed-card__titles {
      display: flex;
      flex-direction: column;
      gap: 0.1rem;
      min-width: 0;
    }
    .composed-card__title {
      margin: 0;
      font-size: 1rem;
    }
    .composed-card__query {
      color: var(--accent);
      font-family: var(--font-mono);
      font-size: 0.7rem;
    }
    .composed-card__body {
      display: flex;
      flex-direction: column;
      gap: 0.6rem;
      padding: 1rem;
    }
    .composed-card__foot {
      display: flex;
      align-items: center;
      justify-content: flex-end;
      gap: 0.5rem;
      padding: 0.7rem 1rem;
      border-top: 1px solid var(--border);
      background: var(--surface-2);
    }
    .composed-card__foot:empty {
      display: none;
    }
  `,
})
export class ComposedCard {
  readonly title = input('Tarjeta compuesta');

  /** contentChild() consulta el contenido proyectado (no el template propio). */
  protected readonly highlight = contentChild(HighlightDirective);

  protected readonly marked = computed(() => this.highlight() !== undefined);
}
