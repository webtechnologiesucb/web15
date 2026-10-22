import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';

import { SiteFooter } from './shared/layout/site-footer';
import { SiteHeader } from './shared/layout/site-header';
import { SiteSidebar } from './shared/layout/site-sidebar';

/**
 * Componente raíz (el "shell" de la aplicación).
 *
 * Contiene lo que se ve en todas las páginas: cabecera, barra lateral y pie.
 * Las vistas se cargan solas en el `<router-outlet>`.
 */
@Component({
  selector: 'app-root',
  imports: [RouterOutlet, SiteHeader, SiteSidebar, SiteFooter],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  /**
   * Estado del menú lateral en móvil.
   *
   * Vive en el shell (el ancestro común) y se comunica con `[(menuOpen)]`:
   * es el patrón de "elevar el estado" y bajarlo por inputs, igual que en
   * web13/web14. Con signals, además, cualquier cambio repinta lo mínimo.
   */
  protected readonly menuOpen = signal(false);
}
