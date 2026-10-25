// src/app/lessons/08-composicion-di/local-provider-demo.ts
// providers por componente: este subárbol ve otra configuración de SWAPI sin
// tocar el provider root. Los hijos de este componente también la verían.
import { Component, inject } from '@angular/core';

import { SWAPI_BASE_URLS } from '../../core/api/swapi-base';

@Component({
  selector: 'app-local-provider-demo',
  template: `
    <div class="l08-provider">
      <p class="field-label">Dentro del subárbol</p>
      <ul class="l08-bases">
        @for (base of bases; track base) {
          <li><code class="inline-code">{{ base }}</code></li>
        }
      </ul>
      <p class="dim">
        Este componente declara su propio provider: no altera el singleton del resto de la app.
      </p>
    </div>
  `,
  providers: [{ provide: SWAPI_BASE_URLS, useValue: ['https://local.example/api'] }],
  styles: ':host { display: contents; }',
})
export class LocalProviderDemo {
  protected readonly bases = inject(SWAPI_BASE_URLS);
}
