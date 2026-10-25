import { TestBed } from '@angular/core/testing';
import { Router, provideRouter } from '@angular/router';

import { Lesson05Router } from './lesson';

function buttonByText(root: HTMLElement, text: string): HTMLButtonElement | undefined {
  return [...root.querySelectorAll('button')].find((button) =>
    (button.textContent ?? '').includes(text),
  );
}

describe('Lección 05 · router', () => {
  beforeEach(async () => {
    localStorage.clear();
    await TestBed.configureTestingModule({
      imports: [Lesson05Router],
      providers: [provideRouter([])],
    }).compileComponents();
  });

  it('pinta los enlaces del router y la URL actual', () => {
    const fixture = TestBed.createComponent(Lesson05Router);
    fixture.detectChanges();
    const el = fixture.nativeElement as HTMLElement;

    expect(el.querySelectorAll('.chips .chip').length).toBe(5);
    expect(el.querySelector('.l05-json')?.textContent).toContain('/');
    expect(el.querySelectorAll('.l05-route').length).toBeGreaterThan(4);
  });

  it('cambia el query param sin salir de la lección', async () => {
    const fixture = TestBed.createComponent(Lesson05Router);
    fixture.detectChanges();
    const el = fixture.nativeElement as HTMLElement;

    buttonByText(el, 'Planeta')?.click();
    await fixture.whenStable();
    fixture.detectChanges();

    expect(el.textContent).toContain('demo=planets');
    expect(TestBed.inject(Router).url).toContain('demo=planets');
  });

  it('limpiar elimina el query param', async () => {
    const fixture = TestBed.createComponent(Lesson05Router);
    fixture.detectChanges();
    const el = fixture.nativeElement as HTMLElement;

    buttonByText(el, 'Planeta')?.click();
    await fixture.whenStable();

    buttonByText(el, 'Limpiar')?.click();
    await fixture.whenStable();
    fixture.detectChanges();

    expect(el.textContent).toContain('demo=people');
    expect(TestBed.inject(Router).url).not.toContain('demo=planets');
  });
});
