/* ==========================================
   MENÚ LATERAL COMPARTIDO · EcoRuta Temuco
   Abre y cierra el drawer en todas las páginas.
   ========================================== */
(function () {
  "use strict";

  var menuBtn = document.getElementById("menuBtn");
  var closeBtn = document.getElementById("closeBtn");
  var drawer = document.getElementById("sideDrawer");
  var overlay = document.getElementById("navOverlay");

  if (!menuBtn || !drawer || !overlay) return;

  drawer.setAttribute("role", "dialog");
  drawer.setAttribute("aria-modal", "true");

  var ultimoFoco = null;

  function obtenerEnlaces() {
    return Array.prototype.slice.call(
      drawer.querySelectorAll('a[href], button:not([disabled])')
    );
  }

  function marcarPaginaActual() {
    var archivoActual = window.location.pathname.split("/").pop() || "index.html";

    Array.prototype.forEach.call(
      document.querySelectorAll(".drawer-link"),
      function (enlace) {
        var archivoEnlace = (enlace.getAttribute("href") || "").split("/").pop();
        if (archivoEnlace === archivoActual) {
          enlace.setAttribute("aria-current", "page");
        }
      }
    );
  }

  function abrirMenu() {
    ultimoFoco = document.activeElement;
    drawer.classList.add("open");
    overlay.classList.add("open");
    document.body.classList.add("menu-abierto");
    drawer.setAttribute("aria-hidden", "false");
    drawer.removeAttribute("inert");
    menuBtn.setAttribute("aria-expanded", "true");
    menuBtn.setAttribute("aria-label", "Cerrar menú");

    if (closeBtn) closeBtn.focus();
  }

  function cerrarMenu() {
    drawer.classList.remove("open");
    overlay.classList.remove("open");
    document.body.classList.remove("menu-abierto");
    drawer.setAttribute("aria-hidden", "true");
    drawer.setAttribute("inert", "");
    menuBtn.setAttribute("aria-expanded", "false");
    menuBtn.setAttribute("aria-label", "Abrir menú");

    if (ultimoFoco && typeof ultimoFoco.focus === "function") {
      ultimoFoco.focus();
    } else {
      menuBtn.focus();
    }
  }

  function menuEstaAbierto() {
    return drawer.classList.contains("open");
  }

  function atraparFoco(evento) {
    if (evento.key !== "Tab" || !menuEstaAbierto()) return;

    var enfocables = obtenerEnlaces();
    if (enfocables.length === 0) return;

    var primero = enfocables[0];
    var ultimo = enfocables[enfocables.length - 1];

    if (evento.shiftKey && document.activeElement === primero) {
      evento.preventDefault();
      ultimo.focus();
    } else if (!evento.shiftKey && document.activeElement === ultimo) {
      evento.preventDefault();
      primero.focus();
    }
  }

  menuBtn.addEventListener("click", function () {
    if (menuEstaAbierto()) {
      cerrarMenu();
    } else {
      abrirMenu();
    }
  });

  if (closeBtn) closeBtn.addEventListener("click", cerrarMenu);
  overlay.addEventListener("click", cerrarMenu);

  document.addEventListener("keydown", function (evento) {
    if (evento.key === "Escape" && menuEstaAbierto()) {
      cerrarMenu();
    }
    atraparFoco(evento);
  });

  drawer.setAttribute("aria-hidden", "true");
  drawer.setAttribute("inert", "");
  marcarPaginaActual();
})();
