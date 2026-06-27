document.addEventListener("DOMContentLoaded", () => {
    const botonAbrir = document.getElementById("botonAbrir");
    const contenedorSobre = document.getElementById("contenedorSobre");

    // 1. ANIMACIÓN DE APERTURA DEL SOBRE
    botonAbrir.addEventListener("click", () => {
        // Ejecuta el movimiento de la solapa fijado en 6 segundos por CSS
        contenedorSobre.classList.add("animar");

        // Al terminar los 6 segundos de transición, limpiamos y mostramos la boda
        setTimeout(() => {
            contenedorSobre.classList.add("oculto");
            document.body.classList.add("mostrar-boda");
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }, 6000); 
    });

    // 2. CUENTA REGRESIVA DINÁMICA
    const fechaBoda = new Date("December 18, 2026 20:00:00").getTime();

    const temporizador = setInterval(() => {
        const ahora = new Date().getTime();
        const diferencia = fechaBoda - ahora;

        // Cálculos correspondientes
        const dias = Math.floor(diferencia / (1000 * 60 * 60 * 24));
        const horas = Math.floor((diferencia % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutos = Math.floor((diferencia % (1000 * 60 * 60)) / (1000 * 60));
        const segundos = Math.floor((diferencia % (1000 * 60)) / 1000);

        // Volcar al HTML
        document.getElementById("dias").innerText = dias < 10 ? "0" + dias : dias;
        document.getElementById("horas").innerText = horas < 10 ? "0" + horas : horas;
        document.getElementById("minutos").innerText = minutos < 10 ? "0" + minutos : minutos;
        document.getElementById("segundos").innerText = segundos < 10 ? "0" + segundos : segundos;

        // Acción si ya llegó la fecha
        if (diferencia < 0) {
            clearInterval(temporizador);
            document.getElementById("contador").innerHTML = "<h3 style='color: #cfa864; font-family: Cinzel, serif;'>¡Nuestra eternidad comienza hoy!</h3>";
        }
    }, 1000);
});
