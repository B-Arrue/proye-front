# EcoRuta Temuco

Sitio web estático para conocer destinos, rutas y experiencias de la Región de La Araucanía.

## Equipo

| Integrante | Rol |
|---|---|
| Asher Galván Diaz | Product Owner |
| Benjamin Ignacio Arrué Chávez | Scrum Master |
| Diego Andrés Vásquez Contreras | Developer |
| Benjamin Camila Baeza Pérez | Developer |
| Paula Rosalía Pastén Guerrero | QA / Tester |

## Sprint 1

En este sprint se preparó la estructura inicial del sitio con páginas HTML y estilos CSS.

El sitio incluye:

- Inicio y navegación entre páginas.
- Secciones de destinos, experiencias, rutas, cultura e información.
- Fotografías locales con sus créditos en FUENTES.md.
- Una página de mapa con un espacio reservado para una próxima etapa.

El mapa interactivo y los filtros todavía no están implementados.

## Tecnologías

- HTML
- CSS
- JavaScript (`fetch`)
- MockAPI para la sección de destinos

El proyecto no requiere instalar dependencias. La página `destinos.html` consulta los destinos en MockAPI.

## Configurar MockAPI

1. En MockAPI, crea un proyecto y un recurso llamado `destinos`.
2. Agrega registros con estos campos de texto: `nombre`, `descripcion`, `imagen`, `alt`, `credito` y `creditoUrl`. Los dos campos de crédito son opcionales. En `imagen`, usa rutas del sitio como `imagenes/conguillio-llaima.jpg`.
3. El recurso configurado para este proyecto es [`/destinos`](https://6ae3b3b1933120ae20f918c6.mockapi.io/destinos). Si creas otro proyecto MockAPI, cambia `MOCKAPI_DESTINOS_URL` en `destinos.js` por su URL GET.
4. Abre `destinos.html` mediante un servidor web o la URL publicada. `fetch` puede estar bloqueado al abrir archivos directamente con `file://`.

La interfaz informa los estados de carga, éxito y error, y ofrece un botón para volver a intentar la consulta. El JSON debe ser una lista de objetos que contengan los campos requeridos.

Ejemplo de datos iniciales para el recurso:

```json
[
  {
    "nombre": "Araucanía Lacustre",
    "descripcion": "Lagos, volcanes y bosques nativos. Una zona para disfrutar de la naturaleza y actividades al aire libre.",
    "imagen": "imagenes/icalma-araucarias.jpg",
    "alt": "Laguna de Icalma rodeada de araucarias",
    "credito": "Foto: Paula Misle",
    "creditoUrl": "https://creativecommons.org/licenses/by-sa/3.0/"
  },
  {
    "nombre": "Araucanía Andina",
    "descripcion": "Paisajes de cordillera, volcanes y lagunas de altura.",
    "imagen": "imagenes/conguillio-llaima.jpg",
    "alt": "Volcán Llaima junto al lago Conguillío",
    "credito": "Foto: Mariomxel",
    "creditoUrl": "https://creativecommons.org/licenses/by-sa/4.0/"
  },
  {
    "nombre": "Nahuelbuta",
    "descripcion": "Una zona conocida por sus bosques de araucarias y senderos.",
    "imagen": "imagenes/nahuelbuta-araucaria.jpg",
    "alt": "Araucaria en el Parque Nacional Nahuelbuta",
    "credito": "Foto: Roberto Antonio Ancavil Ñ",
    "creditoUrl": "https://creativecommons.org/publicdomain/zero/1.0/"
  }
]
```

## Cómo abrir el sitio

1. Descarga o clona este repositorio.
2. Configura la URL de MockAPI en `destinos.js`.
3. Sirve la carpeta con un servidor web o abre la URL publicada.
4. Navega a `destinos.html`.

## Archivos principales

- destinos.html, experiencias.html, ruta.html, cultura.html, informacion.html y mapa.html: páginas del sitio.
- destinos.js: consulta y renderizado de los datos de MockAPI.
- Los archivos CSS contienen los estilos de cada página.
- imagenes/: fotografías utilizadas en el sitio.
- FUENTES.md: autores, licencias y enlaces de las fotografías.

## Uso de inteligencia artificial

Se utilizó inteligencia artificial como apoyo para crear una referencia visual y para proponer cambios de estructura y estilos HTML/CSS. También se usó para ayudar a integrar fotografías reales de Wikimedia Commons. Las imágenes no fueron generadas por IA.

El equipo es responsable del contenido final y debe poder explicar y modificar el código que presenta, de acuerdo con su acuerdo de uso responsable de IA.

## Registro y planificación

- Registro del proyecto: [Registro.md](Registro.md)
- Tablero Kanban: [Trello](https://trello.com/invite/b/6a8df24094a3e2de28389bb0/ATTIf2bcaccf28ab811e33c205cac65963163379A6E2)
- Tablero de registros: [Trello](https://trello.com/invite/b/6a84bee572cdaf6da933fcd6/ATTI904d89c0069105f76779ad2c3ae530926526136B/mi-tablero-de-trello)

## Despliegue

- Página de destinos: https://b-arrue.github.io/proye-front/destinos.html
- Recurso MockAPI: https://6ae3b3b1933120ae20f918c6.mockapi.io/destinos
