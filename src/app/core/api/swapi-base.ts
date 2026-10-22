// src/app/core/api/swapi-base.ts
// Token de inyección con las bases de SWAPI (lección 04).
//
// El resto de la aplicación no sabe qué URLs se usan: pide `SWAPI_BASE_URLS`
// y el proveedor decide. Cambiar de mirror es cambiar `environment.ts`.
import { InjectionToken } from '@angular/core';

import { environment } from '../../../environments/environment';

/** Bases de SWAPI, ya normalizadas (sin barra final y sin repetidas). */
export const SWAPI_BASE_URLS = new InjectionToken<readonly string[]>('SWAPI_BASE_URLS', {
  providedIn: 'root',
  factory: () => resolveSwapiBases(),
});

export function resolveSwapiBases(): string[] {
  const candidates = [environment.swapiBaseUrl, ...environment.swapiFallbackUrls];
  const normalized = candidates
    .filter((base): base is string => typeof base === 'string' && base.trim().length > 0)
    .map((base) => base.trim().replace(/\/+$/, ''));
  return [...new Set(normalized)];
}
