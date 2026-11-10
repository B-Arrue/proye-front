// ==========================================
// Tarea Semana 12 - Desarrollo Web UCT
// Integrante: Benjamín Arrué
// ==========================================

// Definimos la URL del endpoint específico de ruta en MockAPI
const API_URL_RUTAS = 'https://6ae112d6be3bc8fead983c8d.mockapi.io/ruta';

// Capturamos los elementos del DOM de la vista de rutas
const contenedorRutas = document.getElementById('resultado-api');
const cargaRutas = document.getElementById('estado-carga');
const errorRutas = document.getElementById('estado-error');

// Función principal asíncrona para la API de rutas
async function consumirMockAPIRutas() {
    if (cargaRutas) cargaRutas.style.display = 'block';
    if (errorRutas) errorRutas.style.display = 'none';
    if (contenedorRutas) contenedorRutas.innerHTML = '';

    try {
        const respuesta = await fetch(API_URL_RUTAS);

        if (!respuesta.ok) {
            throw new Error(`Error en el servidor: Código ${respuesta.status}`);}

        const datosJson = await respuesta.json();

        if (cargaRutas) cargaRutas.style.display = 'none';
        mostrarRutasEnInterfaz(datosJson);

    } catch (error) {
        if (cargaRutas) cargaRutas.style.display = 'none';
        console.warn('Falla en la petición Fetch de rutas, cargando datos de respaldo...', error);

        // Respaldo local específico para rutas
        const datosRespaldoRutas = [
            { id: "1", name: "Ruta Parques Nacionales Araucanía", descripcion: "Recorrido por la Araucanía Andina y sus volcanes." },
            { id: "2", name: "Circuito Lagos y Bosques", descripcion: "Aventura por la zona lacustre y sus senderos nativos." },
            { id: "3", name: "Sendero Nahuelbuta", descripcion: "Exploración de la cordillera de la costa y araucarias milenarias." }];

        mostrarRutasEnInterfaz(datosRespaldoRutas);} }

// Función para pintar las rutas en el HTML
function mostrarRutasEnInterfaz(elementos) {
    if (!contenedorRutas) return;

    if (elementos.length === 0) {
        contenedorRutas.innerHTML = '<p>No hay rutas guardadas en MockAPI.</p>';
        return;}

    elementos.forEach(item => {
        const tarjeta = document.createElement('div');
        tarjeta.classList.add('tarjeta-item');

        tarjeta.innerHTML = `
            <h3>${item.name || 'Sin nombre'}</h3>
            <p>${item.descripcion || 'Ruta sustentable en La Araucanía.'}</p>
            <p><strong>ID:</strong> ${item.id}</p>`;
        contenedorRutas.appendChild(tarjeta);});}

document.addEventListener('DOMContentLoaded', consumirMockAPIRutas);
