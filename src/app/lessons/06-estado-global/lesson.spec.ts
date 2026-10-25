import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { FAVORITES_STORAGE_KEY } from '../../store/favorites-store';
import { Lesson06EstadoGlobal } from './lesson';

function buttonByText(root: HTMLElement, text: string): HTMLButtonElement | undefined {
  return [...root.querySelectorAll('button')].find((button) =>
    (button.textContent ?? '').includes(text),
  );
}

describe('Lección 06 · estado global', () => {
  beforeEach(async () => {
    localStorage.clear();
    document.documentElement.dataset['theme'] = 'dark';

    await TestBed.configureTestingModule({
      imports: [Lesson06EstadoGlobal],
      providers: [provideRouter([])],
    }).compileComponents();
  });

  it('comparte el estado de favoritos con el store global', () => {
    const fixture = TestBed.createComponent(Lesson06EstadoGlobal);
    fixture.detectChanges();
    const el = fixture.nativeElement as HTMLElement;

    expect(el.textContent).toContain('0 favorito(s)');

    el.querySelectorAll<HTMLButtonElement>('.l06-candidate button')[0].click();
    fixture.detectChanges();

    expect(el.textContent).toContain('1 favorito(s)');
    expect(el.textContent).toContain('Añadido a favoritos: Luke Skywalker');
    expect(el.textContent).toContain('Luke Skywalker');
  });

  it('persiste los favoritos con el effect del store', () => {
    const fixture = TestBed.createComponent(Lesson06EstadoGlobal);
    fixture.detectChanges();
    const el = fixture.nativeElement as HTMLElement;

    el.querySelectorAll<HTMLButtonElement>('.l06-candidate button')[0].click();
    TestBed.tick();

    expect(JSON.parse(localStorage.getItem(FAVORITES_STORAGE_KEY) ?? 'null')).toEqual([
      '/people/1/',
    ]);
  });

  it('el botón del marco de lección actualiza el progreso global', () => {
    const fixture = TestBed.createComponent(Lesson06EstadoGlobal);
    fixture.detectChanges();
    const el = fixture.nativeElement as HTMLElement;

    expect(el.textContent).toContain('Lección 06 pendiente');

    buttonByText(el, 'Marcar como completada')?.click();
    fixture.detectChanges();

    expect(el.textContent).toContain('Lección 06 completada');
    expect(el.textContent).toContain('1 de 10 lecciones completadas');
  });

  it('vaciar favoritos y cambiar el tema', () => {
    const fixture = TestBed.createComponent(Lesson06EstadoGlobal);
    fixture.detectChanges();
    const el = fixture.nativeElement as HTMLElement;

    el.querySelectorAll<HTMLButtonElement>('.l06-candidate button')[0].click();
    fixture.detectChanges();

    buttonByText(el, 'Vaciar favoritos')?.click();
    fixture.detectChanges();
    expect(el.textContent).toContain('0 favorito(s)');

    buttonByText(el, 'Tema:')?.click();
    TestBed.tick();
    fixture.detectChanges();

    expect(document.documentElement.dataset['theme']).toBe('light');
    expect(el.textContent).toContain('Tema: Claro');
  });
});
