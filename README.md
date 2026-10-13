# Hotel Selent — sitio web

Rediseño de https://hotelselent.com.ar/ con el mismo contenido. El sitio es estático (HTML + CSS + JS, sin dependencias ni build).

## Estructura
Seis páginas: `index.html` (inicio), `habitaciones.html`, `servicios.html`, `el-hotel.html`, `mar-del-plata.html` y `reservar.html` (reservas y contacto).

**Los `.html` de la raíz se generan, no se editan a mano.** Las fuentes están en `src/`:
- `src/layout.html`: estructura común (head, header, footer)
- `src/partials/`: header, footer, íconos, buscador de disponibilidad y banda de reserva
- `src/sections/`: cada sección del sitio
- `src/pages/`: una por página, con título, descripción y qué secciones incluye

Después de editar algo en `src/`, regenerar con:
```
python build.py
```

Otros archivos:
- `assets/css/styles.css`: estilos (la paleta está en `:root`)
- `assets/js/main.js`: interacciones y datos de las fichas de habitaciones (`ROOMS`)
- `assets/img/`: imágenes optimizadas en WebP
- `_originales/`: fotos originales del sitio actual (no se publica)

## Publicación
GitHub Pages publica la rama `main`: https://aguslenga123.github.io/hotel-selent/

## Ver en local
```
python -m http.server 5517
```
y abrir http://localhost:5517

## Pendientes antes de publicar
- **Formularios:** la consulta, la pre-reserva y el newsletter abren WhatsApp o el cliente de correo con el mensaje armado; no hay backend. Si se quiere recibir los datos en el servidor, conectarlos a Formspree o similar, o al plugin de contacto de WordPress.
- **Tarifas:** el sitio original no publica precios. Si el hotel quiere mostrarlos, agregarlos a cada habitación.
- **Protocolo de salud:** no se migró esa página (era el contenido de COVID).
- Confirmar con el hotel que el número de WhatsApp (`WHATSAPP` en `main.js`) sigue vigente.
