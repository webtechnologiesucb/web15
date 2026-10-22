// src/app/data/lessons.ts
// Metadatos de la ruta de aprendizaje: 10 lecciones, 330 minutos.
//
// Los metadatos viven aquí (una sola fuente de verdad) y cada vista de lección
// se asocia en `app.routes.ts` con `loadComponent`.

export type LessonLevel = 'Inicial' | 'Intermedio' | 'Avanzado';

export interface Lesson {
  /** Identificador estable; también es el último segmento de la URL. */
  id: string;
  order: number;
  title: string;
  subtitle: string;
  summary: string;
  concepts: string[];
  level: LessonLevel;
  /** Duración estimada en minutos. */
  duration: number;
  /** Retos propuestos al terminar la lección. */
  challenges: string[];
}

export const lessons: Lesson[] = [
  {
    id: '01-componentes-y-plantillas',
    order: 1,
    title: 'Componentes y plantillas',
    subtitle: 'Standalone components, binding y bloques de control',
    summary:
      'Un componente Angular es una clase con @Component que declara su selector, su plantilla y lo que necesita importar. Aquí verás interpolación, binding de propiedades y atributos, escucha de eventos, los bloques @if / @for / @switch y cómo exponer entradas con input().',
    concepts: ['@Component', 'standalone', 'interpolación', 'property & attribute binding', '@if / @for / @switch', 'input()'],
    level: 'Inicial',
    duration: 25,
    challenges: [
      'Añade una cuarta estadística a la ficha del personaje (por ejemplo, el color de ojos).',
      'Haz que la barra de poder también reaccione a la masa del personaje.',
      'Convierte la lista de habilidades en un @for con track por nombre.',
    ],
  },
  {
    id: '02-signals-y-estado',
    order: 2,
    title: 'Estado reactivo con signals',
    subtitle: 'Interacción, inmutabilidad y valores derivados',
    summary:
      'Los signals son el corazón del Angular moderno: un valor reactivo que avisa a la plantilla cuando cambia. Aprenderás set y update, a no duplicar estado y a calcularlo con computed(), además de actualizar arrays y objetos sin mutarlos.',
    concepts: ['signal()', 'set / update', 'computed()', 'inmutabilidad', 'estado derivado', 'model()'],
    level: 'Inicial',
    duration: 30,
    challenges: [
      'Añade un botón «reiniciar» que devuelva el contador a 0 y vacíe el registro.',
      'Guarda cada movimiento como objeto { id, texto, hora } y píntalo con @for.',
      'Convierte el registro en un computed que sólo muestre los últimos 5 movimientos.',
    ],
  },
  {
    id: '03-datos-asincronos',
    order: 3,
    title: 'Datos asíncronos con HttpClient',
    subtitle: 'Observables, httpResource y los tres estados',
    summary:
      'Peticiones reales a SWAPI con HttpClient: se registra con provideHttpClient, se escribe con rutas relativas (el interceptor pone la base) y se convierte a signals con httpResource. Verás los tres estados, la cancelación automática al cambiar de recurso y cómo probarlo con provideHttpClientTesting.',
    concepts: ['provideHttpClient', 'HttpClient', 'Observable', 'httpResource()', 'tres estados', 'cancelación'],
    level: 'Intermedio',
    duration: 35,
    challenges: [
      'Añade un botón «recargar» que llame a reload() del recurso.',
      'Muestra cuánto ha tardado la petición usando performance.now().',
      'Pide el personaje 9999 y comprueba el mensaje del 404.',
    ],
  },
  {
    id: '04-servicios-di',
    order: 4,
    title: 'Servicios e inyección de dependencias',
    subtitle: 'SwapiService, inject() y tokens de inyección',
    summary:
      'La lógica de red se extrae a un servicio inyectable y los componentes lo piden con inject(). Verás providedIn: "root", genéricos que deducen el tipo a partir del recurso, un InjectionToken para la configuración y cómo funciona la jerarquía de inyectores.',
    concepts: ['@Injectable', 'inject()', 'providedIn: root', 'genéricos + keyof', 'InjectionToken', 'jerarquía de inyectores'],
    level: 'Intermedio',
    duration: 35,
    challenges: [
      'Añade a SwapiService un método que devuelva sólo el total de un recurso.',
      'Crea un token SWAPI_PAGE_SIZE y úsalo como valor por defecto.',
      'Escribe una prueba que sustituya SwapiService por un doble con TestBed.',
    ],
  },
  {
    id: '05-router',
    order: 5,
    title: 'Router',
    subtitle: 'Rutas, parámetros, títulos y carga diferida',
    summary:
      'Navegación con RouterLink y RouterLinkActive, parámetros de ruta como entradas gracias a withComponentInputBinding, carga diferida con loadComponent, título por ruta y una ruta comodín para los 404. El explorador de SWAPI es el ejemplo real.',
    concepts: ['provideRouter', 'RouterLink / RouterLinkActive', 'withComponentInputBinding', 'loadComponent', 'title', 'ruta **'],
    level: 'Intermedio',
    duration: 40,
    challenges: [
      'Añade una ruta /lecciones/:id que muestre el detalle de una lección.',
      'Activa withInMemoryScrolling para volver arriba al navegar.',
      'Escribe un guard que bloquee una ruta de ejemplo.',
    ],
  },
  {
    id: '06-estado-global',
    order: 6,
    title: 'Estado global con servicios y signals',
    subtitle: 'Favoritos, progreso y persistencia sin librerías',
    summary:
      'Un servicio con providedIn: "root" es un singleton: todo componente que lo inyecte comparte el mismo estado. Así se construyen los favoritos y el progreso del curso: signals privados, asReadonly(), un effect() que persiste en localStorage y un vistazo a NgRx SignalStore.',
    concepts: ['servicio singleton', 'signal privado + asReadonly()', 'computed()', 'effect()', 'localStorage', 'NgRx SignalStore'],
    level: 'Intermedio',
    duration: 35,
    challenges: [
      'Añade un botón para vaciar la lista de favoritos.',
      'Persiste la última lección visitada y muéstrala en la portada.',
      'Sustituye el effect() de persistencia por un linkedSignal y explica la diferencia.',
    ],
  },
  {
    id: '07-formularios',
    order: 7,
    title: 'Formularios reactivos',
    subtitle: 'Búsqueda con debounce, validación y filtros',
    summary:
      'Formularios reactivos con FormControl y FormGroup: una búsqueda contra SWAPI con valueChanges + debounceTime + switchMap, un desplegable de recursos, una casilla y el estado del formulario (válido, tocado, pendiente).',
    concepts: ['ReactiveFormsModule', 'FormControl / FormGroup', 'valueChanges', 'debounceTime / switchMap', 'validadores', 'estado del formulario'],
    level: 'Intermedio',
    duration: 35,
    challenges: [
      'Añade un validador que exija al menos 3 caracteres.',
      'Muestra un contador de peticiones lanzadas.',
      'Añade una casilla «sólo favoritos» que filtre los resultados.',
    ],
  },
  {
    id: '08-composicion-di',
    order: 8,
    title: 'Composición, directivas e inyección',
    subtitle: 'ng-content, contentChild y host bindings',
    summary:
      'Composición con <ng-content> y slots (select), consulta del contenido proyectado con contentChild(), una directiva de atributo con host bindings, estilos realmente encapsulados y providers locales para cambiar una dependencia sólo en un subárbol.',
    concepts: ['ng-content', 'slots con select', 'contentChild()', 'directiva de atributo', 'host bindings', 'ViewEncapsulation', 'providers por componente'],
    level: 'Avanzado',
    duration: 30,
    challenges: [
      'Añade un segundo slot a la tarjeta con su propia clase CSS.',
      'Convierte la directiva de atributo en estructural (TemplateRef + ViewContainerRef).',
      'Usa providers: [...] en un componente para inyectar otra implementación del servicio.',
    ],
  },
  {
    id: '09-animaciones-ux',
    order: 9,
    title: 'Animaciones y UX de carga',
    subtitle: 'Transiciones CSS, salida animada y @defer',
    summary:
      'Animaciones sin dependencias: transiciones CSS gobernadas por el estado, animación del desmontaje escuchando (animationend), esqueletos durante la carga y el bloque @defer con placeholder y loading para trocear el bundle.',
    concepts: ['transiciones CSS', '(animationend)', 'animar el desmontaje', 'skeletons', '@defer', 'prefers-reduced-motion'],
    level: 'Avanzado',
    duration: 35,
    challenges: [
      'Cambia la animación de salida para que se desvanezca en lugar de desplazarse.',
      'Envuelve una tarjeta del explorador en @defer (on viewport).',
      'Comprueba en DevTools que el chunk diferido sólo se descarga cuando hace falta.',
    ],
  },
  {
    id: '10-rendimiento',
    order: 10,
    title: 'Rendimiento y zoneless',
    subtitle: 'OnPush, signals y code splitting',
    summary:
      'Cierre del curso: por qué ChangeDetectionStrategy.OnPush junto a los signals evita renders innecesarios, cómo funciona el cambio de detección zoneless que Angular 21 trae por defecto, qué hace track en @for y un checklist para no optimizar a ciegas.',
    concepts: ['ChangeDetectionStrategy.OnPush', 'signals y detección de cambios', 'zoneless', '@for track', '@defer', 'Angular DevTools'],
    level: 'Avanzado',
    duration: 30,
    challenges: [
      'Pasa una tarjeta del explorador a OnPush y observa cuántas veces se renderiza.',
      'Usa un track personalizado en un @for y compáralo con el track por índice.',
      'Mide en DevTools el arranque con y sin @defer.',
    ],
  },
];

/** Duración total de la ruta (330 minutos). */
export const totalDuration = lessons.reduce((total, lesson) => total + lesson.duration, 0);

export function getLesson(id: string): Lesson | undefined {
  return lessons.find((lesson) => lesson.id === id);
}

/**
 * Igual que `getLesson`, pero falla al arrancar si el id no existe.
 * Lo usan las propias lecciones: su id es una constante del código, así que un
 * error aquí es un error de programación, no un caso que haya que tolerar.
 */
export function requireLesson(id: string): Lesson {
  const lesson = getLesson(id);
  if (lesson === undefined) {
    throw new Error(`Lección desconocida: ${id}`);
  }
  return lesson;
}

export function getAdjacentLessons(id: string): { previous?: Lesson; next?: Lesson } {
  const index = lessons.findIndex((lesson) => lesson.id === id);
  if (index < 0) return {};
  return { previous: lessons[index - 1], next: lessons[index + 1] };
}
