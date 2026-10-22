// src/app/views/favorites-view.ts
// Favoritos guardados en localStorage (lección 06).
import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';

import { FavoriteRow } from '../shared/swapi/favorite-row';
import { BaseButton } from '../shared/ui/base-button';
import { EmptyState } from '../shared/ui/empty-state';
import { FavoritesStore } from '../store/favorites-store';

@Component({
  selector: 'app-favorites-view',
  imports: [RouterLink, BaseButton, EmptyState, FavoriteRow],
  templateUrl: './favorites-view.html',
  styles: ':host { display: contents; }',
})
export class FavoritesView {
  private readonly favorites = inject(FavoritesStore);

  protected readonly items = this.favorites.items;
  protected readonly count = this.favorites.count;

  protected clear(): void {
    this.favorites.clear();
  }
}
