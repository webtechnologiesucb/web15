import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { Lesson09AnimacionesUx } from './lesson';

function buttonByText(root: HTMLElement, text: string): HTMLButtonElement | undefined {
  return [...root.querySelectorAll('button')].find((button) =>
    (button.textContent ?? '').includes(text),
  );
}

function animationEnd(name: string): AnimationEvent {
  const event = new Event('animationend') as AnimationEvent;
  Object.defineProperty(event, 'animationName', { value: name });
  return event;
}

describe('Lección 09 · animaciones y UX', () => {
  beforeEach(async () => {
    localStorage.clear();
    await TestBed.configureTestingModule({
      imports: [Lesson09AnimacionesUx],
      providers: [provideRouter([])],
    }).compileComponents();
  });

  afterEach(() => vi.useRealTimers());

  it('marca el elemento como saliendo y lo desmonta al terminar la animación', () => {
    const fixture = TestBed.createComponent(Lesson09AnimacionesUx);
    fixture.detectChanges();
    const el = fixture.nativeElement as HTMLElement;

    expect(el.querySelectorAll('.l09-item').length).toBe(3);

    el.querySelector<HTMLButtonElement>('.l09-item button')?.click();
    fixture.detectChanges();

    expect(el.querySelectorAll('.l09-item').length).toBe(3);
    expect(el.querySelectorAll('.l09-item--leaving').length).toBe(1);

    el.querySelector('.l09-item--leaving')?.dispatchEvent(animationEnd('l09-out'));
    fixture.detectChanges();

    expect(el.querySelectorAll('.l09-item').length).toBe(2);
  });

  it('ignora animationend de la animación de entrada', () => {
    const fixture = TestBed.createComponent(Lesson09AnimacionesUx);
    fixture.detectChanges();
    const el = fixture.nativeElement as HTMLElement;

    el.querySelector('.l09-item')?.dispatchEvent(animationEnd('l09-in'));
    fixture.detectChanges();

    expect(el.querySelectorAll('.l09-item').length).toBe(3);
  });

  it('añade un droide nuevo a la lista', () => {
    const fixture = TestBed.createComponent(Lesson09AnimacionesUx);
    fixture.detectChanges();
    const el = fixture.nativeElement as HTMLElement;

    buttonByText(el, 'Añadir droide')?.click();
    fixture.detectChanges();

    expect(el.querySelectorAll('.l09-item').length).toBe(4);
    expect(el.textContent).toContain('Droide E');
  });

  it('muestra el skeleton y después las tarjetas cargadas', async () => {
    vi.useFakeTimers();
    const fixture = TestBed.createComponent(Lesson09AnimacionesUx);
    fixture.detectChanges();
    const el = fixture.nativeElement as HTMLElement;

    buttonByText(el, 'Simular carga')?.click();
    fixture.detectChanges();

    expect(el.querySelectorAll('.sk').length).toBe(3);
    expect(el.textContent).toContain('Cargando tarjetas');

    await vi.advanceTimersByTimeAsync(700);
    fixture.detectChanges();

    expect(el.querySelectorAll('.sk').length).toBe(0);
    expect(el.textContent).toContain('Droide de protocolo');
    expect(el.textContent).toContain('datos listos');

    vi.useRealTimers();
  });
});
