// src/app/shared/swapi/favorite-button.ts
// Botón de favorito que escribe en el estado global (lección 06).
import { Component, computed, inject, input } from '@angular/core';

import { FavoritesStore } from '../../store/favorites-store';

@Component({
  selector: 'app-favorite-button',
  template: `
    <button
      class="fav"
      type="button"
      [class.fav--on]="isFavorite()"
      [attr.aria-pressed]="isFavorite()"
      [attr.aria-label]="label()"
      [attr.title]="label()"
      (click)="toggle()"
    >
      {{ isFavorite() ? '★' : '☆' }}
    </button>
  `,
  styles: ':host { display: contents; }',
})
export class FavoriteButton {
  private readonly favorites = inject(FavoritesStore);

  readonly url = input.required<string>();
  readonly name = input('');

  protected readonly isFavorite = computed(() => this.favorites.isFavorite(this.url()));
  protected readonly label = computed(() =>
    this.isFavorite() ? 'Quitar de favoritos' : 'Añadir a favoritos',
  );

  protected toggle(): void {
    this.favorites.toggle(this.url());
  }
}
