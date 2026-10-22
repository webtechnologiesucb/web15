/*
 * Configuración de producción.
 * `angular.json` la sustituye por `environment.ts` al compilar con
 * `--configuration production` (fileReplacements).
 */
export const environment = {
  production: true,

  /** Base principal de SWAPI. */
  swapiBaseUrl: 'https://swapi.dev/api',

  /** Mirrors públicos que se prueban si la base principal no responde. */
  swapiFallbackUrls: ['https://swapi.py4e.com/api', 'https://swapi.info/api'],
};
