import type { Type } from '@angular/core';
import type { Routes } from '@angular/router';

import { lessons } from './data/lessons';

/**
 * Tabla explícita «id de lección -> componente».
 *
 * Con `loadComponent` cada lección se descarga en su propio chunk: la portada
 * no arrastra el código de las otras nueve (lecciones 05 y 09).
 */
const lessonLoaders: Record<string, () => Promise<Type<unknown>>> = {
  '01-componentes-y-plantillas': () =>
    import('./lessons/01-componentes-y-plantillas/lesson').then((m) => m.Lesson01Componentes),
  '02-signals-y-estado': () =>
    import('./lessons/02-signals-y-estado/lesson').then((m) => m.Lesson02Signals),
  '03-datos-asincronos': () =>
    import('./lessons/03-datos-asincronos/lesson').then((m) => m.Lesson03DatosAsincronos),
  '04-servicios-di': () => import('./lessons/04-servicios-di/lesson').then((m) => m.Lesson04ServiciosDi),
  '05-router': () => import('./lessons/05-router/lesson').then((m) => m.Lesson05Router),
  '06-estado-global': () =>
    import('./lessons/06-estado-global/lesson').then((m) => m.Lesson06EstadoGlobal),
  '07-formularios': () => import('./lessons/07-formularios/lesson').then((m) => m.Lesson07Formularios),
  '08-composicion-di': () =>
    import('./lessons/08-composicion-di/lesson').then((m) => m.Lesson08ComposicionDi),
  '09-animaciones-ux': () =>
    import('./lessons/09-animaciones-ux/lesson').then((m) => m.Lesson09AnimacionesUx),
  '10-rendimiento': () => import('./lessons/10-rendimiento/lesson').then((m) => m.Lesson10Rendimiento),
};

/** Las diez lecciones se derivan de `data/lessons.ts`: una sola fuente de verdad. */
const lessonRoutes: Routes = lessons.map((lesson) => ({
  path: `lecciones/${lesson.id}`,
  title: `Lección ${String(lesson.order).padStart(2, '0')} · ${lesson.title} · Ruta Angular`,
  loadComponent: lessonLoaders[lesson.id],
}));

export const routes: Routes = [
  {
    path: '',
    title: 'Ruta de aprendizaje Angular · SWAPI',
    loadComponent: () => import('./views/home-view').then((m) => m.HomeView),
  },
  {
    path: 'lecciones',
    title: 'Las 10 lecciones · Ruta Angular',
    loadComponent: () => import('./views/lessons-index-view').then((m) => m.LessonsIndexView),
  },
  ...lessonRoutes,
  {
    // Un id de lección que no existe: mejor un 404 honesto que una ficha vacía.
    path: 'lecciones/:id',
    title: 'Lección no encontrada · Ruta Angular',
    loadComponent: () => import('./views/not-found-view').then((m) => m.NotFoundView),
  },
  {
    path: 'favoritos',
    title: 'Favoritos · Ruta Angular',
    loadComponent: () => import('./views/favorites-view').then((m) => m.FavoritesView),
  },
  {
    // Rutas con parámetros: /people, /planets, /films… (lección 05).
    path: ':resource',
    title: 'Explorador de SWAPI · Ruta Angular',
    loadComponent: () => import('./views/resource-list-view').then((m) => m.ResourceListView),
  },
  {
    path: ':resource/:id',
    title: 'Ficha de SWAPI · Ruta Angular',
    loadComponent: () => import('./views/resource-detail-view').then((m) => m.ResourceDetailView),
  },
  {
    path: '**',
    title: 'Página no encontrada · Ruta Angular',
    loadComponent: () => import('./views/not-found-view').then((m) => m.NotFoundView),
  },
];
