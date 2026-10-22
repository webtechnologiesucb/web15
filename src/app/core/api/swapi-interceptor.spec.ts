import { HttpClient, provideHttpClient, withInterceptors } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { firstValueFrom } from 'rxjs';

import { SWAPI_BASE_URLS } from './swapi-base';
import { swapiInterceptor, swapiPathOf } from './swapi-interceptor';

const DEV = 'https://swapi.dev/api';
const MIRROR = 'https://swapi.py4e.com/api';

describe('swapiPathOf', () => {
  it('deja pasar las rutas relativas', () => {
    expect(swapiPathOf('/people/1/')).toBe('/people/1/');
  });

  it('reconoce las URLs absolutas de SWAPI', () => {
    expect(swapiPathOf('https://swapi.dev/api/films/2/')).toBe('/films/2/');
    expect(swapiPathOf('https://swapi.dev/api')).toBe('/');
  });

  it('devuelve null para las URLs que no son de SWAPI', () => {
    expect(swapiPathOf('https://example.com/people/1/')).toBeNull();
  });
});

describe('swapiInterceptor', () => {
  let http: HttpClient;
  let httpTesting: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(withInterceptors([swapiInterceptor])),
        provideHttpClientTesting(),
        // Dos bases: la principal y un mirror, para poder provocar el fallo.
        { provide: SWAPI_BASE_URLS, useValue: [DEV, MIRROR] },
      ],
    });
    http = TestBed.inject(HttpClient);
    httpTesting = TestBed.inject(HttpTestingController);
  });

  afterEach(() => httpTesting.verify());

  it('reescribe la ruta relativa contra la base principal', async () => {
    const result = firstValueFrom(http.get<{ name: string }>('/people/1/'));

    const request = httpTesting.expectOne(`${DEV}/people/1/`);
    expect(request.request.method).toBe('GET');
    request.flush({ name: 'Luke Skywalker' });

    await expect(result).resolves.toEqual({ name: 'Luke Skywalker' });
  });

  it('reintenta con el mirror cuando la principal falla por red', async () => {
    const result = firstValueFrom(http.get<{ name: string }>('/people/1/'));

    httpTesting.expectOne(`${DEV}/people/1/`).error(new ProgressEvent('error'));
    httpTesting.expectOne(`${MIRROR}/people/1/`).flush({ name: 'Luke Skywalker' });

    await expect(result).resolves.toEqual({ name: 'Luke Skywalker' });
  });

  it('no reintenta cuando el recurso no existe (404)', async () => {
    const result = firstValueFrom(http.get('/people/9999/'));

    httpTesting.expectOne(`${DEV}/people/9999/`).flush('Not found', {
      status: 404,
      statusText: 'Not Found',
    });

    await expect(result).rejects.toMatchObject({ status: 404 });
  });

  it('deja pasar las peticiones que no son de SWAPI', async () => {
    const result = firstValueFrom(http.get('https://example.com/health'));

    httpTesting.expectOne('https://example.com/health').flush({ ok: true });

    await expect(result).resolves.toEqual({ ok: true });
  });
});
