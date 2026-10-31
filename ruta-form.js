 
 const DATOS = {
 nombre: document.getElementById("nombre"),
 email: document.getElementById("email"),
 telefono: document.getElementById("telefono"),
 fecha: document.getElementById("fecha"),
 ruta: document.getElementById("ruta"),
 }
 const form = document.getElementById("form")
 

  const parrafo = document.getElementById("warnings")
  const hoy = new Date();
  const manana = new Date(hoy);
  manana.setDate(hoy.getDate() + 1);
  const yyyy = manana.getFullYear();
  const mm = String(manana.getMonth() + 1).padStart(2, '0');
  const dd = String(manana.getDate()).padStart(2, '0');
  const fechaMinima = `${yyyy}-${mm}-${dd}`;
  const successMessage = document.getElementById("success");
  
  DATOS.fecha.min = fechaMinima;


  form.addEventListener("submit", e=>{ 
      e.preventDefault()
      let warnings = ""
      let entrar = false;
      let regexEmail = /^[-\w.%+]{1,64}@(?:[A-Z0-9-]{1,63}\.){1,125}[A-Z]{2,63}$/i
      const regexNombre = /^[a-zA-ZÁÉÍÓÚáéíóúñÑ\s]{3,50}$/;
      
      parrafo.innerHTML = ""
      successMessage.innerHTML = ""

      if (!regexNombre.test(DATOS.nombre.value)) {
        warnings += "El nombre no es válido <br>"
        entrar = true
        
      } 
      if (!DATOS.telefono.value.match(/^\d{10}$/)) {
        warnings += "El teléfono no es válido <br>"
        entrar = true
      }

      if (DATOS.fecha.value < fechaMinima) {
        warnings += "La fecha no es válida <br>"
        entrar = true
      }

      if (DATOS.ruta.value.length < 5) {
        warnings += "La ruta debe tener al menos 5 caracteres <br>"
        entrar = true
      } 

      if (!regexEmail.test(DATOS.email.value)) {
        warnings += "El email no es válido.<br>"
        entrar = true
        
      }
      if (entrar) {
        e.preventDefault()
        parrafo.innerHTML = warnings
        }
        else {
          e.preventDefault()
          const datosReserva = {
            nombre: DATOS.nombre.value,
            email: DATOS.email.value,
            telefono: DATOS.telefono.value,
            fecha: DATOS.fecha.value,
            ruta: DATOS.ruta.value
          };

          fetch("https://TU_API_AQUÍ.mockapi.io/api   /v1/recurso", {
            method: "POST",
            headers: {
              "Content-Type": "application/json"
            },
            body: JSON.stringify(datosReserva)
          })
          .then(response => {
            if (!response.ok) {
              throw new Error("Error en la solicitud")
            }  
            return response.json()
          })
          .then(data => {
            parrafo.innerHTML = ""
            successMessage.innerHTML = "¡Reserva realizada con éxito!"
            form.reset()
          })
          .catch(error => {
            console.error("Error al enviar los datos:", error)
            parrafo.innerHTML = "Ocurrió un error al enviar la reserva. Por favor, inténtalo de nuevo más tarde."
              
            })
          }
          })
          