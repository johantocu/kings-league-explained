# Sistema de diseño: Kings League Explainer DS

Guía visual para que Claude Code construya la página. Reemplaza por completo al estilo FutPlay: **no** uses el azul marino ni el verde neón #39FF14 de FutPlay.

Archivos que acompañan esta guía:
- `design/tokens.css`: las variables (colores, fuentes, escalas, espacios, radios, sombras y movimiento). Se carga primero.
- `design/components.css`: los componentes con prefijo `kx-`. Se carga segundo.

```html
<link rel="stylesheet" href="design/tokens.css">
<link rel="stylesheet" href="design/components.css">
```

> Es un explainer **independiente**, inspirado en la temática de la Kings League. No es su marca oficial. El footer siempre dice: *"Independent explainer. Not affiliated with Kings League."*

---

## 1. Concepto: "Reyes de la arena"

La Kings League mezcla fútbol, streaming y videojuego. Su identidad, hecha por Summa Branding, gira en torno a reyes y coronas, un tono épico con humor de internet y el lenguaje del gaming. Lo traducimos en tres capas:

1. **Arena:** fondo negro absoluto, halos de luz LED azul y violeta, la cancha como escenario.
2. **Oro:** marca lo importante (la palabra fuerte de cada título, las cifras, el botón principal y la banda ticker).
3. **Juego:** cartas que se voltean, marcadores de transmisión y una banda que corre.

## 2. Color

| Variable | Valor | Uso |
|---|---|---|
| `--ground` | #000000 | Fondo de página, siempre |
| `--surface` / `--surface-2` | #141414 / #1C1C1C | Tarjetas, tabla, quiz / hover |
| `--line` | #313131 | Divisores (nunca texto) |
| `--ink` / `--ink-soft` / `--muted` | #FFF / #D1D5DB / #B3B3B3 | Títulos / cuerpo / meta |
| `--gold` | #F4AF23 | Marca: palabra fuerte, cifras, botón principal, ticker |
| `--on-gold` | #000000 | Texto sobre oro |
| `--flame` | #E35205 | Links, LIVE, respuesta incorrecta |
| `--pitch-green` | #3CAA36 | Kickers, cartas, respuesta correcta |
| `--led-blue` / `--led-violet` | #3346FF / #2A1B6E | Luz de arena: halos y bordes, **nunca texto** |
| `--crown-navy` | #0B1026 | Fondo ceremonial (pull quote) |
| `--paper` / `--paper-ink` | #F3F3F3 / #141414 | Una sola banda clara por página (la tabla) |

**Reglas:** el oro ocupa como máximo un 10–15% de la pantalla. Cada color tiene un solo trabajo: **oro = marca**, **verde = cartas y aciertos**, **flame = links, en vivo y errores**. Todo el texto cumple contraste AA; el gris más claro permitido es `--muted`.

## 3. Tipografía

| Rol | Fuente | Uso |
|---|---|---|
| Display | **Anton** | H1 y H2, cifras, marcador. Siempre en MAYÚSCULAS |
| Wide | **Archivo** con `font-stretch: 125%`, peso 800–900 | Ticker, kickers, títulos de tarjeta, botones, encabezados de tabla |
| Sans | **Inter** | Todo el texto corrido |

La liga usa una fuente propia (KingsFont) y Termina, que no son libres. **No intentes cargarlas.** Anton y Archivo son sus equivalentes en Google Fonts.

**Titular en dos tonos (la firma del sistema):** la última palabra, o la palabra fuerte, va en oro dentro de un `<em>`.

```html
<h2 class="kx-h2">The secret <em>cards</em></h2>
```

En el JSON de contenido, separa cada título en dos partes (`title` y `titleGold`), o divídelo por la última palabra con una función, como en el prototipo.

**Escala:** H1 de 128px (64px en celular), H2 de 64px (44px en celular), ticker de 22px, título de tarjeta de 17px, kicker de 12px, lead de 21px, cuerpo de 17px y texto pequeño de 14px.

## 4. Componentes (en `components.css`)

### Hero
Fondo `--ground` con `.kx-halo` arriba (el halo LED). Arriba a la derecha va el selector de idioma `.kx-lang`; debajo, pills (`.kx-pill--gold` para la categoría y `.kx-pill` para el tiempo de lectura). Después el `.kx-h1` en dos tonos, el `.kx-lead` y el byline en Archivo `--muted`.

### Ticker
Va justo debajo del hero, a todo el ancho y **una sola vez por página**. Repite el contenido dos veces dentro de la pista para que el bucle no salte.
```html
<div class="kx-ticker" aria-hidden="true">
  <div class="kx-ticker__track">
    <span>Kings League explained</span><span class="kx-ticker__sep">·</span>
    <span>Secret cards</span><span class="kx-ticker__sep">·</span>
    <!-- …repite todo una segunda vez… -->
  </div>
</div>
```

### Encabezado de sección
```html
<p class="kx-kicker">Match anatomy</p>
<h2 class="kx-h2">How a match <em>works</em></h2>
<p class="kx-body">…</p>
```

### Cifras: `.kx-stat` dentro de `.kx-grid-4`
```html
<div class="kx-stat"><span class="kx-stat__num">36'</span><span class="kx-stat__label">minutes of regular time</span></div>
```

### Tarjeta de regla numerada: `.kx-rule` dentro de `.kx-grid-2`
```html
<div class="kx-rule">
  <div class="kx-rule__head"><span class="kx-rule__num">01</span><h3 class="kx-rule__title">Scale-up start</h3></div>
  <p>…</p>
</div>
```

### Carta secreta: `.kx-card`
Es la silueta **propia** del sistema: esquinas cortadas, marco dorado, ícono en un círculo verde y rejilla en perspectiva. **No** copies el hexágono verde de la liga. Es un `<button>` real; el JS solo alterna `aria-pressed`.
```html
<button type="button" class="kx-card" aria-pressed="false" aria-label="Goal x2 card, tap to flip">
  <span class="kx-card__inner">
    <span class="kx-card__face kx-card__front">
      <span class="kx-card__title">Goal x2</span>
      <span class="kx-card__icon"><!-- SVG de trazo propio, 34px, stroke="currentColor" --></span>
      <span class="kx-card__hint">Tap to flip</span>
    </span>
    <span class="kx-card__face kx-card__back">
      <strong>Goal x2</strong>
      <p>Your goals count double for four minutes.</p>
    </span>
  </span>
</button>
```
Las 7 cartas van en una fila con scroll horizontal en celular (`display:flex; gap:16px; overflow-x:auto`).

### Marcador de transmisión: `.kx-score`
Úsalo en la línea de tiempo del partido, en el resultado del dado y en el puntaje del quiz. Los escudos son bloques de color genéricos, **nunca escudos reales**.
```html
<div class="kx-score" role="img" aria-label="Home 3, Away 2, minute 17">
  <span class="kx-score__team"><span class="kx-score__crest" style="background:var(--led-blue)"></span>Home</span>
  <span class="kx-score__goals">3 : 2</span>
  <span class="kx-score__team">Away<span class="kx-score__crest" style="background:var(--pitch-green)"></span></span>
  <span class="kx-score__min"><span class="kx-dot"></span>17:00</span>
</div>
```

### Pull quote: `.kx-quote` (ceremonial)
Fondo `--crown-navy` con una franja diagonal dorada arriba.
```html
<blockquote class="kx-quote"><p>The fans vote the rules. <em>The match plays like a game.</em></p></blockquote>
```

### Banda clara y tabla: `.kx-paper` + `.kx-table`
Va **una sola vez**, para la tabla comparativa. La columna de la Kings League lleva la clase `is-focus` (en dorado).

### Quiz: `.kx-quiz` + `.kx-quiz__opt`
Estados: `.is-correct` (verde con texto negro), `.is-wrong` (borde flame) y `.is-dim` (las demás opciones). El puntaje se muestra con un `.kx-score` (etiqueta "Score" y el oro con "3/5").

### Pasos numerados: `.kx-steps` con `.kx-steps__num` en oro.

### Selector de idioma: `.kx-lang`
Tres botones con `aria-pressed`: English (por defecto), Italiano y Español. La bandera va en SVG inline, nunca en emoji. El botón activo va en oro.

### Botones: `.kx-btn--primary` (una vez por vista), `.kx-btn--outline` y `.kx-btn--ghost`.

## 5. Elementos gráficos y la cancha

- **Cancha o arena (en SVG o CSS):** fondo con un degradado radial de `#1A1550` a negro, borde de 2px en `--led-blue` con `--glow-led`, líneas blancas al 85%, área en oro con relleno `--gold-tint` y arcos en oro con brillo.
- **Dado:** un cubo negro con puntos o números en oro. El resultado se muestra en un `.kx-score`.
- **Línea de tiempo del partido:** una barra horizontal de 0 a 36+ con tramos de color: Scale-Up en `--steel`, ventana de cartas en `--pitch-green`, goles dobles en `--gold`, dado en `--led-blue` y Matchball en `--flame`. Cada tramo es un botón.
- **Línea de tiempo de expansión:** puntos en oro sobre una línea `--line`, con el año en Anton.
- **Cortes diagonales:** fondos opcionales en `--surface` cortados con `clip-path` a 6–8°.
- **Coronas abstractas:** una fila de triángulos dorados, como patrón decorativo. **Nunca** el busto del rey ni el escudo de la liga.

## 6. Movimiento

- **Ticker:** se desplaza de forma continua (40 s por vuelta).
- **Cartas:** se voltean en 3D en 500 ms con un leve rebote.
- **Marcador:** el número salta (escala 1.15, 200 ms) cuando cambia.
- **Dado:** gira unos 800 ms y frena.
- **Al hacer scroll:** las secciones aparecen con fade y desplazamiento de 16px.
- Con `prefers-reduced-motion` todo queda quieto (ya está resuelto en `components.css`).

## 7. Fotos y video

**No** se usan fotos, videos ni capturas de la Kings League, sus jugadores ni sus presidentes, porque tienen derechos. La atmósfera se recrea con código: halos LED, la cancha en SVG, siluetas abstractas y marcadores. Los presidentes se muestran con iniciales dentro de círculos (`--surface-2` con borde `--gold`).

## 8. Lo que NO se hace

- No usar el logo, el busto del rey, la corona de dos K, KingsFont, Termina ni escudos.
- No copiar la silueta de sus cartas.
- No usar degradados morado-azul de fondo completo: la luz LED va como halo o borde.
- No usar emoji como íconos.
- No poner el nombre FutPlay ni sus colores.
- No usar el sistema para contenido de apuestas.

## 9. Referencia visual

Hay un prototipo de este estilo, aplicado a un artículo de fútbol 5, en el canvas de Claude Design de Johan ("5-a-Side Explained · Kings DS"). Sirve para ver cómo se combinan el hero, el ticker, la cancha, las tarjetas, el pull quote, la banda clara, el quiz y los pasos. El contenido cambia; el lenguaje visual es el mismo.
