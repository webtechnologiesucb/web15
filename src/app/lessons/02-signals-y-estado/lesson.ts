// src/app/lessons/02-signals-y-estado/lesson.ts
// Lección 02 · Estado reactivo con signals
//
// Todo lo que se mueve en esta lección es estado local: un signal escribible,
// valores derivados con computed() y un array que se reemplaza (nunca se muta)
// para que Angular se entere del cambio.
import { Component, computed, signal } from '@angular/core';

import { LikeButton } from '../../shared/demo/like-button';
import { RatingStars } from '../../shared/demo/rating-stars';
import { requireLesson } from '../../data/lessons';
import { LessonShell } from '../../shared/lesson/lesson-shell';
import { BaseButton } from '../../shared/ui/base-button';
import { BaseCard } from '../../shared/ui/base-card';
import { CodeBlock } from '../../shared/ui/code-block';

interface LogEntry {
  id: number;
  texto: string;
  hora: string;
}

@Component({
  selector: 'app-lesson-02',
  imports: [LessonShell, BaseCard, BaseButton, CodeBlock, LikeButton, RatingStars],
  templateUrl: './lesson.html',
  styles: ':host { display: contents; }',
})
export class Lesson02Signals {
  protected readonly lesson = requireLesson('02-signals-y-estado');

  /** Signal básico: valor mutable con set/update. */
  protected readonly contador = signal(0);

  /** Estado derivado con computed(): nunca se duplica. */
  protected readonly doble = computed(() => this.contador() * 2);

  protected readonly parOImpar = computed(() => {
    const valor = this.contador();
    if (valor === 0) return 'Cero';
    return valor % 2 === 0 ? 'Par' : 'Impar';
  });

  /** El log es un array: cada cambio crea una referencia nueva. */
  protected readonly log = signal<LogEntry[]>([]);

  private nextId = 1;

  /** Sólo pintamos los cinco últimos, pero el estado completo sigue ahí. */
  protected readonly ultimosCinco = computed(() => this.log().slice(-5));
  protected readonly totalMovimientos = computed(() => this.log().length);

  /** `model()` en acción: el hijo puede escribir en este signal. */
  protected readonly rating = signal(3);

  protected incrementar(): void {
    const nuevo = this.contador() + 1;
    this.contador.set(nuevo);
    this.registrar(`+1 → ${nuevo}`);
  }

  protected decrementar(): void {
    const nuevo = this.contador() - 1;
    this.contador.set(nuevo);
    this.registrar(`−1 → ${nuevo}`);
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
    // Inmutabilidad: un array nuevo, no `this.log().push(entry)`.
    this.log.update((items) => [...items, entry]);
  }

  protected readonly signalSnippet = `// Crear un signal
const count = signal(0);

// Leerlo en la plantilla o en el código con ()
console.log(count()); // 0

// Actualizarlo
count.set(5);           // asigna un valor
count.update(v => v + 1); // basado en el valor anterior`;

  protected readonly computedSnippet = `// Valor derivado: se recalcula sólo si sus signals cambian
const double = computed(() => count() * 2);
const parity = computed(() => (count() % 2 === 0 ? 'Par' : 'Impar'));

// No se puede asignar directamente
// double.set(10); // error de compilación`;

  protected readonly inmutableSnippet = `// Arrays: crear uno nuevo, no mutar
items.update(list => [...list, nuevoItem]);
items.update(list => list.filter(x => x.id !== id));

// Objetos: spread
user.update(u => ({ ...u, nombre: 'Han' }));`;

  protected readonly linkedSnippet = `// linkedSignal: nace de un input, se reinicia si el input cambia
// y aun así se puede modificar con set/update.
initialLikes = input(0);
count = linkedSignal(() => this.initialLikes());

// model(): input de doble sentido
value = model(0);
// <app-rating-stars [(value)]="rating" />`;

  protected readonly logSnippet = `// Cada acción crea una entrada nueva
private registrar(texto: string): void {
  const entry = { id: this.nextId++, texto, hora: new Date().toLocaleTimeString() };
  this.log.update(items => [...items, entry]);
}

// Derivado: los cinco últimos sin duplicar el estado
ultimosCinco = computed(() => this.log().slice(-5));`;
}
