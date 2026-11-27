/* ==========================================
   FORMULARIO DE RESERVA · EcoRuta Temuco
   Validación en JavaScript plano y envío a MockAPI.
   ========================================== */
(function () {
  "use strict";

  var campos = {
    nombre: document.getElementById("nombre"),
    email: document.getElementById("email"),
    telefono: document.getElementById("telefono"),
    fecha: document.getElementById("fecha"),
    ruta: document.getElementById("ruta")
  };

  var formulario = document.getElementById("form");
  var avisos = document.getElementById("warnings");
  var exito = document.getElementById("success");
  var boton = formulario ? formulario.querySelector('button[type="submit"]') : null;

  var manana = new Date();
  manana.setDate(manana.getDate() + 1);

  var fechaMinima =
    manana.getFullYear() +
    "-" +
    String(manana.getMonth() + 1).padStart(2, "0") +
    "-" +
    String(manana.getDate()).padStart(2, "0");

  if (campos.fecha) campos.fecha.min = fechaMinima;

  function limpiarMensajes() {
    if (avisos) avisos.innerHTML = "";
    if (exito) exito.innerHTML = "";
  }

  function mostrarErrores(lista) {
    if (!avisos) return;
    avisos.innerHTML = lista.join("<br>");
  }

  function validar() {
    var errores = [];
    var nombre = campos.nombre ? campos.nombre.value.trim() : "";
    var email = campos.email ? campos.email.value.trim() : "";
    var telefono = campos.telefono ? campos.telefono.value.trim() : "";
    var fecha = campos.fecha ? campos.fecha.value : "";
    var ruta = campos.ruta ? campos.ruta.value.trim() : "";

    var regexEmail = /^[-\w.%+]{1,64}@(?:[A-Z0-9-]{1,63}\.){1,125}[A-Z]{2,63}$/i;
    var regexNombre = /^[a-zA-ZÁÉÍÓÚáéíóúñÑ\s]{3,50}$/;
    var telefonoLimpio = telefono.replace(/[\s()+-]/g, "");

    if (!regexNombre.test(nombre)) {
      errores.push("El nombre debe tener entre 3 y 50 letras.");
    }
    if (!regexEmail.test(email)) {
      errores.push("El correo electrónico no es válido.");
    }
    if (!/^\d{9,12}$/.test(telefonoLimpio)) {
      errores.push("El teléfono debe tener entre 9 y 12 dígitos.");
    }
    if (!fecha || fecha < fechaMinima) {
      errores.push("La fecha debe ser posterior a hoy.");
    }
    if (ruta.length < 5) {
      errores.push("Selecciona una ruta válida.");
    }

    return {
      errores: errores,
      datos: {
        nombre: nombre,
        email: email,
        telefono: telefono,
        fecha: fecha,
        ruta: ruta
      }
    };
  }

  if (!formulario) return;

  formulario.addEventListener("submit", function (evento) {
    evento.preventDefault();
    limpiarMensajes();

    var resultado = validar();
    if (resultado.errores.length > 0) {
      mostrarErrores(resultado.errores);
      if (avisos) avisos.focus();
      return;
    }

    if (boton) {
      boton.disabled = true;
      boton.textContent = "Enviando…";
    }

    fetch("https://6ae112d6be3bc8fead983c8d.mockapi.io/ruta", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(resultado.datos)
    })
      .then(function (respuesta) {
        if (!respuesta.ok) {
          throw new Error("Error en la solicitud");
        }
        return respuesta.json();
      })
      .then(function () {
        if (exito) exito.textContent = "¡Reserva realizada con éxito!";
        formulario.reset();
        if (campos.fecha) campos.fecha.min = fechaMinima;
      })
      .catch(function (error) {
        console.error("Error al enviar la reserva:", error);
        mostrarErrores([
          "Ocurrió un error al enviar la reserva. Inténtalo de nuevo más tarde."
        ]);
      })
      .finally(function () {
        if (boton) {
          boton.disabled = false;
          boton.textContent = "Reservar";
        }
      });
  });
})();
