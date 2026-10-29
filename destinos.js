// Reemplaza esta URL por la del recurso `destinos` creado en MockAPI.
const MOCKAPI_DESTINOS_URL = "https://6ae3b3b1933120ae20f918c6.mockapi.io/destinos";

const statusElement = document.querySelector("#estado-destinos");
const listElement = document.querySelector("#lista-destinos");
const retryButton = document.querySelector("#reintentar-destinos");

function renderDestinations(destinations) {
  const fragment = document.createDocumentFragment();

  for (const destination of destinations) {
    const card = document.createElement("article");
    card.className = "tarjeta-destino";

    const figure = document.createElement("figure");
    const image = document.createElement("img");
    image.src = destination.imagen;
    image.alt = destination.alt;
    image.loading = "lazy";
    figure.append(image);

    if (destination.credito) {
      const caption = document.createElement("figcaption");
      caption.append(document.createTextNode(`${destination.credito} `));
      if (typeof destination.creditoUrl === "string" && destination.creditoUrl.startsWith("https://")) {
        const link = document.createElement("a");
        link.href = destination.creditoUrl;
        link.target = "_blank";
        link.rel = "noopener noreferrer";
        link.textContent = "Ver licencia";
        caption.append(link);
      }
      figure.append(caption);
    }

    const title = document.createElement("h2");
    title.textContent = destination.nombre;
    const description = document.createElement("p");
    description.textContent = destination.descripcion;

    card.append(figure, title, description);
    fragment.append(card);
  }

  listElement.replaceChildren(fragment);
}

function isValidDestination(destination) {
  return destination &&
    typeof destination.nombre === "string" &&
    typeof destination.descripcion === "string" &&
    typeof destination.imagen === "string" &&
    typeof destination.alt === "string";
}

async function loadDestinations() {
  statusElement.textContent = "Cargando destinos…";
  statusElement.dataset.state = "loading";
  listElement.setAttribute("aria-busy", "true");
  listElement.replaceChildren();
  retryButton.hidden = true;

  try {
    const response = await fetch(MOCKAPI_DESTINOS_URL);
    if (!response.ok) {
      throw new Error(`MockAPI respondió con el estado ${response.status}.`);
    }

    const data = await response.json();
    if (!Array.isArray(data)) {
      throw new Error("La respuesta debe ser una lista JSON de destinos.");
    }

    const destinations = data.filter(isValidDestination);
    if (destinations.length === 0) {
      throw new Error("No hay destinos válidos para mostrar en el recurso.");
    }

    renderDestinations(destinations);
    statusElement.textContent = `Se cargaron ${destinations.length} destinos.`;
    statusElement.dataset.state = "success";
  } catch (error) {
    statusElement.textContent = `No se pudieron cargar los destinos. ${error.message}`;
    statusElement.dataset.state = "error";
    retryButton.hidden = false;
  } finally {
    listElement.setAttribute("aria-busy", "false");
  }
}

retryButton.addEventListener("click", loadDestinations);
loadDestinations();
