(function () {
  const API_URL = "https://6aeb77f6ee39618d7bf85ccd.mockapi.io/ruta";

  const contenedor = document.getElementById("resultado-api");
  const estado = document.getElementById("estado");
  const reintentar = document.getElementById("reintentar");

  function mostrarEstado(tipo, mensaje) {
    estado.dataset.state = tipo;
    estado.textContent = mensaje;
    reintentar.hidden = tipo !== "error";
  }

  function crearTarjeta(ruta) {
    const article = document.createElement("article");

    if (ruta.imagen) {
      const figure = document.createElement("figure");
      const img = document.createElement("img");
      img.src = ruta.imagen;
      img.alt = ruta.nombre;
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

  async function cargarRutas() {
    contenedor.innerHTML = "";
    mostrarEstado("loading", "Cargando rutas...");

    try {
      const respuesta = await fetch(API_URL);
      if (!respuesta.ok) {
        throw new Error("Error " + respuesta.status);
      }

      const rutas = await respuesta.json();
      if (!Array.isArray(rutas)) {
        throw new Error("Formato inesperado");
      }

      if (rutas.length === 0) {
        mostrarEstado("success", "Todavía no hay rutas para mostrar.");
        return;
      }

      rutas.forEach((ruta) => contenedor.appendChild(crearTarjeta(ruta)));
      mostrarEstado("success", rutas.length + " rutas cargadas.");
    } catch (error) {
      mostrarEstado("error", "No se pudieron cargar las rutas. Inténtalo de nuevo.");
    }
  }

  reintentar.addEventListener("click", cargarRutas);
  cargarRutas();
})();