// src/app/views/home-view.ts
// Portada: presentación de la ruta de aprendizaje y accesos al resto de la app.
import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';

import { RESOURCE_META, RESOURCE_NAMES } from '../core/api/swapi-types';
import { lessons, totalDuration } from '../data/lessons';
import { LessonCard } from '../shared/lesson/lesson-card';
import { BaseButton } from '../shared/ui/base-button';
import { ProgressStore } from '../store/progress-store';

@Component({
  selector: 'app-home-view',
  imports: [RouterLink, BaseButton, LessonCard],
  templateUrl: './home-view.html',
  styles: ':host { display: contents; }',
})
export class HomeView {
  /** Inyectar un servicio es pedirlo al inyector: no hay que crearlo a mano. */
  private readonly progress = inject(ProgressStore);

  protected readonly lessons = lessons;
  protected readonly resources = RESOURCE_NAMES;
  protected readonly meta = RESOURCE_META;
  protected readonly totalMinutes = totalDuration;
  protected readonly totalHours = Math.round(totalDuration / 60);

  protected readonly done = this.progress.done;
  protected readonly percent = this.progress.percent;
  protected readonly total = this.progress.total;
  protected readonly nextPending = this.progress.nextPending;

  protected readonly featured = lessons[0];
}
