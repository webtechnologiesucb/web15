// src/app/shared/demo/like-button.ts
// Botón "me gusta" con estado propio.
//
// `linkedSignal` es el detalle interesante: el contador nace del input, se
// reinicia si el input cambia y aun así se puede modificar a mano (lección 02).
import { Component, input, linkedSignal, signal } from '@angular/core';

@Component({
  selector: 'app-like-button',
  template: `
    <button
      class="like"
      type="button"
      [attr.aria-pressed]="liked()"
      [attr.title]="liked() ? 'Quitar me gusta' : 'Me gusta'"
      (click)="toggle()"
    >
      <span aria-hidden="true">{{ liked() ? '❤️' : '🤍' }}</span>
      <span>{{ liked() ? 'Te gusta' : 'Me gusta' }}</span>
      <span class="like__count">{{ count() }}</span>
    </button>
  `,
  styles: ':host { display: contents; }',
})
export class LikeButton {
  /** Número inicial de "me gusta" que llega desde fuera. */
  readonly initialLikes = input(0);

  protected readonly liked = signal(false);
  protected readonly count = linkedSignal(() => this.initialLikes());

  protected toggle(): void {
    this.liked.update((liked) => !liked);
    this.count.update((count) => count + (this.liked() ? 1 : -1));
  }
}
