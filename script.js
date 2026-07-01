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

            // Inicializamos Swiper con las dimensiones correctas al mostrarse
            if (document.querySelector(".mySwiper")) {
                const swiper = new Swiper(".mySwiper", {
                    slidesPerView: 1,
                    spaceBetween: 0,
                    loop: true,
                    speed: 20000,
                    autoplay: {
                        delay: 0,
                        disableOnInteraction: false,
                    },
                    breakpoints: {
                        768: { slidesPerView: 2 }
                    }
                });
            }
        }, 6000); 
    });

    // 2. CUENTA REGRESIVA CONFIGURADA (11 de Octubre de 2026 a las 15:00)
    const fechaBoda = new Date("October 11, 2026 15:00:00").getTime();

    const x = setInterval(() => {
        const ahora = new Date().getTime();
        const distancia = fechaBoda - ahora;

        // Cálculos matemáticos de tiempo
        const dias = Math.floor(distancia / (1000 * 60 * 60 * 24));
        const horas = Math.floor((distancia % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutos = Math.floor((distancia % (1000 * 60 * 60)) / (1000 * 60));
        const segundos = Math.floor((distancia % (1000 * 60)) / 1000);

        // Volcar datos verificando existencia en el DOM
        if (document.getElementById("dias")) {
            document.getElementById("dias").innerText = dias < 10 ? "0" + dias : dias;
            document.getElementById("horas").innerText = horas < 10 ? "0" + horas : horas;
            document.getElementById("minutos").innerText = minutos < 10 ? "0" + minutos : minutos;
            document.getElementById("segundos").innerText = segundos < 10 ? "0" + segundos : segundos;
        }

        // Si la cuenta regresiva llega a cero
        if (distancia < 0) {
            clearInterval(x);
            const timerElement = document.getElementById("timer");
            if (timerElement) {
                timerElement.innerHTML = "<h3 style='color:#ffffff; font-family:Cinzel; letter-spacing:2px;'>¡Llegó el gran día!</h3>";
            }
        }
    }, 1000);
});
document.addEventListener("DOMContentLoaded", () => {
    const itemsGaleria = Array.from(document.querySelectorAll(".item-galeria"));
    const modal = document.getElementById("lightboxModal");
    const imgLightbox = document.getElementById("imagenLightbox");
    const btnCerrar = document.getElementById("btnCerrar");
    const btnPrev = document.getElementById("btnPrev");
    const btnNext = document.getElementById("btnNext");
    
    let indiceActual = 0;

    // Abrir Lightbox
    itemsGaleria.forEach((item, index) => {
        item.addEventListener("click", () => {
            indiceActual = index;
            actualizarImagen();
            modal.classList.add("activo");
            document.body.style.overflow = "hidden"; // Deshabilita scroll de fondo
        });
    });

    // Cambiar Imagen
    const actualizarImagen = () => {
        const rutaImagen = itemsGaleria[indiceActual].getAttribute("data-src");
        imgLightbox.setAttribute("src", rutaImagen);
    };

    const siguienteImagen = () => {
        indiceActual = (indiceActual + 1) % itemsGaleria.length;
        actualizarImagen();
    };

    const anteriorImagen = () => {
        indiceActual = (indiceActual - 1 + itemsGaleria.length) % itemsGaleria.length;
        actualizarImagen();
    };

    // Cerrar Lightbox
    const cerrarLightbox = () => {
        modal.classList.remove("activo");
        document.body.style.overflow = ""; // Reactiva el scroll
        setTimeout(() => { imgLightbox.setAttribute("src", ""); }, 400); // Limpia src al cerrar
    };

    // Event Listeners de Controles
    btnNext.addEventListener("click", (e) => { e.stopPropagation(); siguienteImagen(); });
    btnPrev.addEventListener("click", (e) => { e.stopPropagation(); anteriorImagen(); });
    btnCerrar.addEventListener("click", cerrarLightbox);
    
    // Cerrar al clickear fuera de la imagen (en el fondo oscuro)
    modal.addEventListener("click", (e) => {
        if (e.target === modal || e.target.classList.contains('contenedor-img-lightbox')) {
            cerrarLightbox();
        }
    });

    // Navegación por teclado (Flechas y Escape)
    document.addEventListener("keydown", (e) => {
        if (!modal.classList.contains("activo")) return;
        
        if (e.key === "Escape") cerrarLightbox();
        if (e.key === "ArrowRight") siguienteImagen();
        if (e.key === "ArrowLeft") anteriorImagen();
    });
});


// Manejo del giro de la tarjeta de regalos
const tarjetaRegalo = document.getElementById("tarjetaRegalo");

if (tarjetaRegalo) {
    tarjetaRegalo.addEventListener("click", () => {
        tarjetaRegalo.classList.toggle("girada");
    });
}
