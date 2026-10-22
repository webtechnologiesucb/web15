import { Component } from '@angular/core';

import { requireLesson } from '../../data/lessons';
import { LessonShell } from '../../shared/lesson/lesson-shell';

@Component({
  selector: 'app-lesson-07',
  imports: [LessonShell],
  template: '<app-lesson-shell [lesson]="lesson"><p class="dim">En construccion.</p></app-lesson-shell>',
})
export class Lesson07Formularios {
  protected readonly lesson = requireLesson('07-formularios');
}