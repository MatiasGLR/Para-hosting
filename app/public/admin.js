async function cargarCriaturas() {
    if ($("#lista_criaturas")) {
        $("#lista-criaturas").html("")
        try {
            //const res = await fetch("https://cuentos-de-enforth.onrender.com/api/bestiario", {
            const res = await fetch("/api/bestiario", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                credentials: "include",
                body: JSON.stringify({
                    name: document.querySelector("#criatura_select").value,
                    rareza: document.querySelector("#criatura_select_rareza").value
                })
            });
            const resJson = await res.json();
            if (resJson.status === "Ok") {
                const rows = resJson.data;
                let str = "";
                rows.forEach(row => {
                    const input = String(row.drops).replace(/\n/g, '').trim();

                    // Separar por & sin espacios
                    let bloques = input.split('&').map(b => b.trim());

                    const drops = bloques.map(item => {
                        if (item.length < 3) return ''; // evitar errores

                        const tipo = item[0]; // delimitador inicial: [, {, (
                        const cierre = item[item.length - 1];

                        // Validar que tenga delimitadores correctos
                        if (
                            (tipo === '[' && cierre === ']') ||
                            (tipo === '{' && cierre === '}') ||
                            (tipo === '(' && cierre === ')')
                        ) {
                            const contenido = item.slice(1, -1);
                            const partes = contenido.split('|');

                            // Asignar color según tipo
                            let estiloB = '';
                            if (tipo === '{') estiloB = ' style="color:purple"';
                            else if (tipo === '(') estiloB = ' style="color:red"';

                            const izquierda = (partes[0] || '').trim();
                            const derecha = (partes[1] || '').trim();

                            return `<li class="list-group-item"><b${estiloB}>${izquierda}</b><br>${derecha}</li>`;
                        } else {
                            // No válido o sin delimitador: devolver como texto simple
                            return `<li class="list-group-item">${item}</li>`;
                        }
                    }).join('\n');


                    // Limpiar el input de posibles saltos de línea
                    // Limpiar saltos de línea
                    const cleanInput = String(row.habilidades).replace(/\n/g, '').trim();

                    // Reemplaza todos los "],[" por "]&["
                    const inputMod = cleanInput.replace(/\],\[/g, ']&[');

                    // Ahora sí, separar por "&"
                    bloques = inputMod.split('&');

                    let habilidades = '';
                    if (bloques.length > 0) {
                        habilidades = bloques.map(item => {
                            item = item.trim();

                            if (item.length < 3) return ''; // Para evitar errores si hay algo raro

                            const tipo = item[0]; // [, {, ( o cualquier otro
                            const cierre = item[item.length - 1];

                            // Validar que el item tenga delimitadores iguales al inicio y fin
                            if (
                                (tipo === '[' && cierre === ']') ||
                                (tipo === '{' && cierre === '}') ||
                                (tipo === '(' && cierre === ')')
                            ) {
                                const contenido = item.slice(1, -1);
                                const partes = contenido.split('|');

                                // Color del <b> según tipo
                                let estiloB = '';
                                if (tipo === '{') estiloB = ' style="color:purple"';
                                else if (tipo === '(') estiloB = ' style="color:red"';

                                if (partes.length === 1) {
                                    // Solo nombre
                                    return `<li class="list-group-item"><b${estiloB}>${partes[0].trim()}</b></li>`;
                                } else {
                                    const [nombre, costo, descripcion] = partes;
                                    return `<li class="list-group-item"><b${estiloB}>${(nombre || '').trim()}.</b> <i>${(costo || '').trim()}</i>. ${(descripcion || '').trim()}</li>`;
                                }
                            } else {
                                // Si no tiene delimitadores, se puede omitir o tratar como nombre sin formato
                                return `<li class="list-group-item">${item}</li>`;
                            }
                        }).join('\n');
                    }

                    var es_domesticable = `
                        <div class="col-md-6">
                            <h5 class="text-success">Domesticación</h5>
                            <ul class="list-group list-group-flush">
                                <li class="list-group-item">Esta criatura no es domesticable o no forma parte de la lista de mascotas.</li>
                            </ul>
                        </div>`;
                    if(row.domesticable == "Si") {
                        es_domesticable = `
                        <div class="col-md-6">
                            <h5 class="text-success">Domesticación</h5>
                            <ul class="list-group list-group-flush">
                                <li class="list-group-item">Objeto: <b>${row.objeto_domes}</b></li>
                                <li class="list-group-item">Nivel requerido: <b>Domador Lv${row.nivel_domes}</b></li>
                                <li class="list-group-item">Dificultad: <b>+${row.dificultad_domes}</b></li>
                            </ul>
                        </div>`
                    }

                    str = str + `
                    <div class="container my-4 bestiario-entry w-100">
                        <div class="card shadow-lg border-0">
                            <div class="card-header bg-dark text-white d-flex justify-content-between align-items-center">
                                <h2 class="m-0">${row.name}</h2>
                                <span class="badge bg-danger">Rareza: ${row.rareza}</span>
                            </div>

                            <div class="card-body">
                                <div class="row">
                                    <div class="col-md-6">
                                        <img src="/files/img/bestiario/${row.image_link}">
                                    </div>
                                </div>
                                <hr>
                                <!-- Estadísticas -->
                                <div class="row">
                                    <div class="col-md-6">
                                        <h5 class="text-primary">Estadísticas</h5>
                                        <ul class="list-group list-group-flush">
                                            ${row.agilidad != null && row.agilidad != undefined ? `<li class="list-group-item">Agilidad. <b>${row.agilidad}</b></li>` : ``}
                                            ${row.punteria != null && row.punteria != undefined ? `<li class="list-group-item">Puntería. <b>${row.punteria}</b></li>` : ``}
                                            ${row.resistencia != null && row.resistencia != undefined ? `<li class="list-group-item">Resistencia. <b>${row.resistencia}</b></li>` : ``}
                                            ${row.fuerza != null && row.fuerza != undefined ? `<li class="list-group-item">Fuerza. <b>${row.fuerza}</b></li>` : ``}
                                            ${row.carisma != null && row.carisma != undefined ? `<li class="list-group-item">Carisma. <b>${row.carisma}</b></li>` : ``}
                                            ${row.percepcion != null && row.percepcion != undefined ? `<li class="list-group-item">Percepción. <b>${row.percepcion}</b></li>` : ``}
                                            ${row.inteligencia != null && row.inteligencia != undefined ? `<li class="list-group-item">Inteligencia. <b>${row.inteligencia}</b></li>` : ``}
                                            ${row.suerte != null && row.suerte != undefined ? `<li class="list-group-item">Suerte. <b>${row.suerte}</b></li>` : ``}
                                            ${row.otras_stats != null && row.otras_stats != undefined ? `<li class="list-group-item">Otros. <b>${row.otras_stats}</b></li>` : ``}
                                            <li class="list-group-item">Tamaño. <b>${row.size} unidades</b></li>
                                        </ul>
                                    </div>

                                    <!-- Domesticación -->
                                    ${es_domesticable}
                                </div>

                                <!-- Combate -->
                                <hr>
                                <h5 class="text-danger mt-3">Combate</h5>
                                <div class="row">
                                    <div class="col-md-6">
                                        <ul class="list-group list-group-flush">
                                            <li class="list-group-item">Vida: <b>${row.vida}</b></li>
                                            <li class="list-group-item">Acciones: <b>${row.acciones}</b></li>
                                            <li class="list-group-item">Efecto: <b>${row.efecto}</b></li>
                                            <li class="list-group-item">Probabilidad base: <b>${row.prob_base}</b></li>
                                            <li class="list-group-item">Tamaño de ficha: <b>${row.size_field}</b></li>
                                        </ul>
                                    </div>
                                    <div class="col-md-6">
                                        <ul class="list-group list-group-flush">
                                            <li class="list-group-item">Resiste: <b>${row.efec_resistencia}</b></li>
                                            <li class="list-group-item">Inmune: <b>${row.inmunidad}</b></li>
                                        </ul>
                                        <ul class="list-group list-group-flush">
                                            <li class="list-group-item">Zona de aparición: <b>${row.zonadeaparicion}</b></li>
                                        </ul>
                                    </div>
                                </div>

                                <!-- Habilidades -->
                                <hr>
                                <h5 class="text-warning mt-3">Habilidades</h5>
                                <ul class="list-group list-group-flush">
                                    ${habilidades}
                                </ul>

                                <!-- Drop -->
                                <hr>
                                <h5 class="text-info mt-3">Objetos Obtenibles</h5>
                                <ul class="list-group list-group-flush">
                                    ${drops}
                                </ul>
                            </div>
                        </div>
                    </div>
                    `;
                    $("#lista-criaturas").html(str)
                })
            }
        } catch (error) {
            console.error(error);
        }
    }
}

document.querySelector("#criatura_select_btn").addEventListener("click", cargarCriaturas);


