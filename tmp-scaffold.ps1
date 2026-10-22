$data = @(
  @('02-signals-y-estado', 'Lesson02Signals',         '02-signals-y-estado'),
  @('03-datos-asincronos', 'Lesson03DatosAsincronos', '03-datos-asincronos'),
  @('04-servicios-di',     'Lesson04ServiciosDi',     '04-servicios-di'),
  @('05-router',           'Lesson05Router',          '05-router'),
  @('06-estado-global',    'Lesson06EstadoGlobal',    '06-estado-global'),
  @('07-formularios',      'Lesson07Formularios',     '07-formularios'),
  @('08-composicion-di',   'Lesson08ComposicionDi',   '08-composicion-di'),
  @('09-animaciones-ux',   'Lesson09AnimacionesUx',   '09-animaciones-ux'),
  @('10-rendimiento',      'Lesson10Rendimiento',     '10-rendimiento')
)

$template = @'
import { Component } from '@angular/core';

import { requireLesson } from '../../data/lessons';
import { LessonShell } from '../../shared/lesson/lesson-shell';

@Component({
  selector: 'app-lesson-__NUM__',
  imports: [LessonShell],
  template: '<app-lesson-shell [lesson]="lesson"><p class="dim">En construccion.</p></app-lesson-shell>',
})
export class __CLASS__ {
  protected readonly lesson = requireLesson('__ID__');
}
'@

$root = 'C:\developer\web15\src\app\lessons'

foreach ($row in $data) {
  $dir = Join-Path $root $row[0]
  New-Item -ItemType Directory -Force -Path $dir | Out-Null
  $num = $row[0].Substring(0, 2)
  $content = $template.Replace('__NUM__', $num).Replace('__CLASS__', $row[1]).Replace('__ID__', $row[2])
  [System.IO.File]::WriteAllText((Join-Path $dir 'lesson.ts'), $content)
  Write-Output "creado $($row[0])"
}
