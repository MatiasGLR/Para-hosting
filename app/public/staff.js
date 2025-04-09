async function buscarjugadores() {
    const name = document.querySelector("#nombre-filtro").value;
    try {
        const response = await fetch('http://localhost:10000/api/cargarjugadores', {
            method: 'POST',  // Asegúrate de que sea un POST
            headers: {
                'Content-Type': 'application/json',  // El tipo de contenido es JSON
            },
            body: JSON.stringify({ name: name }),  // Enviar el nombre en el cuerpo de la solicitud
        });

        const data = await response.json();  // Parsear la respuesta como JSON

        // Comprobar el estado de la respuesta
        if (data.status === "Ok") {
            //console.log("Jugadores encontrados:", data.data);
            // Mostrar los jugadores en el frontend
            if (data.data.length > 0) {
                let datos;
                data.data.forEach(jugador => {
                    datos = datos + `
                        <tr>
                            <td>${jugador.name}</td>
                            <td>${jugador.email}</td>
                            <td id='${jugador.name}_rango'><a href="#" onclick="cambiarrango('${jugador.name}')">${nombre_rango(jugador.isadmin)}</a></td>
                        </tr>
                    `
                    document.querySelector("#listado-jugadores").innerHTML = datos;
                });
            } else {
                console.log("No se encontraron jugadores.");
            }
        } else {
            console.log("Error:", data.message);  // Mostrar el mensaje de error
        }

    } catch (error) {
        console.error("Error en la solicitud:", error);  // Manejo de errores en la solicitud
    }
}

async function enviarcambio(jugador, rango) {
    try {
        const response = await fetch('http://localhost:10000/api/cambiarrango', {
            method: 'POST',  // Asegúrate de que sea un POST
            headers: {
                'Content-Type': 'application/json',  // El tipo de contenido es JSON
            },
            body: JSON.stringify({ name: jugador, rank: rango }),  // Enviar el nombre en el cuerpo de la solicitud
        });

        const data = await response.json();  // Parsear la respuesta como JSON

        console.log(data);
        if (data.message) {
            document.querySelector("#mensaje").innerHTML = data.message;
            document.querySelector("#"+jugador+"_rango").innerHTML = `<a href="#" onclick="cambiarrango('${jugador}')">${nombre_rango(rango)}</a>`;
        }

    } catch (error) {
        console.error("Error en la solicitud:", error);  // Manejo de errores en la solicitud
    }
}

function cambiarrango(jugador) {
    const caja = document.querySelector(".caja-cambiarrango");
    const caja_datos = document.querySelector(".cambiarrango");
    caja.style.display = "flex";

    caja_datos.innerHTML = `
        <b>Cambiar rango de jugador</b>
        <x>${jugador}</x>
        <b>¿A que nivel deseas cambiarlo?</b>
        <a href="#" onclick="enviarcambio('${jugador}', 0)">Usuario</a>
        <a href="#" onclick="enviarcambio('${jugador}', 1)">Master</a>
        <a href="#" onclick="enviarcambio('${jugador}', 2)">Moderador</a>
        <a href="#" onclick="enviarcambio('${jugador}', 3)">Admin</a>
        <button class="btn btn-danger" onclick="document.querySelector('.caja-cambiarrango').style.display = 'none'">Cerrar</button>
        <div id="mensaje"></div>
    `
}

function cerrarcaja() {
    const caja = document.querySelector(".caja-cambiarrango");
    caja.style.display = "none";
}

function nombre_rango(rango) {
    switch(rango){
        case 0: return "Usuario";
        case 1: return "Master";
        case 2: return "Moderador";
        case 3: return "Admin";
        case 4: return "Owner";
        default: return "???"
    }
}