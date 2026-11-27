/* ==========================================
   ACCESIBILIDAD · EcoRuta Temuco
   Aplica y recuerda el modo oscuro y el modo
   de lectura para dislexia en todas las páginas.
   ========================================== */
(function () {
  "use strict";

  var CLAVE_TEMA = "ecoruta-tema";
  var CLAVE_LECTURA = "ecoruta-lectura";
  var raiz = document.documentElement;

  var ICONO_LUNA =
    '<span class="acc-btn__icono acc-btn__icono--luna" aria-hidden="true">' +
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">' +
    '<path d="M20.5 14.2A8.5 8.5 0 0 1 9.8 3.5 8.5 8.5 0 1 0 20.5 14.2Z"/>' +
    "</svg></span>";

  var ICONO_SOL =
    '<span class="acc-btn__icono acc-btn__icono--sol" aria-hidden="true">' +
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">' +
    '<circle cx="12" cy="12" r="4"/>' +
    '<path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/>' +
    "</svg></span>";

  var ICONO_LECTURA =
    '<span class="acc-btn__icono" aria-hidden="true">' +
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">' +
    '<path d="M12 6.5C10.4 4.9 8.2 4 5.5 4H3v14h2.5c2.7 0 4.9.9 6.5 2.5 1.6-1.6 3.8-2.5 6.5-2.5H21V4h-2.5c-2.7 0-4.9.9-6.5 2.5Z"/>' +
    '<path d="M12 6.5V20.5"/>' +
    "</svg></span>";

  function leerPreferencia(clave) {
    try {
      return window.localStorage.getItem(clave);
    } catch (error) {
      return null;
    }
  }

  function guardarPreferencia(clave, valor) {
    try {
      window.localStorage.setItem(clave, valor);
    } catch (error) {
      /* El sitio sigue funcionando aunque localStorage esté bloqueado. */
    }
  }

  function aplicarPreferenciasGuardadas() {
    if (leerPreferencia(CLAVE_TEMA) === "oscuro") {
      raiz.classList.add("modo-oscuro");
    }
    if (leerPreferencia(CLAVE_LECTURA) === "activa") {
      raiz.classList.add("modo-dislexia");
    }
  }

  function crearBoton(tipo, iconos, texto) {
    var boton = document.createElement("button");
    boton.type = "button";
    boton.className = "acc-btn";
    boton.dataset.acc = tipo;
    boton.innerHTML = iconos + '<span class="acc-btn__texto">' + texto + "</span>";
    return boton;
  }

  function actualizarBotonTema(boton) {
    var activo = raiz.classList.contains("modo-oscuro");
    boton.setAttribute("aria-pressed", String(activo));
    boton.setAttribute(
      "aria-label",
      activo ? "Desactivar modo oscuro" : "Activar modo oscuro"
    );
    boton.title = activo ? "Desactivar modo oscuro" : "Activar modo oscuro";
    boton.querySelector(".acc-btn__texto").textContent = activo
      ? "Modo claro"
      : "Modo oscuro";
  }

  function actualizarBotonLectura(boton) {
    var activo = raiz.classList.contains("modo-dislexia");
    boton.setAttribute("aria-pressed", String(activo));
    boton.setAttribute(
      "aria-label",
      activo ? "Desactivar lectura fácil" : "Activar lectura fácil"
    );
    boton.title = activo ? "Desactivar lectura fácil" : "Activar lectura fácil";
  }

  function anunciar(mensaje) {
    var region = document.getElementById("acc-anuncio");
    if (!region) {
      region = document.createElement("p");
      region.id = "acc-anuncio";
      region.className = "acc-sr-only";
      region.setAttribute("role", "status");
      region.setAttribute("aria-live", "polite");
      document.body.appendChild(region);
    }
    region.textContent = "";
    window.setTimeout(function () {
      region.textContent = mensaje;
    }, 60);
  }

  function insertarControles() {
    var header = document.querySelector("header");
    if (!header || header.querySelector(".acc-controles")) return;

    var menuBtn = header.querySelector(".menu-btn");
    var acciones = document.createElement("div");
    acciones.className = "header-acciones";

    var controles = document.createElement("div");
    controles.className = "acc-controles";
    controles.setAttribute("role", "group");
    controles.setAttribute("aria-label", "Opciones de accesibilidad");

    var botonTema = crearBoton("tema", ICONO_LUNA + ICONO_SOL, "Modo oscuro");
    var botonLectura = crearBoton("lectura", ICONO_LECTURA, "Lectura fácil");

    actualizarBotonTema(botonTema);
    actualizarBotonLectura(botonLectura);

    botonTema.addEventListener("click", function () {
      var activo = raiz.classList.toggle("modo-oscuro");
      guardarPreferencia(CLAVE_TEMA, activo ? "oscuro" : "claro");
      actualizarBotonTema(botonTema);
      anunciar(activo ? "Modo oscuro activado." : "Modo oscuro desactivado.");
      document.dispatchEvent(
        new CustomEvent("ecoruta:tema-cambiado", { detail: { oscuro: activo } })
      );
    });

    botonLectura.addEventListener("click", function () {
      var activo = raiz.classList.toggle("modo-dislexia");
      guardarPreferencia(CLAVE_LECTURA, activo ? "activa" : "inactiva");
      actualizarBotonLectura(botonLectura);
      anunciar(
        activo
          ? "Modo de lectura para dislexia activado."
          : "Modo de lectura para dislexia desactivado."
      );
    });

    controles.append(botonTema, botonLectura);
    acciones.appendChild(controles);

    if (menuBtn) {
      header.insertBefore(acciones, menuBtn);
      acciones.appendChild(menuBtn);
    } else {
      header.appendChild(acciones);
    }
  }

  function sincronizarOtrasPestanas(evento) {
    if (evento.key === CLAVE_TEMA) {
      raiz.classList.toggle("modo-oscuro", evento.newValue === "oscuro");
      var botonTema = document.querySelector('[data-acc="tema"]');
      if (botonTema) actualizarBotonTema(botonTema);
    }
    if (evento.key === CLAVE_LECTURA) {
      raiz.classList.toggle("modo-dislexia", evento.newValue === "activa");
      var botonLectura = document.querySelector('[data-acc="lectura"]');
      if (botonLectura) actualizarBotonLectura(botonLectura);
    }
  }

  aplicarPreferenciasGuardadas();

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", insertarControles);
  } else {
    insertarControles();
  }

  window.addEventListener("storage", sincronizarOtrasPestanas);
})();
