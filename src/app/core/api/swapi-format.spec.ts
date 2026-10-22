import type { Person, Planet } from './swapi-types';
import {
  detailFieldsOf,
  factsOf,
  idFromUrl,
  prettyKey,
  relationsOf,
  resourceFromUrl,
  titleOf,
} from './swapi-format';

const LUKE: Person = {
  name: 'Luke Skywalker',
  height: '172',
  mass: '77',
  hair_color: 'blond',
  skin_color: 'fair',
  eye_color: 'blue',
  birth_year: '19BBY',
  gender: 'male',
  homeworld: 'https://swapi.dev/api/planets/1/',
  films: ['https://swapi.dev/api/films/1/', 'https://swapi.dev/api/films/2/'],
  species: [],
  vehicles: ['https://swapi.dev/api/vehicles/14/'],
  starships: ['https://swapi.dev/api/starships/12/'],
  created: '2014-12-09T13:50:51.644000Z',
  edited: '2014-12-20T21:17:56.891000Z',
  url: 'https://swapi.dev/api/people/1/',
};

const TATOOINE: Planet = {
  name: 'Tatooine',
  rotation_period: '23',
  orbital_period: '304',
  diameter: '10465',
  climate: 'arid',
  gravity: '1 standard',
  terrain: 'desert',
  surface_water: '1',
  population: '200000',
  residents: ['https://swapi.dev/api/people/1/', 'https://swapi.dev/api/people/2/'],
  films: ['https://swapi.dev/api/films/1/'],
  created: '2014-12-09T13:50:49.641000Z',
  edited: '2014-12-20T20:58:18.411000Z',
  url: 'https://swapi.dev/api/planets/1/',
};

describe('swapi-format', () => {
  it('extrae el id de una URL de SWAPI', () => {
    expect(idFromUrl('https://swapi.dev/api/people/1/')).toBe('1');
    expect(idFromUrl('https://swapi.dev/api/planets/12')).toBe('12');
    expect(idFromUrl('no-es-una-url')).toBe('no-es-una-url');
  });

  it('deduce el recurso de una URL de relación', () => {
    expect(resourceFromUrl('https://swapi.dev/api/people/1/')).toBe('people');
    expect(resourceFromUrl('https://swapi.dev/api/starships/9/')).toBe('starships');
    expect(resourceFromUrl('https://swapi.dev/api/vehicles/9/')).toBeUndefined();
  });

  it('usa `title` en películas y `name` en el resto', () => {
    expect(titleOf(LUKE)).toBe('Luke Skywalker');
  });

  it('resume los datos de un personaje', () => {
    expect(factsOf('people', LUKE)).toEqual([
      { label: 'Nacimiento', value: '19BBY' },
      { label: 'Altura', value: '172 cm' },
      { label: 'Género', value: 'male' },
    ]);
  });

  it('traduce los campos de la ficha y deja fuera lo desconocido', () => {
    const fields = detailFieldsOf('people', LUKE);
    expect(fields).toContainEqual({ label: 'Color de pelo', value: 'blond' });
    expect(fields).toContainEqual({ label: 'Masa', value: '77' });
    expect(fields.some((field) => field.value === '—')).toBe(false);
  });

  it('descarta las relaciones que este explorador no sabe abrir (vehículos)', () => {
    const relations = relationsOf('people', LUKE);
    const labels = relations.map((relation) => relation.label);

    // `vehicles` queda fuera; `species` viene vacío y tampoco se muestra.
    expect(labels).toEqual(['Películas', 'Naves']);
    expect(relations[0]?.urls.length).toBe(2);
  });

  it('relaciona un planeta con sus residentes y sus películas', () => {
    const relations = relationsOf('planets', TATOOINE);
    expect(relations.map((relation) => relation.label)).toEqual(['Residentes', 'Películas']);
  });

  it('deja bonitas las claves en snake_case', () => {
    expect(prettyKey('hair_color')).toBe('Color de pelo');
    expect(prettyKey('desconocida')).toBe('desconocida');
  });
});
