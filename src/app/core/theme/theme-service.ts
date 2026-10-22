// src/app/core/theme/theme-service.ts
// Tema claro/oscuro con un servicio singleton + signals (lección 06).
//
// En React esto era un Context; en Angular basta un servicio inyectable:
// cualquier componente lo pide con inject(ThemeService) y comparte el estado.
import { Injectable, computed, effect, signal } from '@angular/core';

export type Theme = 'dark' | 'light';

export const THEME_STORAGE_KEY = 'web15-theme';

/** Lee el tema que el script anti-parpadeo dejó en <html data-theme="...">. */
export function readThemeFromDocument(): Theme {
  if (typeof document === 'undefined') return 'dark';
  return document.documentElement.dataset['theme'] === 'light' ? 'light' : 'dark';
}

@Injectable({ providedIn: 'root' })
export class ThemeService {
  private readonly current = signal<Theme>(readThemeFromDocument());

  readonly theme = this.current.asReadonly();
  readonly isLight = computed(() => this.current() === 'light');

  constructor() {
    // Un effect se vuelve a ejecutar cada vez que cambia lo que lee dentro.
    effect(() => {
      const theme = this.current();
      if (typeof document !== 'undefined') {
        document.documentElement.dataset['theme'] = theme;
      }
      try {
        localStorage.setItem(THEME_STORAGE_KEY, theme);
      } catch {
        /* almacenamiento no disponible */
      }
    });
  }

  toggle(): void {
    this.current.update((theme) => (theme === 'dark' ? 'light' : 'dark'));
  }

  set(theme: Theme): void {
    this.current.set(theme);
  }
}
