document.addEventListener("DOMContentLoaded", () => {
    const botonAbrir = document.getElementById("botonAbrir");
    const contenedorSobre = document.getElementById("contenedorSobre");

    // Lógica de apertura del sobre
    botonAbrir.addEventListener("click", () => {
        contenedorSobre.classList.add("animar");

        // Esperamos los 6 segundos de la solapa + un pequeño margen
        setTimeout(() => {
            contenedorSobre.classList.add("oculto");
            document.body.classList.add("mostrar-boda");
            // Scroll al inicio por si acaso
            window.scrollTo(0, 0);
        }, 6000); 
    });

    // --- CONTADOR REGRESIVO ---
    const fechaBoda = new Date("Octuber 10, 2026 16:00:00").getTime();

    const x = setInterval(function() {
        const ahora = new Date().getTime();
        const distancia = fechaBoda - ahora;

        const dias = Math.floor(distancia / (1000 * 60 * 60 * 24));
        const horas = Math.floor((distancia % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutos = Math.floor((distancia % (1000 * 60 * 60)) / (1000 * 60));
        const segundos = Math.floor((distancia % (1000 * 60)) / 1000);

        document.getElementById("dias").innerHTML = dias;
        document.getElementById("horas").innerHTML = horas;
        document.getElementById("minutos").innerHTML = minutos;
        document.getElementById("segundos").innerHTML = segundos;

        if (distancia < 0) {
            clearInterval(x);
            document.getElementById("contador").innerHTML = "¡NUESTRA ETERNIDAD EMPIEZA HOY!";
        }
    }, 1000);
});
