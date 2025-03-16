// Conexión al servidor de socket.io
const socket = io();

// Elementos del chat
const messageInput = document.getElementById("message");
const sendButton = document.getElementById("send-btn");
const chatBox = document.getElementById("chat-box");
const colorPicker = document.getElementById("color-picker");
const darkModeBtn = document.getElementById("dark-mode-btn");

// Obtención del nombre de usuario desde las cookies

var username = "Desconocido"; // Si no hay cookie de usuario, usa "Usuario"

async function Inicializar() {
    try {
        const res = await fetch("https://cuentos-de-enforth.onrender.com/api/revisarjugador", {
            method: "POST",
            headers: {
                "Content-Type" : "application/json"
            },
            credentials: "include"
        });
        const resJson = await res.json();
        console.log(resJson)
        if(resJson) {
            username = resJson.nombre;
            resJson.mensajes.forEach(mensaje => {
                console.log(mensaje);  // Ejemplo, imprimir el mensaje
                let data = {
                    user: mensaje.nombre,
                    message: mensaje.mensaje,
                    color: mensaje.color,
                    isOwnMessage: mensaje.nombre == username ? true : false
                }
                displayMessage(data)
            })
        }
    } catch (e) {
        console.error(e);
    }
}

Inicializar();

// Enviar el mensaje
sendButton.addEventListener("click", async () => {
    const message = messageInput.value;

    if(message.trim() == "") return;

    const color = colorPicker.value;

    const newMessage = {
        user: username,
        message: message,
        color: color,
        isOwnMessage: true
    };
    
    if(esTiradaValida(newMessage.message)) {
        newMessage.user = newMessage.user + " [Dados]"
        const tirada = tirarDados(newMessage.message);
        newMessage.message = "<b>"+newMessage.message+"</b> ->" + tirada.mensaje + "" + " <b style='color:white; background-color:black;'>[ " + tirada.total + " ]</b>";
    }

    if(newMessage.message.length > 300) newMessage.message = "String muy largo, no se puede realizar esa tirada " + messageInput.value; 

    socket.emit("chatMessage", newMessage);

    messageInput.value = "";

    try {
        const res = await fetch("https://cuentos-de-enforth.onrender.com/api/guardarmensaje", {
            method: "POST",
            headers: {
                "Content-Type" : "application/json"
            },
            credentials: "include",
            body: JSON.stringify({
                user: newMessage.user,
                message: newMessage.message,
                color: newMessage.color
            })
        });
    } catch (e) {
        console.error(e);
    }
});

socket.on("chatMessage", async (data) => {
    displayMessage(data);
});

// Función para crear el HTML de cada mensaje
function displayMessage(data) {
    const messageElement = document.createElement("div");

    // Si el mensaje es del usuario actual, se muestra a la izquierda, de lo contrario a la derecha
    if (data.user == username || data.user.replace(" [Dados]", "") == username) {
        messageElement.classList.add("message", "sent"); // Para los mensajes enviados
    } else {
        messageElement.classList.add("message", "received"); // Para los mensajes recibidos
    }
    // Configuración de color para el mensaje
    messageElement.innerHTML = `<strong style="color:${data.color};">${data.user}</strong><span style='display:inline-block'>${data.message}</span>`;
    chatBox.appendChild(messageElement);

    // Desplazar el chat hacia abajo
    chatBox.scrollTop = chatBox.scrollHeight;
}

// Función para obtener la cookie de 'user'
function getCookie(name) {
    let value = "; " + document.cookie;
    let parts = value.split("; " + name + "=");
    if (parts.length === 2) return parts.pop().split(";").shift();
}

// Modo oscuro
darkModeBtn.addEventListener("click", () => {
    document.body.classList.toggle("dark-mode");
    const currentMode = document.body.classList.contains("dark-mode") ? "dark" : "light";
    localStorage.setItem("chatMode", currentMode); // Guardar el modo
});

// Cambiar el modo según lo guardado
window.addEventListener("load", () => {
    const savedMode = localStorage.getItem("chatMode");
    if (savedMode === "dark") {
        document.body.classList.add("dark-mode");
    }
});

function tirarDados(formula) {
    function lanzarDado(caras) {
        return Math.floor(Math.random() * caras) + 1;
    }

    function lanzarDadoFate() {
        const valores = [-1, 0, 1];
        return valores[Math.floor(Math.random() * valores.length)];
    }

    function procesarParte(parte) {
        // Convertir df a dF para estandarizar
        parte = parte.replace(/df/gi, "dF");

        const match = parte.match(/^(\d+)d(F|\d+)(dh\d+|dl\d+|h\d+|l\d+)?$/);
        if (!match) return { resultados: [parseInt(parte)], suma: parseInt(parte), detalle: `[${parte}]` };

        const cantidad = parseInt(match[1]);
        const caras = match[2] === "F" ? "F" : parseInt(match[2]);
        const modificador = match[3];
        let resultados = [];

        for (let i = 0; i < cantidad; i++) {
            resultados.push(caras === "F" ? lanzarDadoFate() : lanzarDado(caras));
        }

        let resultadosOriginales = [...resultados]; // Guardamos la tirada original antes de modificar
        let descartados = [];

        if (modificador) {
            const modCantidad = parseInt(modificador.replace(/\D/g, "")); // Extraemos el número
            if (modificador.startsWith("dh") || modificador.startsWith("h")) {
                resultados.sort((a, b) => b - a); // Orden descendente
                descartados = resultados.slice(0, modCantidad); // Se descartan los más altos
                resultados = resultados.slice(modCantidad);
            } else if (modificador.startsWith("dl") || modificador.startsWith("l")) {
                resultados.sort((a, b) => a - b); // Orden ascendente
                descartados = resultados.slice(0, modCantidad); // Se descartan los más bajos
                resultados = resultados.slice(modCantidad);
            }
        }

        const suma = resultados.reduce((sum, val) => sum + val, 0);

        // Formatear los resultados, tachando los descartados
        let detalle = `[${parte} -> `;
        detalle += resultadosOriginales
            .map(num => (descartados.includes(num) ? `<s>${num}</s>` : num))
            .join(", ");
        detalle += `]`;

        return { resultados, suma, detalle };
    }

    // Convertimos los signos negativos en "+ -" para separarlos correctamente
    formula = formula.replace(/-/g, "+-");
    let partes = formula.split("+").map(p => p.trim()).filter(p => p !== "");

    let mensaje = [];
    let sumaTotal = 0;

    for (let parte of partes) {
        let { suma, detalle } = procesarParte(parte);
        sumaTotal += suma;
        mensaje.push(detalle);
    }

    return { mensaje: mensaje.join(" "), total: sumaTotal };
}

function esTiradaValida(formula) {
    // Convertir df a dF antes de validar
    formula = formula.replace(/df/gi, "dF");

    const regex = /^(-?\d+d(F|\d+)(dh\d+|dl\d+|h\d+|l\d+)?|-?\d+)([+-](-?\d+d(F|\d+)(dh\d+|dl\d+|h\d+|l\d+)?|-?\d+))*$/;
    return regex.test(formula);
}

document.getElementById("message").addEventListener("keypress", function(event) {
    if (event.key === "Enter") {
        event.preventDefault(); // Evita que se haga un salto de línea si es un <textarea>
        document.getElementById("send-btn").click(); // Simula el clic en el botón
    }
});