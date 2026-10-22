// src/app/shared/swapi/resource-field.ts
// Campo etiqueta/valor de una ficha de SWAPI.
import { Component, computed, input } from '@angular/core';

@Component({
  selector: 'app-resource-field',
  template: `
    <div class="field">
      <span class="field__label">{{ label() }}</span>
      <p class="field__value">{{ display() }}</p>
    </div>
  `,
  styles: ':host { display: contents; }',
})
export class ResourceField {
  readonly label = input.required<string>();
  readonly value = input<string | number | null | undefined>();

  protected readonly display = computed(() => {
    const raw = this.value();
    if (raw === null || raw === undefined) return '—';
    const text = String(raw).trim();
    return text === '' || text === 'unknown' || text === 'n/a' || text === 'none' ? '—' : text;
  });
}
