import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { Lesson08ComposicionDi } from './lesson';

function buttonByText(root: HTMLElement, text: string): HTMLButtonElement | undefined {
  return [...root.querySelectorAll('button')].find((button) =>
    (button.textContent ?? '').includes(text),
  );
}

describe('Lección 08 · composición e inyección', () => {
  beforeEach(async () => {
    localStorage.clear();
    await TestBed.configureTestingModule({
      imports: [Lesson08ComposicionDi],
      providers: [provideRouter([])],
    }).compileComponents();
  });

  function render(): { fixture: ComponentFixture<Lesson08ComposicionDi>; el: HTMLElement } {
    const fixture = TestBed.createComponent(Lesson08ComposicionDi);
    fixture.detectChanges();
    TestBed.tick();
    fixture.detectChanges();
    return { fixture, el: fixture.nativeElement as HTMLElement };
  }

  it('proyecta contenido en los slots y detecta la directiva con contentChild', () => {
    const { el } = render();

    expect(el.querySelector('.composed-card')).not.toBeNull();
    expect(el.querySelector('.l08-icon')?.textContent).toContain('✦');
    expect(el.textContent).toContain('slot de acciones');
    expect(el.textContent).toContain('contentChild detectado · tono accent');
  });

  it('contentChild reacciona al quitar y poner el icono', () => {
    const { fixture, el } = render();

    buttonByText(el, 'Quitar icono')?.click();
    fixture.detectChanges();

    expect(el.querySelector('.l08-icon')).toBeNull();
    expect(el.textContent).not.toContain('contentChild detectado');

    buttonByText(el, 'Añadir icono')?.click();
    fixture.detectChanges();

    expect(el.querySelector('.l08-icon')).not.toBeNull();
    expect(el.textContent).toContain('contentChild detectado');
  });

  it('la directiva de atributo actualiza su tono', () => {
    const { fixture, el } = render();

    buttonByText(el, 'danger')?.click();
    fixture.detectChanges();

    expect(el.textContent).toContain('contentChild detectado · tono danger');
    expect(el.querySelector('.l08-icon')?.getAttribute('data-tone')).toBe('danger');
  });

  it('la directiva estructural crea el número de copias pedido', () => {
    const { fixture, el } = render();

    expect(el.querySelectorAll('.l08-repeat').length).toBe(3);

    buttonByText(el, '×5')?.click();
    fixture.detectChanges();

    expect(el.querySelectorAll('.l08-repeat').length).toBe(5);
  });

  it('el provider local no cambia el valor root', () => {
    const { el } = render();

    expect(el.textContent).toContain('https://local.example/api');
    expect(el.querySelector('.l08-provider')).not.toBeNull();
    expect(el.textContent).toContain('Provider root');
  });
});
