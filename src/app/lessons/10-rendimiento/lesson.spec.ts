import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { Lesson10Rendimiento } from './lesson';

function renderCount(root: HTMLElement): number {
  const text = root.querySelector('.l10-render__count')?.textContent ?? '0';
  return Number.parseInt(text, 10);
}

function buttonByText(root: HTMLElement, text: string): HTMLButtonElement | undefined {
  return [...root.querySelectorAll('button')].find((button) =>
    (button.textContent ?? '').includes(text),
  );
}

describe('Lección 10 · rendimiento', () => {
  beforeEach(async () => {
    localStorage.clear();
    await TestBed.configureTestingModule({
      imports: [Lesson10Rendimiento],
      providers: [provideRouter([])],
    }).compileComponents();
  });

  it('el hijo OnPush no se renderiza por estado que no lee', () => {
    const fixture = TestBed.createComponent(Lesson10Rendimiento);
    fixture.detectChanges();
    const el = fixture.nativeElement as HTMLElement;

    const before = renderCount(el);
    expect(before).toBeGreaterThan(0);

    buttonByText(el, 'Incrementar estado no relacionado')?.click();
    fixture.detectChanges();

    expect(renderCount(el)).toBe(before);
    expect(el.textContent).toContain('Estado no relacionado: 1');
  });

  it('sí se renderiza cuando cambia su input', () => {
    const fixture = TestBed.createComponent(Lesson10Rendimiento);
    fixture.detectChanges();
    const el = fixture.nativeElement as HTMLElement;

    const before = renderCount(el);

    buttonByText(el, 'C-3PO')?.click();
    fixture.detectChanges();

    expect(renderCount(el)).toBeGreaterThan(before);
    expect(el.querySelector('.l10-render')?.textContent).toContain('C-3PO');
  });

  it('track por id mantiene las filas al rotar el orden', () => {
    const fixture = TestBed.createComponent(Lesson10Rendimiento);
    fixture.detectChanges();
    const el = fixture.nativeElement as HTMLElement;

    const firstRow = () => el.querySelector('.l10-list .l10-row .l10-row__btn')?.textContent ?? '';
    expect(firstRow()).toContain('Luke Skywalker');

    buttonByText(el, 'Rotar el orden')?.click();
    fixture.detectChanges();

    expect(firstRow()).toContain('C-3PO');
  });
});
