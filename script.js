// ==========================================
// Tarea Semana 12 - Desarrollo Web UCT
// Integrante: Benjamín Arrué
// ==========================================

// 1. URL de tu recurso personalizado en MockAPI (Destinos)
const API_URL = 'https://6ae112d6be3bc8fead983c8d.mockapi.io/destinos';

// Capturamos los elementos del HTML para manejar los estados
const contenedorResultados = document.getElementById('zonas-turisticas') || document.getElementById('resultado-api');
const mensajeCarga = document.getElementById('estado-carga');
const mensajeError = document.getElementById('estado-error');

// Función principal asíncrona para consumir la API de destinos
async function consumirMockAPI() {
    if (mensajeCarga) mensajeCarga.style.display = 'block';
    if (mensajeError) mensajeError.style.display = 'none';

    try {const respuesta = await fetch(API_URL);

        if (!respuesta.ok) {
            throw new Error(`Error en el servidor: Código ${respuesta.status}`);}

        const datosJson = await respuesta.json();

        if (mensajeCarga) mensajeCarga.style.display = 'none';
        mostrarDatosEnInterfaz(datosJson);

    } catch (error) {
        if (mensajeCarga) mensajeCarga.style.display = 'none';
        console.warn('Falla en la petición Fetch de destinos, cargando datos locales de respaldo...', error);

        // Datos de respaldo por si falla MockAPI o GitHub Pages
        const datosRespaldo = [
            {
                id: "1",
                name: "Araucanía Lacustre",
                zona: "Lagos · Naturaleza",
                descripcion: "Lagos, volcanes y bosques nativos al borde de la Patagonia.",
                imagenUrl: "lacustre.jpg"},
            {
                id: "2",
                name: "Araucanía Andina",
                zona: "Montaña · Aventura",
                descripcion: "Cordillera, géiseres, ski y lagunas de altura.",
                imagenUrl: "andina.jpg"},
            {
                id: "3",
                name: "Nahuelbuta",
                zona: "Bosque · Trekking",
                descripcion: "Cordillera de la costa, bosques de araucarias milenarias.",
                imagenUrl: "nahuelbuta.jpg"}];

        mostrarDatosEnInterfaz(datosRespaldo);}}

// Función para pintar las tarjetas de destinos en el HTML
function mostrarDatosEnInterfaz(elementos) {
    if (!contenedorResultados) return;

    const tituloH2 = contenedorResultados.querySelector("h2");
    contenedorResultados.innerHTML = '';
    if (tituloH2) contenedorResultados.appendChild(tituloH2);

    if (elementos.length === 0) {
        contenedorResultados.innerHTML += '<p>No hay elementos guardados en MockAPI.</p>';
        return;}

    elementos.forEach(item => {
        const tarjeta = document.createElement('article');
        tarjeta.classList.add('tarjeta-item');

        tarjeta.innerHTML = `
            <img src="${item.imagenUrl || 'hero-araucania.jpg'}" alt="${item.name || 'Destino'}">
            <p>${item.zona || 'Turismo sustentable'}</p>
            <h3>${item.name || 'Sin nombre'}</h3>
            <p>${item.descripcion || 'Descubre los rincones de La Araucanía.'}</p>
            <a href="ruta.html?id=${item.id}">Ver detalles</a>`;
        contenedorResultados.appendChild(tarjeta);});}

document.addEventListener('DOMContentLoaded', consumirMockAPI);
