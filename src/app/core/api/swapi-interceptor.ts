// src/app/core/api/swapi-interceptor.ts
// Interceptor funcional de Angular: reescribe las rutas de SWAPI contra la base
// configurada y, si esa base falla, reintenta con los mirrors públicos.
//
// Es la versión Angular de `src/api/http.ts` de web14: la lógica de red vive en
// un único sitio y los servicios escriben rutas relativas ("/people/1/").
import { type HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, throwError } from 'rxjs';

import { SWAPI_BASE_URLS } from './swapi-base';
import { isRetriableError } from './swapi-error';

/**
 * Devuelve la ruta relativa a la raíz de la API, o `null` si la URL no es de
 * SWAPI (en ese caso se deja pasar sin tocar).
 *
 *   '/people/1/'                              -> '/people/1/'
 *   'https://swapi.dev/api/films/2/'          -> '/films/2/'
 */
export function swapiPathOf(url: string): string | null {
  if (url.startsWith('/')) return url;
  const match = /^https?:\/\/[^/]+\/api(\/.*)?$/.exec(url);
  return match ? (match[1] ?? '/') : null;
}

export const swapiInterceptor: HttpInterceptorFn = (request, next) => {
  const path = swapiPathOf(request.url);
  if (path === null) return next(request);

  const bases = inject(SWAPI_BASE_URLS);
  if (bases.length === 0) return next(request);

  const attempt = (index: number): ReturnType<typeof next> => {
    const base = bases[index] ?? bases[0];
    return next(request.clone({ url: `${base}${path}` })).pipe(
      catchError((error: unknown) => {
        const hasNextMirror = index + 1 < bases.length;
        return hasNextMirror && isRetriableError(error) ? attempt(index + 1) : throwError(() => error);
      }),
    );
  };

  return attempt(0);
};
