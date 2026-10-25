import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { Lesson02Signals } from './lesson';

function buttonByText(root: HTMLElement, text: string): HTMLButtonElement | undefined {
  return [...root.querySelectorAll('button')].find((button) =>
    (button.textContent ?? '').includes(text),
  );
}

describe('Lección 02 · signals y estado', () => {
  beforeEach(async () => {
    localStorage.clear();
    await TestBed.configureTestingModule({
      imports: [Lesson02Signals],
      providers: [provideRouter([])],
    }).compileComponents();
  });

  it('actualiza el signal y sus valores derivados', () => {
    const fixture = TestBed.createComponent(Lesson02Signals);
    fixture.detectChanges();
    const el = fixture.nativeElement as HTMLElement;

    expect(el.querySelector('.l02-summary')?.textContent).toContain('Valor: 0');

    buttonByText(el, '+1')?.click();
    fixture.detectChanges();

    expect(el.querySelector('.l02-summary')?.textContent).toContain('Valor: 1');
    expect(el.querySelector('.l02-summary')?.textContent).toContain('Doble: 2');
    expect(el.querySelector('.l02-summary')?.textContent).toContain('Impar');
  });

  it('registra cada movimiento y sólo pinta los cinco últimos', () => {
    const fixture = TestBed.createComponent(Lesson02Signals);
    fixture.detectChanges();
    const el = fixture.nativeElement as HTMLElement;

    for (let index = 0; index < 7; index += 1) {
      buttonByText(el, '+1')?.click();
    }
    fixture.detectChanges();

    expect(el.querySelectorAll('.l02-log__list li').length).toBe(5);
    expect(el.textContent).toContain('Mostrando 5 de 7');
  });

  it('reiniciar devuelve el contador a cero y vacía el registro', () => {
    const fixture = TestBed.createComponent(Lesson02Signals);
    fixture.detectChanges();
    const el = fixture.nativeElement as HTMLElement;

    buttonByText(el, '+1')?.click();
    buttonByText(el, 'Reiniciar')?.click();
    fixture.detectChanges();

    expect(el.querySelector('.l02-summary')?.textContent).toContain('Valor: 0');
    expect(el.textContent).toContain('Aún no hay movimientos.');
  });

  it('el hijo escribe en el model() y el padre lo lee', () => {
    const fixture = TestBed.createComponent(Lesson02Signals);
    fixture.detectChanges();
    const el = fixture.nativeElement as HTMLElement;

    el.querySelector<HTMLButtonElement>('.rating__star:nth-of-type(5)')?.click();
    fixture.detectChanges();

    expect(el.textContent).toContain('El padre lee la valoración actual: 5 / 5.');
  });
});
