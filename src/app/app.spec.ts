import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { App } from './app';
import { lessons } from './data/lessons';

describe('App (el shell)', () => {
  beforeEach(async () => {
    localStorage.clear();
    await TestBed.configureTestingModule({
      imports: [App],
      providers: [provideRouter([]), provideHttpClient(), provideHttpClientTesting()],
    }).compileComponents();
  });

  it('se crea', () => {
    const fixture = TestBed.createComponent(App);
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('pinta la marca, la cabecera y el pie', async () => {
    const fixture = TestBed.createComponent(App);
    await fixture.whenStable();
    const el = fixture.nativeElement as HTMLElement;

    expect(el.querySelector('.brand__text strong')?.textContent).toContain('Angular');
    expect(el.querySelector('.header')).not.toBeNull();
    expect(el.querySelector('.footer')).not.toBeNull();
    expect(el.querySelector('.app__main')).not.toBeNull();
  });

  it('la barra lateral lista las diez lecciones y los cinco recursos', async () => {
    const fixture = TestBed.createComponent(App);
    await fixture.whenStable();
    const el = fixture.nativeElement as HTMLElement;

    expect(el.querySelectorAll('.lesson-link').length).toBe(lessons.length);
    expect(el.querySelectorAll('.resource-link').length).toBe(5);
  });

  it('el botón de menú abre y cierra la barra lateral', async () => {
    const fixture = TestBed.createComponent(App);
    await fixture.whenStable();
    const el = fixture.nativeElement as HTMLElement;

    const sidebar = el.querySelector('#sidebar');
    const burger = el.querySelector<HTMLButtonElement>('.header__burger');

    expect(sidebar?.classList.contains('sidebar--open')).toBe(false);

    burger?.click();
    fixture.detectChanges();
    expect(sidebar?.classList.contains('sidebar--open')).toBe(true);

    burger?.click();
    fixture.detectChanges();
    expect(sidebar?.classList.contains('sidebar--open')).toBe(false);
  });
});
