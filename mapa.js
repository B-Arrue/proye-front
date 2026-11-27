/* ==========================================
   MAPA · EcoRuta Temuco
   Mapa Leaflet con las rutas de La Araucanía.
   ========================================== */
(function () {
  "use strict";

  var rutas = [
    { nombre: "Circuito Volcán Llaima", categoria: "Trekking", zona: "Araucanía Andina", dificultad: "Alta", duracion: "2 días", distancia: "28 km", lat: -38.68, lng: -71.7 },
    { nombre: "Sendero Araucarias Milenarias", categoria: "Senderismo", zona: "Nahuelbuta", dificultad: "Media", duracion: "1 día", distancia: "12 km", lat: -37.8, lng: -72.97 },
    { nombre: "Ruta de los Lagos", categoria: "Ciclismo", zona: "Araucanía Lacustre", dificultad: "Baja", duracion: "3 días", distancia: "45 km", lat: -39.28, lng: -72.23 },
    { nombre: "Sendero Litoral Toltén", categoria: "Senderismo", zona: "Araucanía Costera", dificultad: "Media", duracion: "1 día", distancia: "18 km", lat: -39.22, lng: -73.22 },
    { nombre: "Ruta Cultural Mapuche", categoria: "Cultural", zona: "Temuco", dificultad: "Baja", duracion: "4 horas", distancia: "8 km", lat: -38.7359, lng: -72.5904 },
    { nombre: "Travesía Lonquimay", categoria: "Expedición", zona: "Araucanía Andina", dificultad: "Alta", duracion: "3 días", distancia: "52 km", lat: -38.38, lng: -71.58 },
    { nombre: "Bahía Ensenada", categoria: "Kayak", zona: "Araucanía Lacustre", dificultad: "Baja", duracion: "5 horas", distancia: "9 km", lat: -39.28, lng: -71.95 },
    { nombre: "Mirador Piedra del Águila", categoria: "Trekking", zona: "Nahuelbuta", dificultad: "Media", duracion: "6 horas", distancia: "14 km", lat: -37.83, lng: -73.0 }
  ];

  var contenedor = document.getElementById("mapa-leaflet");
  if (!contenedor || typeof L === "undefined") return;

  var mapa = L.map(contenedor, { scrollWheelZoom: false }).setView(
    [-38.75, -72.5],
    8
  );

  L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
    maxZoom: 18,
    attribution:
      '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
  }).addTo(mapa);

  var puntos = [];

  rutas.forEach(function (ruta) {
    var popup = document.createElement("div");

    var titulo = document.createElement("strong");
    titulo.textContent = ruta.nombre;

    var lugar = document.createElement("p");
    lugar.textContent = ruta.categoria + " · " + ruta.zona;

    var datos = document.createElement("p");
    datos.textContent =
      ruta.dificultad + " · " + ruta.duracion + " · " + ruta.distancia;

    var enlace = document.createElement("a");
    enlace.href = "ruta.html?busqueda=" + encodeURIComponent(ruta.nombre);
    enlace.textContent = "Ver ruta";

    popup.append(titulo, lugar, datos, enlace);

    L.marker([ruta.lat, ruta.lng]).addTo(mapa).bindPopup(popup);
    puntos.push([ruta.lat, ruta.lng]);
  });

  mapa.fitBounds(puntos, { padding: [30, 30] });

  window.addEventListener("load", function () {
    mapa.invalidateSize();
  });
})();
