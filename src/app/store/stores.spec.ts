import { TestBed } from '@angular/core/testing';

import { lessons } from '../data/lessons';
import { FAVORITES_STORAGE_KEY, FavoritesStore } from './favorites-store';
import { PROGRESS_STORAGE_KEY, ProgressStore } from './progress-store';

describe('FavoritesStore', () => {
  beforeEach(() => {
    localStorage.clear();
    TestBed.resetTestingModule();
  });

  it('empieza vacío y añade o quita favoritos sin duplicar', () => {
    const store = TestBed.inject(FavoritesStore);

    expect(store.count()).toBe(0);

    store.toggle('/people/1/');
    store.toggle('/films/2/');
    store.toggle('/people/1/'); // el segundo toggle lo quita

    expect(store.items()).toEqual(['/films/2/']);
    expect(store.isFavorite('/people/1/')).toBe(false);
  });

  it('persiste los cambios en localStorage (el effect está suscrito)', () => {
    const store = TestBed.inject(FavoritesStore);

    store.toggle('/planets/3/');
    store.remove('/planets/3/');
    store.toggle('/starships/9/');
    TestBed.tick(); // los effects se ejecutan al estabilizarse la aplicación

    expect(JSON.parse(localStorage.getItem(FAVORITES_STORAGE_KEY) ?? 'null')).toEqual([
      '/starships/9/',
    ]);
  });

  it('lee lo que ya había guardado', () => {
    localStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify(['/starships/9/']));

    expect(TestBed.inject(FavoritesStore).items()).toEqual(['/starships/9/']);
  });

  it('ignora un contenido corrupto y arranca vacío', () => {
    localStorage.setItem(FAVORITES_STORAGE_KEY, '{esto no es json');

    expect(TestBed.inject(FavoritesStore).count()).toBe(0);
  });

  it('clear vacía la lista', () => {
    const store = TestBed.inject(FavoritesStore);
    store.toggle('/people/1/');
    store.clear();
    expect(store.count()).toBe(0);
  });
});

describe('ProgressStore', () => {
  beforeEach(() => {
    localStorage.clear();
    TestBed.resetTestingModule();
  });

  it('calcula el porcentaje y cuál es la siguiente lección pendiente', () => {
    const store = TestBed.inject(ProgressStore);

    expect(store.percent()).toBe(0);
    expect(store.nextPending()?.id).toBe(lessons[0].id);

    store.toggle(lessons[0].id);

    expect(store.done()).toBe(1);
    expect(store.percent()).toBe(Math.round((1 / lessons.length) * 100));
    expect(store.nextPending()?.id).toBe(lessons[1].id);
  });

  it('reset vuelve a cero y guarda la lista vacía', () => {
    const store = TestBed.inject(ProgressStore);

    store.toggle(lessons[0].id);
    store.reset();
    TestBed.tick();

    expect(store.done()).toBe(0);
    expect(JSON.parse(localStorage.getItem(PROGRESS_STORAGE_KEY) ?? 'null')).toEqual([]);
  });

  it('marca una lección como completada sólo una vez', () => {
    const store = TestBed.inject(ProgressStore);

    store.toggle(lessons[2].id);
    store.toggle(lessons[2].id);

    expect(store.done()).toBe(0);
    expect(store.isCompleted(lessons[2].id)).toBe(false);
  });
});
