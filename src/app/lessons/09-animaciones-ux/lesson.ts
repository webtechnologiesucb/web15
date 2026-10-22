import { Component } from '@angular/core';

import { requireLesson } from '../../data/lessons';
import { LessonShell } from '../../shared/lesson/lesson-shell';

@Component({
  selector: 'app-lesson-09',
  imports: [LessonShell],
  template: '<app-lesson-shell [lesson]="lesson"><p class="dim">En construccion.</p></app-lesson-shell>',
})
export class Lesson09AnimacionesUx {
  protected readonly lesson = requireLesson('09-animaciones-ux');
}