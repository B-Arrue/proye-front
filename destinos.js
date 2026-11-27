/* ==========================================
   DESTINOS · EcoRuta Temuco
   Catálogo de zonas turísticas con datos de
   MockAPI y respaldo local.
   ========================================== */
(function () {
  "use strict";

  var estado = document.getElementById("estado-destinos");
  var listado = document.getElementById("lista-destinos");
  var reintentar = document.getElementById("reintentar-destinos");

  if (!listado) return;

  function crearTarjeta(destino) {
    var articulo = document.createElement("article");
    articulo.className = "tarjeta-destino";

    var figura = document.createElement("figure");
    var imagen = document.createElement("img");
    imagen.src = destino.imagen;
    imagen.alt = destino.alt || destino.nombre;
    imagen.loading = "lazy";
    figura.appendChild(imagen);

    if (destino.credito) {
      var credito = document.createElement("figcaption");
      credito.appendChild(document.createTextNode(destino.credito + " "));

      if (
        typeof destino.creditoUrl === "string" &&
        destino.creditoUrl.indexOf("https://") === 0
      ) {
        var enlaceCredito = document.createElement("a");
        enlaceCredito.href = destino.creditoUrl;
        enlaceCredito.target = "_blank";
        enlaceCredito.rel = "noopener noreferrer";
        enlaceCredito.textContent = "Ver licencia";
        credito.appendChild(enlaceCredito);
      }

      figura.appendChild(credito);
    }

    var cuerpo = document.createElement("div");
    cuerpo.className = "tarjeta-destino__body";

    var titulo = document.createElement("h2");
    titulo.textContent = destino.nombre;

    var descripcion = document.createElement("p");
    descripcion.textContent = destino.descripcion;

    var enlace = document.createElement("a");
    enlace.className = "btn btn--secondary btn--sm";
    enlace.href =
      "ruta.html?busqueda=" +
      encodeURIComponent(destino.busqueda || destino.nombre);
    enlace.textContent = "Ver rutas de la zona";

    cuerpo.append(titulo, descripcion, enlace);
    articulo.append(figura, cuerpo);
    return articulo;
  }

  function mostrarEstado(tipo, mensaje) {
    if (!estado) return;
    estado.dataset.state = tipo;
    estado.textContent = mensaje;
  }

  async function cargarDestinos() {
    mostrarEstado("loading", "Cargando destinos…");
    listado.setAttribute("aria-busy", "true");
    listado.replaceChildren();
    if (reintentar) reintentar.hidden = true;

    try {
      if (!window.EcoRutaDestinos || !window.EcoRutaDestinos.cargarDestinos) {
        throw new Error("No está disponible el módulo de destinos.");
      }

      var destinos = await window.EcoRutaDestinos.cargarDestinos();
      if (!Array.isArray(destinos) || destinos.length === 0) {
        throw new Error("No hay destinos para mostrar.");
      }

      var fragmento = document.createDocumentFragment();
      destinos.forEach(function (destino) {
        fragmento.appendChild(crearTarjeta(destino));
      });

      listado.appendChild(fragmento);
      mostrarEstado("success", destinos.length + " zonas para explorar.");
    } catch (error) {
      mostrarEstado(
        "error",
        "No se pudieron cargar los destinos. Inténtalo de nuevo."
      );
      if (reintentar) reintentar.hidden = false;
      console.error("Error al cargar destinos:", error);
    } finally {
      listado.setAttribute("aria-busy", "false");
    }
  }

  if (reintentar) reintentar.addEventListener("click", cargarDestinos);
  cargarDestinos();
})();
