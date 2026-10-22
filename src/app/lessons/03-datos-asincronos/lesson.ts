// src/app/lessons/03-datos-asincronos/lesson.ts
// Lección 03 · Datos asíncronos con HttpClient
import { httpResource } from '@angular/common/http';
import { Component, computed, signal } from '@angular/core';

import { describeSwapiError } from '../../core/api/swapi-error';
import { requireLesson } from '../../data/lessons';
import { LessonShell } from '../../shared/lesson/lesson-shell';
import { BaseButton } from '../../shared/ui/base-button';
import { BaseCard } from '../../shared/ui/base-card';
import { CodeBlock } from '../../shared/ui/code-block';
import { EmptyState } from '../../shared/ui/empty-state';
import { ErrorState } from '../../shared/ui/error-state';
import { LoadingState } from '../../shared/ui/loading-state';

interface Person {
  name: string;
  height: string;
  mass: string;
  gender: string;
  birth_year: string;
  url: string;
}

@Component({
  selector: 'app-lesson-03',
  imports: [LessonShell, BaseCard, BaseButton, CodeBlock, LoadingState, ErrorState, EmptyState],
  templateUrl: './lesson.html',
  styles: ':host { display: contents; }',
})
export class Lesson03DatosAsincronos {
  protected readonly lesson = requireLesson('03-datos-asincronos');

  protected readonly id = signal(1);
  private start = 0;

  protected readonly person = httpResource<Person>(() => ({ url: `/people/${this.id()}/` }));

  protected readonly status = computed(() => {
    if (this.person.isLoading()) return 'loading';
    if (this.person.error()) return 'error';
    if (this.person.hasValue()) return 'success';
    return 'idle';
  });

  protected readonly errorMsg = computed(() => describeSwapiError(this.person.error()));

  protected next(): void {
    this.id.update((v) => Math.min(10, v + 1));
  }

  protected prev(): void {
    this.id.update((v) => Math.max(1, v - 1));
  }

  protected reload(): void {
    this.start = performance.now();
    this.person.reload();
  }

  protected readonly httpSnippet = `// app.config.ts
provideHttpClient(withFetch(), withInterceptors([swapiInterceptor]))`,

  protected readonly resourceSnippet = `// En el componente
person = httpResource<Person>(() => ({ url: \`/people/\${this.id()}/\` }));

// Estados
person.isLoading()
person.hasValue()
person.error()
person.value() // datos

// Recargar
person.reload();`,

  protected readonly statesSnippet = `// Tres estados a manejar:
// - Cargando: isLoading()
// - Éxito: hasValue() con value()
// - Error: error() con mensaje legible`;
}