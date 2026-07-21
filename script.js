document.addEventListener("DOMContentLoaded", () => {
  // ==========================================================================
  // 1. MANEJO INTERACTIVO DEL SOBRE & INICIALIZACIÓN DE SWIPER
  // ==========================================================================
  const botonAbrir = document.getElementById("botonAbrir");
  const contenedorSobre = document.getElementById("contenedorSobre");
  const contenidoInvitacion = document.getElementById("contenidoInvitacion");

  botonAbrir.addEventListener("click", () => {
    contenedorSobre.classList.add("animar");

    // Esperamos que la solapa termine de abrir
    setTimeout(() => {
      // Quitamos solo el frente del sobre
      contenedorSobre.classList.add("quitar-fondo");
    }, 3500);

    // Después mostramos la invitación
    setTimeout(() => {
      contenedorSobre.classList.add("oculto");

      document.body.classList.add("mostrar-boda");

      if (contenidoInvitacion) {
        contenidoInvitacion.classList.add("invitacion-activa");
      }

      startPetals();
    }, 5000);
  });
});
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
document.addEventListener("DOMContentLoaded", () => {
  const btnAbrirConfirmacion = document.getElementById("btnAbrirConfirmacion");
  const modalRespuesta = document.getElementById("modalRespuesta");
  const btnCancelarModal = document.getElementById("btnCancelarModal");
  const btnConfirmarModal = document.getElementById("btnConfirmarModal");
  const btnRechazarModal = document.getElementById("btnRechazarModal");
  const btnCerrarMensaje = document.getElementById("btnCerrarMensaje");
  const contenidoRespuesta = document.getElementById("contenidoRespuesta");
  const mensajeFinal = document.getElementById("mensajeFinal");

  if (btnAbrirConfirmacion && modalRespuesta) {
    btnAbrirConfirmacion.addEventListener("click", () => {
      modalRespuesta.classList.add("activo");
    });
  }

  if (btnCancelarModal) {
    btnCancelarModal.addEventListener("click", () => {
      modalRespuesta.classList.remove("activo");
    });
  }

  function mostrarMensaje(acepto) {
    contenidoRespuesta.style.display = "none";
    mensajeFinal.style.display = "block";
    actualizarPases();
    if (acepto) {
      document.getElementById("iconoMensajeFinal").innerHTML = "🤍";
      document.getElementById("tituloMensajeFinal").textContent =
        "¡Muchas gracias!";
      document.getElementById("textoMensajeFinal").innerHTML = `
Tu asistencia ha sido registrada correctamente.
<br><br>
A continuación podrás visualizar tu pase digital con el código QR
que deberás presentar al ingresar al evento.
`;
    } else {
      document.getElementById("iconoMensajeFinal").innerHTML = "🌿";
      document.getElementById("tituloMensajeFinal").textContent =
        "Gracias por avisarnos";
      document.getElementById("textoMensajeFinal").innerHTML = `
Lamentamos que no puedas acompañarnos en este día tan especial.
<br><br>
Agradecemos mucho que nos hayas informado.
`;
    }
  }

  async function enviarRespuesta(asistira) {
    try {
      const response = await fetch("/.netlify/functions/aceptarinvitados", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          familiaNombre: datos.familiaNombre,
          asistira: asistira,
        }),
      });

      if (!response.ok) throw new Error();

      await response.json();

      modalRespuesta.classList.remove("activo");
      mostrarMensaje(asistira);
    } catch (error) {
      console.error(error);
      alert("No fue posible registrar tu respuesta.");
    }
  }

  if (btnConfirmarModal) {
    btnConfirmarModal.addEventListener("click", () => {
      enviarRespuesta(true);
    });
  }

  if (btnRechazarModal) {
    btnRechazarModal.addEventListener("click", () => {
      enviarRespuesta(false);
    });
  }

  if (btnCerrarMensaje) {
    btnCerrarMensaje.addEventListener("click", () => {
      modalRespuesta.classList.remove("activo");

      setTimeout(() => {
        contenidoRespuesta.style.display = "block";
        mensajeFinal.style.display = "none";
      }, 500);
    });
  }
});
let petalInterval = null;

function createPetal() {
  const leaf = document.createElement("div");
  leaf.className = "petal";

  // Tamaños variados
  const width = Math.random() * 18 + 16;
  const height = width * (Math.random() * 0.4 + 1.3);

  leaf.style.width = width + "px";
  leaf.style.height = height + "px";

  // Posición inicial
  leaf.style.left = Math.random() * 100 + "vw";

  // Colores otoñales
  const colors = [
    "#7B3F00", // café
    "#A0522D", // siena
    "#B5651D", // naranja quemado
    "#C97A2B", // ámbar
    "#D98C2B", // mostaza
    "#E0A93B", // amarillo dorado
    "#8B4513", // café oscuro
    "#A63D2E", // rojo hoja
    "#C45A3D", // terracota
    "#6B4423", // nogal
  ];

  leaf.style.background = colors[Math.floor(Math.random() * colors.length)];

  // Forma de hoja
  leaf.style.borderRadius = "0 80% 0 80%";
  leaf.style.transform = `rotate(${Math.random() * 360}deg)`;

  // Duración
  const duration = Math.random() * 6 + 8;

  leaf.style.animationDuration = duration + "s";
  leaf.style.animationDelay = Math.random() * 3 + "s";

  // Movimiento lateral
  leaf.style.setProperty("--spin-speed", Math.random() * 5 + 4 + "s");
  leaf.style.setProperty("--wobble-distance", Math.random() * 120 + 60 + "px");

  // Opacidad
  leaf.style.opacity = Math.random() * 0.5 + 0.5;

  document.body.appendChild(leaf);

  setTimeout(
    () => {
      leaf.remove();
    },
    (duration + 3) * 1000,
  );
}
function startPetals() {
  if (petalInterval) return;

  const isMobile = window.innerWidth < 768;
  const interval = isMobile ? 900 : 500;

  petalInterval = setInterval(createPetal, interval);
}
///obtener invitado
const params = new URLSearchParams(window.location.search);
const familia = params.get("familia");

const contenedor = document.getElementById("contenedorConfirmacion");

let datos = null;

if (!familia) {
  contenedor.innerHTML = `
        <h2 class="titulo-confirmar">Invitación no válida</h2>
        <p class="texto-confirmar">
            El enlace de invitación es incorrecto.
        </p>
    `;
} else {
  fetch(
    `/.netlify/functions/obtener-invitado?familia=${encodeURIComponent(familia)}`,
  )
    .then((res) => res.json())

    .then((res) => {
      if (!res.ok || !res.invitado) {
        contenedor.innerHTML = `
                    <h2 class="titulo-confirmar">
                        Invitación no encontrada
                    </h2>
                `;

        return;
      }

      datos = res.invitado;

      // YA CONFIRMÓ
      if (datos.acepto == true || datos.Acepto == true || datos.acepto == 1) {
        mostrarPase();

        return;
      }

      // RECHAZÓ
      if (datos.rechazo == true || datos.rechazo == 1) {
        contenedor.innerHTML = `

                    <img class="imagen-decorativa-confirmar"
                    src="https://teinvitoacelebrar.com/wp-content/uploads/2026/02/boda-sarah-y-rodrigo-11.png">

                    <h2 class="titulo-confirmar">
                        Gracias por avisarnos
                    </h2>

                    <h3 class="nombres-confirmar">
                        ${datos.FamiliaDesc}
                    </h3>

                    <p class="texto-confirmar">

                        Lamentamos que no puedas acompañarnos.

                        <br><br>

                        Gracias por hacernos saber tu decisión.

                    </p>

                `;

        return;
      }

      // AÚN NO RESPONDE

      contenedor.innerHTML = `

                <img class="imagen-decorativa-confirmar"
                src="https://teinvitoacelebrar.com/wp-content/uploads/2026/02/boda-sarah-y-rodrigo-11.png">

                <h2 class="titulo-confirmar">

                    Confirma tu asistencia

                </h2>

                <h3 class="nombres-confirmar">

                    ${datos.FamiliaDesc}

                </h3>

                <p class="texto-confirmar">

                    Nos haría mucha ilusión contar con tu presencia.

                    <br><br>

                    Nos gustaría saber si asistirás a nuestro gran día.

                </p>

                <div class="informacion-familia">

                    <div>

                        <span>Familia</span>

                        <strong>${datos.FamiliaDesc}</strong>

                    </div>

                    <div>

                        <span>Pases asignados</span>

                        <strong>${datos.Pases}</strong>

                    </div>

                </div>

                <div class="bloque-boton-confirmar">

                    <button
                        id="btnAbrirConfirmacion"
                        class="btn-confirmar">

                        Confirmar asistencia

                    </button>

                </div>

            `;

      document
        .getElementById("btnAbrirConfirmacion")
        .addEventListener("click", () => {
          modalRespuesta.classList.add("activo");
        });
    })

    .catch(() => {
      contenedor.innerHTML = `
                <h2 class="titulo-confirmar">
                    Error al cargar la invitación
                </h2>
            `;
    });
}
function mostrarPase() {
  const contenedor = document.getElementById("contenedorConfirmacion");

  contenedor.innerHTML = `

        <img class="imagen-decorativa-confirmar"
            src="Imagenes/ArregloFlores.png"
            alt="Decoración">

        <h2 class="titulo-confirmar">
            ¡Gracias por confirmar!
        </h2>

        <h3 class="nombres-confirmar">
            ${datos.FamiliaDesc}
        </h3>

        <p class="texto-confirmar">

            Nos llena de alegría saber que nos acompañarás.

            <br><br>

            <strong>Este es tu pase de entrada.</strong>

            <br>

            Favor de mostrar este código QR al ingresar al evento.

        </p>

        <div class="tarjeta-pase">

            <div id="codigoQR"></div>

<div class="datos-pase">

<div class="dato-pase">
<div class="dato-icono">👨‍👩‍👧</div>
<div class="dato-info">
<span>Familia</span>
<strong>${datos.FamiliaDesc}</strong>
</div>
</div>

<div class="dato-pase">
<div class="dato-icono">✦</div>
<div class="dato-info">
<span>Mesa</span>
<strong>${datos.Mesa}</strong>
</div>
</div>

<div class="dato-pase">
<div class="dato-icono">🤍</div>
<div class="dato-info">
<span>Pases asignados</span>
<strong>${datos.Pases}</strong>
</div>
</div>

</div>

        </div>

    `;

  generarQR(datos);
}
function generarQR(datos) {
  const qrData = JSON.stringify({
    id: datos.id,
    familia: datos.FamiliaDesc,
    mesa: datos.Mesa,
    pases: datos.Pases,
    codigo: datos.familiaNombre,
    evento: "Boda Ismael & Luisa",
    tipo: "PASE_ENTRADA",
  });

  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(qrData)}`;

  document.getElementById("codigoQR").innerHTML = `
        <img src="${qrUrl}" alt="QR Pase de Entrada">
    `;
}
function actualizarPases() {
  fetch(
    `/.netlify/functions/obtener-invitado?familia=${encodeURIComponent(familia)}`,
  )
    .then((res) => res.json())

    .then((res) => {
      if (!res.ok || !res.invitado) {
        contenedor.innerHTML = `
                    <h2 class="titulo-confirmar">
                        Invitación no encontrada
                    </h2>
                `;

        return;
      }

      datos = res.invitado;

      // YA CONFIRMÓ
      if (datos.acepto == true || datos.Acepto == true || datos.acepto == 1) {
        mostrarPase();

        return;
      }

      // RECHAZÓ
      if (datos.rechazo == true || datos.rechazo == 1) {
        contenedor.innerHTML = `

                    <img class="imagen-decorativa-confirmar"
                    src="https://teinvitoacelebrar.com/wp-content/uploads/2026/02/boda-sarah-y-rodrigo-11.png">

                    <h2 class="titulo-confirmar">
                        Gracias por avisarnos
                    </h2>

                    <h3 class="nombres-confirmar">
                        ${datos.FamiliaDesc}
                    </h3>

                    <p class="texto-confirmar">

                        Lamentamos que no puedas acompañarnos.

                        <br><br>

                        Gracias por hacernos saber tu decisión.

                    </p>

                `;

        return;
      }

      // AÚN NO RESPONDE

      contenedor.innerHTML = `

                <img class="imagen-decorativa-confirmar"
                src="https://teinvitoacelebrar.com/wp-content/uploads/2026/02/boda-sarah-y-rodrigo-11.png">

                <h2 class="titulo-confirmar">

                    Confirma tu asistencia

                </h2>

                <h3 class="nombres-confirmar">

                    ${datos.FamiliaDesc}

                </h3>

                <p class="texto-confirmar">

                    Nos haría mucha ilusión contar con tu presencia.

                    <br><br>

                    Nos gustaría saber si asistirás a nuestro gran día.

                </p>

                <div class="informacion-familia">

                    <div>

                        <span>Familia</span>

                        <strong>${datos.FamiliaDesc}</strong>

                    </div>

                    <div>

                        <span>Pases asignados</span>

                        <strong>${datos.Pases}</strong>

                    </div>

                </div>

                <div class="bloque-boton-confirmar">

                    <button
                        id="btnAbrirConfirmacion"
                        class="btn-confirmar">

                        Confirmar asistencia

                    </button>

                </div>

            `;
    });
}
