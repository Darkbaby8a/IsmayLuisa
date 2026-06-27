document.addEventListener("DOMContentLoaded", () => {
    const botonAbrir = document.getElementById("botonAbrir");
    const contenedorSobre = document.getElementById("contenedorSobre");

    // 1. MANEJO INTERACTIVO DEL SOBRE (Apertura de 6 Segundos)
    botonAbrir.addEventListener("click", () => {
        contenedorSobre.classList.add("animar");

        // Al finalizar los 6 segundos exactos de la solapa se limpia el viewport
        setTimeout(() => {
            contenedorSobre.classList.add("oculto");
            document.body.classList.add("mostrar-boda");
            window.scrollTo({ top: 0, behavior: 'instant' });
        }, 6000); 
    });

    // 2. CUENTA REGRESIVA CONFIGURADA (26 de Abril de 2026)
    const fechaBoda = new Date("April 26, 2026 15:00:00").getTime();

    const x = setInterval(() => {
        const ahora = new Date().getTime();
        const distancia = fechaBoda - ahora;

        const dias = Math.floor(distancia / (1000 * 60 * 60 * 24));
        const horas = Math.floor((distancia % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutos = Math.floor((distancia % (1000 * 60 * 60)) / (1000 * 60));
        const segundos = Math.floor((distancia % (1000 * 60)) / 1000);

        // Volcar datos verificando existencia de elementos
        if(document.getElementById("dias")) {
            document.getElementById("dias").innerText = dias < 10 ? "0" + dias : dias;
            document.getElementById("horas").innerText = horas < 10 ? "0" + horas : horas;
            document.getElementById("minutos").innerText = minutos < 10 ? "0" + minutos : minutos;
            document.getElementById("segundos").innerText = segundos < 10 ? "0" + segundos : segundos;
        }

        if (distancia < 0) {
            clearInterval(x);
            if(document.getElementById("timer")) {
                document.getElementById("timer").innerHTML = "<h3 style='color:var(--color-guinda); font-family:Cinzel;'>¡Llegó el gran día!</h3>";
            }
        }
    }, 1000);

    // 3. LOGICA CONTROLADORA DEL MODAL RSVP
    const confirmModal = document.getElementById("confirmModal");
    const btnAceptar = document.getElementById("btnAceptar");
    const btnCerrar = document.getElementById("btnCerrar");
    const btnSi = document.getElementById("btnSi");
    const btnNo = document.getElementById("btnNo");

    btnAceptar.addEventListener("click", () => {
        confirmModal.style.display = "flex";
    });

    btnCerrar.addEventListener("click", () => {
        confirmModal.style.display = "none";
    });

    btnSi.addEventListener("click", () => {
        alert("¡Muchas gracias por confirmar tu asistencia! Te esperamos.");
        confirmModal.style.display = "none";
        // Aquí puedes simular la aparición del QR si cuentas con librería
        document.getElementById("qrContainer").style.display = "block";
    });

    btnNo.addEventListener("click", () => {
        alert("Lamentamos que no puedas acompañarnos. Agradecemos avisarnos.");
        confirmModal.style.display = "none";
    });

    // Cerrar si hace clic fuera del modal
    window.addEventListener("click", (e) => {
        if (e.target === confirmModal) {
            confirmModal.style.display = "none";
        }
    });
});
