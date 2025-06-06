async function cargarCriaturas() {
    if($("#lista_criaturas")) {
        $("#lista-criaturas").html("")
        try {
            //const res = await fetch("https://cuentos-de-enforth.onrender.com/api/bestiario", {
            const res = await fetch("/api/bestiario", {
                method: "POST",
                headers: {
                    "Content-Type" : "application/json"
                },
                credentials: "include",
                body: JSON.stringify({
                    name: document.querySelector("#criatura_select").value,
                    rareza: document.querySelector("#criatura_select_rareza").value
                })
            });
            const resJson = await res.json();
            if(resJson.status === "Ok") {
                console.log(resJson);
                const rows = resJson.data;
                let str = "";
                rows.forEach(row => {
                    console.log(row.drops)
                    const matches = String(row.drops).match(/\[([^\]]+)\]/g);
                    const drops = matches.map(item => {
                        // Quita los corchetes
                        const content = item.slice(1, -1);
                        const [izquierda, derecha] = content.split('|');
                        return `<li><b>${izquierda.trim()}</b><br>${derecha.trim()}</li>`;
                    }).join('\n');
                    // Limpiar el input de posibles saltos de línea
                    const cleanInput = String(row.habilidades).replace(/\n/g, '');

                    // Extraer todo lo que está dentro de []
                    const matches_skills = cleanInput.match(/\[([^\]]+)\]/g);

                    let habilidades = '';
                    if (matches_skills) {
                        habilidades = matches_skills.map(item => {
                            const content = item.slice(1, -1); // quitar los []
                            const [nombre, costo, descripcion] = content.split('|');
                            return `<li><b>${(nombre || '').trim()}.</b> <i>${(costo || '').trim()}</i>. ${(descripcion || '').trim()}.</li>`;
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
                                    <li><b>Vida.</b> (2 +1/1)d4+4</li>
                                    <li><b>Acciones.</b> 1A (+1/3) 2U (+1/3)</li>
                                    <li><b>Efecto.</b> Sangrado</li>
                                    <li><b>Probabilidad base.</b> 10%</li>
                                    <li><b>Resistencia a.</b> Contundente</li>
                                    <li><b>Inmunidad.</b> Ninguno</li>
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
                    console.log(str)
                    $("#lista-criaturas").html(str)
                })
            }
        } catch (error) {
            console.error(error);
        }
    }
 }

 document.querySelector("#criatura_select_btn").addEventListener("click", cargarCriaturas);

 
 