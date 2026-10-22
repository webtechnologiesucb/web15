// src/app/lessons/01-componentes-y-plantillas/power-meter.ts
// Componente hijo de la lección 01: no sabe nada de SWAPI, sólo recibe datos.
//
// Sirve para explicar dos ideas:
//   - `input()` es la forma moderna de declarar entradas (con tipos y valores
//     por defecto). `input.required()` obliga al padre a pasarlas.
//   - El componente calcula lo que necesita a partir de sus entradas con
//     `computed()`, en lugar de guardar estado duplicado.
import { Component, computed, input } from '@angular/core';

@Component({
  selector: 'app-power-meter',
  template: `
    <div class="row row--between">
      <span class="field-label">{{ label() }}</span>
      <strong>{{ value() }} / {{ max() }}</strong>
    </div>

    <div
      class="bar"
      role="progressbar"
      [attr.aria-valuenow]="value()"
      aria-valuemin="0"
      [attr.aria-valuemax]="max()"
    >
      <!-- binding de estilo condicional: null quita la propiedad -->
      <span
        class="bar__fill"
        [style.width.%]="percent()"
        [style.background]="percent() > 90 ? 'var(--accent)' : null"
      ></span>
    </div>
  `,
  styles: `
    /* El host sí crea caja aquí: este componente ocupa el ancho disponible. */
    :host {
      display: block;
    }
    .bar {
      margin-top: 0.35rem;
    }
  `,
})
export class PowerMeter {
  readonly label = input('Poder');
  readonly value = input.required<number>();
  readonly max = input(100);

  protected readonly percent = computed(() => {
    const max = this.max() === 0 ? 1 : this.max();
    return Math.max(0, Math.min(100, Math.round((this.value() / max) * 100)));
  });
}
