// ==========================================
// Tarea Semana 12 - Desarrollo Web UCT
// Integrante: Benjamín Arrué
// ==========================================

// 1. URL del recurso de destinos en MockAPI
const API_URL = 'https://6ae3b3b1933120ae20f918c6.mockapi.io/destinos';

// En el inicio se pintan las tarjetas de "Zonas Turísticas".
const contenedorResultados = document.getElementById('zonas-turisticas');
const mensajeCarga = document.getElementById('estado-carga');
const mensajeError = document.getElementById('estado-error');

// Datos de respaldo por si MockAPI no responde o devuelve una lista vacía.
const DESTINOS_RESPALDO = [
    {
        id: "1",
        nombre: "Araucanía Lacustre",
        zona: "Lagos · Naturaleza",
        descripcion: "Lagos, volcanes y bosques nativos al borde de la Patagonia.",
        imagen: "imagenes/icalma-araucarias.jpg",
        alt: "Laguna de Icalma rodeada de araucarias"
    },
    {
        id: "2",
        nombre: "Araucanía Andina",
        zona: "Montaña · Aventura",
        descripcion: "Cordillera, géiseres, ski y lagunas de altura.",
        imagen: "imagenes/conguillio-llaima.jpg",
        alt: "Volcán Llaima junto al lago Conguillío"
    },
    {
        id: "3",
        nombre: "Nahuelbuta",
        zona: "Bosque · Trekking",
        descripcion: "Cordillera de la costa, bosques de araucarias milenarias.",
        imagen: "imagenes/nahuelbuta-araucaria.jpg",
        alt: "Araucaria en el Parque Nacional Nahuelbuta"
    }
];

function normalizarDestino(item) {
    const nombre = item.nombre || item.name || "Destino de La Araucanía";
    return {
        id: item.id || "",
        nombre: nombre,
        zona: item.zona || item.categoria || "Turismo sustentable",
        descripcion: item.descripcion || "Descubre los rincones de La Araucanía.",
        imagen: item.imagen || item.imagenUrl || "Imagenes/volcan-llaima.jpg",
        alt: item.alt || nombre
    };
}

// Función principal asíncrona para consumir la API de destinos
async function consumirMockAPI() {
    if (!contenedorResultados) return;

    if (mensajeCarga) mensajeCarga.style.display = 'block';
    if (mensajeError) mensajeError.style.display = 'none';

    try {
        const respuesta = await fetch(API_URL);

        if (!respuesta.ok) {
            throw new Error(`Error en el servidor: Código ${respuesta.status}`);
        }

        const datosJson = await respuesta.json();

        if (!Array.isArray(datosJson) || datosJson.length === 0) {
            throw new Error('La API no devolvió destinos.');
        }

        if (mensajeCarga) mensajeCarga.style.display = 'none';
        mostrarDatosEnInterfaz(datosJson.map(normalizarDestino));

    } catch (error) {
        if (mensajeCarga) mensajeCarga.style.display = 'none';
        console.warn('No se pudieron cargar los destinos desde MockAPI. Se usan datos locales de respaldo.', error);
        mostrarDatosEnInterfaz(DESTINOS_RESPALDO);
    }
}

// Función para pintar las tarjetas de destinos en el HTML
function mostrarDatosEnInterfaz(elementos) {
    if (!contenedorResultados) return;

    const tituloH2 = contenedorResultados.querySelector("h2");
    contenedorResultados.replaceChildren();
    if (tituloH2) contenedorResultados.appendChild(tituloH2);

    if (elementos.length === 0) {
        const mensaje = document.createElement("p");
        mensaje.textContent = "No hay destinos para mostrar por el momento.";
        contenedorResultados.appendChild(mensaje);
        return;
    }

    const fragmento = document.createDocumentFragment();

    elementos.forEach(item => {
        const tarjeta = document.createElement("article");
        tarjeta.classList.add("tarjeta-item");

        const imagen = document.createElement("img");
        imagen.src = item.imagen;
        imagen.alt = item.alt;
        imagen.loading = "lazy";

        const zona = document.createElement("p");
        zona.textContent = item.zona;

        const titulo = document.createElement("h3");
        titulo.textContent = item.nombre;

        const descripcion = document.createElement("p");
        descripcion.textContent = item.descripcion;

        const enlace = document.createElement("a");
        enlace.href = "ruta.html" + (item.id ? "?id=" + encodeURIComponent(item.id) : "");
        enlace.textContent = "Ver detalles";

        tarjeta.append(imagen, zona, titulo, descripcion, enlace);
        fragmento.appendChild(tarjeta);
    });

    contenedorResultados.appendChild(fragmento);
}

document.addEventListener('DOMContentLoaded', consumirMockAPI);
