# public/importado/

Portadas descargadas por `npm run importar`.

Aquí caen las miniaturas de YouTube, las imágenes de portada de Blogger, las
portadas de TikTok y las imágenes Open Graph de cada enlace promocionado.

**Por qué se descargan en lugar de enlazarlas.**
Si la página apuntara a `i.ytimg.com` o a `p16-sign.tiktokcdn.com`, cada
visitante haría una petición a Google o a ByteDance sólo por abrir el sitio, y
eso los rastrea. Descargándolas una sola vez, todo se sirve desde el propio
dominio.

**No hace falta tocar nada aquí.** El importador se salta las que ya existen,
así que volver a ejecutarlo no re-descarga lo mismo. Para forzar una portada
nueva, borra su archivo y vuelve a correr `npm run importar`.

Los nombres siguen un patrón fijo:

| Prefijo | Origen |
|---|---|
| `podcast-<idDeVideo>` | miniatura de YouTube |
| `blog-<slug>` | portada del artículo en Blogger |
| `promo-<id>` | imagen Open Graph del enlace promocionado |
| `tiktok-<idDeVideo>` | portada del TikTok |
