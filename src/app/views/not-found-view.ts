// src/app/views/not-found-view.ts
// 404: la ruta comodín `**` de app.routes.ts acaba aquí.
import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

import { BaseButton } from '../shared/ui/base-button';
import { EmptyState } from '../shared/ui/empty-state';

@Component({
  selector: 'app-not-found-view',
  imports: [RouterLink, BaseButton, EmptyState],
  template: `
    <div class="stack">
      <app-empty-state
        icon="🛰️"
        title="404 · Esta ruta no existe"
        message="Puede que el enlace esté mal escrito o que el recurso ya no esté en SWAPI."
      >
        <div class="empty__actions">
          <a appBaseButton variant="primary" routerLink="/">Volver a la portada</a>
          <a appBaseButton variant="ghost" routerLink="/lecciones">Ver las 10 lecciones</a>
          <a appBaseButton variant="subtle" routerLink="/people">Explorar personajes</a>
        </div>
      </app-empty-state>
    </div>
  `,
  styles: ':host { display: contents; }',
})
export class NotFoundView {}
