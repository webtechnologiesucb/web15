/*
 * Configuración de desarrollo.
 *
 * Angular no tiene variables `import.meta.env` como Vite: la configuración vive
 * en archivos de entorno y `angular.json` los intercambia con `fileReplacements`
 * en la configuración de producción (ver environment.production.ts).
 */
export const environment = {
  production: false,

  /** Base principal de SWAPI. */
  swapiBaseUrl: 'https://swapi.dev/api',

  /**
   * Mirrors públicos que se prueban, en orden, cuando la base principal falla
   * por red o por un error 5xx (ver SwapiInterceptor).
   */
  swapiFallbackUrls: ['https://swapi.py4e.com/api', 'https://swapi.info/api'],
};
