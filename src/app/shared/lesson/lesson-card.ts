// src/app/shared/lesson/lesson-card.ts
// Tarjeta de una lección: se reutiliza en la portada y en el índice.
//
// Recibe la lección como `input.required` y consulta el progreso global, así
// que el estado completado siempre está al día sin pasar props de más.
import { Component, computed, inject, input } from '@angular/core';
import { RouterLink } from '@angular/router';

import type { Lesson, LessonLevel } from '../../data/lessons';
import { ProgressStore } from '../../store/progress-store';
import { BaseBadge, type BadgeTone } from '../ui/base-badge';

@Component({
  selector: 'app-lesson-card',
  imports: [RouterLink, BaseBadge],
  templateUrl: './lesson-card.html',
  styles: ':host { display: contents; }',
})
export class LessonCard {
  private readonly progress = inject(ProgressStore);

  readonly lesson = input.required<Lesson>();

  protected readonly done = computed(() => this.progress.isCompleted(this.lesson().id));

  protected readonly levelTone: Record<LessonLevel, BadgeTone> = {
    Inicial: 'success',
    Intermedio: 'primary',
    Avanzado: 'accent',
  };

  protected pad2(value: number): string {
    return String(value).padStart(2, '0');
  }
}
