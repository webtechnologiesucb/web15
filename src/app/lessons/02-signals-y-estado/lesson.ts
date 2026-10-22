// src/app/lessons/02-signals-y-estado/lesson.ts
// Lección 02 · Estado reactivo con signals
import { Component, computed, linkedSignal, signal } from '@angular/core';

import { requireLesson } from '../../data/lessons';
import { LessonShell } from '../../shared/lesson/lesson-shell';
import { BaseBadge } from '../../shared/ui/base-badge';
import { BaseButton } from '../../shared/ui/base-button';
import { BaseCard } from '../../shared/ui/base-card';
import { CodeBlock } from '../../shared/ui/code-block';
import { LikeButton } from '../../shared/demo/like-button';

interface LogEntry {
  id: number;
  texto: string;
  hora: string;
}

@Component({
  selector: 'app-lesson-02',
  imports: [LessonShell, BaseCard, BaseBadge, BaseButton, CodeBlock, LikeButton],
  templateUrl: './lesson.html',
  styles: ':host { display: contents; }',
})
export class Lesson02Signals {
  protected readonly lesson = requireLesson('02-signals-y-estado');

  /** Signal básico: valor mutable con set/update. */
  protected readonly contador = signal(0);

  /** Estado derivado con computed(): nunca se duplica. */
  protected readonly doble = computed(() => this.contador() * 2);

  protected readonly parOImpar = computed(() =>
    this.contador() === 0 ? 'Cero' : this.contador() % 2 === 0 ? 'Par' : 'Impar',
  );

  /** Registro de movimientos. */
  protected readonly log = signal<LogEntry[]>([]);

  private nextId = 1;

  protected readonly ultimosCinco = computed(() => this.log().slice(-5));

  protected incrementar(): void {
    this.contador.update((v) => v + 1);
    this.registrar(`+1 → ${this.contador() + 0}`); // usamos el nuevo valor
    // mejor calcular nuevo valor
  }

  protected decrementar(): void {
    this.contador.update((v) => v - 1);
    this.registrar(`-1`);
  }

  protected reset(): void {
    this.contador.set(0);
    this.log.set([]);
    this.nextId = 1;
  }

  private registrar(texto: string): void {
    const entry: LogEntry = {
      id: this.nextId++,
      texto,
      hora: new Date().toLocaleTimeString(),
    };
    this.log.update((items) => [...items, entry]);
  }

  protected readonly signalSnippet = `// Crear un signal
const count = signal(0);

// Leerlo en plantilla o con ()
console.log(count()); // 0

// Actualizarlo
count.set(5);           // asigna un valor
count.update(v => v+1); // basado en el valor anterior`;

  protected readonly computedSnippet = `// Valor derivado, se recalcula solo si sus signals cambian
const double = computed(() => count() * 2);

// No se puede asignar directamente
// double.set(10); // error`;

  protected readonly inmutableSnippet = `// Arrays: crear uno nuevo, no mutar
items.update(list => [...list, nuevoItem]);
items.update(list => list.filter(x => x.id !== id));

// Objetos: spread
user.update(u => ({ ...u, nombre: 'Han' }));`;

  protected readonly linkedSnippet = `// linkedSignal: nace de un input, se puede modificar
initialLikes = input(0);
count = linkedSignal(() => this.initialLikes());
// count() puede cambiar con set/update`;
}