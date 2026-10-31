// ==========================================
// Tarea Semana 12 - Desarrollo Web UCT
// Integrante: Benjamín Arrué
// ==========================================

// Definimos la URL del endpoint específico de ruta en MockAPI (en singular)
const API_URL = 'https://6ae112d6be3bc8fead983c8d.mockapi.io/ruta';

// Capturamos los elementos del DOM donde mostraremos los resultados o estados
const contenedorResultados = document.getElementById('resultado-api');
const mensajeCarga = document.getElementById('estado-carga');
const mensajeError = document.getElementById('estado-error');

// Función principal asíncrona para realizar la petición a la API (Fetch)
async function consumirMockAPI() {
    // Mostrar indicador de carga y ocultar errores previos
    if (mensajeCarga) mensajeCarga.style.display = 'block';
    if (mensajeError) mensajeError.style.display = 'none';
    if (contenedorResultados) contenedorResultados.innerHTML = '';

    try {
        // Realizamos la petición HTTP GET a la API
        const respuesta = await fetch(API_URL);

        // Verificamos si la respuesta del servidor es correcta
        if (!respuesta.ok) {
            throw new Error(`Error en el servidor: Código ${respuesta.status}`);
        }

        // Convertimos la respuesta a formato JSON (arreglo de objetos)
        const datosJson = await respuesta.json();

        // Ocultamos el mensaje de carga una vez obtenidos los datos
        if (mensajeCarga) mensajeCarga.style.display = 'none';

        // Llamamos a la función encargada de pintar los datos en la interfaz
        mostrarDatosEnInterfaz(datosJson);

    } catch (error) {
        // En caso de error, ocultamos la carga y mostramos el mensaje de error
        if (mensajeCarga) mensajeCarga.style.display = 'none';
        if (mensajeError) {
            mensajeError.style.display = 'block';
            mensajeError.textContent = `¡Ups! Ocurrió un problema al cargar los datos: ${error.message}`;
        }
        console.error('Falla en la petición Fetch:', error);
    } 
}

// Función para recorrer los datos y agregarlos dinámicamente al HTML
function mostrarDatosEnInterfaz(elementos) {
    if (!contenedorResultados) return;

    // Validamos si el arreglo de la API está vacío
    if (elementos.length === 0) {
        contenedorResultados.innerHTML = '<p>No hay elementos guardados en MockAPI.</p>';
        return;
    }

    // Iteramos sobre cada elemento recibido de la API
    elementos.forEach(item => {
        const tarjeta = document.createElement('div');
        tarjeta.classList.add('tarjeta-item');

        // Estructura HTML que se inyectará por cada ruta registrada
        tarjeta.innerHTML = `
            <h3>${item.name || 'Sin nombre'}</h3>
            <p>ID: ${item.id}</p>
        `;
        contenedorResultados.appendChild(tarjeta);
    });
}

// Ejecutamos la función de consumo una vez que el DOM de la página haya cargado por completo
document.addEventListener('DOMContentLoaded', consumirMockAPI);
