// src/app/lessons/10-rendimiento/render-counter.ts
// Hijo con ChangeDetectionStrategy.OnPush: Angular sólo lo comprueba cuando
// cambia un input, cuando emite un evento propio o cuando un signal suyo cambia.
import { ChangeDetectionStrategy, Component, input } from '@angular/core';

export interface DemoItem {
  id: number;
  name: string;
  role: string;
}

@Component({
  selector: 'app-render-counter',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="l10-render">
      <div class="stack-sm">
        <span class="field-label">Hijo OnPush</span>
        <strong>{{ item().name }}</strong>
        <span class="dim">{{ item().role }}</span>
      </div>
      <span class="spacer"></span>
      <span class="l10-render__count" aria-label="número de renders">
        {{ renderCount }} render(s)
      </span>
    </div>
  `,
  styles: ':host { display: contents; }',
})
export class RenderCounter {
  readonly item = input.required<DemoItem>();

  /** Se incrementa cada vez que Angular comprueba este componente. */
  renderCount = 0;

  ngDoCheck(): void {
    this.renderCount += 1;
  }
}
