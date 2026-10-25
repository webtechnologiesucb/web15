import { provideHttpClient } from '@angular/common/http';
import {
  HttpTestingController,
  provideHttpClientTesting,
} from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { Lesson04ServiciosDi } from './lesson';

function buttonByText(root: HTMLElement, text: string): HTMLButtonElement | undefined {
  return [...root.querySelectorAll('button')].find((button) =>
    (button.textContent ?? '').includes(text),
  );
}

describe('Lección 04 · servicios e inyección', () => {
  let httpMock: HttpTestingController;

  beforeEach(async () => {
    localStorage.clear();
    await TestBed.configureTestingModule({
      imports: [Lesson04ServiciosDi],
      providers: [provideRouter([]), provideHttpClient(), provideHttpClientTesting()],
    }).compileComponents();

    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => httpMock.verify());

  it('muestra que el servicio es un singleton y las bases inyectadas', () => {
    const fixture = TestBed.createComponent(Lesson04ServiciosDi);
    fixture.detectChanges();
    const el = fixture.nativeElement as HTMLElement;

    expect(el.textContent).toContain('Sí · singleton');
    expect(el.querySelectorAll('.l04-bases li').length).toBeGreaterThan(0);
  });

  it('carga los personajes a través de SwapiService', async () => {
    const fixture = TestBed.createComponent(Lesson04ServiciosDi);
    fixture.detectChanges();
    const el = fixture.nativeElement as HTMLElement;

    buttonByText(el, 'Cargar personajes')?.click();
    fixture.detectChanges();

    expect(el.textContent).toContain('Consultando SwapiService');

    httpMock.expectOne('/people/').flush({
      count: 2,
      next: null,
      previous: null,
      results: [
        { name: 'Luke Skywalker', height: '172', birth_year: '19BBY', url: '/people/1/' },
        { name: 'C-3PO', height: '167', birth_year: '112BBY', url: '/people/2/' },
      ],
    });

    await fixture.whenStable();
    fixture.detectChanges();

    expect(el.textContent).toContain('Luke Skywalker');
    expect(el.textContent).toContain('C-3PO');
    expect(el.textContent).toContain('2 personajes en total');
  });

  it('convierte un error HTTP en un mensaje legible', async () => {
    const fixture = TestBed.createComponent(Lesson04ServiciosDi);
    fixture.detectChanges();
    const el = fixture.nativeElement as HTMLElement;

    buttonByText(el, 'Cargar personajes')?.click();
    fixture.detectChanges();

    httpMock
      .expectOne('/people/')
      .flush('boom', { status: 500, statusText: 'Server Error' });

    await fixture.whenStable();
    fixture.detectChanges();

    expect(el.textContent).toContain('SWAPI está respondiendo con errores');
  });
});
