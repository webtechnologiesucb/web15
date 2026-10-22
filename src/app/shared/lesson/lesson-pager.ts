// src/app/shared/lesson/lesson-pager.ts
// Navegación "anterior / siguiente" calculada a partir de la posición de la
// lección en `lessons` (los metadatos son la única fuente de verdad).
import { Component, computed, input } from '@angular/core';
import { RouterLink } from '@angular/router';

import { getAdjacentLessons, type Lesson } from '../../data/lessons';

@Component({
  selector: 'app-lesson-pager',
  imports: [RouterLink],
  template: `
    <nav class="pager" aria-label="Navegación entre lecciones">
      @if (previous(); as lesson) {
        <a class="pager__link" [routerLink]="['/lecciones', lesson.id]">
          <small class="dim">← Lección anterior</small>
          <strong>{{ lesson.title }}</strong>
        </a>
      } @else {
        <span class="pager__spacer"></span>
      }

      @if (next(); as lesson) {
        <a class="pager__link pager__link--next" [routerLink]="['/lecciones', lesson.id]">
          <small class="dim">Siguiente lección →</small>
          <strong>{{ lesson.title }}</strong>
        </a>
      }
    </nav>
  `,
  styles: ':host { display: contents; }',
})
export class LessonPager {
  readonly lesson = input.required<Lesson>();

  protected readonly previous = computed(() => getAdjacentLessons(this.lesson().id).previous);
  protected readonly next = computed(() => getAdjacentLessons(this.lesson().id).next);
}
