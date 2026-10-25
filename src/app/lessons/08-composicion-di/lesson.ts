// src/app/lessons/08-composicion-di/lesson.ts
// Lección 08 · Composición, directivas e inyección
//
// Una tarjeta con varios slots, una directiva de atributo con host bindings,
// una directiva estructural mínima y un provider local que sólo afecta a un
// subárbol. Son las cuatro piezas que permiten componer sin duplicar.
import { Component, inject, signal } from '@angular/core';

import { SWAPI_BASE_URLS } from '../../core/api/swapi-base';
import { requireLesson } from '../../data/lessons';
import { LessonShell } from '../../shared/lesson/lesson-shell';
import { BaseBadge } from '../../shared/ui/base-badge';
import { BaseButton } from '../../shared/ui/base-button';
import { BaseCard } from '../../shared/ui/base-card';
import { CodeBlock } from '../../shared/ui/code-block';
import { ComposedCard } from './composed-card';
import { HighlightDirective, type HighlightTone } from './highlight';
import { LocalProviderDemo } from './local-provider-demo';
import { RepeatDirective } from './repeat';

@Component({
  selector: 'app-lesson-08',
  imports: [
    LessonShell,
    ComposedCard,
    HighlightDirective,
    RepeatDirective,
    LocalProviderDemo,
    BaseCard,
    BaseBadge,
    BaseButton,
    CodeBlock,
  ],
  templateUrl: './lesson.html',
  styles: ':host { display: contents; }',
})
export class Lesson08ComposicionDi {
  protected readonly lesson = requireLesson('08-composicion-di');

  /** Configuración root (la que usa el resto de la aplicación). */
  protected readonly rootBases = inject(SWAPI_BASE_URLS);

  protected readonly tone = signal<HighlightTone>('accent');
  protected readonly repeatCount = signal(3);
  protected readonly showIcon = signal(true);

  protected readonly tones: HighlightTone[] = ['accent', 'primary', 'danger'];

  protected setTone(tone: HighlightTone): void {
    this.tone.set(tone);
  }

  protected setRepeat(count: number): void {
    this.repeatCount.set(count);
  }

  protected toggleIcon(): void {
    this.showIcon.update((visible) => !visible);
  }

  protected readonly projectionSnippet = `<!-- El consumidor decide qué va en cada hueco -->
<app-composed-card title="Tarjeta compuesta">
  <span card-icon>✦</span>

  <span card-actions>acciones</span>

  <p>Contenido por defecto (sin select).</p>

  <button card-footer>Pie</button>
</app-composed-card>

<!-- Dentro del componente -->
<ng-content select="[card-icon]" />
<ng-content select="[card-actions]" />
<ng-content />                      <!-- contenido por defecto -->
<ng-content select="[card-footer]" />`;

  protected readonly contentChildSnippet = `// Consulta el contenido proyectado por el padre
protected readonly highlight = contentChild(HighlightDirective);
protected readonly marked = computed(() => this.highlight() !== undefined);

// La plantilla reacciona cuando el padre añade o quita el elemento
@if (highlight(); as directive) {
  <small>tono {{ directive.appHighlight() }}</small>
}`;

  protected readonly directiveSnippet = `@Directive({
  selector: '[appHighlight]',
  host: {
    '[class.l08-highlight]': 'true',
    '[style.border-color]': 'color()',
    '[style.color]': 'color()',
  },
})
export class HighlightDirective {
  readonly appHighlight = input<'accent' | 'primary' | 'danger'>('accent');
  protected readonly color = computed(() => /* var(--accent), ... */);
}`;

  protected readonly structuralSnippet = `@Directive({ selector: '[appRepeat]' })
export class RepeatDirective {
  private readonly template = inject(TemplateRef);
  private readonly viewContainer = inject(ViewContainerRef);
  readonly appRepeat = input(1, { transform: numberAttribute });

  constructor() {
    effect(() => {
      this.viewContainer.clear();
      for (let i = 0; i < this.appRepeat(); i += 1) {
        this.viewContainer.createEmbeddedView(this.template, { $implicit: i });
      }
    });
  }
}

// Uso: el asterisco crea el <ng-template>
<li *appRepeat="3; let i = $index">Elemento {{ i + 1 }}</li>`;

  protected readonly providersSnippet = `@Component({
  selector: 'app-local-provider-demo',
  providers: [
    // Sólo este componente y sus hijos ven este valor
    { provide: SWAPI_BASE_URLS, useValue: ['https://local.example/api'] },
  ],
  template: '<code>{{ bases.join(", ") }}</code>',
})
export class LocalProviderDemo {
  protected readonly bases = inject(SWAPI_BASE_URLS);
}`;

  protected readonly encapsulationSnippet = `@Component({
  selector: 'app-composed-card',
  encapsulation: ViewEncapsulation.Emulated, // el valor por defecto
  styles: \`
    .composed-card { border: 1px solid var(--border); }
  \`,
})
export class ComposedCard {}

// Los estilos de este componente no afectan a .composed-card de fuera.
// NgDeep rompería esa garantía; casi nunca hace falta.`;
}
