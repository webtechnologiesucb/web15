// src/app/shared/layout/site-sidebar.ts
// Barra lateral: progreso de la ruta y accesos al explorador de SWAPI.
import { Component, inject, input, output } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

import { RESOURCE_META, RESOURCE_NAMES } from '../../core/api/swapi-types';
import { lessons, type LessonLevel } from '../../data/lessons';
import { ProgressStore } from '../../store/progress-store';
import { ProgressPanel } from '../lesson/progress-panel';
import { BaseBadge, type BadgeTone } from '../ui/base-badge';

@Component({
  selector: 'app-site-sidebar',
  imports: [RouterLink, RouterLinkActive, BaseBadge, ProgressPanel],
  templateUrl: './site-sidebar.html',
  styles: ':host { display: contents; }',
})
export class SiteSidebar {
  private readonly progress = inject(ProgressStore);

  readonly open = input(false);
  /** Avisa al padre para que cierre el menú móvil al navegar. */
  readonly closed = output<void>();

  protected readonly lessons = lessons;
  protected readonly resources = RESOURCE_NAMES;
  protected readonly meta = RESOURCE_META;

  protected readonly levelTone: Record<LessonLevel, BadgeTone> = {
    Inicial: 'success',
    Intermedio: 'primary',
    Avanzado: 'accent',
  };

  protected isCompleted(id: string): boolean {
    return this.progress.isCompleted(id);
  }

  protected pad2(value: number): string {
    return String(value).padStart(2, '0');
  }

  protected close(): void {
    this.closed.emit();
  }
}
