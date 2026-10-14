# AGENTS.md — portfolio-cami

> Instrucciones para agentes de IA que trabajen en este repositorio.
> Se distingue entre **hechos verificados** (observados en el código), **convenciones existentes** (patrones ya usados) y **[propuesta]** (reglas nuevas para trabajo futuro).

## 1. Qué es este proyecto

Portafolio estático de una sola página para "María Camila Porras / La Dibujadora de Luz" (fotógrafa).
Stack verificado: **Astro 7 (SSG, `output: static`) + TypeScript estricto + SASS (`sass` v1) + `astro:assets` (`<Image>`)**.
Sin framework UI (sin React/Vue/Svelte), sin router, sin backend, sin API, sin estado global, sin tests, sin linter/formatter configurados.
Idioma del contenido: español. `html lang="es"` en `src/layouts/BaseLayout.astro:15`.

## 2. Comandos reales (verificados en `package.json`)

Gestor de paquetes: **bun** (existe `bun.lock`; motor requerido `node >= 22.12.0`).

```sh
bun install            # instalar dependencias
bun run dev            # servidor de desarrollo (http://localhost:4321)
bun run build           # compilación estática -> dist/
bun run preview         # previsualizar dist/
bunx astro check        # chequeo de tipos/diagnóstico Astro (usa @astrojs/check)
bunx astro --help       # resto de comandos CLI
```

Notas verificadas:

- `bunx astro check` hoy reporta **2 errores** en `src/components/Header.astro:50,71` (`'this' implicitly has type 'any'`) y 1 aviso de `index` no usado en `src/components/GalleryCarrousel.astro:33`. `bun run build` **sí pasa** (sale con warnings de fuentes, ver §7).
- No existen scripts `test`, `lint` ni `format`. No afirmar que pasaron sin ejecutarlos.
- El anterior `AGENTS.md` documentaba `bun run astro dev --background`, `... dev stop/status/logs`: **esos flags/comandos no existen** en Astro ni en `package.json`. "Background" se refiere al parámetro `background` de la herramienta `shell` del agente, no a un flag del CLI. No usarlos.
- `.vscode/launch.json` arranca el dev con `./node_modules/.bin/astro dev`; la extensión recomendada es `astro-build.astro-vscode` (ver `.vscode/extensions.json`).

Docs oficiales (solo como referencia, no clonar su contenido aquí):

- Routing/páginas: https://docs.astro.build/en/guides/routing/
- Componentes Astro: https://docs.astro.build/en/basics/astro-components/
- `astro:assets` (`<Image>`): https://docs.astro.build/en/guides/images/
- Estilos: https://docs.astro.build/en/guides/styling/

## 3. Árbol real del repositorio

```
portfolio-cami/
├── AGENTS.md                  # este archivo (instrucciones para agentes)
├── CLAUDE.md                  # link simbólico de AGENTS.md
├── astro.config.mjs           # config mínima: host 0.0.0.0, devToolbar off
├── tsconfig.json              # extiende astro/tsconfigs/strict
├── package.json / bun.lock    # NO modificar versiones/lock sin que la tarea lo pida
├── public/
│   └── favicon.svg            # único estático público, referenciado en BaseLayout
├── src/
│   ├── pages/index.astro      # ÚNICA ruta (/). Compone Header + secciones + Footer
│   ├── layouts/BaseLayout.astro  # shell HTML + <slot/> + importa main.scss
│   ├── components/            # Header, Footer, GalleryGrid, GalleryCarrousel (.astro)
│   ├── images/               # 001–012.webp + hero-placeholder.webp (¡ver §7: sin commitear!)
│   └── assets/
│       ├── fonts/             # ¡ver §7: a medio completar (falta BetterTogheter)!
│       └── scss/              # sistema de estilos (único entry: main.scss)
│           ├── main.scss
│           ├── abstracts/_variables.scss
│           ├── base/_reset.scss, _fonts.scss, _base.scss
│           ├── components/_header.scss, _footer.scss,
│           │                _gallery-grid.scss, _gallery-carrousel.scss
│           └── layout/_home.scss
├── dist/                      # salida de build (generado, no editar, ignorado)
├── .astro/                    # tipos generados (generado, no editar, ignorado)
└── node_modules/              # dependencias (no editar, ignorado)
```

No hay `src/content/`, `src/utils/`, `src/services/`, `src/hooks/`, `src/styles/` ni tests. No crearlos sin necesidad real (ver §8).

## 4. Responsabilidad por directorio (qué va dónde)

| Directorio | Responsabilidad | Puede depender de | Quién depende de él |
|---|---|---|---|
| `src/pages/` | Rutas (file-based routing). Hoy solo `index.astro`: define datos de la galería, secciones hero/gallery/about y contacto. | `layouts/`, `components/`, `astro:assets`, `src/images/` | Nadie (punto final). |
| `src/layouts/` | Shell HTML (`<head>`, meta, `lang`, favicon, `<slot/>`). Solo `BaseLayout.astro`; es el **único que importa `main.scss`** (`BaseLayout.astro:2`). Props: `title?`, `description?` con defaults. | `assets/scss/main.scss` | `src/pages/*` |
| `src/components/` | Componentes `.astro` presentacionales, uno por archivo PascalCase. `Header` (nav fija + `<script>` de menú/scroll), `Footer` (año dinámico + sociales), `GalleryGrid` (desktop), `GalleryCarrousel` (mobile, track duplicado para loop CSS). Props tipadas vía `export interface Props`. | `astro:assets` (solo galerías). Sin imports entre componentes. | `src/pages/*` |
| `src/images/` | Fotos de contenido optimizables (`.webp`). Se referencian como string `"/src/images/xxx.webp"` en `index.astro:10-22` y se renderizan con `<Image width height format="webp" quality loading>`. | Nada | `src/pages/`, galerías |
| `src/assets/scss/` | Único sistema de estilos. Entry `main.scss` con `@use` explícitos. | `abstracts/_variables.scss` | `BaseLayout.astro` |
| `src/assets/fonts/` | `@font-face` locales (ver §7). | Nada | `base/_fonts.scss` vía URL |
| `public/` | Estáticos servidos tal cual (`/favicon.svg`). Solo archivos que NO necesitan procesamiento Vite/Astro. | Nada | `BaseLayout.astro` (`href="/favicon.svg"`) |

Dónde crear un archivo nuevo:

- Nueva sección de la landing → JSX en `src/pages/index.astro`; si supera ~50 líneas o se reutiliza, extraer a `src/components/Nombre.astro` + parcial `scss/components/_nombre.scss` + `@use` en `main.scss`.
- Nueva página/ruta → `src/pages/nombre.astro` envolviendo con `BaseLayout`.
- Nuevo layout alternativo → `src/layouts/`.
- Token (color, spacing, breakpoint, fuente) → `abstracts/_variables.scss`, nunca hardcodeado.
- Estilo global/base → `base/`; estilo de un componente → `components/_<bloque>.scss`; estilo de sección de página (hero/gallery/about) → `layout/_home.scss` (hoy el único parcial de layout).
- Foto de contenido → `src/images/` en `.webp`, nombre secuencial o descriptivo en minúsculas + `alt` en español. Favicon/manifest/robots → `public/`.

Qué NO poner dónde: lógica de negocio/servicios en `components/`; componentes en `pages/`; parciales SCSS sin `@use` en `main.scss`; imágenes de contenido en `public/`; fuentes en `public/` (van en `src/assets/fonts/` para que Vite las procese).

## 5. `src/assets/` en detalle

### `scss/` (convención existente, mantener)

- `abstracts/_variables.scss` — **única fuente de verdad** de diseño. Paleta verificada: `$color-primary #75633d`, `$color-secondary #dc9334`, `$color-accent #966443`, `$color-neutral #e7cfad`, `$color-status #fffcf7`; fuentes `$font-title 'Better Togheter'…`, `$font-body 'FF Providence'…`; espaciados `xs–xl`; breakpoints `640/768/1024px`. Solo variables, sin CSS emitido.
- `base/` — `_reset.scss` (reset mínimo propio), `_fonts.scss` (`@font-face` con `font-display: swap`), `_base.scss` (`body`, `h1–h6`, `a` usando variables). Orden de `@use` en `main.scss`: variables → fonts → reset → base → components → layout.
- `components/_*.scss` — un parcial por componente, mismo nombre en minúsculas con guiones (`Header.astro` → `_header.scss`; `GalleryCarrousel.astro` → `_gallery-carrousel.scss`, nótese la grafía "carrousel" heredada: **no renombrar sin tarea que lo pida**). Cada parcial empieza con `@use '../abstracts/variables' as *;`.
- `layout/_home.scss` — estilos de secciones de la página (`hero`, `gallery-section`, `about-section`, `contact-*`) + media queries `968px/640px` que alternan `.gallery-desktop`/`.gallery-mobile` (`display:none/block`). Clases planas estilo BEM suelto (`.hero-title`, `.nav-link`), sin anidamiento profundo.
- Reglas: usar `@use`, nunca `@import`; referenciar colores/fuentes/espaciados solo vía variables; el `responsive` va al final del parcial correspondiente; añadir `@use` a `main.scss` si se crea un parcial nuevo.

### `fonts/` + `images/` (hechos verificados, ver §7)

- Fuentes (verificado el 2026-10-14 con `bun run build`): `_fonts.scss` declara `Better Togheter` y `FF Providence` en `.woff/.woff2` bajo `/src/assets/fonts/`. Existen `FFProvidence.woff/.woff2` (fuente de cuerpo OK); **faltan `BetterTogheter.woff/.woff2`** y el build emite 2 warnings `didn't resolve at build time`. Los títulos caen al fallback `Georgia, serif`.
- Imágenes: `src/images/001–012.webp` + `hero-placeholder.webp`. Se usan vía `<Image src={string}>` (no vía `import`), por lo que **no reciben optimización/inferencia de Astro**; el build las deja como están. Funciona, pero es un patrón subóptimo documentado, no una convención a imitar ciegamente.
- `public/` vs `src/`: usar `src/images/` + `astro:assets` para fotos de contenido; `public/` solo para lo que debe servirse byte-a-byte en una URL fija (hoy solo `favicon.svg`).

## 6. Arquitectura y flujo (verificado)

```
pages/index.astro  ──imports──▶  layouts/BaseLayout.astro ──@use──▶ scss/main.scss ──@use──▶ parciales
       │                              │ (<slot/>)
       └──── renders ──▶ Header / GalleryGrid / GalleryCarrousel / Footer (+ <Image>)
```

- Entrada: `src/pages/index.astro` (única ruta `/`). Define `galleryImages` (12 entradas `{src, alt}`) y las pasa como props a ambas galerías; `columns={4}` solo lo consume `GalleryGrid` (`GalleryCarrousel` declara `columns?` pero la ignora — código muerto conocido).
- Capas: página (composición + datos) → componentes (presentación) → layout (shell) → SCSS (tokens → base → componentes → layout). Dirección permitida: páginas importan layouts y componentes; componentes **no** importan páginas ni layouts ni otros componentes; SCSS parciales solo importan `abstracts/variables`. No hay lógica de negocio, servicios ni llamadas HTTP que separar.
- JS cliente: solo el `<script>` de `Header.astro:29-87` (toggle menú móvil con `aria-expanded` + scroll suave con offset del header fijo). Sin hidratación de framework (`client:*` no se usa en ningún lado).
- Errores/validación/config: no hay manejo centralizado (no existe). `astro.config.mjs` es mínimo (`host 0.0.0.0`, `allowedHosts: true`, `devToolbar.enabled: false`). No hay `.env` ni variables de entorno.
- Patrones usados: SSG puro, componentes presentacionales con `Props` tipadas, mobile/desktop por duplicación (`gallery-desktop`/`gallery-mobile` conmutados por CSS) y loop infinito del carrusel duplicando el array en el markup (`GalleryCarrousel.astro:33-48`, con `aria-hidden` en la copia). **[propuesta]** No introducir store global, fetchers, ni frameworks UI salvo que una tarea futura (formulario, CMS, i18n…) lo exija con justificación.

## 7. Observaciones conocidas (no corregir en esta tarea, documentado para futuro)

1. **Reorganización SCSS sin commitear** (`git status`): `_header.scss`/`_footer.scss` se movieron `layout/` → `components/` y `_home.scss` `components/` → `layout/`, con `main.scss` ya actualizado. Es la ubicación correcta; solo falta commit.
2. **Fuente de títulos ausente**: `_fonts.scss` referencia `BetterTogheter.woff/.woff2`, que no existen (verificado: `ls src/assets/fonts/` solo muestra `FFProvidence.woff/.woff2`; el build emite 2 warnings `didn't resolve at build time`). Los `h1–h6` caen al fallback `Georgia, serif`. Arreglo futuro: añadir los `.woff2` con los nombres esperados.
3. **`astro check` en rojo**: 2 errores `noImplicitThis` en `Header.astro:50,71` (`function (e)` usa `this`; tipar como `(e: Event)` + `e.currentTarget as HTMLAnchorElement`) y `index` sin usar en `GalleryCarrousel.astro:33`.
4. **`src/images/` y `src/assets/fonts/` sin commitear** (`??` en git): 13 `.webp` + 2 `.woff` solo existen en local. Sin commit, cualquier clon queda sin fotos y sin fuente de cuerpo.
5. **Deuda menor**: `GalleryCarrousel` ignora prop `columns`; `GalleryGrid` fija `width/height` y `data-columns` pero el CSS solo contempla `2/3/4` (default `3`); hero usa `quality={90}`/galerías `85` sin criterio documentado; favicon genérico de cámara.

## 8. Flujo de trabajo obligatorio del agente

1. Leer este `AGENTS.md` y explorar el contexto relevante (`pages/`, componente implicado, parcial SCSS espejo, `_variables.scss`).
2. Identificar comportamiento actual y requisito antes de tocar nada.
3. Localizar módulos responsables y sus dependencias (§4–§6).
4. En cambios amplios/estructurales, proponer plan breve primero.
5. Implementar el cambio mínimo correcto; respetar tokens, nombres y ubicación de archivos.
6. Añadir/actualizar pruebas si existieran (hoy no hay); como mínimo ejecutar `bunx astro check` y `bun run build` cuando se toque `.astro`, `.ts` o `.scss`.
7. Revisar `git diff --stat` + `git status --short`: sin archivos extra, sin cambios fuera de alcance, sin tocar `dist/`, `.astro/`, `node_modules/`, `bun.lock` salvo necesidad.
8. Resumir: cambios, comprobaciones ejecutadas con resultado literal, y pendientes. **Prohibido afirmar que algo "pasa" sin haberlo ejecutado.**

## 9. Convenciones de implementación

- **Archivos/carpetas**: componentes `PascalCase.astro` (`GalleryGrid.astro`); parciales SCSS `_kebab-case.scss` con `_` inicial; imágenes `kebab-case` o `NNN.webp`; todo en minúsculas salvo componentes.
- **Código**: `export interface Props` en cada componente con props; `const {...} = Astro.props` con defaults; `camelCase` para variables/props; tokens SCSS `$color-*`, `$font-*`, `$spacing-*`, `$breakpoint-*`; clases CSS planas `.bloque-elemento` (sin CSS Modules).
- **Imports**: rutas relativas (`../layouts/BaseLayout.astro`); SCSS siempre `@use` (nunca `@import`); `main.scss` es el único entry y solo `BaseLayout` lo importa — no importar `.scss` desde componentes/páginas.
- **Tamaño/responsabilidad**: un componente = un bloque visual; si una sección de `index.astro` supera ~50 líneas, extraerla. No duplicar markup social/contacto entre `index.astro` y `Footer.astro` sin motivo (ya hay duplicación de SVGs: reutilizar solo si la tarea lo pide).
- **Imágenes**: `<Image>` con `alt` en español siempre; `loading="eager"` solo hero/primeras, resto `lazy`; `format="webp"`.
- **Accesibilidad**: mantener `aria-label`, `aria-expanded`, `aria-hidden` en copias decorativas; `rel="noopener noreferrer"` en `target="_blank"`.
- **Responsive**: breakpoints existentes `640/768/968/1024px`; el patrón del proyecto es duplicar markup desktop/mobile conmutado por CSS (no introducir JS de breakpoints salvo justificación).
- **Errores/límites**: validar props opcionales con defaults (`columns = 3`, `title = …`); no hay capa de errores global — no inventarla.
- **Config/env**: no hay `.env`; si una tarea futura lo necesita, documentarlo aquí y añadir `.env.example` (nunca commitear secretos).
- **Seguridad/dependencias**: dependencias mínimas (`astro`, `@astrojs/check`, `sass`, `typescript`). No añadir librerías si el problema se resuelve con Astro/SCSS nativo. No tocar `bun.lock`/versiones sin que la tarea lo requiera.
- **Comentarios/docs**: comentarios `<!-- -->`/`//` solo para separar secciones (`<!-- Hero -->`, `// === HERO ===`); contenido del sitio en español.

## 10. Reglas de orden (vinculantes)

- No crear carpetas, capas, configs ni abstracciones sin necesidad real demostrada por la tarea.
- No duplicar funcionalidad existente (revisar `components/`, `_variables.scss` y `layout/_home.scss` antes de crear nada).
- No mover archivos ni reorganizar directorios sin justificación técnica (la reorganización header/footer/home de §7.1 es la excepción ya en curso).
- No modificar dependencias, versiones ni `bun.lock` si la tarea no lo requiere.
- No editar `dist/`, `.astro/`, `node_modules/` ni el SVG de terceros en `public/favicon.svg` salvo sustitución deliberada del favicon.
- No añadir librerías cuando Astro + SCSS basten.
- No tocar funcionalidad ajena a la tarea; no romper la grafía heredada (`GalleryCarrousel`, `carrousel`) al margen de una tarea de renombrado.
- No introducir cambios incompatibles con este documento sin documentar el porqué en el resumen.
- Si falta regla para ubicar un archivo, decidir por responsabilidad (§4) y proponer la actualización de este `AGENTS.md` en el resumen.
