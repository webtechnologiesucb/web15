// src/app/core/api/swapi-service.ts
// Acceso tipado a SWAPI (lecciones 03 y 04).
//
// Los servicios devuelven Observables de RxJS; las vistas los convierten en
// signals con `httpResource` o `toSignal`. Escriben rutas relativas y el
// SwapiInterceptor se encarga de la base real y de los mirrors.
import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import type { Observable } from 'rxjs';

import type { ResourceName, SwapiListResponse, SwapiResources } from './swapi-types';

@Injectable({ providedIn: 'root' })
export class SwapiService {
  private readonly http = inject(HttpClient);

  /** Lista paginada de un recurso; `search` filtra en el servidor (`?search=`). */
  list<K extends ResourceName>(
    resource: K,
    page = 1,
    search = '',
  ): Observable<SwapiListResponse<SwapiResources[K]>> {
    let params = new HttpParams();
    if (page > 1) params = params.set('page', String(page));
    const term = search.trim();
    if (term.length > 0) params = params.set('search', term);

    return this.http.get<SwapiListResponse<SwapiResources[K]>>(`/${resource}/`, { params });
  }

  /** Un recurso concreto por id: `detail('planets', 1)`. */
  detail<K extends ResourceName>(resource: K, id: string | number): Observable<SwapiResources[K]> {
    return this.http.get<SwapiResources[K]>(`/${resource}/${id}/`);
  }

  /**
   * Sigue una URL absoluta devuelta por SWAPI (`homeworld`, `films`, `next`...).
   * El interceptor reconoce el patrón `/api/...` y aplica los mirrors.
   */
  byUrl<T>(url: string): Observable<T> {
    return this.http.get<T>(url);
  }
}
