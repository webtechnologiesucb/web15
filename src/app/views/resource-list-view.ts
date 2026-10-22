// src/app/views/resource-list-view.ts
// Explorador: listado paginado y búsqueda de cualquiera de los 5 recursos.
//
// Es el ejemplo "de verdad" de las lecciones 02, 03, 05 y 07: el parámetro de
// ruta entra como input, los tres estados se pintan sin ifs anidados y la
// página se reinicia sola con `linkedSignal` cuando cambia el recurso.
import { httpResource } from '@angular/common/http';
import { Component, computed, input, linkedSignal, signal } from '@angular/core';
import { RouterLink } from '@angular/router';

import { describeSwapiError } from '../core/api/swapi-error';
import {
  RESOURCE_META,
  RESOURCE_NAMES,
  isResourceName,
  type ResourceName,
  type SwapiItem,
  type SwapiListResponse,
} from '../core/api/swapi-types';
import { ResourceCard } from '../shared/swapi/resource-card';
import { BaseButton } from '../shared/ui/base-button';
import { EmptyState } from '../shared/ui/empty-state';
import { ErrorState } from '../shared/ui/error-state';
import { LoadingState } from '../shared/ui/loading-state';
import { PaginationBar } from '../shared/ui/pagination-bar';

/** SWAPI devuelve 10 elementos por página. */
const PAGE_SIZE = 10;

@Component({
  selector: 'app-resource-list-view',
  imports: [
    RouterLink,
    BaseButton,
    ResourceCard,
    PaginationBar,
    LoadingState,
    ErrorState,
    EmptyState,
  ],
  templateUrl: './resource-list-view.html',
  styles: ':host { display: contents; }',
})
export class ResourceListView {
  /** `:resource` llega aquí gracias a `withComponentInputBinding()` (lección 05). */
  readonly resource = input.required<string>();

  protected readonly options = RESOURCE_NAMES;
  protected readonly meta = RESOURCE_META;

  /** Del parámetro (texto) al recurso validado. */
  protected readonly name = computed<ResourceName | null>(() => {
    const value = this.resource();
    return isResourceName(value) ? value : null;
  });

  protected readonly currentMeta = computed(() => {
    const name = this.name();
    return name === null ? null : RESOURCE_META[name];
  });

  /** Texto que escribe el usuario y término ya aplicado (se aplica al enviar). */
  protected readonly searchInput = linkedSignal<string, string>({
    source: () => this.name() ?? '',
    computation: () => '',
  });
  protected readonly search = linkedSignal<string, string>({
    source: () => this.name() ?? '',
    computation: () => '',
  });

  /**
   * `linkedSignal` con `source`: vuelve a 1 cuando cambia el recurso o la
   * búsqueda, pero sigue siendo escribible por la paginación.
   */
  protected readonly page = linkedSignal<string, number>({
    source: () => `${this.name() ?? ''}|${this.search()}`,
    computation: () => 1,
  });

  /** El recurso HTTP de Angular: valor, estado y error son signals. */
  protected readonly list = httpResource<SwapiListResponse<SwapiItem>>(() => {
    const name = this.name();
    if (name === null) return undefined; // sin petición

    const params: Record<string, string> = {};
    if (this.page() > 1) params['page'] = String(this.page());
    if (this.search().length > 0) params['search'] = this.search();

    return { url: `/${name}/`, params };
  });

  protected readonly items = computed(() => this.list.value()?.results ?? []);
  protected readonly total = computed(() => this.list.value()?.count ?? 0);
  protected readonly totalPages = computed(() => Math.max(1, Math.ceil(this.total() / PAGE_SIZE)));
  protected readonly errorMessage = computed(() => describeSwapiError(this.list.error()));

  protected onSearchInput(event: Event): void {
    this.searchInput.set((event.target as HTMLInputElement).value);
  }

  protected applySearch(event: Event): void {
    event.preventDefault();
    this.search.set(this.searchInput().trim());
  }

  protected clearSearch(): void {
    this.searchInput.set('');
    this.search.set('');
  }

  protected reload(): void {
    this.list.reload();
  }
}
