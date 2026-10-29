document.getElementById("ruta-form").addEventListener("submit", function(event) {
  event.preventDefault(); 
  const nombre = document.getElementById("nombre").value;
  const email = document.getElementById("email").value;
  const telefono = document.getElementById("telefono").value;
  const fecha = document.getElementById("fecha").value;
  const ruta = document.getElementById("ruta").value;

  if (nombre.length < 8 ) {
    console.log("El nombre debe tener al menos 8 caracteres.");
    return
  }
  if (nombre && email) {
    console.log("Nombre: ${nombre}");
    console.log("Email: ${email}");
    console.log("Teléfono: ${telefono}");
    console.log("Fecha: ${fecha}");
    console.log("Ruta seleccionada: ${ruta}");
    console.log("Correcto");
  } else {
    console.log("Por favor, complete todos los campos requeridos.");
  }
}