// src/app/shared/lesson/progress-panel.ts
// Panel de progreso de la barra lateral. Lee y escribe en ProgressStore,
// así que se mantiene sincronizado con el resto de la aplicación.
import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';

import { totalDuration } from '../../data/lessons';
import { ProgressStore } from '../../store/progress-store';
import { BaseButton } from '../ui/base-button';

@Component({
  selector: 'app-progress-panel',
  imports: [BaseButton, RouterLink],
  template: `
    <div class="side-panel surface">
      <div class="panel__row">
        <span class="muted">Tu progreso</span>
        <strong class="panel__percent">{{ progress.percent() }}%</strong>
      </div>

      <div
        class="bar"
        role="progressbar"
        [attr.aria-valuenow]="progress.percent()"
        aria-valuemin="0"
        aria-valuemax="100"
      >
        <span class="bar__fill" [style.width.%]="progress.percent()"></span>
      </div>

      <div class="panel__row panel__row--foot">
        <small class="dim">
          {{ progress.done() }} de {{ progress.total }} · ~{{ hours }} h
        </small>
        <button
          appBaseButton
          size="sm"
          variant="subtle"
          type="button"
          [disabled]="progress.done() === 0"
          (click)="progress.reset()"
        >
          Reiniciar
        </button>
      </div>

      @if (progress.nextPending(); as lesson) {
        <a appBaseButton size="sm" variant="primary" [routerLink]="['/lecciones', lesson.id]">
          Continuar: {{ lesson.title }}
        </a>
      } @else {
        <p class="dim l02-summary">¡Ruta completada! 🎉</p>
      }
    </div>
  `,
  styles: ':host { display: contents; }',
})
export class ProgressPanel {
  protected readonly progress = inject(ProgressStore);
  protected readonly hours = Math.round(totalDuration / 60);
}
