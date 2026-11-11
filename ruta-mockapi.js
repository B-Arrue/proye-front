(function () {
  const API_URL = "https://6aeb77f6ee39618d7bf85ccd.mockapi.io/ruta";

  const contenedor = document.getElementById("resultado-api");
  const estado = document.getElementById("estado");
  const reintentar = document.getElementById("reintentar");

  const formulario = document.getElementById("buscador-rutas");
  const entradaBusqueda = document.getElementById("busqueda-rutas");
  const botonLimpiar = document.getElementById("limpiar-busqueda");
  const filtroDificultad = document.getElementById("filtro-dificultad");
  const botonesCategoria = Array.from(document.querySelectorAll(".filtro-categoria"));

  let rutas = [];
  let datosCargados = false;
  let terminoBusqueda = "";
  let categoriaActiva = "";
  let dificultadActiva = "";

  // Quita tildes y mayúsculas para que "araucania" encuentre "Araucanía".
  function normalizar(texto) {
    return String(texto || "")
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase()
      .trim();
  }

  function textoBuscable(ruta) {
    return normalizar(
      [ruta.nombre, ruta.categoria, ruta.zona, ruta.dificultad, ruta.duracion, ruta.distancia]
        .filter(Boolean)
        .join(" ")
    );
  }

  function hayFiltrosActivos() {
    return Boolean(terminoBusqueda || categoriaActiva || dificultadActiva);
  }

  function obtenerRutasFiltradas() {
    return rutas.filter((ruta) => {
      const coincideTexto = !terminoBusqueda || textoBuscable(ruta).includes(terminoBusqueda);
      const coincideCategoria =
        !categoriaActiva || normalizar(ruta.categoria) === normalizar(categoriaActiva);
      const coincideDificultad =
        !dificultadActiva || normalizar(ruta.dificultad) === normalizar(dificultadActiva);

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
    botonesCategoria.forEach((boton) => {
      const activa = (boton.dataset.categoria || "") === categoriaActiva;
      boton.classList.toggle("activo", activa);
      boton.setAttribute("aria-pressed", String(activa));
    });
  }

  function actualizarBotonLimpiar() {
    if (botonLimpiar) botonLimpiar.hidden = !hayFiltrosActivos();
  }

  function crearTarjeta(ruta) {
    const article = document.createElement("article");

    if (ruta.imagen) {
      const figure = document.createElement("figure");
      const img = document.createElement("img");
      img.src = ruta.imagen;
      img.alt = ruta.nombre;
      img.loading = "lazy";
      figure.appendChild(img);
      article.appendChild(figure);
    }

    const categoria = document.createElement("span");
    categoria.textContent = ruta.categoria;

    const zona = document.createElement("p");
    zona.textContent = ruta.zona;

    const titulo = document.createElement("h2");
    titulo.textContent = ruta.nombre;

    const datos = document.createElement("ul");
    [ruta.dificultad, ruta.duracion, ruta.distancia]
      .filter(Boolean)
      .forEach((texto) => {
        const li = document.createElement("li");
        li.textContent = texto;
        datos.appendChild(li);
      });

    article.append(categoria, zona, titulo, datos);
    return article;
  }

  function renderizarRutas() {
    if (!contenedor || !datosCargados) return;

    contenedor.innerHTML = "";
    const filtradas = obtenerRutasFiltradas();

    if (rutas.length === 0) {
      mostrarEstado("success", "Todavía no hay rutas para mostrar.");
      actualizarBotonLimpiar();
      return;
    }

    if (filtradas.length === 0) {
      const mensajeVacio = document.createElement("p");
      mensajeVacio.className = "sin-resultados";
      mensajeVacio.textContent =
        "No se encontraron rutas con esos filtros. Prueba con otro término o categoría.";
      contenedor.appendChild(mensajeVacio);
      mostrarEstado("empty", "0 rutas encontradas.");
      actualizarBotonLimpiar();
      return;
    }

    filtradas.forEach((ruta) => contenedor.appendChild(crearTarjeta(ruta)));

    if (hayFiltrosActivos()) {
      mostrarEstado("success", "Mostrando " + filtradas.length + " de " + rutas.length + " rutas.");
    } else {
      mostrarEstado("success", rutas.length + " rutas cargadas.");
    }

    actualizarBotonLimpiar();
  }

  async function cargarRutas() {
    datosCargados = false;
    rutas = [];
    actualizarBotonLimpiar();
    contenedor.innerHTML = "";
    contenedor.setAttribute("aria-busy", "true");
    mostrarEstado("loading", "Cargando rutas...");

    try {
      const respuesta = await fetch(API_URL);
      if (!respuesta.ok) {
        throw new Error("Error " + respuesta.status);
      }

      const datos = await respuesta.json();
      if (!Array.isArray(datos)) {
        throw new Error("Formato inesperado");
      }

      rutas = datos;
      datosCargados = true;
      renderizarRutas();
    } catch (error) {
      rutas = [];
      contenedor.innerHTML = "";
      mostrarEstado("error", "No se pudieron cargar las rutas. Inténtalo de nuevo.");
    } finally {
      contenedor.setAttribute("aria-busy", "false");
    }
  }

  if (formulario) {
    formulario.addEventListener("submit", (event) => {
      event.preventDefault();
      terminoBusqueda = normalizar(entradaBusqueda.value);
      renderizarRutas();
    });
  }

  if (entradaBusqueda) {
    entradaBusqueda.addEventListener("input", () => {
      terminoBusqueda = normalizar(entradaBusqueda.value);
      renderizarRutas();
    });
  }

  botonesCategoria.forEach((boton) => {
    boton.addEventListener("click", () => {
      categoriaActiva = boton.dataset.categoria || "";
      actualizarCategorias();
      renderizarRutas();
    });
  });

  if (filtroDificultad) {
    filtroDificultad.addEventListener("change", () => {
      dificultadActiva = filtroDificultad.value;
      renderizarRutas();
    });
  }

  if (botonLimpiar) {
    botonLimpiar.addEventListener("click", () => {
      entradaBusqueda.value = "";
      terminoBusqueda = "";
      categoriaActiva = "";
      dificultadActiva = "";
      filtroDificultad.value = "";
      actualizarCategorias();
      renderizarRutas();
      entradaBusqueda.focus();
    });
  }

  reintentar.addEventListener("click", cargarRutas);
  cargarRutas();
})();
