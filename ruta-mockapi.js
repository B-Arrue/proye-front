/* ==========================================
   CATÁLOGO DE RUTAS · EcoRuta Temuco
   Consume MockAPI, aplica filtros y permite
   llegar con ?categoria=, ?busqueda= o ?dificultad=.
   ========================================== */
(function () {
  "use strict";

  var API_URL = "https://6aeb77f6ee39618d7bf85ccd.mockapi.io/ruta";

  var contenedor = document.getElementById("resultado-api");
  var estado = document.getElementById("estado");
  var reintentar = document.getElementById("reintentar");

  var formulario = document.getElementById("buscador-rutas");
  var entradaBusqueda = document.getElementById("busqueda-rutas");
  var botonLimpiar = document.getElementById("limpiar-busqueda");
  var filtroDificultad = document.getElementById("filtro-dificultad");
  var botonesCategoria = Array.prototype.slice.call(
    document.querySelectorAll(".filtro-categoria")
  );

  var RUTAS_RESPALDO = [
    { id: "1", nombre: "Circuito Volcán Llaima", categoria: "Trekking", zona: "Araucanía Andina", dificultad: "Alta", duracion: "2 días", distancia: "28 km", imagen: "Imagenes/volcan-llaima.jpg" },
    { id: "2", nombre: "Sendero Araucarias Milenarias", categoria: "Senderismo", zona: "Nahuelbuta", dificultad: "Media", duracion: "1 día", distancia: "12 km", imagen: "Imagenes/araucarias.jpg" },
    { id: "3", nombre: "Ruta de los Lagos", categoria: "Ciclismo", zona: "Araucanía Lacustre", dificultad: "Baja", duracion: "3 días", distancia: "45 km", imagen: "Imagenes/ruta-lagos.jpg" },
    { id: "4", nombre: "Sendero Litoral Toltén", categoria: "Senderismo", zona: "Araucanía Costera", dificultad: "Media", duracion: "1 día", distancia: "18 km", imagen: "Imagenes/sendero-litoral.jpeg" },
    { id: "5", nombre: "Ruta Cultural Mapuche", categoria: "Cultural", zona: "Temuco", dificultad: "Baja", duracion: "4 horas", distancia: "8 km", imagen: "Imagenes/mapuche.jpeg" },
    { id: "6", nombre: "Travesía Lonquimay", categoria: "Expedición", zona: "Araucanía Andina", dificultad: "Alta", duracion: "3 días", distancia: "52 km", imagen: "Imagenes/lonquimay.jpeg" },
    { id: "7", nombre: "Bahía Ensenada", categoria: "Kayak", zona: "Araucanía Lacustre", dificultad: "Baja", duracion: "5 horas", distancia: "9 km", imagen: "Imagenes/ensenada.jpeg" },
    { id: "8", nombre: "Mirador Piedra del Águila", categoria: "Trekking", zona: "Nahuelbuta", dificultad: "Media", duracion: "6 horas", distancia: "14 km", imagen: "Imagenes/piedra-aguila.png" }
  ];

  var IMAGENES_MINUSCULA = {
    "art.jpg": true,
    "comida.png": true,
    "conguillio-llaima.jpg": true,
    "icalma-araucarias.jpg": true,
    "nahuelbuta-araucaria.jpg": true
  };

  var rutas = [];
  var datosCargados = false;
  var terminoBusqueda = "";
  var categoriaActiva = "";
  var dificultadActiva = "";
  var CLAVE_FAVORITOS = "ecoruta-favoritos";
  var CLAVE_FILTROS = "ecoruta-filtros-rutas";

  function leerFavoritos() {
    try {
      var valor = window.localStorage.getItem(CLAVE_FAVORITOS);
      return valor ? JSON.parse(valor) : [];
    } catch (error) {
      return [];
    }
  }

  function guardarFavoritos(lista) {
    try {
      window.localStorage.setItem(CLAVE_FAVORITOS, JSON.stringify(lista));
    } catch (error) {
      /* sin persistencia */
    }
  }

  function esFavorito(nombre) {
    return leerFavoritos().indexOf(nombre) !== -1;
  }

  function alternarFavorito(nombre) {
    var lista = leerFavoritos();
    var indice = lista.indexOf(nombre);
    if (indice === -1) {
      lista.push(nombre);
    } else {
      lista.splice(indice, 1);
    }
    guardarFavoritos(lista);
    return indice === -1;
  }

  function guardarFiltros() {
    try {
      window.sessionStorage.setItem(
        CLAVE_FILTROS,
        JSON.stringify({
          termino: terminoBusqueda,
          categoria: categoriaActiva,
          dificultad: dificultadActiva
        })
      );
    } catch (error) {
      /* sin persistencia */
    }
  }

  function leerFiltrosGuardados() {
    try {
      var valor = window.sessionStorage.getItem(CLAVE_FILTROS);
      return valor ? JSON.parse(valor) : null;
    } catch (error) {
      return null;
    }
  }

  function normalizar(texto) {
    return String(texto || "")
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase()
      .trim();
  }

  function resolverImagen(url) {
    var archivo = String(url || "").split("/").pop();
    if (!archivo) return "Imagenes/volcan-llaima.jpg";
    return (IMAGENES_MINUSCULA[archivo] ? "imagenes/" : "Imagenes/") + archivo;
  }

  function normalizarRuta(ruta) {
    return {
      id: ruta.id || "",
      nombre: ruta.nombre || "Ruta de La Araucanía",
      categoria: ruta.categoria || "Naturaleza",
      zona: ruta.zona || "La Araucanía",
      dificultad: ruta.dificultad || "Media",
      duracion: ruta.duracion || "Por confirmar",
      distancia: ruta.distancia || "Por confirmar",
      imagen: resolverImagen(ruta.imagen)
    };
  }

  function textoBuscable(ruta) {
    return normalizar(
      [
        ruta.nombre,
        ruta.categoria,
        ruta.zona,
        ruta.dificultad,
        ruta.duracion,
        ruta.distancia
      ]
        .filter(Boolean)
        .join(" ")
    );
  }

  function hayFiltrosActivos() {
    return Boolean(terminoBusqueda || categoriaActiva || dificultadActiva);
  }

  function obtenerRutasFiltradas() {
    return rutas.filter(function (ruta) {
      var coincideTexto =
        !terminoBusqueda || textoBuscable(ruta).indexOf(terminoBusqueda) !== -1;
      var coincideCategoria = true;
      if (categoriaActiva) {
        if (categoriaActiva === "Favoritos") {
          coincideCategoria = esFavorito(ruta.nombre);
        } else {
          coincideCategoria =
            normalizar(ruta.categoria) === normalizar(categoriaActiva);
        }
      }
      var coincideDificultad =
        !dificultadActiva ||
        normalizar(ruta.dificultad) === normalizar(dificultadActiva);

      return coincideTexto && coincideCategoria && coincideDificultad;
    });
  }

  function mostrarEstado(tipo, mensaje) {
    if (!estado) return;
    estado.dataset.state = tipo;
    estado.textContent = mensaje;
    if (reintentar) reintentar.hidden = tipo !== "error";
  }

  function actualizarCategorias() {
    botonesCategoria.forEach(function (boton) {
      var activa = (boton.dataset.categoria || "") === categoriaActiva;
      boton.classList.toggle("activo", activa);
      boton.setAttribute("aria-pressed", String(activa));
    });
  }

  function actualizarContadorFavoritos() {
    var contador = document.querySelector(".fav-count");
    if (contador) {
      contador.textContent = " (" + leerFavoritos().length + ")";
    }
  }

  function actualizarBotonLimpiar() {
    if (botonLimpiar) botonLimpiar.hidden = !hayFiltrosActivos();
  }

  function icono(nombre) {
    if (nombre === "zona") {
      return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M17.657 16.657L13.414 20.9a2 2 0 0 1-2.827 0l-4.244-4.243a8 8 0 1 1 11.314 0z"/><path d="M15 11a3 3 0 1 1-6 0 3 3 0 0 1 6 0z"/></svg>';
    }
    if (nombre === "tiempo") {
      return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></svg>';
    }
    return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 19V5M4 19h16"/><path d="M8 16v-4M12 16V8M16 16v-6"/></svg>';
  }

  function crearMeta(iconoNombre, texto) {
    var span = document.createElement("span");
    span.innerHTML = icono(iconoNombre);
    span.appendChild(document.createTextNode(texto));
    return span;
  }

  function seleccionarRuta(nombre) {
    var select = document.getElementById("ruta");
    if (!select) return;

    var opcion = Array.prototype.slice.call(select.options).find(function (item) {
      return normalizar(item.value) === normalizar(nombre);
    });

    if (!opcion) {
      opcion = new Option(nombre, nombre);
      select.add(opcion);
    }

    select.value = opcion.value;
    actualizarFicha(nombre);
  }

  function actualizarFicha(nombre) {
    var ruta = rutas.find(function (item) {
      return normalizar(item.nombre) === normalizar(nombre);
    });
    if (!ruta) return;

    var imagen = document.getElementById("ficha-imagen");
    if (imagen) {
      imagen.src = ruta.imagen;
      imagen.alt = "Vista en detalle de la ruta " + ruta.nombre;
    }

    var titulo = document.getElementById("ficha-titulo");
    if (titulo) titulo.textContent = ruta.nombre;

    var zona = document.getElementById("ficha-zona");
    if (zona) zona.textContent = ruta.zona + " · " + ruta.categoria;

    var descripcion = document.getElementById("ficha-descripcion");
    if (descripcion) {
      descripcion.textContent =
        "Ruta de dificultad " +
        ruta.dificultad.toLowerCase() +
        " en " +
        ruta.zona +
        ". Duración de " +
        ruta.duracion +
        " y " +
        ruta.distancia +
        " de recorrido. Consulta los detalles y reserva tu cupo.";
    }

    var categoria = document.getElementById("ficha-categoria");
    if (categoria) categoria.textContent = ruta.categoria;

    var dificultad = document.getElementById("ficha-dificultad");
    if (dificultad) dificultad.textContent = ruta.dificultad + " dificultad";

    var zonaBadge = document.getElementById("ficha-zona-badge");
    if (zonaBadge) zonaBadge.textContent = ruta.zona;

    var duracion = document.getElementById("ficha-duracion");
    if (duracion) duracion.textContent = ruta.duracion;

    var distancia = document.getElementById("ficha-distancia");
    if (distancia) distancia.textContent = ruta.distancia;
  }

  function crearTarjeta(ruta) {
    var articulo = document.createElement("article");
    articulo.className = "ruta-card";

    var media = document.createElement("div");
    media.className = "ruta-card__media";

    var imagen = document.createElement("img");
    imagen.src = ruta.imagen;
    imagen.alt = "Paisaje de la ruta " + ruta.nombre;
    imagen.loading = "lazy";
    media.appendChild(imagen);

    var badge = document.createElement("span");
    badge.className =
      "ruta-card__badge badge--" + normalizar(ruta.dificultad);
    badge.textContent = ruta.dificultad;
    media.appendChild(badge);

    var cuerpo = document.createElement("div");
    cuerpo.className = "ruta-card__body";

    var categoria = document.createElement("span");
    categoria.className = "ruta-card__categoria";
    categoria.textContent = ruta.categoria;

    var titulo = document.createElement("h2");
    titulo.textContent = ruta.nombre;

    var meta = document.createElement("div");
    meta.className = "ruta-card__meta";
    meta.append(
      crearMeta("zona", ruta.zona),
      crearMeta("tiempo", ruta.duracion),
      crearMeta("distancia", ruta.distancia)
    );

    var descripcion = document.createElement("p");
    descripcion.textContent =
      "Ruta de dificultad " +
      ruta.dificultad.toLowerCase() +
      " en " +
      ruta.zona +
      ". Consulta los detalles y reserva tu cupo.";

    var favorito = document.createElement("button");
    favorito.type = "button";
    favorito.className = "ruta-card__favorito";
    var inicial = esFavorito(ruta.nombre);
    favorito.setAttribute("aria-pressed", String(inicial));
    favorito.setAttribute(
      "aria-label",
      inicial
        ? "Quitar " + ruta.nombre + " de favoritos"
        : "Agregar " + ruta.nombre + " a favoritos"
    );
    favorito.innerHTML =
      '<svg viewBox="0 0 24 24" fill="' +
      (inicial ? "currentColor" : "none") +
      '" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>';
    favorito.addEventListener("click", function () {
      var ahora = alternarFavorito(ruta.nombre);
      favorito.setAttribute("aria-pressed", String(ahora));
      favorito.setAttribute(
        "aria-label",
        ahora
          ? "Quitar " + ruta.nombre + " de favoritos"
          : "Agregar " + ruta.nombre + " a favoritos"
      );
      var svg = favorito.querySelector("svg");
      if (svg) svg.setAttribute("fill", ahora ? "currentColor" : "none");
      actualizarContadorFavoritos();
      if (categoriaActiva === "Favoritos") {
        renderizarRutas();
      }
    });

    var enlace = document.createElement("a");
    enlace.className = "btn btn--primary btn--sm btn--block";
    enlace.href = "#ficha-ruta";
    enlace.textContent = "Ver detalles";
    enlace.addEventListener("click", function () {
      seleccionarRuta(ruta.nombre);
    });

    cuerpo.append(categoria, titulo, meta, descripcion, favorito, enlace);
    articulo.append(media, cuerpo);
    return articulo;
  }

  function renderizarRutas() {
    if (!contenedor || !datosCargados) return;

    contenedor.replaceChildren();
    var filtradas = obtenerRutasFiltradas();

    if (rutas.length === 0) {
      mostrarEstado("empty", "Todavía no hay rutas para mostrar.");
      actualizarBotonLimpiar();
      return;
    }

    if (filtradas.length === 0) {
      var mensajeVacio = document.createElement("p");
      mensajeVacio.className = "sin-resultados";
      mensajeVacio.textContent =
        "No se encontraron rutas con esos filtros. Prueba con otro término, categoría o dificultad.";
      contenedor.appendChild(mensajeVacio);
      mostrarEstado("empty", "0 rutas encontradas.");
      actualizarBotonLimpiar();
      return;
    }

    var fragmento = document.createDocumentFragment();
    filtradas.forEach(function (ruta) {
      fragmento.appendChild(crearTarjeta(ruta));
    });
    contenedor.appendChild(fragmento);

    if (hayFiltrosActivos()) {
      mostrarEstado(
        "success",
        "Mostrando " + filtradas.length + " de " + rutas.length + " rutas."
      );
    } else {
      mostrarEstado("success", rutas.length + " rutas cargadas.");
    }

    actualizarBotonLimpiar();
    actualizarContadorFavoritos();
    guardarFiltros();
  }

  async function cargarRutas() {
    datosCargados = false;
    rutas = [];
    actualizarBotonLimpiar();

    if (contenedor) {
      contenedor.replaceChildren();
      contenedor.setAttribute("aria-busy", "true");
    }
    mostrarEstado("loading", "Cargando rutas…");

    try {
      var respuesta = await fetch(API_URL, { cache: "no-store" });
      if (!respuesta.ok) {
        throw new Error("Error " + respuesta.status);
      }

      var datos = await respuesta.json();
      if (!Array.isArray(datos)) {
        throw new Error("Formato inesperado");
      }

      rutas = datos.map(normalizarRuta);
      datosCargados = true;
      renderizarRutas();
      seleccionarRuta("Circuito Volcán Llaima");
    } catch (error) {
      console.warn(
        "No se pudo conectar con la API de rutas. Se usa el catálogo local.",
        error
      );
      rutas = RUTAS_RESPALDO.map(normalizarRuta);
      datosCargados = true;
      renderizarRutas();
      seleccionarRuta("Circuito Volcán Llaima");
      mostrarEstado(
        "error",
        "No se pudo conectar con la API. Mostrando el catálogo local."
      );
    } finally {
      if (contenedor) contenedor.setAttribute("aria-busy", "false");
    }
  }

  function aplicarParametrosURL() {
    var parametros = new URLSearchParams(window.location.search);
    var categoria = parametros.get("categoria") || "";
    var busqueda = parametros.get("busqueda") || "";
    var dificultad = parametros.get("dificultad") || "";

    var hayParametros = Boolean(categoria || busqueda || dificultad);

    if (!hayParametros) {
      var guardados = leerFiltrosGuardados();
      if (guardados) {
        if (guardados.categoria) categoria = guardados.categoria;
        if (guardados.dificultad) dificultad = guardados.dificultad;
        if (guardados.termino) busqueda = guardados.termino;
      }
    }

    if (categoria) categoriaActiva = categoria;
    if (dificultad) {
      dificultadActiva = dificultad;
      if (filtroDificultad) filtroDificultad.value = dificultad;
    }
    if (busqueda) {
      terminoBusqueda = normalizar(busqueda);
      if (entradaBusqueda) entradaBusqueda.value = busqueda;
    }

    actualizarCategorias();
    actualizarBotonLimpiar();
  }

  if (formulario) {
    formulario.addEventListener("submit", function (evento) {
      evento.preventDefault();
      terminoBusqueda = normalizar(entradaBusqueda ? entradaBusqueda.value : "");
      renderizarRutas();
    });
  }

  if (entradaBusqueda) {
    entradaBusqueda.addEventListener("input", function () {
      terminoBusqueda = normalizar(entradaBusqueda.value);
      renderizarRutas();
    });
  }

  botonesCategoria.forEach(function (boton) {
    boton.addEventListener("click", function () {
      categoriaActiva = boton.dataset.categoria || "";
      actualizarCategorias();
      renderizarRutas();
    });
  });

  if (filtroDificultad) {
    filtroDificultad.addEventListener("change", function () {
      dificultadActiva = filtroDificultad.value;
      renderizarRutas();
    });
  }

  if (botonLimpiar) {
    botonLimpiar.addEventListener("click", function () {
      if (entradaBusqueda) entradaBusqueda.value = "";
      if (filtroDificultad) filtroDificultad.value = "";
      terminoBusqueda = "";
      categoriaActiva = "";
      dificultadActiva = "";
      actualizarCategorias();
      renderizarRutas();
      if (entradaBusqueda) entradaBusqueda.focus();
    });
  }

  if (reintentar) reintentar.addEventListener("click", cargarRutas);

  aplicarParametrosURL();
  cargarRutas();
})();
