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


// Esperamos a que el usuario haga clic en el sobre para abrirlo
document.getElementById('botonAbrir').addEventListener('click', function() {
    
    // 1. Ocultamos el contenedor del sobre (puedes cambiarlo por una animación si prefieres)
    document.getElementById('contenedorSobre').style.display = 'none';
    
    // 2. Hacemos visible el cuerpo de la invitación
    const contenidoInvitacion = document.getElementById('contenidoInvitacion');
    contenidoInvitacion.classList.add('invitacion-activa');

    // 3. Inicializamos Swiper con movimiento continuo (efecto "maratón")
    const swiper = new Swiper(".mySwiper", {
        slidesPerView: 1,         // 1 imagen en pantallas móviles
        spaceBetween: 0,          // Sin separación entre imágenes
        loop: true,               // Bucle infinito
        speed: 20000,             // Velocidad ultra lenta (20 segundos por transición)
        autoplay: {
            delay: 0,             // Delay en 0 para que nunca se detenga
            disableOnInteraction: false, // Sigue moviéndose aunque el usuario lo toque
        },
        breakpoints: {
            // Cuando la pantalla sea de 768px o más (Tablets y PCs)
            768: {
                slidesPerView: 2, // Muestra 2 imágenes al mismo tiempo
            }
        }
    });
});
