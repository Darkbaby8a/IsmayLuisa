const tbody = document.getElementById("tablaCuerpo");
const txtFamilias = document.getElementById("txtTotalFamilias");
const txtaceptados = document.getElementById("txtaceptados");
const txtRechazos = document.getElementById("txtRechazos");
const txtPases = document.getElementById("txtTotalPases");
const formBoda = document.getElementById("formConfirmarBoda");
const btnSubmit = document.getElementById("btnConfirmarModal");

let datosGlobal = [];
let idEditando = null;

//==============================
// CARGAR TABLA
//==============================
function cargarInvitados() {
  fetch("/.netlify/functions/ObtenerInvitados")
    .then((response) => {
      if (!response.ok) throw new Error("Error al obtener datos");

      return response.json();
    })
    .then((res) => {
      datosGlobal = res.data;

      // ==========================
      // TOTALES
      // ==========================

      txtFamilias.textContent = res.totalInvitados;
      txtPases.textContent = res.totalPases;

      // Total de pases aceptados
      const totalAceptados = datosGlobal
        .filter((invitado) => Number(invitado.acepto) === 1)
        .reduce((total, invitado) => {
          return total + Number(invitado.Pases || 0);
        }, 0);

      // Total de pases rechazados
      const totalRechazados = datosGlobal
        .filter((invitado) => Number(invitado.rechazo) === 1)
        .reduce((total, invitado) => {
          return total + Number(invitado.Pases || 0);
        }, 0);

      txtaceptados.textContent = totalAceptados;
      txtRechazos.textContent = totalRechazados;

      // ==========================
      // TABLA
      // ==========================

      tbody.innerHTML = "";

      if (datosGlobal.length === 0) {
        tbody.innerHTML = `
                    <tr>
                        <td colspan="7" style="text-align:center;padding:30px;">
                            No hay invitados registrados.
                        </td>
                    </tr>
                `;

        return;
      }

      datosGlobal.forEach((invitado) => {
        let estado = "Pendiente";
        let claseEstado = "fila-pendiente";

        if (Number(invitado.acepto) === 1) {
          estado = "Aceptó";
          claseEstado = "fila-aceptado";
        }

        if (Number(invitado.rechazo) === 1) {
          estado = "Rechazó";
          claseEstado = "fila-rechazado";
        }

        const fila = document.createElement("tr");

        // Pintar toda la fila
        fila.classList.add(claseEstado);

        fila.innerHTML = `
                    <td>
                        <strong>#${invitado.id}</strong>
                    </td>

                    <td>
                        ${invitado.FamiliaDesc}
                    </td>

                    <td>
                        ${invitado.Mesa}
                    </td>

                    <td>
                        ${invitado.Pases}
                    </td>

                    <td>
                        ${estado}
                    </td>

                    <td>
                        <button 
                            class="btn-copiar-link"
                            onclick="copiarLink('https://ismayluisa.netlify.app/?familia=${encodeURIComponent(invitado.familiaNombre)}')">
                            Copiar enlace
                        </button>
                    </td>

                    <td>
                        <button
                            class="btn-editar"
                            onclick="editarInvitado(${invitado.id})">
                            ✏️ Editar
                        </button>

                        <button
                            class="btn-eliminar"
                            onclick="eliminarInvitado(${invitado.id})">
                            🗑️
                        </button>
                    </td>
                `;

        tbody.appendChild(fila);
      });
    })
    .catch((err) => {
      console.error(err);

      tbody.innerHTML = `
                <tr>
                    <td colspan="7" style="color:red;text-align:center;padding:30px;">
                        Error al cargar los datos.
                    </td>
                </tr>
            `;
    });
}

//==============================
// EDITAR
//==============================
function editarInvitado(id) {
  const invitado = datosGlobal.find((x) => x.id == id);

  if (!invitado) return;

  idEditando = id;

  document.getElementById("familiaDesc").value = invitado.FamiliaDesc;
  document.getElementById("mesa").value = invitado.Mesa;
  document.getElementById("pases").value = invitado.Pases;

  btnSubmit.textContent = "Guardar Cambios";

  window.scrollTo({
    top: 0,
    behavior: "smooth",
  });
}

//==============================
// CANCELAR EDICION
//==============================
function cancelarEdicion() {
  idEditando = null;

  formBoda.reset();

  btnSubmit.textContent = "Registrar Asistencia";
}

//==============================
// GUARDAR
//==============================
formBoda.addEventListener("submit", function (e) {
  e.preventDefault();

  btnSubmit.disabled = true;
  btnSubmit.textContent = "Procesando...";

  const datos = {
    id: idEditando,

    FamiliaDesc: document.getElementById("familiaDesc").value,

    Mesa: document.getElementById("mesa").value,

    Pases: parseInt(document.getElementById("pases").value),
  };

  const url = idEditando
    ? "/.netlify/functions/EditarInvitado"
    : "/.netlify/functions/AgregarInvitado";

  fetch(url, {
    method: "POST",

    headers: {
      "Content-Type": "application/json",
    },

    body: JSON.stringify(datos),
  })
    .then((response) => {
      if (!response.ok) throw new Error("Error");

      return response.json();
    })

    .then((res) => {
      formBoda.reset();

      idEditando = null;

      btnSubmit.textContent = "Registrar Asistencia";

      cargarInvitados();
    })

    .catch((err) => {
      console.error(err);

      alert("Ocurrió un error.");
    })

    .finally(() => {
      btnSubmit.disabled = false;

      if (idEditando) btnSubmit.textContent = "Guardar Cambios";
      else btnSubmit.textContent = "Registrar Asistencia";
    });
});

//==============================
// INICIO
//==============================
document.addEventListener("DOMContentLoaded", function () {
  cargarInvitados();
});
function eliminarInvitado(id) {
  if (!confirm("¿Deseas eliminar este invitado?")) return;

  fetch("/.netlify/functions/EliminarInvitado", {
    method: "POST",

    headers: {
      "Content-Type": "application/json",
    },

    body: JSON.stringify({
      id: id,
    }),
  })
    .then((res) => {
      if (!res.ok) throw new Error();

      return res.json();
    })
    .then((res) => {
      cargarInvitados();
    })
    .catch((err) => {
      console.error(err);

      alert("No fue posible eliminar el invitado.");
    });
}
function copiarLink(texto) {
  navigator.clipboard
    .writeText(texto)
    .then(() => {
      const mensaje = document.getElementById("mensajeCopiado");

      mensaje.classList.add("mostrar");

      setTimeout(() => {
        mensaje.classList.remove("mostrar");
      }, 2500);
    })
    .catch(() => {
      const mensaje = document.getElementById("mensajeCopiado");

      mensaje.textContent = "No fue posible copiar";

      mensaje.classList.add("mostrar");

      setTimeout(() => {
        mensaje.classList.remove("mostrar");

        mensaje.textContent = "Enlace copiado correctamente";
      }, 2500);
    });
}

// 1. Deshabilitar el clic derecho
document.addEventListener("contextmenu", (e) => {
  e.preventDefault();
});

// 2. Deshabilitar atajos de teclado para inspeccionar
document.addEventListener("keydown", (e) => {
  //Deshabilitar F12
  if (e.key === "F12") {
    e.preventDefault();
  }

  // Deshabilitar Ctrl+Shift+I (Inspeccionar), Ctrl+Shift+J (Consola), Ctrl+Shift+C (Elemento)
  if (
    e.ctrlKey &&
    e.shiftKey &&
    ["I", "J", "C", "i", "j", "c"].includes(e.key)
  ) {
    e.preventDefault();
  }

  // Deshabilitar Cmd+Option+I / Cmd+Option+J en macOS
  if (e.metaKey && e.altKey && ["I", "J", "C", "i", "j", "c"].includes(e.key)) {
    e.preventDefault();
  }

  // Deshabilitar Ctrl+U / Cmd+U (Ver código fuente)
  if ((e.ctrlKey || e.metaKey) && ["U", "u"].includes(e.key)) {
    e.preventDefault();
  }
});

// 3. Trampa de debugger (opcional: pausa la ejecución si logran abrir la consola)
setInterval(() => {
  const startTime = performance.now();
  debugger;
  const endTime = performance.now();
  //Si la consola está abierta, la instrucción 'debugger' pausa el flujo y causa un retraso medible
  if (endTime - startTime > 100) {
    console.clear();
  }
}, 1000);
