# Hotel Selent — sitio web

Rediseño de https://hotelselent.com.ar/ con el mismo contenido. El sitio es estático (HTML + CSS + JS, sin dependencias ni build).

## Estructura
- `index.html` — página única con todas las secciones
- `assets/css/styles.css` — estilos (la paleta está en `:root`)
- `assets/js/main.js` — interacciones y datos de habitaciones y atractivos (`ROOMS`, `SPOTS`)
- `assets/img/` — imágenes optimizadas en WebP (~3 MB en total)
- `_originales/` — fotos originales descargadas del sitio actual (no se publica)

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
