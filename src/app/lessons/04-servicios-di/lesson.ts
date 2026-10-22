// src/app/lessons/04-servicios-di/lesson.ts
// Lección 04 · Servicios e inyección de dependencias
import { Component, computed, inject, signal } from '@angular/core';

import { SWAPI_BASE_URLS } from '../../core/api/swapi-base';
import { SwapiService } from '../../core/api/swapi-service';
import { requireLesson } from '../../data/lessons';
import { LessonShell } from '../../shared/lesson/lesson-shell';
import { BaseButton } from '../../shared/ui/base-button';
import { BaseCard } from '../../shared/ui/base-card';
import { CodeBlock } from '../../shared/ui/code-block';

@Component({
  selector: 'app-lesson-04',
  imports: [LessonShell, BaseCard, BaseButton, CodeBlock],
  templateUrl: './lesson.html',
  styles: ':host { display: contents; }',
})
export class Lesson04ServiciosDi {
  protected readonly lesson = requireLesson('04-servicios-di');

  private readonly swapi = inject(SwapiService);
  protected readonly bases = inject(SWAPI_BASE_URLS);

  protected readonly count = signal(0);

  protected incrementar(): void {
    this.count.update((v) => v + 1);
  }

  protected readonly serviceSnippet = `@Injectable({ providedIn: 'root' })
export class SwapiService {
  private readonly http = inject(HttpClient);
  
  list<K extends ResourceName>(resource: K, page = 1, search = '') {
    // ...
    return this.http.get<SwapiListResponse<SwapiResources[K]>>(\`/\${resource}/\`, { params });
  }
}`,

  protected readonly injectSnippet = `// Inyección con inject() (moderna)
private readonly swapi = inject(SwapiService);

// Uso
this.swapi.list('people', 1).subscribe(...);`,

  protected readonly tokenSnippet = `export const SWAPI_BASE_URLS = new InjectionToken<readonly string[]>('SWAPI_BASE_URLS', {
  providedIn: 'root',
  factory: () => resolveSwapiBases(),
});

// Inyectar
private readonly bases = inject(SWAPI_BASE_URLS);`,

  protected readonly genericsSnippet = `// Genéricos que deducen el tipo
list<K extends ResourceName>(resource: K): Observable<SwapiListResponse<SwapiResources[K]>> {
  return this.http.get<SwapiListResponse<SwapiResources[K]>>(\`/\${resource}/\`);
}

// TypeScript deduce automáticamente el tipo correcto`;
}