import { provideHttpClient } from '@angular/common/http';
import {
  HttpTestingController,
  provideHttpClientTesting,
} from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { Lesson03DatosAsincronos } from './lesson';

function buttonByText(root: HTMLElement, text: string): HTMLButtonElement | undefined {
  return [...root.querySelectorAll('button')].find((button) =>
    (button.textContent ?? '').includes(text),
  );
}

/** Deja que los efectos y el loader de `httpResource` terminen su turno. */
async function settle(): Promise<void> {
  await new Promise((resolve) => setTimeout(resolve));
}

const LUKE = {
  name: 'Luke Skywalker',
  height: '172',
  mass: '77',
  gender: 'male',
  birth_year: '19BBY',
  url: 'https://swapi.dev/api/people/1/',
};

describe('Lección 03 · datos asíncronos', () => {
  let httpMock: HttpTestingController;

  beforeEach(async () => {
    localStorage.clear();
    await TestBed.configureTestingModule({
      imports: [Lesson03DatosAsincronos],
      providers: [provideRouter([]), provideHttpClient(), provideHttpClientTesting()],
    }).compileComponents();

    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => httpMock.verify());

  it('pinta el estado de carga y después los datos', async () => {
    const fixture = TestBed.createComponent(Lesson03DatosAsincronos);
    fixture.detectChanges();
    await settle();
    fixture.detectChanges();
    const el = fixture.nativeElement as HTMLElement;

    expect(el.textContent).toContain('Cargando personaje');

    httpMock.expectOne('/people/1/').flush(LUKE);
    await settle();
    fixture.detectChanges();

    expect(el.textContent).toContain('Luke Skywalker');
    expect(el.textContent).toContain('172 cm');
    expect(el.textContent).toContain('success');
  });

  it('al cambiar de personaje lanza la petición del nuevo id', async () => {
    const fixture = TestBed.createComponent(Lesson03DatosAsincronos);
    fixture.detectChanges();
    await settle();
    fixture.detectChanges();
    httpMock.expectOne('/people/1/').flush(LUKE);
    await settle();
    fixture.detectChanges();

    const el = fixture.nativeElement as HTMLElement;
    buttonByText(el, 'Siguiente')?.click();
    fixture.detectChanges();
    await settle();
    fixture.detectChanges();

    const request = httpMock.expectOne('/people/2/');
    request.flush({ ...LUKE, name: 'C-3PO', url: 'https://swapi.dev/api/people/2/' });
    await settle();
    fixture.detectChanges();

    expect(el.textContent).toContain('C-3PO');
    expect(el.textContent).toContain('Personaje #2');
  });

  it('muestra el mensaje del 404 sin reintentar', async () => {
    const fixture = TestBed.createComponent(Lesson03DatosAsincronos);
    fixture.detectChanges();
    await settle();
    fixture.detectChanges();
    httpMock.expectOne('/people/1/').flush(LUKE);
    await settle();
    fixture.detectChanges();

    const el = fixture.nativeElement as HTMLElement;
    buttonByText(el, 'Probar un 404')?.click();
    fixture.detectChanges();
    await settle();
    fixture.detectChanges();

    httpMock
      .expectOne('/people/9999/')
      .flush('Not found', { status: 404, statusText: 'Not Found' });
    await settle();
    fixture.detectChanges();

    expect(el.textContent).toContain('Ese recurso no existe en SWAPI (404).');
    expect(el.textContent).toContain('error');
  });

  it('recargar repite la petición del personaje actual', async () => {
    const fixture = TestBed.createComponent(Lesson03DatosAsincronos);
    fixture.detectChanges();
    await settle();
    fixture.detectChanges();
    httpMock.expectOne('/people/1/').flush(LUKE);
    await settle();
    fixture.detectChanges();

    const el = fixture.nativeElement as HTMLElement;
    buttonByText(el, 'Recargar')?.click();
    fixture.detectChanges();
    await settle();
    fixture.detectChanges();

    httpMock.expectOne('/people/1/').flush(LUKE);
    await settle();
    fixture.detectChanges();

    expect(el.textContent).toContain('Luke Skywalker');
  });
});
