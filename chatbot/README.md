# Chat de la Maestra Virtual

Este directorio contiene una versión independiente del chat educativo con la maestra virtual. El objetivo es poder incrustarlo en otros sitios mediante un `<iframe>` sin necesidad de cargar el resto de la web del cuento.

## Archivos incluidos

- `chat-maestra.html`: página autónoma con todo el contenedor del chat. Es el archivo que debes publicar y apuntar con el iframe.
- `chat-maestra.css`: estilos necesarios para el widget.
- `chat-educativo.js` y `profesora-virtual.js`: lógica del chat y de la maestra con IA.
- `ia/ia-conversacional.js`: motor que descarga y ejecuta el modelo educativo.

## Cómo usar con un iframe

1. Sube el contenido de esta carpeta (`chat-widget/`) a tu servidor o hosting estático.
2. Copia la URL pública de `chat-maestra.html` (por ejemplo: `https://tu-dominio.com/chat-widget/chat-maestra.html`).
3. Inserta el siguiente iframe en tu página de WordPress (o cualquier otro CMS):

```html
<iframe
  src="https://tu-dominio.com/chat-widget/chat-maestra.html"
  title="Chat Maestra Virtual"
  loading="lazy"
  style="width: 520px; max-width: 100%; height: 600px; border: none; border-radius: 18px; overflow: hidden;"
  allow="clipboard-write"
></iframe>
```

Puedes ajustar `width` y `height` según el espacio disponible en tu sitio. El chat se adapta a pantallas móviles dentro del iframe.

## Notas

- La maestra ahora utiliza un modelo open-source (`Xenova/LaMini-Flan-T5-248M`) que se ejecuta completamente en el navegador gracias a [Transformers.js](https://github.com/xenova/transformers.js). La primera carga puede tardar unos minutos (descarga aproximada de 500 MB) según la conexión.
- El widget sigue funcionando sin claves de API ni servicios pagos; los mensajes no se envían a servidores externos.
- Para obtener el mejor rendimiento sirve los archivos sobre HTTPS, lo que permite al navegador aprovechar WebAssembly sin restricciones adicionales.
- Si necesitas personalizar colores o tipografías, edita `chat-maestra.css` sin tocar la lógica JavaScript.
- Para reiniciar la conversación dentro del iframe, usa el botón "Nueva Conversación" del widget.
