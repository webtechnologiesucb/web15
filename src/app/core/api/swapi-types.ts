// src/app/core/api/swapi-types.ts
// Tipos de los recursos de SWAPI (https://swapi.dev/documentation).
//
// El mapa `SwapiResources` es la clave de la lección 04: asocia el nombre del
// recurso (`people`) con su entidad (`Person`), de modo que un genérico
// `SwapiResources[K]` deduce el tipo de retorno a partir de la URL.

/** Respuesta paginada estándar de SWAPI. */
export interface SwapiListResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}

export interface Person {
  name: string;
  height: string;
  mass: string;
  hair_color: string;
  skin_color: string;
  eye_color: string;
  birth_year: string;
  gender: string;
  homeworld: string;
  films: string[];
  species: string[];
  vehicles: string[];
  starships: string[];
  created: string;
  edited: string;
  url: string;
}

export interface Planet {
  name: string;
  rotation_period: string;
  orbital_period: string;
  diameter: string;
  climate: string;
  gravity: string;
  terrain: string;
  surface_water: string;
  population: string;
  residents: string[];
  films: string[];
  created: string;
  edited: string;
  url: string;
}

export interface Film {
  title: string;
  episode_id: number;
  opening_crawl: string;
  director: string;
  producer: string;
  release_date: string;
  characters: string[];
  planets: string[];
  starships: string[];
  vehicles: string[];
  species: string[];
  created: string;
  edited: string;
  url: string;
}

export interface Starship {
  name: string;
  model: string;
  manufacturer: string;
  cost_in_credits: string;
  length: string;
  max_atmosphering_speed: string;
  crew: string;
  passengers: string;
  cargo_capacity: string;
  consumables: string;
  hyperdrive_rating: string;
  MGLT: string;
  starship_class: string;
  pilots: string[];
  films: string[];
  created: string;
  edited: string;
  url: string;
}

export interface Species {
  name: string;
  classification: string;
  designation: string;
  average_height: string;
  skin_colors: string;
  hair_colors: string;
  eye_colors: string;
  average_lifespan: string;
  homeworld: string | null;
  language: string;
  people: string[];
  films: string[];
  created: string;
  edited: string;
  url: string;
}

/** Mapa recurso -> entidad. Permite deducir tipos con genéricos (lección 04). */
export interface SwapiResources {
  people: Person;
  planets: Planet;
  films: Film;
  starships: Starship;
  species: Species;
}

export type ResourceName = keyof SwapiResources;

export interface ResourceMeta {
  singular: string;
  plural: string;
  icon: string;
  /** Ruta del bloque temático de la lección que lo usa. */
  lesson: string;
}

export const RESOURCE_META: Record<ResourceName, ResourceMeta> = {
  people: { singular: 'Personaje', plural: 'Personajes', icon: '👤', lesson: '/lecciones/05-router' },
  planets: { singular: 'Planeta', plural: 'Planetas', icon: '🪐', lesson: '/lecciones/05-router' },
  films: { singular: 'Película', plural: 'Películas', icon: '🎬', lesson: '/lecciones/05-router' },
  starships: { singular: 'Nave', plural: 'Naves', icon: '🚀', lesson: '/lecciones/05-router' },
  species: { singular: 'Especie', plural: 'Especies', icon: '👽', lesson: '/lecciones/05-router' },
};

export const RESOURCE_NAMES: ResourceName[] = ['people', 'planets', 'films', 'starships', 'species'];

/** Guarda de tipo: comprueba si un valor (por ejemplo un parámetro de ruta) es un recurso válido. */
export function isResourceName(value: unknown): value is ResourceName {
  return typeof value === 'string' && (RESOURCE_NAMES as string[]).includes(value);
}

/** Valor de cualquier recurso de SWAPI: unos usan `name` y otros `title`. */
export type SwapiItem = SwapiResources[ResourceName];
