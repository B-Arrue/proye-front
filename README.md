# EcoRuta Temuco

Sitio web estático para conocer destinos, rutas y experiencias de la Región de La Araucanía.

## Equipo

| Integrante | Rol |
|---|---|
| Asher Galván Díaz | Product Owner |
| Benjamin Ignacio Arrué Chávez | Scrum Master |
| Diego Andrés Vásquez Contreras | Developer |
| Benjamin Camila Baeza Pérez | Developer |
| Paula Rosalía Pastén Guerrero | QA / Tester |

## Funcionalidades

- Inicio con zonas turísticas cargadas desde MockAPI y respaldo local.
- Catálogo de rutas con filtros por categoría, dificultad y búsqueda.
- Ficha de ruta con información consistente con el catálogo.
- Mapa interactivo (Leaflet) con las rutas de la región.
- Experiencias culturales, gastronómicas y recorridos guiados.
- Cultura local y recomendaciones para visitar con respeto.
- Formulario de reserva de rutas y formulario de contacto.
- Modo oscuro y modo de lectura para dislexia (preferencias guardadas).
- Menú lateral móvil con navegación por teclado.
- Favoritos de rutas guardados en el navegador.

## Tecnologías

- HTML5, CSS3 y JavaScript (sin dependencias).
- MockAPI para destinos y rutas.
- Leaflet para el mapa interactivo.
- LocalStorage / SessionStorage para preferencias y favoritos.

## Cómo abrir el sitio

1. Descarga o clona este repositorio.
2. Sirve la carpeta con un servidor web (por ejemplo, Live Server o `python -m http.server`).
3. Abre `index.html` en el navegador.
4. Las zonas y rutas se cargan desde MockAPI; si la API no responde, se usa el catálogo local.

## Archivos principales

- `index.html`, `destinos.html`, `experiencias.html`, `ruta.html`, `cultura.html`, `informacion.html`, `mapa.html`, `contacto.html`: páginas del sitio.
- `figma.css`: sistema visual compartido (tokens, componentes y responsive).
- `accesibilidad.css` / `accesibilidad.js`: modo oscuro y lectura fácil.
- `menu.js`: menú lateral compartido.
- `destinos-data.js` / `destinos.js`: zonas turísticas (MockAPI + respaldo local).
- `ruta-mockapi.js`: catálogo de rutas, filtros y favoritos.
- `ruta-form.js`: validación y envío de reservas.
- `contacto.js`: validación del formulario de contacto.
- `mapa.js`: mapa Leaflet con las rutas.
- `carrusel.js`: carrusel de la galería.
- `script.js`: renderizado de las zonas en el inicio.
- `imagenes/` e `Imagenes/`: fotografías utilizadas.
- `FUENTES.md`: autores, licencias y enlaces de las fotografías.

## Accesibilidad

- Navegación por teclado y trampa de foco en el menú.
- `skip-link` para saltar al contenido.
- Textos alternativos en imágenes y formularios etiquetados.
- Contraste verificado (WCAG AA).
- `prefers-reduced-motion` y soporte de alto contraste.
- Modo oscuro y lectura fácil para dislexia.

## Uso de inteligencia artificial

Se utilizó inteligencia artificial como apoyo para crear una referencia visual y para proponer cambios de estructura y estilos HTML/CSS. También se usó para ayudar a integrar fotografías reales de Wikimedia Commons. Las imágenes no fueron generadas por IA.

El equipo es responsable del contenido final y debe poder explicar y modificar el código que presenta, de acuerdo con su acuerdo de uso responsable de IA.

## Registro y planificación

- Registro del proyecto: [Registro.md](Registro.md)
- Tablero Kanban: [Trello](https://trello.com/invite/b/6a8df24094a3e2de28389bb0/ATTIf2bcaccf28ab811e33c205cac65963163379A6E2)
- Tablero de registros: [Trello](https://trello.com/invite/b/6a84bee572cdaf6da933fcd6/ATTI904d89c0069105f76779ad2c3ae530926526136B/mi-tablero-de-trello)

## Despliegue

- Página principal: https://b-arrue.github.io/proye-front/index.html
- Página de destinos: https://b-arrue.github.io/proye-front/destinos.html
- Recurso MockAPI: https://6ae3b3b1933120ae20f918c6.mockapi.io/destinos
