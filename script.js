/* ==========================================
   INICIO · EcoRuta Temuco
   Pinta las 5 zonas turísticas combinando
   MockAPI con los datos locales compartidos.
   ========================================== */
(function () {
  "use strict";

  var contenedor = document.getElementById("zonas-turisticas");
  var estado = document.getElementById("estado-carga");

  if (!contenedor) return;

  function crearTarjeta(zona) {
    var articulo = document.createElement("article");
    articulo.className = "zona-card";

    var media = document.createElement("div");
    media.className = "zona-card__media";

    var DIMENSIONES = {
      "conguillio-llaima.jpg": [1280, 719],
      "icalma-araucarias.jpg": [1280, 719],
      "nahuelbuta-araucaria.jpg": [1280, 960],
      "sendero-litoral.jpeg": [1300, 1300],
      "mapuche.jpeg": [1600, 1067]
    };
    var imagen = document.createElement("img");
    imagen.src = zona.imagen;
    imagen.alt = zona.alt || zona.nombre;
    imagen.loading = "lazy";
    imagen.decoding = "async";
    var dim = DIMENSIONES[String(zona.imagen).split("/").pop().toLowerCase()];
    if (dim) {
      imagen.width = dim[0];
      imagen.height = dim[1];
    }
    media.appendChild(imagen);

    var cuerpo = document.createElement("div");
    cuerpo.className = "zona-card__body";

    var titulo = document.createElement("h3");
    titulo.textContent = zona.nombre;

    var descripcion = document.createElement("p");
    descripcion.textContent = zona.descripcion;

    var enlace = document.createElement("a");
    enlace.className = "zona-card__link";
    enlace.href = "ruta.html?busqueda=" + encodeURIComponent(zona.busqueda || zona.nombre);
    enlace.innerHTML = 'Ver rutas <span aria-hidden="true">&rarr;</span>';

    cuerpo.append(titulo, descripcion, enlace);
    articulo.append(media, cuerpo);
    return articulo;
  }

  async function iniciar() {
    contenedor.setAttribute("aria-busy", "true");

    try {
      var zonas =
        window.EcoRutaDestinos && window.EcoRutaDestinos.cargarDestinos
          ? await window.EcoRutaDestinos.cargarDestinos()
          : [];

      var fragmento = document.createDocumentFragment();
      zonas.forEach(function (zona) {
        fragmento.appendChild(crearTarjeta(zona));
      });

      contenedor.replaceChildren(fragmento);
      contenedor.setAttribute("aria-busy", "false");

      if (estado) {
        estado.textContent = zonas.length + " zonas turísticas disponibles.";
      }
    } catch (error) {
      contenedor.setAttribute("aria-busy", "false");
      if (estado) {
        estado.textContent = "No se pudieron cargar las zonas turísticas.";
      }
      console.error("Error al renderizar las zonas turísticas:", error);
    }
  }

  iniciar();
})();
