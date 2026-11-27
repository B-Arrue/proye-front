/* ==========================================
   CARRUSEL DE GALERÍA · EcoRuta Temuco
   Conserva el carrusel original y actualiza el
   texto descriptivo de cada fotografía.
   ========================================== */
(function () {
  "use strict";

  var btnIzquierda = document.querySelector(".btn-left");
  var btnDerecha = document.querySelector(".btn-right");
  var slider = document.getElementById("slider");
  var diapositivas = Array.prototype.slice.call(
    document.querySelectorAll(".slider-section")
  );
  var leyenda = document.getElementById("carrusel-caption");

  if (!btnIzquierda || !btnDerecha || !slider || diapositivas.length === 0) {
    return;
  }

  var indice = 0;
  var paso = 100 / diapositivas.length;

  function actualizarLeyenda() {
    if (!leyenda) return;
    var texto = diapositivas[indice].getAttribute("data-caption");
    if (texto) leyenda.textContent = texto;
  }

  function moverA(nuevoIndice) {
    indice = (nuevoIndice + diapositivas.length) % diapositivas.length;
    slider.style.transform = "translateX(-" + indice * paso + "%)";
    slider.style.transition = "transform 0.55s ease";
    actualizarLeyenda();
  }

  btnIzquierda.addEventListener("click", function () {
    moverA(indice - 1);
  });

  btnDerecha.addEventListener("click", function () {
    moverA(indice + 1);
  });

  actualizarLeyenda();
})();
