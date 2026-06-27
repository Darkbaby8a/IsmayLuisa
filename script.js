document.addEventListener("DOMContentLoaded", () => {
    const botonAbrir = document.getElementById("botonAbrir");
    const contenedorSobre = document.getElementById("contenedorSobre");

    // Evento de apertura
    botonAbrir.addEventListener("click", () => {
        // Ejecuta la animación de la solapa y desvanece el sobre base
        contenedorSobre.classList.add("animar");

        // Espera a que termine la animación para quitar el contenedor por completo
        setTimeout(() => {
            contenedorSobre.classList.add("oculto");
            document.body.classList.add("mostrar-boda");
        }, 800); // 800 milisegundos
    });

    // Contador regresivo dinámico
    const fechaBoda = new Date("December 18, 2026 18:00:00").getTime();

    const cuentaRegresiva = setInterval(() => {
        const ahora = new Date().getTime();
        const distancia = fechaBoda - ahora;

        const dias = Math.floor(distancia / (1000 * 60 * 60 * 24));
        const horas = Math.floor((distancia % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutos = Math.floor((distancia % (1000 * 60 * 60)) / (1000 * 60));
        const segundos = Math.floor((distancia % (1000 * 60)) / 1000);

        document.getElementById("dias").innerText = dias < 10 ? "0" + dias : dias;
        document.getElementById("horas").innerText = horas < 10 ? "0" + horas : horas;
        document.getElementById("minutos").innerText = minutos < 10 ? "0" + minutos : minutos;
        document.getElementById("segundos").innerText = segundos < 10 ? "0" + segundos : segundos;

        if (distancia < 0) {
            clearInterval(cuentaRegresiva);
            document.querySelector(".contador").innerHTML = "<h3>¡Llegó el gran día!</h3>";
        }
    }, 1000);
});
