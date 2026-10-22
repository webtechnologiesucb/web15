// src/app/shared/layout/site-header.ts
// Cabecera fija: marca, favoritos y conmutador de tema.
//
// El estado del menú móvil vive en <App> y baja/ sube con un `model()`
// (doble sentido): <app-site-header [(menuOpen)]="menuOpen" />
import { Component, inject, model } from '@angular/core';
import { RouterLink } from '@angular/router';

import { ThemeService } from '../../core/theme/theme-service';
import { FavoriteLink } from '../swapi/favorite-link';
import { BaseButton } from '../ui/base-button';

@Component({
  selector: 'app-site-header',
  imports: [RouterLink, BaseButton, FavoriteLink],
  templateUrl: './site-header.html',
  styles: ':host { display: contents; }',
})
export class SiteHeader {
  private readonly theme = inject(ThemeService);

  /** `model()` es un input de doble sentido: el padre puede leerlo y escribirlo. */
  readonly menuOpen = model(false);

  protected readonly isLight = this.theme.isLight;

  protected toggleMenu(): void {
    this.menuOpen.update((open) => !open);
  }

  protected toggleTheme(): void {
    this.theme.toggle();
  }
}
