import { provideHttpClient, withFetch, withInterceptors } from '@angular/common/http';
import {
  type ApplicationConfig,
  provideBrowserGlobalErrorListeners,
  provideZonelessChangeDetection,
} from '@angular/core';
import { provideRouter, withComponentInputBinding, withInMemoryScrolling } from '@angular/router';

import { routes } from './app.routes';
import { swapiInterceptor } from './core/api/swapi-interceptor';

/**
 * Configuración de la aplicación (el "composition root").
 *
 * Los providers son el equivalente Angular de los `plugins`/contextos que en
 * web13/web14 se montaban en el punto de entrada.
 */
export const appConfig: ApplicationConfig = {
  providers: [
    // Errores no capturados -> consola y `ErrorHandler`.
    provideBrowserGlobalErrorListeners(),

    // Sin zone.js: la detección de cambios la disparan los signals (lección 10).
    provideZonelessChangeDetection(),

    provideRouter(
      routes,
      // Los parámetros de ruta (`:resource`, `:id`) llegan como inputs (lección 05).
      withComponentInputBinding(),
      // Al navegar se vuelve arriba y los `#anclas` funcionan.
      withInMemoryScrolling({ scrollPositionRestoration: 'top', anchorScrolling: 'enabled' }),
    ),

    // `withFetch` usa la Fetch API; el interceptor añade la base de SWAPI y los mirrors.
    provideHttpClient(withFetch(), withInterceptors([swapiInterceptor])),
  ],
};
