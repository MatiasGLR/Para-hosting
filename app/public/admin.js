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

                            return `<li><b${estiloB}>${izquierda}</b><br>${derecha}</li>`;
                        } else {
                            // No válido o sin delimitador: devolver como texto simple
                            return `<li>${item}</li>`;
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
                                    return `<li><b${estiloB}>${partes[0].trim()}</b></li>`;
                                } else {
                                    const [nombre, costo, descripcion] = partes;
                                    return `<li><b${estiloB}>${(nombre || '').trim()}.</b> <i>${(costo || '').trim()}</i>. ${(descripcion || '').trim()}</li>`;
                                }
                            } else {
                                // Si no tiene delimitadores, se puede omitir o tratar como nombre sin formato
                                return `<li>${item}</li>`;
                            }
                        }).join('\n');
                    }

                    str = str + `
                    <div class="criatura row">
                        <div class="col-2 d-flex align-items-center">
                            <img src="/files/img/bestiario/${row.image_link}" alt="Imagen de criatura">
                        </div>
                        <div class="col-10 mt-2 row">
                            <h4 class="text-center">${row.name}</h4>
                            <div class="col-3">
                                <b class="text-center">Datos y estadísticas:</b>
                                <ul>
                                    <li><b>Tamaño.</b> ${row.size} unidades</li>
                                    ${row.agilidad != null && row.agilidad != undefined ? `<li><b>Agilidad.</b> ${row.agilidad}</li>` : ``}
                                    ${row.punteria != null && row.punteria != undefined ? `<li><b>Puntería.</b> ${row.punteria}</li>` : ``}
                                    ${row.resistencia != null && row.resistencia != undefined ? `<li><b>Resistencia.</b> ${row.resistencia}</li>` : ``}
                                    ${row.fuerza != null && row.fuerza != undefined ? `<li><b>Fuerza.</b> ${row.fuerza}</li>` : ``}
                                    ${row.carisma != null && row.carisma != undefined ? `<li><b>Carisma.</b> ${row.carisma}</li>` : ``}
                                    ${row.percepcion != null && row.percepcion != undefined ? `<li><b>Percepción.</b> ${row.percepcion}</li>` : ``}
                                    ${row.inteligencia != null && row.inteligencia != undefined ? `<li><b>Inteligencia.</b> ${row.inteligencia}</li>` : ``}
                                    ${row.suerte != null && row.suerte != undefined ? `<li><b>Suerte.</b> ${row.suerte}</li>` : ``}
                                    ${row.otras_stats != null && row.otras_stats != undefined ? `<li><b>Otros.</b> ${row.otras_stats}</li>` : ``}
                                    <li><b>Zona de aparición.</b> ${row.zonadeaparicion}</li>
                                </ul>
                            </div>
                            <div class="col-3">
                                <b class="text-center">Drop:</b>
                                <ul>
                                    ${drops}
                                </ul>
                            </div>
                            <div class="col-3">
                                <b class="text-center">Datos de domesticación:</b>
                                <ul>
                                    <li><b>Domesticable.</b> ${row.domesticable}</li>
                                    <li><b>Objeto de domesticación.</b> ${row.objeto_domes}</li>
                                    <li><b>Nivel requerido.</b> Domador Lv${row.nivel_domes}</li>
                                    <li><b>Dificultad.</b> +${row.dificultad_domes}</li>
                                </ul>
                            </div>
                            <div class="col-3">
                                <b class="text-center">Combate:</b>
                                <ul>
                                    <li><b>Vida.</b> ${row.vida}</li>
                                    <li><b>Acciones.</b> ${row.acciones}</li>
                                    <li><b>Efecto.</b> ${row.efecto}</li>
                                    <li><b>Probabilidad base.</b> ${row.prob_base}</li>
                                    <li><b>Resistencia a.</b> ${row.efec_resistencia}</li>
                                    <li><b>Inmunidad.</b> ${row.inmunidad}</li>
                                    <li><b>Tamaño de ficha.</b> ${row.size_field}</li>
                                </ul>
                            </div>
                        </div>
                        <div class="col-12">
                            <h2>Habilidades</h2>
                            <ul>
                                ${habilidades}
                            </ul>
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


