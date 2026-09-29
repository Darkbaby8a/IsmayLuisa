let invitadoActual = null;
let qrScanner = null;
let procesandoQR = false;
let resultadosActuales = [];

/* =============================
       UTILIDADES
============================= */
function esc(s) {
  return String(s ?? "").replace(
    /[&<>"']/g,
    (c) =>
      ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;",
      })[c],
  );
}

function estadoDe(i) {
  if (i.rechazo === true) return "rechazado";
  if (i.acepto === true) return "aceptado";
  return "pendiente";
}

/* =============================
       NAVEGACIÓN
============================= */
function mostrar(id, btn) {
  document
    .querySelectorAll(".section")
    .forEach((s) => s.classList.remove("active"));
  document
    .querySelectorAll(".tab")
    .forEach((b) => b.classList.remove("active"));

  document.getElementById(id).classList.add("active");
  if (btn) btn.classList.add("active");

  // Apagar la cámara al salir de la pestaña QR
  if (id !== "qr") detenerQR();

  if (id === "qr") iniciarQR();
  if (id === "lista") cargarLista();
}

/* =============================
       QR
============================= */
async function detenerQR() {
  if (!qrScanner) return;
  const s = qrScanner;
  qrScanner = null;
  try {
    await s.stop();
    s.clear();
  } catch (e) {
    /* ya estaba detenido */
  }
}

function iniciarQR() {
  if (qrScanner) return;

  procesandoQR = false;
  qrScanner = new Html5Qrcode("reader");

  qrScanner
    .start({ facingMode: "environment" }, { fps: 10, qrbox: 250 }, (txt) => {
      // El lector dispara el callback varias veces por segundo; evitamos repetidos
      if (procesandoQR) return;
      procesandoQR = true;

      let data;
      try {
        data = JSON.parse(txt);
      } catch (err) {
        alert("QR inválido");
        setTimeout(() => (procesandoQR = false), 2000);
        return;
      }

      if (!data || !data.familia) {
        alert("QR inválido: no contiene familia");
        setTimeout(() => (procesandoQR = false), 2000);
        return;
      }

      detenerQR();
      alert(data.familia);
      buscarPorFamilia(data.familia);
    })
    .catch((err) => {
      qrScanner = null;
      alert("No se pudo abrir la cámara: " + err);
    });
}

function buscarPorFamilia(familia) {
  fetch(
    `/.netlify/functions/obtener-invitado-qr?familia=${encodeURIComponent(familia)}`,
  )
    .then((r) => r.json())
    .then((r) => {
      if (!r.ok) {
        alert("Error del servidor: " + (r.error || r.message || "desconocido"));
        return mostrar("qr");
      }
      if (!r.invitados || r.invitados.length === 0) {
        alert("Familia no encontrada");
        return mostrar("qr");
      }
      manejarResultados(r.invitados);
    })
    .catch((err) => {
      alert("Error de conexión: " + err.message);
      mostrar("qr");
    });
}

/* =============================
       BUSCAR
============================= */
function buscar() {
  const v = document.getElementById("familiaManual").value.trim();
  if (v) buscarInvitado(v);
}

function buscarInvitado(nombre) {
  fetch(
    `/.netlify/functions/obtener-invitado-nombre?displayname=${encodeURIComponent(nombre)}`,
  )
    .then((r) => r.json())
    .then((r) => {
      if (!r.ok || !r.invitados || r.invitados.length === 0) {
        alert("No encontrado");
        return;
      }
      manejarResultados(r.invitados);
    })
    .catch((err) => alert("Error de conexión: " + err.message));
}

function manejarResultados(invitados) {
  if (invitados.length === 1) {
    seleccionar(invitados[0]);
    return;
  }

  resultadosActuales = invitados;
  mostrar("resultados");

  const cont = document.getElementById("listaResultados");
  cont.innerHTML = invitados
    .map(
      (i, idx) => `
      <div class="result-item" onclick="seleccionarPorIndice(${idx})">
        <strong>${esc(i.displayname)}</strong><br>
        Familia: ${esc(i.familia)}
      </div>`,
    )
    .join("");
}

function seleccionarPorIndice(idx) {
  seleccionar(resultadosActuales[idx]);
}

/* =============================
       SELECCIONAR
============================= */
function seleccionar(i) {
  invitadoActual = i;
  mostrar("infoBox");

  const usados = i.pasesuti || 0;
  const disponibles = (i.pases || 0) - usados;

  document.getElementById("nombre").textContent = i.displayname;
  document.getElementById("pases").textContent = i.pases;
  document.getElementById("usados").textContent = usados;

  // Si tienes un elemento con id="mesa" en tu HTML, se llena solo
  const mesaEl = document.getElementById("mesa");
  if (mesaEl) mesaEl.textContent = i.mesa || "Sin asignar";

  const dispEl = document.getElementById("disponibles");
  dispEl.textContent = disponibles;
  dispEl.className = disponibles > 0 ? "disponibles-ok" : "disponibles-cero";

  const btn = document.querySelector("#infoBox .btn-primary");
  const estado = document.getElementById("estadoAcceso");

  if (i.rechazo === true) {
    btn.disabled = true;
    btn.textContent = "Acceso Denegado";
    btn.style.opacity = "0.5";
    estado.textContent = "🔴 Invitación rechazada";
    estado.className = "estado-mensaje estado-denegado";
  } else if (i.acepto !== true) {
    btn.disabled = true;
    btn.textContent = "Pendiente";
    btn.style.opacity = "0.5";
    estado.textContent = "🟡 Invitación pendiente de confirmación";
    estado.className = "estado-mensaje estado-pendiente";
  } else if (disponibles <= 0) {
    btn.disabled = true;
    btn.textContent = "Sin pases disponibles";
    btn.style.opacity = "0.5";
    estado.textContent = "🔴 Todos los pases ya fueron utilizados";
    estado.className = "estado-mensaje estado-denegado";
  } else {
    btn.disabled = false;
    btn.textContent = "Registrar Entrada";
    btn.style.opacity = "1";
    estado.textContent = "🟢 Acceso permitido";
    estado.className = "estado-mensaje estado-ok";
  }

  document.getElementById("mensaje").style.display = "none";
}

/* =============================
       POP UP DE MESA
============================= */
function mostrarPopupMesa(inv, cantidad) {
  const previo = document.getElementById("popupMesa");
  if (previo) previo.remove();

  const mesa = inv.mesa ? `Mesa ${esc(inv.mesa)}` : "Sin mesa asignada";

  const overlay = document.createElement("div");
  overlay.id = "popupMesa";
  overlay.style.cssText =
    "position:fixed;inset:0;background:rgba(0,0,0,.65);display:flex;align-items:center;justify-content:center;z-index:9999;padding:20px;";

  overlay.innerHTML = `
    <div style="background:#fff;border-radius:16px;padding:28px 24px;max-width:360px;width:100%;text-align:center;box-shadow:0 10px 40px rgba(0,0,0,.35);">
      <div style="font-size:52px;line-height:1;">✅</div>
      <h2 style="margin:10px 0 4px;">Entrada registrada</h2>
      <p style="margin:0;color:#666;">${cantidad} pase(s) utilizados</p>
      <hr style="margin:16px 0;border:none;border-top:1px solid #eee;">
      <p style="margin:0;font-size:20px;"><strong>${esc(inv.displayname)}</strong></p>
      <p style="margin:6px 0;color:#666;">le toca sentarse en la</p>
      <div style="font-size:34px;font-weight:bold;color:#b0935a;">${mesa}</div>
      <button id="popupMesaCerrar"
        style="margin-top:22px;width:100%;padding:14px;border:none;border-radius:10px;background:#b0935a;color:#fff;font-size:17px;cursor:pointer;">
        Aceptar
      </button>
    </div>`;

  document.body.appendChild(overlay);
  const cerrar = () => overlay.remove();
  document.getElementById("popupMesaCerrar").addEventListener("click", cerrar);
  overlay.addEventListener("click", (e) => {
    if (e.target === overlay) cerrar();
  });
}

/* =============================
       REGISTRAR ENTRADA
============================= */
function registrar() {
  if (!invitadoActual) return;

  const usados = invitadoActual.pasesuti || 0;
  const disponibles = (invitadoActual.pases || 0) - usados;

  if (!(invitadoActual.acepto === true && invitadoActual.rechazo !== true)) {
    alert("Este invitado no aceptó la invitación.");
    return;
  }

  if (disponibles <= 0) {
    alert("No hay pases disponibles.");
    return;
  }

  const usar = parseInt(document.getElementById("pasesUsar").value, 10);

  if (!usar || usar <= 0) {
    alert("Cantidad inválida");
    return;
  }

  if (usar > disponibles) {
    alert("Excede los pases disponibles");
    return;
  }

  const btn = document.querySelector("#infoBox .btn-primary");
  btn.disabled = true; // evita doble registro por doble toque

  fetch("/.netlify/functions/registrar-acceso", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ id: invitadoActual.id, pasesUsar: usar }),
  })
    .then((r) => r.json())
    .then((r) => {
      if (!r.ok) {
        alert(r.message || r.error || "No se pudo registrar la entrada");
        seleccionar(invitadoActual);
        return;
      }

      document.getElementById("pasesUsar").value = "";

      // Datos frescos del servidor (incluye la mesa)
      invitadoActual = { ...invitadoActual, ...r.invitado };

      seleccionar(invitadoActual);
      document.getElementById("mensaje").style.display = "block";
      mostrarPopupMesa(invitadoActual, usar);
    })
    .catch((err) => {
      alert("Error de conexión: " + err.message);
      seleccionar(invitadoActual);
    });
}

/* =============================
       LISTA
============================= */
let listaGlobal = [];

function cargarLista() {
  fetch("/.netlify/functions/listar-invitados")
    .then((r) => r.json())
    .then((r) => {
      if (!r.ok) return;
      listaGlobal = r.invitados;
      aplicarFiltros();
    })
    .catch((err) => console.error(err));
}

function renderTabla(data) {
  const tabla = document.getElementById("tabla");

  let totalAceptaron = 0;
  let totalRechazaron = 0;
  let totalPendientes = 0;
  let totalPasesAceptados = 0;

  const filas = data.map((i) => {
    const usados = i.pasesuti || 0;
    const disponibles = (i.pases || 0) - usados;

    let acepto = "";
    let rechazo = "";
    let pendiente = "";

    const est = estadoDe(i);
    if (est === "aceptado") {
      acepto = "✔";
      totalAceptaron++;
      totalPasesAceptados += i.pases || 0;
    } else if (est === "rechazado") {
      rechazo = "✖";
      totalRechazaron++;
    } else {
      pendiente = "⏳";
      totalPendientes++;
    }

    return `
      <tr>
        <td>${esc(i.familiaNombre)}</td>
        <td>${esc(i.FamiliaDesc)}</td>
        <td>${i.pases}</td>
        <td>${usados}</td>
        <td>${disponibles}</td>
        <td style="text-align:center;color:green;font-weight:bold;">${acepto}</td>
        <td style="text-align:center;color:#b02a37;font-weight:bold;">${rechazo}</td>
        <td style="text-align:center;color:#b0935a;font-weight:bold;">${pendiente}</td>
      </tr>`;
  });

  tabla.innerHTML = filas.join("");

  document.getElementById("totalInvitados").textContent = data.length;
  document.getElementById("totalAceptaron").textContent = totalAceptaron;
  document.getElementById("totalRechazaron").textContent = totalRechazaron;
  document.getElementById("totalPendientes").textContent = totalPendientes;
  document.getElementById("totalDisponibles").textContent = totalPasesAceptados;
}

/* =============================
       FILTROS
============================= */
document
  .getElementById("filtroNombre")
  .addEventListener("input", aplicarFiltros);
document
  .getElementById("filtroEstado")
  .addEventListener("change", aplicarFiltros);

function aplicarFiltros() {
  const nombreFiltro = document
    .getElementById("filtroNombre")
    .value.toLowerCase();
  const estadoFiltro = document.getElementById("filtroEstado").value;

  const filtrados = listaGlobal.filter((i) => {
    const coincideNombre =
      String(i.displayname ?? "")
        .toLowerCase()
        .includes(nombreFiltro) ||
      String(i.familia ?? "")
        .toLowerCase()
        .includes(nombreFiltro);

    const coincideEstado =
      !estadoFiltro || estadoFiltro === "todos" || estadoDe(i) === estadoFiltro;

    return coincideNombre && coincideEstado;
  });

  renderTabla(filtrados);
}

/* =============================
       BLOQUEO DE INSPECCIÓN
============================= */
document.addEventListener("contextmenu", (e) => e.preventDefault());

document.addEventListener("keydown", (e) => {
  if (e.key === "F12") e.preventDefault();

  if (e.ctrlKey && e.shiftKey && ["I", "J", "C", "i", "j", "c"].includes(e.key))
    e.preventDefault();

  if (e.metaKey && e.altKey && ["I", "J", "C", "i", "j", "c"].includes(e.key))
    e.preventDefault();

  if ((e.ctrlKey || e.metaKey) && ["U", "u"].includes(e.key))
    e.preventDefault();
});

setInterval(() => {
  const startTime = performance.now();
  debugger;
  const endTime = performance.now();
  if (endTime - startTime > 100) console.clear();
}, 1000);
