/* ==========================================
   DESTINOS · EcoRuta Temuco
   Combina las 5 zonas turísticas del sitio con
   los registros disponibles en MockAPI.
   ========================================== */
(function () {
  "use strict";

  var API_URL = "https://6ae3b3b1933120ae20f918c6.mockapi.io/destinos";

  // Estos archivos viven en la carpeta "imagenes" (minúscula) del repositorio.
  var IMAGENES_MINUSCULA = {
    "art.jpg": true,
    "comida.png": true,
    "conguillio-llaima.jpg": true,
    "icalma-araucarias.jpg": true,
    "nahuelbuta-araucaria.jpg": true
  };

  var ZONAS = [
    {
      id: "andina",
      nombre: "Araucanía Andina",
      descripcion:
        "Volcanes, bosques de araucaria y lagunas de origen glaciar.",
      imagen: "imagenes/conguillio-llaima.jpg",
      alt: "Volcán Llaima junto al lago Conguillío",
      credito: "Foto: Mariomxel",
      creditoUrl: "https://creativecommons.org/licenses/by-sa/4.0/",
      busqueda: "Araucanía Andina"
    },
    {
      id: "lacustre",
      nombre: "Araucanía Lacustre",
      descripcion: "Lagos, ríos y termas rodeados de naturaleza exuberante.",
      imagen: "imagenes/icalma-araucarias.jpg",
      alt: "Laguna de Icalma rodeada de araucarias",
      credito: "Foto: Paula Misle",
      creditoUrl: "https://creativecommons.org/licenses/by-sa/3.0/",
      busqueda: "Araucanía Lacustre"
    },
    {
      id: "nahuelbuta",
      nombre: "Nahuelbuta",
      descripcion:
        "Cordillera de la Costa con bosques de coihue y roble pelín.",
      imagen: "imagenes/nahuelbuta-araucaria.jpg",
      alt: "Araucaria en el Parque Nacional Nahuelbuta",
      credito: "Foto: Roberto Antonio Ancavil",
      creditoUrl: "https://creativecommons.org/publicdomain/zero/1.0/",
      busqueda: "Nahuelbuta"
    },
    {
      id: "costera",
      nombre: "Araucanía Costera",
      descripcion:
        "Playas vírgenes y comunidades lafkenche frente al Pacífico.",
      imagen: "Imagenes/sendero-litoral.jpeg",
      alt: "Sendero junto a la costa de La Araucanía",
      credito: "",
      creditoUrl: "",
      busqueda: "Araucanía Costera"
    },
    {
      id: "temuco",
      nombre: "Temuco",
      descripcion:
        "Capital regional con cultura mapuche, naturaleza urbana y gastronomía.",
      imagen: "Imagenes/mapuche.jpeg",
      alt: "Cultura mapuche en Temuco",
      credito: "",
      creditoUrl: "",
      busqueda: "Temuco"
    }
  ];

  function normalizar(texto) {
    return String(texto || "")
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase()
      .trim();
  }

  function resolverImagen(url, respaldo) {
    var archivo = String(url || "").split("/").pop();
    if (!archivo) return respaldo;
    return (IMAGENES_MINUSCULA[archivo] ? "imagenes/" : "Imagenes/") + archivo;
  }

  function combinarConApi(zonas, registros) {
    return zonas.map(function (zona) {
      var nombreZona = normalizar(zona.nombre);
      var registro = registros.find(function (item) {
        var nombreApi = normalizar(item && item.nombre);
        return (
          nombreApi &&
          (nombreApi === nombreZona ||
            nombreApi.indexOf(nombreZona) !== -1 ||
            nombreZona.indexOf(nombreApi) !== -1)
        );
      });

      if (!registro) return Object.assign({}, zona);

      return Object.assign({}, zona, {
        imagen: resolverImagen(registro.imagen, zona.imagen),
        alt: registro.alt || zona.alt,
        credito: registro.credito || zona.credito,
        creditoUrl: registro.creditoUrl || zona.creditoUrl
      });
    });
  }

  async function cargarDestinos() {
    try {
      var respuesta = await fetch(API_URL, { cache: "no-store" });
      if (!respuesta.ok) {
        throw new Error("MockAPI respondió con el estado " + respuesta.status);
      }

      var datos = await respuesta.json();
      if (!Array.isArray(datos) || datos.length === 0) {
        throw new Error("La API no devolvió destinos.");
      }

      return combinarConApi(ZONAS, datos);
    } catch (error) {
      console.warn(
        "No se pudieron cargar los destinos desde MockAPI. Se usan las zonas locales.",
        error
      );
      return ZONAS.map(function (zona) {
        return Object.assign({}, zona);
      });
    }
  }

  window.EcoRutaDestinos = {
    cargarDestinos: cargarDestinos,
    zonas: ZONAS,
    resolverImagen: resolverImagen
  };
})();
