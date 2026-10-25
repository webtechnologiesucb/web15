// src/app/lessons/05-router/lesson.ts
// Lección 05 · Router
//
// La demo usa el router real de la aplicación: los chips navegan al explorador
// (RouterLink + RouterLinkActive) y los botones cambian el query param `demo`
// sin salir de la lección, para poder observar la URL y el estado activo.
import { Component, computed, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import {
  NavigationEnd,
  Router,
  RouterLink,
  RouterLinkActive,
  ActivatedRoute,
} from '@angular/router';
import { filter } from 'rxjs';

import { RESOURCE_META, RESOURCE_NAMES, type ResourceName } from '../../core/api/swapi-types';
import { requireLesson } from '../../data/lessons';
import { LessonShell } from '../../shared/lesson/lesson-shell';
import { BaseBadge } from '../../shared/ui/base-badge';
import { BaseButton } from '../../shared/ui/base-button';
import { BaseCard } from '../../shared/ui/base-card';
import { CodeBlock } from '../../shared/ui/code-block';

interface RouteRow {
  path: string;
  title: string;
  component: string;
}

const ROUTE_ROWS: RouteRow[] = [
  { path: '', title: 'Ruta de aprendizaje Angular · SWAPI', component: 'HomeView' },
  { path: 'lecciones', title: 'Las 10 lecciones · Ruta Angular', component: 'LessonsIndexView' },
  {
    path: 'lecciones/:id',
    title: 'Lección NN · Ruta Angular',
    component: 'LessonNN… (lazy)',
  },
  { path: 'favoritos', title: 'Favoritos · Ruta Angular', component: 'FavoritesView' },
  { path: ':resource', title: 'Explorador de SWAPI · Ruta Angular', component: 'ResourceListView' },
  {
    path: ':resource/:id',
    title: 'Ficha de SWAPI · Ruta Angular',
    component: 'ResourceDetailView',
  },
  { path: '**', title: 'Página no encontrada · Ruta Angular', component: 'NotFoundView' },
];

@Component({
  selector: 'app-lesson-05',
  imports: [
    LessonShell,
    RouterLink,
    RouterLinkActive,
    BaseCard,
    BaseBadge,
    BaseButton,
    CodeBlock,
  ],
  templateUrl: './lesson.html',
  styles: ':host { display: contents; }',
})
export class Lesson05Router {
  protected readonly lesson = requireLesson('05-router');

  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);

  private readonly navigationEnd = toSignal(
    this.router.events.pipe(filter((event): event is NavigationEnd => event instanceof NavigationEnd)),
    { initialValue: null },
  );

  protected readonly resources = RESOURCE_NAMES;
  protected readonly meta = RESOURCE_META;
  protected readonly routeRows = ROUTE_ROWS;

  /** La URL actual, actualizada con cada NavigationEnd. */
  protected readonly currentUrl = computed(() => {
    this.navigationEnd(); // dependencia: cada navegación recalcula la URL
    return this.router.url;
  });

  protected readonly queryParams = computed(
    () => this.router.parseUrl(this.currentUrl()).queryParams,
  );

  protected readonly demoResource = computed<ResourceName>(() => {
    const value = this.queryParams()['demo'];
    return RESOURCE_NAMES.find((name) => name === value) ?? 'people';
  });

  protected readonly demoMeta = computed(() => RESOURCE_META[this.demoResource()]);

  /** Navegación programática que sólo cambia el query param. */
  protected setDemo(resource: ResourceName): void {
    void this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { demo: resource },
      queryParamsHandling: 'merge',
    });
  }

  protected clearDemo(): void {
    void this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { demo: null },
      queryParamsHandling: 'merge',
    });
  }

  protected readonly configSnippet = `// app.config.ts
provideRouter(
  routes,
  withComponentInputBinding(), // :resource y :id llegan como inputs
  withInMemoryScrolling({ scrollPositionRestoration: 'top' }),
);`;

  protected readonly routesSnippet = `const lessonRoutes: Routes = lessons.map((lesson) => ({
  path: \`lecciones/\${lesson.id}\`,
  title: \`Lección \${lesson.order} · \${lesson.title}\`,
  loadComponent: lessonLoaders[lesson.id], // un chunk por lección
}));

export const routes: Routes = [
  { path: '', loadComponent: () => import('./views/home-view')... },
  ...lessonRoutes,
  { path: ':resource', loadComponent: () => import('./views/resource-list-view')... },
  { path: ':resource/:id', loadComponent: () => import('./views/resource-detail-view')... },
  { path: '**', loadComponent: () => import('./views/not-found-view')... },
];`;

  protected readonly paramsSnippet = `// La ruta ':resource' se enlaza con el input del componente.
// No hace falta leer ActivatedRoute a mano.
export class ResourceListView {
  readonly resource = input.required<string>();

  protected readonly name = computed(() => {
    const value = this.resource();
    return isResourceName(value) ? value : null;
  });
}`;

  protected readonly linksSnippet = `<!-- Enlaces declarativos -->
<a routerLink="/lecciones" routerLinkActive="active">Lecciones</a>
<a [routerLink]="['/', resource, id]">Ficha</a>

<!-- Con query params y fragmento -->
<a [routerLink]="[]" [queryParams]="{ demo: 'people' }">Demo</a>

<!-- Navegación programática -->
this.router.navigate(['/people', 1], { queryParams: { page: 2 } });`;

  protected readonly titleSnippet = `// El título se configura en la ruta, no en el componente
{ path: 'favoritos', title: 'Favoritos · Ruta Angular', loadComponent: ... }

// La ruta comodín debe ir siempre la última
{ path: '**', loadComponent: () => import('./views/not-found-view')... }`;
}
