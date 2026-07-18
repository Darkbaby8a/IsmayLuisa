document.addEventListener("DOMContentLoaded", () => {
  // ==========================================================================
  // 1. MANEJO INTERACTIVO DEL SOBRE & INICIALIZACIÓN DE SWIPER
  // ==========================================================================
  const botonAbrir = document.getElementById("botonAbrir");
  const contenedorSobre = document.getElementById("contenedorSobre");
  const contenidoInvitacion = document.getElementById("contenidoInvitacion");

  if (botonAbrir && contenedorSobre) {
    botonAbrir.addEventListener("click", () => {
      contenedorSobre.classList.add("animar");

      // Al finalizar los 6 segundos de la solapa se limpia el viewport
      setTimeout(() => {
        contenedorSobre.classList.add("oculto");
        document.body.classList.add("mostrar-boda");

        if (contenidoInvitacion) {
          contenidoInvitacion.classList.add("invitacion-activa");
        }
        startPetals();
        window.scrollTo({ top: 0, behavior: "instant" });

        // Inicialización segura de Swiper con las dimensiones del contenedor activo
        if (
          document.querySelector(".mySwiper") &&
          typeof Swiper !== "undefined"
        ) {
          new Swiper(".mySwiper", {
            slidesPerView: 1,
            spaceBetween: 0,
            loop: true,
            speed: 20000, // Movimiento ultra lento continuo lineal
            autoplay: {
              delay: 0,
              disableOnInteraction: false,
            },
            breakpoints: {
              768: { slidesPerView: 2 },
            },
          });
        }
      }, 3000);
    });
  }

  // ==========================================================================
  // 2. CUENTA REGRESIVA (11 de Octubre de 2026 a las 15:00)
  // ==========================================================================
  const fechaBoda = new Date("October 11, 2026 15:00:00").getTime();
  const elDias = document.getElementById("dias");
  const elHoras = document.getElementById("horas");
  const elMinutos = document.getElementById("minutos");
  const elSegundos = document.getElementById("segundos");
  const timerElement = document.getElementById("timer");

  const cuentaRegresiva = setInterval(() => {
    const ahora = new Date().getTime();
    const distancia = fechaBoda - ahora;

    // Si la cuenta regresiva llega a cero
    if (distancia < 0) {
      clearInterval(cuentaRegresiva);
      if (timerElement) {
        timerElement.innerHTML =
          "<h3 style='color:#ffffff; font-family:Cinzel; letter-spacing:2px;'>¡Llegó el gran día!</h3>";
      }
      return;
    }

    // Cálculos matemáticos de tiempo
    const dias = Math.floor(distancia / (1000 * 60 * 60 * 24));
    const horas = Math.floor(
      (distancia % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60),
    );
    const minutos = Math.floor((distancia % (1000 * 60 * 60)) / (1000 * 60));
    const segundos = Math.floor((distancia % (1000 * 60)) / 1000);

    // Renderizado formateado con ceros a la izquierda
    if (elDias) {
      elDias.innerText = dias < 10 ? "0" + dias : dias;
      elHoras.innerText = horas < 10 ? "0" + horas : horas;
      elMinutos.innerText = minutos < 10 ? "0" + minutos : minutos;
      elSegundos.innerText = segundos < 10 ? "0" + segundos : segundos;
    }
  }, 1000);

  // ==========================================================================
  // 3. GALERÍA DE IMÁGENES (LIGHTBOX INTERACTIVO)
  // ==========================================================================
  const itemsGaleria = Array.from(document.querySelectorAll(".item-galeria"));
  const modalLightbox = document.getElementById("lightboxModal");
  const imgLightbox = document.getElementById("imagenLightbox");
  const btnCerrar = document.getElementById("btnCerrar");
  const btnPrev = document.getElementById("btnPrev");
  const btnNext = document.getElementById("btnNext");

  let indiceActual = 0;

  if (modalLightbox && imgLightbox && itemsGaleria.length > 0) {
    const actualizarImagen = () => {
      const rutaImagen = itemsGaleria[indiceActual].getAttribute("data-src");
      if (rutaImagen) imgLightbox.setAttribute("src", rutaImagen);
    };

    const siguienteImagen = () => {
      indiceActual = (indiceActual + 1) % itemsGaleria.length;
      actualizarImagen();
    };

    const anteriorImagen = () => {
      indiceActual =
        (indiceActual - 1 + itemsGaleria.length) % itemsGaleria.length;
      actualizarImagen();
    };

    const cerrarLightbox = () => {
      modalLightbox.classList.remove("activo");
      document.body.style.overflow = ""; // Reactiva scroll general
      setTimeout(() => {
        imgLightbox.setAttribute("src", "");
      }, 400);
    };

    // Asignación de triggers de apertura
    itemsGaleria.forEach((item, index) => {
      item.addEventListener("click", () => {
        indiceActual = index;
        actualizarImagen();
        modalLightbox.classList.add("activo");
        document.body.style.overflow = "hidden"; // Bloquea scroll de fondo
      });
    });

    // Controles de navegación y cierre
    if (btnNext)
      btnNext.addEventListener("click", (e) => {
        e.stopPropagation();
        siguienteImagen();
      });
    if (btnPrev)
      btnPrev.addEventListener("click", (e) => {
        e.stopPropagation();
        anteriorImagen();
      });
    if (btnCerrar) btnCerrar.addEventListener("click", cerrarLightbox);

    modalLightbox.addEventListener("click", (e) => {
      if (
        e.target === modalLightbox ||
        e.target.classList.contains("contenedor-img-lightbox")
      ) {
        cerrarLightbox();
      }
    });

    // Eventos de teclado físicos
    document.addEventListener("keydown", (e) => {
      if (!modalLightbox.classList.contains("activo")) return;
      if (e.key === "Escape") cerrarLightbox();
      if (e.key === "ArrowRight") siguienteImagen();
      if (e.key === "ArrowLeft") anteriorImagen();
    });
  }

  // ==========================================================================
  // 4. MESA DE REGALOS (GIRO 3D DE TARJETA)
  // ==========================================================================
  const tarjetaRegalo = document.getElementById("tarjetaRegalo");

  if (tarjetaRegalo) {
    tarjetaRegalo.addEventListener("click", () => {
      tarjetaRegalo.classList.toggle("girada");
    });
  }

  // ==========================================================================
  // 5. MODAL CONTROL DE ASISTENCIA Y SEGURIDAD
  // ==========================================================================
  const btnAbrirConfirmacion = document.getElementById("btnAbrirConfirmacion");
  const modalSeguridad = document.getElementById("modalSeguridad");
  const btnCancelarModal = document.getElementById("btnCancelarModal");
  const btnConfirmarModal = document.getElementById("btnConfirmarModal");

  if (btnAbrirConfirmacion && modalSeguridad) {
    btnAbrirConfirmacion.addEventListener("click", () => {
      modalSeguridad.classList.add("activo");
    });

    if (btnCancelarModal) {
      btnCancelarModal.addEventListener("click", () => {
        modalSeguridad.classList.remove("activo");
      });
    }

    if (btnConfirmarModal) {
      btnConfirmarModal.addEventListener("click", () => {
        modalSeguridad.classList.remove("activo");
        // Desarrollar aquí el flujo de redirección (WhatsApp API, Endpoint, etc.)
      });
    }
  }
});
let petalInterval = null;

function createPetal() {
  const petal = document.createElement("div");
  petal.className = "petal";

  // Tamaños un poco más grandes y variados para simular profundidad
  const width = Math.random() * 12 + 12; // Entre 12px y 24px
  const height = width * (Math.random() * 0.2 + 1.1); // Un poco más largos que anchos

  petal.style.width = width + "px";
  petal.style.height = height + "px";
  petal.style.left = Math.random() * 100 + "vw";

  // Paleta de colores: Guinda elegante, vino, rosa viejo y rosa suave
  const colors = ["#7A1632", "#5c0b20", "#a23c52", "#d98895", "#f3c6ce"];
  petal.style.background = colors[Math.floor(Math.random() * colors.length)];

  // Duración de la caída (más lento = más elegante)
  const duration = Math.random() * 5 + 6; // Entre 6 y 11 segundos
  petal.style.animationDuration = duration + "s";

  // Variación del retraso para que no caigan todos al mismo tiempo al iniciar
  petal.style.animationDelay = Math.random() * 2 + "s";

  // Variables personalizadas de CSS para que cada pétalo gire a una velocidad y ángulo diferente
  petal.style.setProperty("--spin-speed", Math.random() * 3 + 2 + "s");
  petal.style.setProperty("--wobble-distance", Math.random() * 40 + 20 + "px");

  document.body.appendChild(petal);

  // Se elimina una vez termina la animación
  setTimeout(() => petal.remove(), (duration + 2) * 1000);
}

function startPetals() {
  if (petalInterval) return;

  const isMobile = window.innerWidth < 768;
  const interval = isMobile ? 900 : 500;

  petalInterval = setInterval(createPetal, interval);
}
