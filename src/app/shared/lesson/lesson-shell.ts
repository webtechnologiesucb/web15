// src/app/shared/lesson/lesson-shell.ts
// Marco común de todas las lecciones: cabecera con metadatos, el contenido que
// proyecta cada lección, los retos y la navegación anterior/siguiente.
import { Component, computed, inject, input } from '@angular/core';

import type { Lesson } from '../../data/lessons';
import { ProgressStore } from '../../store/progress-store';
import { BaseBadge } from '../ui/base-badge';
import { BaseButton } from '../ui/base-button';
import { ChallengeList } from './challenge-list';
import { LessonPager } from './lesson-pager';

@Component({
  selector: 'app-lesson-shell',
  imports: [BaseBadge, BaseButton, ChallengeList, LessonPager],
  templateUrl: './lesson-shell.html',
  styles: ':host { display: contents; }',
})
export class LessonShell {
  private readonly progress = inject(ProgressStore);

  readonly lesson = input.required<Lesson>();

  protected readonly done = computed(() => this.progress.isCompleted(this.lesson().id));

  protected toggleDone(): void {
    this.progress.toggle(this.lesson().id);
  }
}
