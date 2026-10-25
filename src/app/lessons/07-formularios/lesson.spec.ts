import { provideHttpClient } from '@angular/common/http';
import {
  HttpTestingController,
  provideHttpClientTesting,
} from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { FavoritesStore } from '../../store/favorites-store';
import { Lesson07Formularios } from './lesson';

function typeQuery(root: HTMLElement, value: string): void {
  const input = root.querySelector<HTMLInputElement>('input[formcontrolname="query"]');
  if (input === null) throw new Error('No se encontró el campo de búsqueda');
  input.value = value;
  input.dispatchEvent(new Event('input'));
}

const PAGE = {
  count: 2,
  next: null,
  previous: null,
  results: [
    {
      name: 'Luke Skywalker',
      height: '172',
      mass: '77',
      gender: 'male',
      birth_year: '19BBY',
      url: '/people/1/',
    },
    {
      name: 'C-3PO',
      height: '167',
      mass: '75',
      gender: 'n/a',
      birth_year: '112BBY',
      url: '/people/2/',
    },
  ],
};

describe('Lección 07 · formularios reactivos', () => {
  let httpMock: HttpTestingController;

  beforeEach(async () => {
    localStorage.clear();
    await TestBed.configureTestingModule({
      imports: [Lesson07Formularios],
      providers: [provideRouter([]), provideHttpClient(), provideHttpClientTesting()],
    }).compileComponents();

    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    vi.useRealTimers();
    httpMock.verify();
  });

  it('espera el debounce y busca con el término escrito', async () => {
    vi.useFakeTimers();
    const fixture = TestBed.createComponent(Lesson07Formularios);
    fixture.detectChanges();
    const el = fixture.nativeElement as HTMLElement;

    typeQuery(el, 'luke');
    fixture.detectChanges();

    await vi.advanceTimersByTimeAsync(399);
    httpMock.expectNone('/people/');

    await vi.advanceTimersByTimeAsync(1);
    const request = httpMock.expectOne(
      (req) => req.url === '/people/' && req.params.get('search') === 'luke',
    );
    request.flush(PAGE);
    fixture.detectChanges();

    expect(el.textContent).toContain('Luke Skywalker');
    expect(el.textContent).toContain('1 petición(es)');
    expect(el.textContent).toContain('success');
  });

  it('no busca con menos de tres caracteres', async () => {
    vi.useFakeTimers();
    const fixture = TestBed.createComponent(Lesson07Formularios);
    fixture.detectChanges();
    const el = fixture.nativeElement as HTMLElement;

    typeQuery(el, 'lu');
    fixture.detectChanges();
    await vi.advanceTimersByTimeAsync(400);
    fixture.detectChanges();

    httpMock.expectNone('/people/');
    expect(el.textContent).toContain('necesita al menos 3 caracteres');
    expect(el.textContent).toContain('invalid');
  });

  it('vuelve a buscar al cambiar de recurso', async () => {
    vi.useFakeTimers();
    const fixture = TestBed.createComponent(Lesson07Formularios);
    fixture.detectChanges();
    const el = fixture.nativeElement as HTMLElement;

    typeQuery(el, 'luke');
    fixture.detectChanges();
    await vi.advanceTimersByTimeAsync(400);
    httpMock.expectOne((req) => req.url === '/people/').flush(PAGE);
    fixture.detectChanges();

    const select = el.querySelector<HTMLSelectElement>('select[formcontrolname="resource"]');
    if (select === null) throw new Error('No se encontró el selector de recurso');
    select.value = 'planets';
    select.dispatchEvent(new Event('change'));

    await vi.advanceTimersByTimeAsync(400);
    const request = httpMock.expectOne(
      (req) => req.url === '/planets/' && req.params.get('search') === 'luke',
    );
    request.flush({ count: 0, next: null, previous: null, results: [] });
    fixture.detectChanges();

    expect(select.value).toBe('planets');
    expect(el.textContent).toContain('2 petición(es)');
  });

  it('la casilla sólo favoritos filtra en local', async () => {
    vi.useFakeTimers();
    const fixture = TestBed.createComponent(Lesson07Formularios);
    fixture.detectChanges();
    const el = fixture.nativeElement as HTMLElement;

    typeQuery(el, 'luke');
    fixture.detectChanges();
    await vi.advanceTimersByTimeAsync(400);
    httpMock.expectOne((req) => req.url === '/people/').flush(PAGE);
    fixture.detectChanges();

    TestBed.inject(FavoritesStore).toggle('/people/1/');
    el.querySelector<HTMLInputElement>('input[formcontrolname="onlyFavorites"]')?.click();
    fixture.detectChanges();

    expect(el.querySelectorAll('.grid app-resource-card').length).toBe(1);
    expect(el.textContent).toContain('1 visibles');
  });
});
