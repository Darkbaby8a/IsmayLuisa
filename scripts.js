const weddingDate = new Date("April 26, 2026 15:00:00").getTime();

function updateElement(id, newValue) {
  const element = document.getElementById(id);
  const formatted = String(newValue).padStart(2, "0");

  if (element && element.textContent !== formatted) {
    element.textContent = formatted;
    element.classList.remove("animate-down");
    void element.offsetWidth;
    element.classList.add("animate-down");
  }
}

const timer = setInterval(() => {
  const now = new Date().getTime();
  const distance = weddingDate - now;

  if (distance < 0) {
    clearInterval(timer);
    document.getElementById("timer").textContent = "¡Es hoy!";
    return;
  }

  updateElement("days", Math.floor(distance / (1000 * 60 * 60 * 24)));
  updateElement("hours", Math.floor((distance / (1000 * 60 * 60)) % 24));
  updateElement("minutes", Math.floor((distance / (1000 * 60)) % 60));
  updateElement("seconds", Math.floor((distance / 1000) % 60));
}, 1000);


/* =========================== APERTURA SOBRE =========================== */

document.body.style.overflow = "hidden";

window.addEventListener("load", () => {
  const envelope = document.getElementById("invitationCover");

  setTimeout(() => envelope.classList.add("open"), 1200);

  setTimeout(() => {
    envelope.classList.add("hide");
    document.body.style.overflow = "auto";
    startPetals();
  }, 3400);
});


/* =========================== PÉTALOS =========================== */

let petalInterval = null;

function createPetal() {
  const petal = document.createElement("div");
  petal.className = "petal";

  const size = Math.random() * 10 + 8;
  petal.style.width = size + "px";
  petal.style.height = size + "px";
  petal.style.left = Math.random() * 100 + "vw";

  const colors = ["#630d16", "#ff7f50", "#f8ad9d", "#e5989b"];
  petal.style.background = colors[Math.floor(Math.random() * colors.length)];

  const duration = Math.random() * 4 + 6;
  petal.style.animationDuration = duration + "s";

  document.body.appendChild(petal);

  setTimeout(() => petal.remove(), duration * 1000);
}

function startPetals() {
  if (petalInterval) return;

  const isMobile = window.innerWidth < 768;
  const interval = isMobile ? 900 : 500;

  petalInterval = setInterval(createPetal, interval);
}


/* =========================== OBSERVER SECCIONES =========================== */

const revealElements = document.querySelectorAll(".reveal-item");

const revealObserver = new IntersectionObserver(
  (entries, observer) => {
    entries.forEach((entry, index) => {
      if (entry.isIntersecting) {
        setTimeout(() => {
          entry.target.classList.add("visible");
        }, index * 200);

        observer.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.15 }
);

revealElements.forEach((el) => revealObserver.observe(el));


/* =========================== INVITADOS =========================== */

const params = new URLSearchParams(window.location.search);
const familia = params.get("familia");

const familyName = document.getElementById("familyName");
const passesCount = document.getElementById("passesCount");
const btnAceptar = document.getElementById("btnAceptar");
const attendanceText = document.getElementById("attendanceText");
const passesBox = document.getElementById("passesBox");

if (!familia) {
  attendanceText.textContent = "Invitación no válida.";
  btnAceptar.style.display = "none";
  passesBox.style.display = "none";
} else {

  fetch(`/.netlify/functions/obtener-invitado?familia=${encodeURIComponent(familia)}`)
    .then((res) => res.json())
    .then((res) => {

      if (!res.ok || !res.invitado) {
        attendanceText.textContent = "Invitación no encontrada.";
        btnAceptar.style.display = "none";
        passesBox.style.display = "none";
        return;
      }

      const invitado = res.invitado;

      familyName.textContent = invitado.nombre;
      passesCount.innerHTML = `Tienen <strong>${invitado.Pases}</strong> pases reservados`;

      // 🔎 CASOS POSIBLES
      if (invitado.Acepto === true) {

        mostrarGracias(true);
        generarQR(familia);
        btnAceptar.style.display = "none";

      } else if (invitado.rechazo === true) {

        mostrarGracias(false);
        btnAceptar.style.display = "none";

      } else {

        // Aún no ha confirmado
        btnAceptar.style.display = "inline-block";

      }
    })
    .catch(() => {
      attendanceText.textContent = "Error al cargar la invitación.";
      btnAceptar.style.display = "none";
      passesBox.style.display = "none";
    });
}
btnAceptar.addEventListener("click", () => {
  abrirModal(familia);
});



/* =========================== ACEPTAR INVITACIÓN =========================== */

function aceptarInvitacion(familia, asistira) {
  fetch("/.netlify/functions/aceptarInvitacion", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ 
      familia,
      asistira
    }),
  })
    .then((res) => res.json())
    .then((res) => {
      if (res.ok) {

        if (asistira) {
          crearEventoCalendario();
          generarQR(familia);
        }

        mostrarGracias(asistira);

      } else {
        alert(res.message || "No se pudo confirmar la invitación");
      }
    })
    .catch(() => alert("Error de conexión"));
}


function mostrarGracias(asistira) {

  if (asistira) {
    attendanceText.innerHTML = `
      💖 Gracias por confirmar tu asistencia.<br>
      Será un honor contar con ustedes.
    `;
  } else {
    attendanceText.innerHTML = `
      💌 Gracias por avisarnos.<br>
      Lamentaremos no contar con ustedes, pero entendemos.
    `;
	  passesCount.style.display = "none";
  }

  btnAceptar.style.display = "none";
}



/* =========================== CALENDARIO (.ICS) =========================== */

function crearEventoCalendario() {
  const ics = `
BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//Boda Coral & Daniel//ES
BEGIN:VEVENT
UID:boda-Coral-Daniel-2026@example.com
DTSTAMP:20260101T000000Z
DTSTART:20260426T150000
DTEND:20260426T230000
SUMMARY:Boda Coral & Daniel
DESCRIPTION:Recordatorio de la boda de Coral & Daniel
LOCATION:Salón de Eventos SUTM
BEGIN:VALARM
TRIGGER:-P14D
ACTION:DISPLAY
DESCRIPTION:Recordatorio boda
END:VALARM
END:VEVENT
END:VCALENDAR
  `.trim();

  const blob = new Blob([ics], { type: "text/calendar;charset=utf-8" });
  const url = URL.createObjectURL(blob);

  const link = document.createElement("a");
  link.href = url;
  link.download = "Boda_Coral_Daniel.ics";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  URL.revokeObjectURL(url);
}


/* =========================== GENERAR QR =========================== */

function generarQR(familia) {
  const qrData = JSON.stringify({
    familia: familia,
    evento: "Boda Coral & Daniel",
    tipo: "PASE_ENTRADA",
  });

  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(
    qrData
  )}`;

  const qrContainer = document.getElementById("qrContainer");
  const qrCode = document.getElementById("qrCode");

  qrCode.innerHTML = `<img src="${qrUrl}" alt="QR Pase de Entrada">`;
  qrContainer.style.display = "block";
}
/* =========================== MOSTRAR SECCIÓN PRINCIPAL =========================== */

const weddingSection = document.querySelector(".wedding-section");

const sectionObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
      }
    });
  },
  { threshold: 0.15 }
);

if (weddingSection) {
  sectionObserver.observe(weddingSection);
}
		  const modal = document.getElementById("confirmModal");
const btnSi = document.getElementById("btnSi");
const btnNo = document.getElementById("btnNo");
const btnCerrar = document.getElementById("btnCerrar");
let familiaActual = null;

function abrirModal(familia) {
  familiaActual = familia;
  modal.classList.add("active");
}

btnCerrar.addEventListener("click", () => {
  modal.classList.remove("active");
});

btnSi.addEventListener("click", () => {

  aceptarInvitacion(familiaActual, true);

  const content = document.querySelector(".rsvp-modal-content");

  content.innerHTML = `
    <small class="modal-subtitle">CONFIRMACIÓN EXITOSA</small>
    <h2>¡Gracias por confirmar!</h2>
    <p class="modal-text">
      Por favor tome captura de su código QR.<br>
      Será su pase de entrada el día del evento.
    </p>
  `;

  // Espera 3 segundos
  setTimeout(() => {

    modal.classList.remove("active");

    // Espera a que cierre animación (400ms aprox)
    setTimeout(() => {

      qrContainer.scrollIntoView({
        behavior: "smooth",
        block: "center"
      });

    }, 500);

  }, 3000);

});


btnNo.addEventListener("click", () => {
  modal.classList.remove("active");
  aceptarInvitacion(familiaActual, false);
});

