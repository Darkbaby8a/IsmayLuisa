document.addEventListener("DOMContentLoaded", () => {
    const botonAbrir = document.getElementById("botonAbrir");
    const contenedorSobre = document.getElementById("contenedorSobre");

    // 1. EFECTO DE APERTURA DEL SOBRE
    botonAbrir.addEventListener("click", () => {
        // Añade la clase para levantar la solapa
        contenedorSobre.classList.add("abierto");

        // Espera a que termine de levantarse la solapa para desvanecer el sobre
        setTimeout(() => {
            contenedorSobre.classList.add("oculto");
            document.body.classList.add("mostrar-boda");
        }, 800); // 800ms coincide con la transición del CSS
    });

    // 2. LÓGICA DEL CONTADOR (Puedes cambiar la fecha aquí)
    const fechaBoda = new Date("December 18, 2026 18:00:00").getTime();

    const cuentaRegresiva = setInterval(() => {
        const ahora = new Date().getTime();
        const distancia = fechaBoda - ahora;

        // Cálculos de tiempo
        const dias = Math.floor(distancia / (1000 * 60 * 60 * 24));
        const horas = Math.floor((distancia % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutos = Math.floor((distancia % (1000 * 60 * 60)) / (1000 * 60));
        const segundos = Math.floor((distancia % (1000 * 60)) / 1000);

        // Renderizar en el HTML
        document.getElementById("dias").innerText = dias < 10 ? "0" + dias : dias;
        document.getElementById("horas").innerText = horas < 10 ? "0" + horas : horas;
        document.getElementById("minutos").innerText = minutos < 10 ? "0" + minutos : minutos;
        document.getElementById("segundos").innerText = segundos < 10 ? "0" + segundos : segundos;

        // Si la fecha ya pasó
        if (distancia < 0) {
            clearInterval(cuentaRegresiva);
            document.querySelector(".contador").innerHTML = "<h3>¡Llegó el gran día!</h3>";
        }
    }, 1000);
});
