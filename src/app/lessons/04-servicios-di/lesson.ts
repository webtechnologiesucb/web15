// src/app/lessons/04-servicios-di/lesson.ts
// Lección 04 · Servicios e inyección de dependencias
//
// El componente no crea el servicio con `new`: lo pide al inyector con
// `inject()`. Como SwapiService es `providedIn: 'root'`, todas las peticiones
// comparten la misma instancia y la misma configuración.
import { Component, computed, inject, signal } from '@angular/core';
import { firstValueFrom } from 'rxjs';

import { SWAPI_BASE_URLS } from '../../core/api/swapi-base';
import { describeSwapiError } from '../../core/api/swapi-error';
import { SwapiService } from '../../core/api/swapi-service';
import type { Person } from '../../core/api/swapi-types';
import { requireLesson } from '../../data/lessons';
import { LessonShell } from '../../shared/lesson/lesson-shell';
import { BaseBadge } from '../../shared/ui/base-badge';
import { BaseButton } from '../../shared/ui/base-button';
import { BaseCard } from '../../shared/ui/base-card';
import { CodeBlock } from '../../shared/ui/code-block';
import { ErrorState } from '../../shared/ui/error-state';
import { LoadingState } from '../../shared/ui/loading-state';

type LoadState = 'idle' | 'loading' | 'success' | 'error';

@Component({
  selector: 'app-lesson-04',
  imports: [
    LessonShell,
    BaseCard,
    BaseBadge,
    BaseButton,
    CodeBlock,
    LoadingState,
    ErrorState,
  ],
  templateUrl: './lesson.html',
  styles: ':host { display: contents; }',
})
export class Lesson04ServiciosDi {
  protected readonly lesson = requireLesson('04-servicios-di');

  /** El servicio se inyecta; el componente no sabe cómo se construye. */
  private readonly swapi = inject(SwapiService);

  /** La misma petición al inyector devuelve la misma instancia (singleton). */
  private readonly swapiAgain = inject(SwapiService);
  protected readonly isSingleton = this.swapi === this.swapiAgain;

  /** La configuración también es una dependencia: un InjectionToken. */
  protected readonly bases = inject(SWAPI_BASE_URLS);

  protected readonly state = signal<LoadState>('idle');
  protected readonly people = signal<Person[]>([]);
  protected readonly total = signal(0);
  protected readonly errorMsg = signal('');
  protected readonly loadedOnce = computed(() => this.state() === 'success');

  protected async loadPeople(): Promise<void> {
    this.state.set('loading');
    this.errorMsg.set('');

    try {
      // El genérico de `list` deduce Person[] a partir de 'people'.
      const page = await firstValueFrom(this.swapi.list('people', 1));
      this.people.set(page.results);
      this.total.set(page.count);
      this.state.set('success');
    } catch (error) {
      this.errorMsg.set(describeSwapiError(error));
      this.state.set('error');
    }
  }

  protected readonly serviceSnippet = `@Injectable({ providedIn: 'root' })
export class SwapiService {
  private readonly http = inject(HttpClient);

  list<K extends ResourceName>(resource: K, page = 1, search = '') {
    const params = new HttpParams({ fromObject: { page, search } });
    return this.http.get<SwapiListResponse<SwapiResources[K]>>(\`/\${resource}/\`, { params });
  }
}`;

  protected readonly injectSnippet = `// Inyección moderna: se pide en el campo, sin constructor
private readonly swapi = inject(SwapiService);

// pedir dos veces el mismo token devuelve la misma instancia
private readonly same = inject(SwapiService);

// Uso
const page = await firstValueFrom(this.swapi.list('people', 1));`;

  protected readonly tokenSnippet = `export const SWAPI_BASE_URLS = new InjectionToken<readonly string[]>('SWAPI_BASE_URLS', {
  providedIn: 'root',
  factory: () => resolveSwapiBases(),
});

// Cualquier componente puede leer la configuración sin conocerla
protected readonly bases = inject(SWAPI_BASE_URLS);`;

  protected readonly genericsSnippet = `// El mapa recurso -> entidad hace que K deduzca el tipo de retorno
list<K extends ResourceName>(
  resource: K,
): Observable<SwapiListResponse<SwapiResources[K]>> {
  return this.http.get<SwapiListResponse<SwapiResources[K]>>(\`/\${resource}/\`);
}

// this.swapi.list('people')  -> Observable<SwapiListResponse<Person>>
// this.swapi.list('planets') -> Observable<SwapiListResponse<Planet>>`;

  protected readonly hierarchySnippet = `// Jerarquía de inyectores (de más cercano a más lejano)
// 1. providers: [...] del componente
// 2. providers del componente padre
// 3. providedIn: 'root' (la aplicación)
//
// Un provider local crea otra instancia sólo para ese subárbol:
// providers: [{ provide: SwapiService, useClass: SwapiServiceFalso }]`;
}
