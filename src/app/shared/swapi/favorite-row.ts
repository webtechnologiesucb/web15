// src/app/shared/swapi/favorite-row.ts
// Una fila de la lista de favoritos. Como los favoritos se guardan como URL,
// la fila resuelve por su cuenta el nombre del recurso (lecciones 03 y 06).
import { httpResource } from '@angular/common/http';
import { Component, computed, inject, input } from '@angular/core';
import { RouterLink } from '@angular/router';

import { idFromUrl, resourceFromUrl, titleOf } from '../../core/api/swapi-format';
import { RESOURCE_META, type SwapiItem } from '../../core/api/swapi-types';
import { FavoritesStore } from '../../store/favorites-store';
import { BaseButton } from '../ui/base-button';

@Component({
  selector: 'app-favorite-row',
  imports: [RouterLink, BaseButton],
  templateUrl: './favorite-row.html',
  styles: ':host { display: contents; }',
})
export class FavoriteRow {
  private readonly favorites = inject(FavoritesStore);

  readonly url = input.required<string>();

  protected readonly resource = computed(() => resourceFromUrl(this.url()));
  protected readonly id = computed(() => idFromUrl(this.url()));

  protected readonly icon = computed(() => {
    const resource = this.resource();
    return resource === undefined ? '•' : RESOURCE_META[resource].icon;
  });

  protected readonly kind = computed(() => {
    const resource = this.resource();
    return resource === undefined ? 'Recurso' : RESOURCE_META[resource].singular;
  });

  protected readonly link = computed<string[]>(() => {
    const resource = this.resource();
    return resource === undefined ? ['/'] : ['/', resource, this.id()];
  });

  private readonly detail = httpResource<SwapiItem>(() => ({ url: this.url() }));

  protected readonly title = computed(() => {
    const item = this.detail.value();
    return item === undefined ? `#${this.id()}` : titleOf(item);
  });

  protected readonly state = computed(() => {
    if (this.detail.isLoading()) return 'cargando…';
    if (this.detail.error()) return 'no disponible';
    return '';
  });

  protected remove(): void {
    this.favorites.remove(this.url());
  }
}
