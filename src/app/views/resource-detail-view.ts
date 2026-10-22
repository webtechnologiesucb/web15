// src/app/views/resource-detail-view.ts
// Ficha de un recurso concreto: /people/1, /planets/3, /films/5…
//
// Demuestra tres cosas de las lecciones 03, 05 y 09:
//   - el parámetro `:id` entra como input (withComponentInputBinding),
//   - `httpResource` deduce los tres estados,
//   - las relaciones se cargan con `@defer (on viewport)`.
import { httpResource } from '@angular/common/http';
import { Component, computed, input } from '@angular/core';
import { RouterLink } from '@angular/router';

import { describeSwapiError } from '../core/api/swapi-error';
import { detailFieldsOf, relationsOf, titleOf } from '../core/api/swapi-format';
import {
  RESOURCE_META,
  isResourceName,
  type ResourceName,
  type SwapiItem,
} from '../core/api/swapi-types';
import { FavoriteButton } from '../shared/swapi/favorite-button';
import { ResourceField } from '../shared/swapi/resource-field';
import { ResourceLink } from '../shared/swapi/resource-link';
import { BaseButton } from '../shared/ui/base-button';
import { EmptyState } from '../shared/ui/empty-state';
import { ErrorState } from '../shared/ui/error-state';
import { LoadingState } from '../shared/ui/loading-state';

@Component({
  selector: 'app-resource-detail-view',
  imports: [
    RouterLink,
    BaseButton,
    FavoriteButton,
    ResourceField,
    ResourceLink,
    LoadingState,
    ErrorState,
    EmptyState,
  ],
  templateUrl: './resource-detail-view.html',
  styles: ':host { display: contents; }',
})
export class ResourceDetailView {
  readonly resource = input.required<string>();
  readonly id = input.required<string>();

  protected readonly name = computed<ResourceName | null>(() => {
    const value = this.resource();
    return isResourceName(value) ? value : null;
  });

  protected readonly currentMeta = computed(() => {
    const name = this.name();
    return name === null ? null : RESOURCE_META[name];
  });

  /** Al cambiar `:id` el input cambia y esta petición se relanza sola. */
  protected readonly detail = httpResource<SwapiItem>(() => {
    const name = this.name();
    return name === null ? undefined : { url: `/${name}/${this.id()}/` };
  });

  protected readonly item = computed(() => this.detail.value());

  protected readonly title = computed(() => {
    const item = this.item();
    return item === undefined ? '' : titleOf(item);
  });

  protected readonly facts = computed(() => {
    const name = this.name();
    const item = this.item();
    return name !== null && item !== undefined ? detailFieldsOf(name, item) : [];
  });

  protected readonly relations = computed(() => {
    const name = this.name();
    const item = this.item();
    return name !== null && item !== undefined ? relationsOf(name, item) : [];
  });

  protected readonly openingCrawl = computed(() => {
    const item = this.item();
    return item !== undefined && 'opening_crawl' in item ? item.opening_crawl : '';
  });

  protected readonly errorMessage = computed(() => describeSwapiError(this.detail.error()));

  protected reload(): void {
    this.detail.reload();
  }
}
