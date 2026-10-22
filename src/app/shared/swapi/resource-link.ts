// src/app/shared/swapi/resource-link.ts
// Chip que enlaza a otro recurso de SWAPI (películas de un personaje, residentes
// de un planeta…). Cada chip resuelve su propio nombre con `httpResource`, así
// que el componente padre no tiene que coordinar N peticiones.
import { httpResource } from '@angular/common/http';
import { Component, computed, input } from '@angular/core';
import { RouterLink } from '@angular/router';

import { idFromUrl, resourceFromUrl, titleOf } from '../../core/api/swapi-format';
import { RESOURCE_META, type SwapiItem } from '../../core/api/swapi-types';

@Component({
  selector: 'app-resource-link',
  imports: [RouterLink],
  template: `
    <a class="chip" [routerLink]="link()">
      <span aria-hidden="true">{{ icon() }}</span>
      @if (title()) {
        <span>{{ title() }}</span>
      } @else {
        <span class="dim">#{{ id() }}</span>
      }
    </a>
  `,
  styles: ':host { display: contents; }',
})
export class ResourceLink {
  /** URL absoluta de SWAPI (por ejemplo el `homeworld` de un personaje). */
  readonly url = input.required<string>();

  protected readonly resource = computed(() => resourceFromUrl(this.url()));
  protected readonly id = computed(() => idFromUrl(this.url()));

  protected readonly icon = computed(() => {
    const resource = this.resource();
    return resource === undefined ? '•' : RESOURCE_META[resource].icon;
  });

  protected readonly link = computed<string[]>(() => {
    const resource = this.resource();
    return resource === undefined ? ['/'] : ['/', resource, this.id()];
  });

  private readonly detail = httpResource<SwapiItem>(() => ({ url: this.url() }));

  protected readonly title = computed(() => {
    const item = this.detail.value();
    return item === undefined ? '' : titleOf(item);
  });
}
