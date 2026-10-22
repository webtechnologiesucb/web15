// src/app/shared/swapi/resource-card.ts
// Tarjeta de un recurso de SWAPI para las rejillas del explorador.
//
// Todo lo que se muestra se calcula con computed() a partir de los inputs:
// no hay estado duplicado y no hace falta un efecto de sincronización.
import { Component, computed, input } from '@angular/core';
import { RouterLink } from '@angular/router';

import { factsOf, idFromUrl, titleOf } from '../../core/api/swapi-format';
import { RESOURCE_META, type ResourceName, type SwapiItem } from '../../core/api/swapi-types';
import { FavoriteButton } from './favorite-button';

@Component({
  selector: 'app-resource-card',
  imports: [RouterLink, FavoriteButton],
  templateUrl: './resource-card.html',
  styles: ':host { display: contents; }',
})
export class ResourceCard {
  readonly resource = input.required<ResourceName>();
  readonly item = input.required<SwapiItem>();

  protected readonly meta = computed(() => RESOURCE_META[this.resource()]);
  protected readonly title = computed(() => titleOf(this.item()));
  protected readonly facts = computed(() => factsOf(this.resource(), this.item()));
  protected readonly detailLink = computed(() => ['/', this.resource(), idFromUrl(this.item().url)]);
}
