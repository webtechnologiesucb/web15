import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { Lesson01Componentes } from './lesson';

/** Busca un botón por el texto que muestra. */
function buttonByText(root: HTMLElement, text: string): HTMLButtonElement | undefined {
  return [...root.querySelectorAll('button')].find((button) =>
    (button.textContent ?? '').includes(text),
  );
}

describe('Lección 01 · componentes y plantillas', () => {
  beforeEach(async () => {
    localStorage.clear();
    // El marco de lección usa `routerLink` (pager), así que hace falta el router.
    await TestBed.configureTestingModule({
      imports: [Lesson01Componentes],
      providers: [provideRouter([])],
    }).compileComponents();
  });

  it('envuelve el contenido en el marco común de lección', () => {
    const fixture = TestBed.createComponent(Lesson01Componentes);
    fixture.detectChanges();
    const el = fixture.nativeElement as HTMLElement;

    expect(el.querySelector('.lesson__title')?.textContent).toContain('Componentes y plantillas');
    expect(el.querySelector('.lesson__summary')).not.toBeNull();
  });

  it('pinta la ficha del primer personaje con @for y @switch', () => {
    const fixture = TestBed.createComponent(Lesson01Componentes);
    fixture.detectChanges();
    const el = fixture.nativeElement as HTMLElement;

    expect(el.textContent).toContain('Luke Skywalker');
    expect(el.querySelectorAll('.l01-skills li').length).toBe(3);
    expect(el.textContent).toContain('Jedi · lado luminoso');
  });

  it('el binding de evento sube el poder del medidor', () => {
    const fixture = TestBed.createComponent(Lesson01Componentes);
    fixture.detectChanges();
    const el = fixture.nativeElement as HTMLElement;

    expect(el.textContent).toContain('78 / 100');

    buttonByText(el, '+5 de poder')?.click();
    fixture.detectChanges();

    expect(el.textContent).toContain('83 / 100');
  });

  it('cambia de personaje y reinicia el poder añadido', () => {
    const fixture = TestBed.createComponent(Lesson01Componentes);
    fixture.detectChanges();
    const el = fixture.nativeElement as HTMLElement;

    buttonByText(el, 'Siguiente personaje')?.click();
    fixture.detectChanges();

    expect(el.textContent).toContain('Chewbacca');
    expect(el.textContent).toContain('91 / 100');
  });
});
