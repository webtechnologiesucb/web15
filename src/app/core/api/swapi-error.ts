// src/app/core/api/swapi-error.ts
// Mensajes de error legibles para el usuario.
import { HttpErrorResponse } from '@angular/common/http';

/** Convierte cualquier error en un texto que se pueda mostrar en pantalla. */
export function describeSwapiError(error: unknown): string {
  if (error instanceof HttpErrorResponse) {
    if (error.status === 404) return 'Ese recurso no existe en SWAPI (404).';
    if (error.status === 0) return 'No se pudo conectar con SWAPI. Comprueba tu conexión.';
    if (error.status >= 500) return 'SWAPI está respondiendo con errores (5xx). Inténtalo de nuevo.';
    return `SWAPI respondió con el estado ${error.status}.`;
  }
  if (error instanceof Error) return error.message;
  return 'Ha ocurrido un error inesperado al cargar los datos.';
}

/**
 * ¿Tiene sentido probar el siguiente mirror?
 * - Un 404 es definitivo: el recurso no existe en ninguna base.
 * - Una petición cancelada (AbortController) tampoco debe reintentarse.
 * - Los errores de red o 5xx sí: el mirror puede estar caído (lección 03).
 */
export function isRetriableError(error: unknown): boolean {
  if (isAbortError(error)) return false;
  if (error instanceof HttpErrorResponse) return error.status === 0 || error.status >= 500;
  return false;
}

/** Detecta una petición cancelada con AbortController / AbortSignal. */
export function isAbortError(error: unknown): boolean {
  if (typeof DOMException !== 'undefined' && error instanceof DOMException && error.name === 'AbortError') {
    return true;
  }
  const name = nameOf(error);
  return typeof name === 'string' && name.toLowerCase().includes('abort');
}

function nameOf(error: unknown): unknown {
  return typeof error === 'object' && error !== null && 'name' in error
    ? (error as { name?: unknown }).name
    : undefined;
}
