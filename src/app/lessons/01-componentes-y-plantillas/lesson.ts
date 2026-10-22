// src/app/lessons/01-componentes-y-plantillas/lesson.ts
// Lección 01 · Componentes y plantillas
//
// Todo lo de esta lección son mecanismos *de plantilla*: interpolar, enlazar
// propiedades y atributos, escuchar eventos, los bloques @if / @for / @switch y
// pasar datos a un componente hijo con `input()`.
import { Component } from '@angular/core';

import { requireLesson } from '../../data/lessons';
import { LessonShell } from '../../shared/lesson/lesson-shell';
import { BaseBadge } from '../../shared/ui/base-badge';
import { BaseButton } from '../../shared/ui/base-button';
import { BaseCard } from '../../shared/ui/base-card';
import { CodeBlock } from '../../shared/ui/code-block';
import { PowerMeter } from './power-meter';

/** Datos de mentira con sabor a SWAPI (en la lección 03 llegan por HTTP). */
interface DemoCharacter {
  name: string;
  species: string;
  side: 'Jedi' | 'Rebelde' | 'Imperio';
  icon: string;
  height: number;
  mass: number;
  birthYear: string;
  power: number;
  abilities: string[];
}

const CHARACTERS: DemoCharacter[] = [
  {
    name: 'Luke Skywalker',
    species: 'Humano',
    side: 'Jedi',
    icon: '🧑‍🚀',
    height: 172,
    mass: 77,
    birthYear: '19BBY',
    power: 78,
    abilities: ['La Fuerza', 'Sable de luz', 'Piloto de X-wing'],
  },
  {
    name: 'Chewbacca',
    species: 'Wookiee',
    side: 'Rebelde',
    icon: '🐻',
    height: 228,
    mass: 112,
    birthYear: '200BBY',
    power: 91,
    abilities: ['Fuerza bruta', 'Mecánico', 'Copiloto del Halcón Milenario'],
  },
  {
    name: 'Darth Vader',
    species: 'Humano',
    side: 'Imperio',
    icon: '🖤',
    height: 202,
    mass: 136,
    birthYear: '41.9BBY',
    power: 96,
    abilities: ['La Fuerza', 'Sable de luz', 'Estrangulamiento a distancia'],
  },
];

@Component({
  selector: 'app-lesson-01',
  imports: [LessonShell, BaseCard, BaseBadge, BaseButton, CodeBlock, PowerMeter],
  templateUrl: './lesson.html',
  // El host no crea caja: el contenido participa del layout de la vista.
  styles: ':host { display: contents; }',
})
export class Lesson01Componentes {
  /** Los metadatos (título, nivel, retos…) salen de una única fuente de verdad. */
  protected readonly lesson = requireLesson('01-componentes-y-plantillas');

  /**
   * Las llaves dobles no se pueden escribir literalmente en una plantilla
   * (Angular las interpretaría), así que se guardan en una cadena y se pintan.
   */
  protected readonly braces = '{{ expresión }}';

  protected readonly characters = CHARACTERS;

  /** Campos normales de clase: la plantilla los lee y los eventos los cambian. */
  protected index = 0;
  protected boost = 0;

  protected get character(): DemoCharacter {
    return this.characters[this.index];
  }

  /** Valor derivado: el poder base más lo que ha añadido el usuario. */
  protected get power(): number {
    return Math.min(100, this.character.power + this.boost);
  }

  protected select(index: number): void {
    this.index = index;
    this.boost = 0;
  }

  protected next(): void {
    this.select((this.index + 1) % this.characters.length);
  }

  protected boostPower(): void {
    const room = 100 - this.character.power;
    this.boost = Math.min(room, this.boost + 5);
  }

  protected readonly classSnippet = `@Component({
  selector: 'app-lesson-01',
  imports: [LessonShell, BaseCard, BaseBadge, BaseButton, CodeBlock, PowerMeter],
  templateUrl: './lesson.html',
})
export class Lesson01Componentes {
  protected readonly lesson = requireLesson('01-componentes-y-plantillas');

  protected index = 0;   // personaje seleccionado
  protected boost = 0;   // poder extra que añade el usuario

  protected get character(): DemoCharacter {
    return this.characters[this.index];
  }

  protected next(): void {
    this.index = (this.index + 1) % this.characters.length;
  }
}`;

  protected readonly templateSnippet = `<app-base-card [title]="character.name" [subtitle]="character.species">
  <p>Altura: {{ character.height }} cm</p>

  <!-- el hijo recibe el número; él decide cómo pintarlo -->
  <app-power-meter label="Nivel de poder" [value]="power" />

  @if (power >= 90) {
    <p>⚠️ Poder desmedido</p>
  } @else {
    <p>Poder bajo control.</p>
  }

  <ul class="l01-skills">
    @for (ability of character.abilities; track ability) {
      <li>{{ ability }}</li>
    }
  </ul>
</app-base-card>`;

  protected readonly meterSnippet = `export class PowerMeter {
  readonly label = input('Poder');            // con valor por defecto
  readonly value = input.required<number>();  // obligatorio
  readonly max = input(100);

  protected readonly percent = computed(() =>
    Math.round((this.value() / this.max()) * 100),
  );
}`;
}
