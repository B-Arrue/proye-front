/* ==========================================
   CONTACTO · EcoRuta Temuco
   Validación del formulario de contacto.
   ========================================== */
(function () {
  "use strict";

  var formulario = document.getElementById("form-contacto");
  var mensaje = document.getElementById("contacto-form-mensaje");

  if (!formulario) return;

  var campos = {
    nombre: document.getElementById("contacto-nombre"),
    email: document.getElementById("contacto-email"),
    asunto: document.getElementById("contacto-asunto"),
    texto: document.getElementById("contacto-mensaje"),
    privacidad: document.getElementById("contacto-privacidad")
  };

  function mostrar(tipo, texto) {
    if (!mensaje) return;
    mensaje.dataset.state = tipo;
    mensaje.textContent = texto;
  }

  formulario.addEventListener("submit", function (evento) {
    evento.preventDefault();

    var errores = [];
    var nombre = campos.nombre ? campos.nombre.value.trim() : "";
    var email = campos.email ? campos.email.value.trim() : "";
    var asunto = campos.asunto ? campos.asunto.value : "";
    var texto = campos.texto ? campos.texto.value.trim() : "";
    var privacidad = campos.privacidad ? campos.privacidad.checked : false;

    var regexEmail = /^[-\w.%+]{1,64}@(?:[A-Z0-9-]{1,63}\.){1,125}[A-Z]{2,63}$/i;

    if (nombre.length < 3) {
      errores.push("Escribe tu nombre completo.");
    }
    if (!regexEmail.test(email)) {
      errores.push("El correo electrónico no es válido.");
    }
    if (!asunto) {
      errores.push("Selecciona un motivo de contacto.");
    }
    if (texto.length < 10) {
      errores.push("Cuéntanos un poco más (mínimo 10 caracteres).");
    }
    if (!privacidad) {
      errores.push("Debes aceptar el uso de tus datos para responderte.");
    }

    if (errores.length > 0) {
      mostrar("error", errores.join(" "));
      return;
    }

    mostrar(
      "success",
      "¡Gracias por escribirnos! Recibimos tu mensaje y te responderemos a la brevedad."
    );
    formulario.reset();
  });
})();
