# Ruta de aprendizaje Angular 21 + SWAPI

Showcase didáctico en **Angular 21** que propone una **ruta de aprendizaje progresiva en 10
lecciones** (~5 h 30 min). Cada lección combina tres piezas:

1. una **demo interactiva** que funciona de verdad,
2. el **código clave** comentado,
3. una lista de **retos** para practicar.

Todos los ejemplos usan datos reales de **[SWAPI](https://swapi.dev/)** (Star Wars API):
personajes, planetas, películas, naves y especies. La misma API alimenta un explorador con
paginación, búsqueda, fichas de detalle y favoritos que sirve como caso práctico transversal.

---

## Cómo ejecutarlo

**Requisitos:** Node.js ≥ 20.19 (o ≥ 22.12) y npm.

```bash
cd web15
npm install
npm start        # http://localhost:4200
```

Otros comandos:

| Script          | Qué hace                                                    |
| --------------- | ----------------------------------------------------------- |
| `npm start`     | Servidor de desarrollo con recarga automática               |
| `npm run build` | Compila la aplicación en `dist/web15`                       |
| `npm test`      | Ejecuta las pruebas con Vitest en modo watch                |
| `npm test -- --watch=false` | Ejecuta las pruebas una sola vez               |
| `npm run watch` | Compila en modo desarrollo y observa cambios                |

No hace falta configurar nada: la app funciona con la API pública por defecto. Para cambiar de
mirror, edita `src/environments/environment.ts`.

---

## Cómo recorrer la ruta

La aplicación en sí es el material del curso. La forma recomendada es **en orden**, porque cada
lección reutiliza lo aprendido en las anteriores:

- La **portada** (`/`) resume la ruta, muestra tu porcentaje de avance y enlaza a la siguiente
  lección pendiente.
- La **barra lateral** lista las 10 lecciones y marca con ✓ las completadas.
- Al final de cada lección hay un botón **«Marcar como completada»**; el progreso se guarda en
  `localStorage` (clave `web15-completed-lessons`).
- El **tema claro/oscuro** también se guarda (`web15-theme`) y se aplica antes de montar Angular
  para evitar el destello inicial.
- Los **favoritos** (`web15-favorites`) son globales: se marcan desde el explorador o desde las
  demos y aparecen en `/favoritos`.

---

## Las 10 lecciones

|  #  | Ruta                                     | Título                                  | Qué se practica                                                                                  |   Nivel    | Min |
| :-: | ---------------------------------------- | --------------------------------------- | ------------------------------------------------------------------------------------------------ | :--------: | :-: |
| 01  | `/lecciones/01-componentes-y-plantillas` | **Componentes y plantillas**            | Standalone components, interpolación, property/attribute binding, eventos, `@if`/`@for`/`@switch`, `input()` |  Inicial   | 25  |
| 02  | `/lecciones/02-signals-y-estado`         | **Estado reactivo con signals**         | `signal()`, `set`/`update`, `computed()`, inmutabilidad, `linkedSignal`, `model()`             |  Inicial   | 30  |
| 03  | `/lecciones/03-datos-asincronos`         | **Datos asíncronos con HttpClient**     | `provideHttpClient`, `httpResource()`, tres estados, cancelación y `provideHttpClientTesting`    | Intermedio | 35  |
| 04  | `/lecciones/04-servicios-di`             | **Servicios e inyección de dependencias** | `@Injectable`, `inject()`, `providedIn: 'root'`, genéricos, `InjectionToken`, jerarquía de inyectores | Intermedio | 35  |
| 05  | `/lecciones/05-router`                   | **Router**                              | `RouterLink`/`RouterLinkActive`, `withComponentInputBinding`, `loadComponent`, títulos y ruta `**` | Intermedio | 40  |
| 06  | `/lecciones/06-estado-global`            | **Estado global con servicios y signals** | Servicios singleton, `asReadonly()`, `computed()`, `effect()`, `localStorage`, NgRx SignalStore | Intermedio | 35  |
| 07  | `/lecciones/07-formularios`              | **Formularios reactivos**               | `FormControl`/`FormGroup`, `valueChanges`, `debounceTime`/`switchMap`, validadores, estado del formulario | Intermedio | 35  |
| 08  | `/lecciones/08-composicion-di`           | **Composición, directivas e inyección** | `ng-content`, slots, `contentChild()`, directiva de atributo, directiva estructural, providers locales |  Avanzado  | 30  |
| 09  | `/lecciones/09-animaciones-ux`           | **Animaciones y UX de carga**           | Transiciones CSS, animación del desmontaje con `animationend`, skeletons, `@defer`, `prefers-reduced-motion` |  Avanzado  | 35  |
| 10  | `/lecciones/10-rendimiento`              | **Rendimiento y zoneless**              | `OnPush`, signals y detección de cambios, zoneless, `@for` con `track`, code splitting y checklist |  Avanzado  | 30  |

**Total: 330 min (~5,5 h).** Los metadatos (título, nivel, conceptos, duración y retos) viven en
`src/app/data/lessons.ts`; las rutas se generan a partir de ese array y del mapa de cargadores de
`src/app/app.routes.ts`.

---

## Mapa de rutas

| Ruta                 | Vista                 | Descripción                                                               |
| -------------------- | --------------------- | ------------------------------------------------------------------------- |
| `/`                  | `HomeView`            | Portada con la ruta completa y tu progreso                                |
| `/lecciones`         | `LessonsIndexView`    | Índice de las 10 lecciones y reinicio del progreso                        |
| `/lecciones/:id`     | `Lesson01…10`         | Cada lección en su propio chunk (`loadComponent`)                         |
| `/favoritos`         | `FavoritesView`       | Favoritos guardados en `localStorage`                                     |
| `/:resource`         | `ResourceListView`    | Listado paginado de `people`, `planets`, `films`, `starships` o `species` |
| `/:resource/:id`     | `ResourceDetailView`  | Ficha de un recurso con sus relaciones                                    |
| `**`                 | `NotFoundView`        | Página 404 y lección inexistente                                          |

La ruta comodín va siempre al final. Las rutas de lección se generan en `app.routes.ts` a partir de
`lessons`, así que añadir una lección sólo requiere darla de alta en `data/lessons.ts`, crear su
componente y registrar el cargador.

---

## El explorador SWAPI

El explorador (`/people`, `/planets`, `/films`, `/starships`, `/species`) es el caso práctico que
recorre toda la ruta:

- **Paginación** de servidor usando `next`/`previous` de SWAPI.
- **Búsqueda** con `?search=` y `debounceTime(400)` para no lanzar una petición por tecla.
- **Tres estados de UI**: cargando (`LoadingState`), error (`ErrorState`, con reintento) y vacío
  (`EmptyState`).
- **Favoritos** compartidos con la página `/favoritos`.
- **Navegación entre relaciones**: desde un personaje se puede saltar a su planeta, sus películas,
  naves y especies, porque las URLs absolutas de SWAPI se resuelven con `SwapiService.byUrl()`.

Detalles del cliente HTTP:

- `src/environments/environment.ts` define la base principal y los mirrors de respaldo.
- `swapiInterceptor` reescribe las rutas relativas (`/people/1/`) contra la base configurada.
- Si la base falla por red o con un 5xx, reintenta con los mirrors **en orden**.
- Los **404** y las peticiones **abortadas** no se reintentan.
- `provideHttpClient(withFetch(), withInterceptors([swapiInterceptor]))` se registra en
  `src/app/app.config.ts`.

---

## Estructura del proyecto

```
web15/
├─ angular.json                  # Configuración de build y fileReplacements de entornos
├─ src/
│  ├─ index.html                 # Script anti-parpadeo del tema
│  ├─ main.ts                    # bootstrapApplication(App, appConfig)
│  ├─ environments/              # Base de SWAPI y mirrors
│  ├─ styles/
│  │  ├─ global.css              # Tokens, reset y utilidades
│  │  ├─ components.css          # Botones, badges, tarjetas, chips...
│  │  ├─ views.css               # Portada, explorador, detalle, favoritos
│  │  └─ lessons.css             # Paneles específicos de cada lección (lNN-*)
│  └─ app/
│     ├─ app.config.ts           # Providers: router, HTTP, zoneless, errores
│     ├─ app.routes.ts           # Rutas y carga diferida de las 10 lecciones
│     ├─ app.ts / app.html       # Shell: cabecera, barra lateral y pie
│     ├─ core/
│     │  ├─ api/                 # SwapiService, interceptor, tipos, errores y formato
│     │  ├─ storage/             # Lectura/escritura segura de localStorage
│     │  └─ theme/               # ThemeService (signals + effect)
│     ├─ data/lessons.ts         # Fuente única de verdad de la ruta
│     ├─ lessons/                # Una carpeta por lección (01…10)
│     ├─ shared/
│     │  ├─ demo/                # LikeButton, RatingStars, Collapse...
│     │  ├─ layout/              # Header, sidebar, footer, progreso
│     │  ├─ lesson/              # LessonShell, pager, tarjeta, retos
│     │  ├─ swapi/               # Tarjetas, favoritos y campos de recurso
│     │  └─ ui/                  # BaseButton, BaseBadge, BaseCard, CodeBlock...
│     ├─ store/                  # FavoritesStore y ProgressStore
│     └─ views/                  # Portada, índice, listado, detalle, favoritos, 404
└─ public/                       # Favicon y recursos estáticos
```

---

## Dónde se practica cada concepto

| Concepto                              | Archivo de referencia                                              |
| ------------------------------------- | ------------------------------------------------------------------ |
| Componentes standalone y plantillas   | `src/app/lessons/01-componentes-y-plantillas/`                     |
| Estado local y derivado               | `src/app/lessons/02-signals-y-estado/`                             |
| `httpResource` y estados de red       | `src/app/lessons/03-datos-asincronos/`                             |
| Servicios, `inject()` y tokens        | `src/app/core/api/swapi-service.ts`, `swapi-base.ts`               |
| Rutas, parámetros y carga diferida    | `src/app/app.routes.ts`, `src/app/views/resource-*-view.ts`        |
| Estado global sin librerías           | `src/app/store/favorites-store.ts`, `progress-store.ts`            |
| Formularios y búsqueda con debounce   | `src/app/lessons/07-formularios/`                                  |
| Composición, directivas y providers   | `src/app/lessons/08-composicion-di/`                               |
| Animaciones y `@defer`                | `src/app/lessons/09-animaciones-ux/`, `deferred-panel.ts`          |
| OnPush, zoneless y `track`            | `src/app/lessons/10-rendimiento/`, `src/app/app.config.ts`         |

---

## Estado y persistencia

| Clave                     | Contenido                                      |
| ------------------------- | ---------------------------------------------- |
| `web15-theme`             | `dark` \| `light`                              |
| `web15-favorites`         | URLs de recursos favoritos                     |
| `web15-completed-lessons` | Ids de lecciones completadas                   |

Los tres stores se leen al arrancar con validación (`readStoredJson`), de modo que un valor corrupto
en `localStorage` no rompe la aplicación: se usa el valor por defecto.

---

## Pruebas y verificación

```bash
npm run build                 # compilación de producción sin errores
npm test -- --watch=false     # 14 archivos de pruebas / 65 casos
```

Las pruebas cubren los stores, el interceptor y el formato de SWAPI, el shell de la aplicación y las
demos interactivas de las diez lecciones (signals, peticiones HTTP, router, formularios,
composición, animaciones y rendimiento).

---

## Créditos

- Datos: [SWAPI](https://swapi.dev/) — _Star Wars API_. Mirrors de respaldo:
  [swapi.py4e.com](https://swapi.py4e.com/) y [swapi.info](https://swapi.info/).
- Hecho como material de estudio; Star Wars y sus personajes pertenecen a Lucasfilm/Disney.
