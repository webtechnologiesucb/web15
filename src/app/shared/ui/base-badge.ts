// src/app/shared/ui/base-badge.ts
// Insignia con tono. Renderiza su contenido proyectado dentro de un <span>.
import { Component, input } from '@angular/core';

export type BadgeTone = 'default' | 'accent' | 'primary' | 'success' | 'danger';

@Component({
  selector: 'app-base-badge',
  template: '<ng-content />',
  host: {
    '[class.badge]': 'true',
    '[class.badge--accent]': "tone() === 'accent'",
    '[class.badge--primary]': "tone() === 'primary'",
    '[class.badge--success]': "tone() === 'success'",
    '[class.badge--danger]': "tone() === 'danger'",
  },
})
export class BaseBadge {
  readonly tone = input<BadgeTone>('default');
}
