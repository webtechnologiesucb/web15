// src/app/shared/swapi/favorite-link.ts
// Enlace de la cabecera con el número de favoritos, siempre actualizado.
import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';

import { FavoritesStore } from '../../store/favorites-store';

@Component({
  selector: 'app-favorite-link',
  imports: [RouterLink],
  template: `
    <a class="fav-link" routerLink="/favoritos" title="Favoritos">
      <span aria-hidden="true">★</span>
      <span class="fav-link__count">{{ favorites.count() }}</span>
      <span class="visually-hidden">recurso(s) en favoritos</span>
    </a>
  `,
  styles: ':host { display: contents; }',
})
export class FavoriteLink {
  protected readonly favorites = inject(FavoritesStore);
}
