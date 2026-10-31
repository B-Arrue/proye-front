// ==========================================
// Tarea Semana 12 - Desarrollo Web UCT
// Integrante: Benjamín Arrué
// ==========================================

// 1. URL de tu recurso personalizado en MockAPI 
const API_URL = 'https://6ae112d6be3bc8fead983c8d.mockapi.io/destinos';

// Capturamos los elementos del HTML para manejar los estados
const contenedorResultados = document.getElementById('resultado-api');
const mensajeCarga = document.getElementById('estado-carga');
const mensajeError = document.getElementById('estado-error');

// Función principal asíncrona para consumir la API
async function consumirMockAPI() {
    // --- ESTADO 1: CARGA (Mostramos mensaje de espera y limpiamos errores) ---
    if (mensajeCarga) mensajeCarga.style.display = 'block';
    if (mensajeError) mensajeError.style.display = 'none';
    if (contenedorResultados) contenedorResultados.innerHTML = '';

    try {
        // Petición fetch al servidor de MockAPI
        const respuesta = await fetch(API_URL);

        // Verificamos si la respuesta del servidor es exitosa (200-299)
        if (!respuesta.ok) {
            throw new Error(`Error en el servidor: Código ${respuesta.status}`);}

        // Procesamos la respuesta convirtiéndola a formato JSON
        const datosJson = await respuesta.json();

        // --- ESTADO 2: ÉXITO (Ocultamos carga y pintamos los datos en pantalla) ---
        if (mensajeCarga) mensajeCarga.style.display = 'none';
        mostrarDatosEnInterfaz(datosJson);}

      catch (error) {
        // --- ESTADO 3: ERROR (Ocultamos carga y mostramos el error al usuario) ---
        if (mensajeCarga) mensajeCarga.style.display = 'none';
        if (mensajeError) {
            mensajeError.style.display = 'block';
            mensajeError.textContent = `¡Ups! Ocurrió un problema al cargar los datos: ${error.message}`;}
        console.error('Falla en la petición Fetch:', error);} }

// Función auxiliar para recorrer el JSON y armar las tarjetas en el HTML
function mostrarDatosEnInterfaz(elementos) {
    if (!contenedorResultados) return;

    // Si la API no trae registros
    if (elementos.length === 0) {
        contenedorResultados.innerHTML = '<p>No hay elementos guardados en MockAPI.</p>';
        return;}

    // Recorremos cada objeto del arreglo JSON
    elementos.forEach(item => {
        const tarjeta = document.createElement('div');
        tarjeta.classList.add('tarjeta-item'); // Clase útil para estilizar con su CSS

        // Ajusta las propiedades (ej: item.name, item.descripcion) según los campos que creaste en MockAPI
        tarjeta.innerHTML = `
            <h3>${item.name || 'Sin nombre'}</h3>
            <p>ID: ${item.id}</p>
        `;
        contenedorResultados.appendChild(tarjeta);});}

// Ejecutamos la función de manera automática al cargar la página
document.addEventListener('DOMContentLoaded', consumirMockAPI);
