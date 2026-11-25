import type { ReservaRuta } from "./ruta.js";

interface CamposReserva {
    nombre: HTMLInputElement | null;
    email: HTMLInputElement | null;
    telefono: HTMLInputElement | null;
    fecha: HTMLInputElement | null;
    ruta: HTMLSelectElement | HTMLInputElement | null;
}

const DATOS: CamposReserva = {
    nombre: document.getElementById("nombre") as HTMLInputElement | null,
    email: document.getElementById("email") as HTMLInputElement | null,
    telefono: document.getElementById("telefono") as HTMLInputElement | null,
    fecha: document.getElementById("fecha") as HTMLInputElement | null,
    ruta: document.getElementById("ruta") as (HTMLSelectElement | HTMLInputElement) | null,
};

const form = document.getElementById("form") as HTMLFormElement | null;
const parrafo = document.getElementById("warnings") as HTMLElement | null;
const successMessage = document.getElementById("success") as HTMLElement | null;

const hoy = new Date();
const manana = new Date(hoy);
manana.setDate(hoy.getDate() + 1);

const yyyy = manana.getFullYear();
const mm = String(manana.getMonth() + 1).padStart(2, "0");
const dd = String(manana.getDate()).padStart(2, "0");
const fechaMinima = `${yyyy}-${mm}-${dd}`;

if (DATOS.fecha) {
    DATOS.fecha.min = fechaMinima;
}

if (form) {
    form.addEventListener("submit", (e: SubmitEvent) => {
        e.preventDefault();

        let warnings = "";
        let entrar = false;

        const regexEmail = /^[-\w.%+]{1,64}@(?:[A-Z0-9-]{1,63}\.){1,125}[A-Z]{2,63}$/i;
        const regexNombre = /^[a-zA-ZÁÉÍÓÚáéíóúñÑ\s]{3,50}$/;

        if (parrafo) parrafo.innerHTML = "";
        if (successMessage) successMessage.innerHTML = "";

        const nombreValor = DATOS.nombre?.value.trim() ?? "";
        const telefonoValor = DATOS.telefono?.value.trim() ?? "";
        const fechaValor = DATOS.fecha?.value ?? "";
        const rutaValor = DATOS.ruta?.value.trim() ?? "";
        const emailValor = DATOS.email?.value.trim() ?? "";

        if (!regexNombre.test(nombreValor)) {
            warnings += "El nombre no es válido <br>";
            entrar = true;
        }

        if (!/^\d{10}$/.test(telefonoValor)) {
            warnings += "El teléfono no es válido <br>";
            entrar = true;
        }

        if (!fechaValor || fechaValor < fechaMinima) {
            warnings += "La fecha no es válida <br>";
            entrar = true;
        }

        if (rutaValor.length < 5) {
            warnings += "La ruta debe tener al menos 5 caracteres <br>";
            entrar = true;
        }

        if (!regexEmail.test(emailValor)) {
            warnings += "El email no es válido.<br>";
            entrar = true;
        }

        if (entrar) {
            if (parrafo) parrafo.innerHTML = warnings;
            return;
        }

        const datosReserva: ReservaRuta = {
            nombre: nombreValor,
            email: emailValor,
            telefono: telefonoValor,
            fecha: fechaValor,
            ruta: rutaValor,
        };

        fetch("https://6ae112d6be3bc8fead983c8d.mockapi.io/ruta", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(datosReserva),
        })
            .then((response: Response) => {
                if (!response.ok) {
                    throw new Error("Error en la solicitud");
                }
                return response.json() as Promise<ReservaRuta>;
            })
            .then(() => {
                if (parrafo) parrafo.innerHTML = "";
                if (successMessage) successMessage.innerHTML = "¡Reserva realizada con éxito!";
                form.reset();
            })
            .catch((error: unknown) => {
                console.error("Error al enviar los datos:", error);
                if (parrafo) {
                    parrafo.innerHTML =
                        "Ocurrió un error al enviar la reserva. Por favor, inténtalo de nuevo más tarde.";
                }
            });
    });
}
