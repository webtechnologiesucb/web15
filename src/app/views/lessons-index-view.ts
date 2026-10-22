// src/app/views/lessons-index-view.ts
// Índice de la ruta de aprendizaje: todas las lecciones con su estado.
import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';

import { lessons, totalDuration } from '../data/lessons';
import { LessonCard } from '../shared/lesson/lesson-card';
import { BaseButton } from '../shared/ui/base-button';
import { ProgressStore } from '../store/progress-store';

@Component({
  selector: 'app-lessons-index-view',
  imports: [RouterLink, BaseButton, LessonCard],
  templateUrl: './lessons-index-view.html',
  styles: ':host { display: contents; }',
})
export class LessonsIndexView {
  private readonly progress = inject(ProgressStore);

  protected readonly lessons = lessons;
  protected readonly totalMinutes = totalDuration;
  protected readonly done = this.progress.done;
  protected readonly total = this.progress.total;
  protected readonly percent = this.progress.percent;

  protected reset(): void {
    this.progress.reset();
  }
}
