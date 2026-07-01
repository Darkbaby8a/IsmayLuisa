document.addEventListener("DOMContentLoaded", () => {
    const botonAbrir = document.getElementById("botonAbrir");
    const contenedorSobre = document.getElementById("contenedorSobre");

    // 1. MANEJO INTERACTIVO DEL SOBRE (Apertura de 6 Segundos) + INICIALIZACIÓN CARRUSEL
    botonAbrir.addEventListener("click", () => {
        contenedorSobre.classList.add("animar");

        // Al finalizar los 6 segundos exactos de la solapa se limpia el viewport
        setTimeout(() => {
            contenedorSobre.classList.add("oculto");
            document.body.classList.add("mostrar-boda");
            
            // Hacemos visible el cuerpo de la invitación
            const contenidoInvitacion = document.getElementById('contenidoInvitacion');
            if (contenidoInvitacion) {
                contenidoInvitacion.classList.add('invitacion-activa');
            }

            window.scrollTo({ top: 0, behavior: 'instant' });

            // Inicializamos Swiper aquí para que tome las dimensiones correctas al mostrarse
            if (document.querySelector(".mySwiper")) {
                const swiper = new Swiper(".mySwiper", {
                    slidesPerView: 1,         // 1 imagen en pantallas móviles
                    spaceBetween: 0,          // Sin separación entre imágenes
                    loop: true,               // Bucle infinito
                    speed: 20000,             // Velocidad ultra lenta continuo (Estilo Elementor)
                    autoplay: {
                        delay: 0,             // Movimiento constante sin detenciones
                        disableOnInteraction: false,
                    },
                    breakpoints: {
                        // A partir de pantallas de 768px (Tablets / PC)
                        768: {
                            slidesPerView: 2, // Muestra 2 imágenes en pantalla
                        }
                    }
                });
            }
        }, 6000); 
    });
});
