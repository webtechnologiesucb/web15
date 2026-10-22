// src/app/core/api/swapi-format.ts
// Utilidades para presentar los datos de SWAPI.
// Son funciones puras: se prueban sin Angular ni red (ver swapi-format.spec.ts).
import {
  RESOURCE_META,
  RESOURCE_NAMES,
  type ResourceName,
  type SwapiItem,
} from './swapi-types';

/** Par etiqueta/valor listo para pintar en una ficha. */
export interface Fact {
  label: string;
  value: string;
}

const EMPTY = '—';

/** Extrae el id numérico de una URL de SWAPI: ".../people/1/" -> "1". */
export function idFromUrl(url: string): string {
  const match = /\/(\d+)\/?$/.exec(url);
  return match?.[1] ?? url;
}

/** Recurso al que apunta una URL de SWAPI (homeworld, films, pilots...). */
export function resourceFromUrl(url: string): ResourceName | undefined {
  const match = /\/([a-z]+)\/\d+\/?$/.exec(url);
  const candidate = match?.[1];
  return RESOURCE_NAMES.find((name) => name === candidate);
}

/** Título visible de cualquier recurso (`title` en películas, `name` en el resto). */
export function titleOf(item: SwapiItem): string {
  return 'title' in item ? item.title : item.name;
}

/** Lee una propiedad del objeto sin pelearse con la unión de tipos. */
function pick(item: SwapiItem, key: string): string {
  const value = (item as unknown as Record<string, unknown>)[key];
  if (value === undefined || value === null || value === '') return EMPTY;
  return String(value);
}

/** Añade una unidad sólo si hay valor. */
function withUnit(value: string, unit: string): string {
  return value === EMPTY ? EMPTY : `${value} ${unit}`;
}

/** Dos o tres datos de resumen para las tarjetas del explorador. */
export function factsOf(resource: ResourceName, item: SwapiItem): Fact[] {
  switch (resource) {
    case 'people':
      return [
        { label: 'Nacimiento', value: pick(item, 'birth_year') },
        { label: 'Altura', value: withUnit(pick(item, 'height'), 'cm') },
        { label: 'Género', value: pick(item, 'gender') },
      ];
    case 'planets':
      return [
        { label: 'Clima', value: pick(item, 'climate') },
        { label: 'Terreno', value: pick(item, 'terrain') },
        { label: 'Población', value: pick(item, 'population') },
      ];
    case 'films':
      return [
        { label: 'Episodio', value: pick(item, 'episode_id') },
        { label: 'Director', value: pick(item, 'director') },
        { label: 'Estreno', value: pick(item, 'release_date') },
      ];
    case 'starships':
      return [
        { label: 'Modelo', value: pick(item, 'model') },
        { label: 'Clase', value: pick(item, 'starship_class') },
        { label: 'Tripulación', value: pick(item, 'crew') },
      ];
    case 'species':
      return [
        { label: 'Clasificación', value: pick(item, 'classification') },
        { label: 'Idioma', value: pick(item, 'language') },
        { label: 'Esperanza de vida', value: pick(item, 'average_lifespan') },
      ];
  }
}

/** Ficha completa: todos los campos "de texto" del recurso, en orden. */
export function detailFieldsOf(resource: ResourceName, item: SwapiItem): Fact[] {
  const keys: Record<ResourceName, string[]> = {
    people: ['height', 'mass', 'hair_color', 'skin_color', 'eye_color', 'birth_year', 'gender'],
    planets: [
      'rotation_period',
      'orbital_period',
      'diameter',
      'climate',
      'gravity',
      'terrain',
      'surface_water',
      'population',
    ],
    films: ['episode_id', 'director', 'producer', 'release_date'],
    starships: [
      'model',
      'manufacturer',
      'cost_in_credits',
      'length',
      'max_atmosphering_speed',
      'crew',
      'passengers',
      'cargo_capacity',
      'consumables',
      'hyperdrive_rating',
      'MGLT',
      'starship_class',
    ],
    species: [
      'classification',
      'designation',
      'average_height',
      'skin_colors',
      'hair_colors',
      'eye_colors',
      'average_lifespan',
      'language',
    ],
  };

  return keys[resource].map((key) => ({ label: prettyKey(key), value: pick(item, key) }));
}

/** Colecciones relacionadas (films, residents, pilots...) que llegan como URLs. */
export function relationKeysOf(resource: ResourceName): string[] {
  const keys: Record<ResourceName, string[]> = {
    people: ['films', 'species', 'starships', 'vehicles'],
    planets: ['residents', 'films'],
    films: ['characters', 'planets', 'starships', 'species'],
    starships: ['pilots', 'films'],
    species: ['people', 'films'],
  };
  return keys[resource];
}

/**
 * Relaciones de un recurso, ya como pares etiqueta/URLs.
 * Sólo se devuelven los enlaces que se pueden abrir en este explorador
 * (people, planets, films, starships, species): `vehicles` queda fuera.
 */
export function relationsOf(
  resource: ResourceName,
  item: SwapiItem,
): { label: string; urls: string[] }[] {
  return relationKeysOf(resource)
    .map((key) => ({
      label: prettyKey(key),
      urls: readUrls(item, key).filter((url) => resourceFromUrl(url) !== undefined),
    }))
    .filter((relation) => relation.urls.length > 0);
}

function readUrls(item: SwapiItem, key: string): string[] {
  const value = (item as unknown as Record<string, unknown>)[key];
  return Array.isArray(value) ? value.filter((entry): entry is string => typeof entry === 'string') : [];
}

/** Nombre legible del recurso (para títulos, breadcrumbs y pestañas). */
export function labelOfResource(resource: ResourceName, plural = false): string {
  const meta = RESOURCE_META[resource];
  return plural ? meta.plural : meta.singular;
}

const PRETTY_KEYS: Record<string, string> = {
  height: 'Altura',
  mass: 'Masa',
  hair_color: 'Color de pelo',
  skin_color: 'Color de piel',
  eye_color: 'Color de ojos',
  birth_year: 'Año de nacimiento',
  gender: 'Género',
  rotation_period: 'Periodo de rotación',
  orbital_period: 'Periodo orbital',
  diameter: 'Diámetro',
  climate: 'Clima',
  gravity: 'Gravedad',
  terrain: 'Terreno',
  surface_water: 'Agua superficial',
  population: 'Población',
  episode_id: 'Episodio',
  director: 'Director',
  producer: 'Productor',
  release_date: 'Estreno',
  opening_crawl: 'Texto de apertura',
  model: 'Modelo',
  starship_class: 'Clase',
  manufacturer: 'Fabricante',
  cost_in_credits: 'Coste (créditos)',
  length: 'Longitud',
  max_atmosphering_speed: 'Velocidad máxima',
  crew: 'Tripulación',
  passengers: 'Pasajeros',
  cargo_capacity: 'Capacidad de carga',
  consumables: 'Consumibles',
  hyperdrive_rating: 'Hiperimpulsor',
  MGLT: 'MGLT',
  classification: 'Clasificación',
  designation: 'Designación',
  average_height: 'Altura media',
  average_lifespan: 'Esperanza de vida',
  skin_colors: 'Colores de piel',
  hair_colors: 'Colores de pelo',
  eye_colors: 'Colores de ojos',
  language: 'Idioma',
  homeworld: 'Mundo natal',
  characters: 'Personajes',
  planets: 'Planetas',
  starships: 'Naves',
  vehicles: 'Vehículos',
  species: 'Especies',
  residents: 'Residentes',
  pilots: 'Pilotos',
  films: 'Películas',
  people: 'Personas',
};

/** Etiqueta legible de una clave en snake_case. */
export function prettyKey(key: string): string {
  return PRETTY_KEYS[key] ?? key;
}
