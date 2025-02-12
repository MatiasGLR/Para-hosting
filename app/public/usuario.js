const razas_no_maldicion = ["Demonio", "Naturis", "Automata"];
const raza_no_hibridable = ["Naturis", "Automata", "Benirie", "Draieach"];
var distribuidos = 0;
const razas_data = {
    Humano: {
        stats:"Inteligencia +1",
        natural: 1
    },
    Orco:{
        stats:"Fuerza +1",
        natural: 3
    },
    Shira:{
        stats:"Puntería +1",
        natural: 2
    },
    Fjereo:{
        stats:"Agilidad +1",
        natural: 0
    },
    Lhanie:{
        stats:"Agilidad +1",
        natural: 2
    },
    Turbe:{
        stats:"Inteligencia +1",
        natural: 0
    },
    Sarka:{
        stats:"Agilidad +1",
        natural: 2
    },
    Demonio:{
        stats:"Puntería +1",
        natural: 2
    },
    Automata:{
        stats:"Fuerza +1",
        natural: 4
    },
    Draieach:{
        stats:"Resistencia +1",
        natural: 1
    },
    Benirie:{
        stats:"Carisma +1",
        natural: 1
    },
    Naturis:{
        stats:"Inteligencia +1",
        natural: 4
    }
}
/*
function readURL(input) {
    if (input.files && input.files[0]) {
        const reader = new FileReader();

        const validTypes = ["image/png", "image/jpeg", "image/jpg", "image/gif", "image/webp"];

        if (!validTypes.includes(input.files[0].type)) {
            document.querySelector('#data_imagen_mostrar').innerHTML = "⚠️ Solo se permiten imágenes PNG, JPG, JPEG, WEBP o GIF.";
            input.value = ""; // Limpia el input
            return;
        }

        reader.onload = function (e) {
            const img = new Image();
            img.src = e.target.result;
            
            img.onload = function() {
                const maxWidth = 300;
                const maxHeight = 300;

                if (img.width > maxWidth || img.height > maxHeight) {
                    document.querySelector('#data_imagen_mostrar').innerHTML = '⚠️ La imagen ha excedido el tamaño';
                    input.value = ""; // Limpia el input
                } else {
                    document.querySelector('#data_imagen_mostrar').innerHTML = '<img id="imagen_mostrada" src='+e.target.result+' style="width:100%; height:100%"></img>';
                }
            }
        };

        reader.readAsDataURL(input.files[0]);
    }
}*/

function esImagen(url) {
    return new Promise((resolve) => {
        const img = new Image();
        img.src = url;

        img.onload = () => resolve(true); // Si carga, es una imagen
        img.onerror = () => resolve(false); // Si falla, no es una imagen
    });
}

const imagenes_permitidas = ["jpg","jpeg","webp","png","gif"];

function readURL(input) {
    const imagen = document.querySelector("#data_imagen").value;
    return document.querySelector('#data_imagen_mostrar').innerHTML = '<img id="imagen_mostrada" src='+imagen+' style="width:100%; height:100%"></img>';
    /*imagenes_permitidas.forEach(tipo => {
        if(imagen.includes(tipo)) return document.querySelector('#data_imagen_mostrar').innerHTML = '<img id="imagen_mostrada" src='+imagen+' style="width:100%; height:100%"></img>';
    });
    alert("Este enlace no continene una imagen");
    document.querySelector("#data_imagen").value = "";*/
}

function razaExtra ()  {
    const raza = document.querySelector("#data_raza");
    const options = document.querySelectorAll("#data_hibrido option");
    options.forEach(option => {
        if(raza_no_hibridable.includes(raza.value)) {
            option.disabled = true;
            document.querySelector("#data_hibrido").value = "!";
            document.querySelector("#data_hibrido_extra").innerHTML = "";
        }
        else option.disabled = false;
    })
    if(raza.value != ""){
        document.querySelector("#data_raza_extra").innerHTML = razas_data[raza.value].stats + '. Armadura natural: ' + razas_data[raza.value].natural;
        const option = document.querySelector(`#data_hibrido option[value="${raza.value}"]`);
        cerarstats();
        const estadistica = razas_data[raza.value].stats.replace(" +1", "").toLowerCase();
        document.querySelector("#ra_"+estadistica).value = 1;
        const lista_stats = document.querySelectorAll(".raza_td");
        lista_stats.forEach(inp => {
            inp.dispatchEvent(new Event('change'));
        })
        const stat_val_def = document.querySelector("#in_"+estadistica).value;
        if(stat_val_def >= 5) {
            document.querySelector("#in_"+estadistica).value = stat_val_def-1;
            distribuidos-=1;
        }
        if (option) {
            if(option.value == "") option.disabled = false;
            option.disabled = true;
        }
        resetdistribuibles();
    } else {
        raza.value = "";
        document.querySelector("#data_raza_extra").innerHTML = "";
    }
    if(raza.value == "!") document.querySelector("#data_raza_extra").innerHTML = "";
};

function hibridoExtra () {
    const raza = document.querySelector("#data_hibrido");
    const options = document.querySelectorAll("#data_raza option");
    options.forEach(option => {
        if(raza_no_hibridable.includes(raza.value)) {
            option.disabled = true;
            document.querySelector("#data_raza").value = "!";
            document.querySelector("#data_raza_extra").innerHTML = "";
        }
        else option.disabled = false;
    });
    if(raza.value != ""){
        let str = `
            ${razas_data[raza.value].stats}. Armadura natural: ${razas_data[raza.value].natural}<br>
            
        `;
        document.querySelector("#data_hibrido_extra").innerHTML = str;
        const option = document.querySelector(`#data_raza option[value="${raza.value}"]`);
        if (option) {
            if(option.value == "") option.disabled = false;
            else option.disabled = true;
        }
    } else {
        raza.value = "";
        document.querySelector("#data_hibrido_extra").innerHTML = "";
    }
    if(raza.value == "!") document.querySelector("#data_hibrido_extra").innerHTML = "";
}

function cargarpestaña(src) {
    $.get(src, function (html_text) {
        document.querySelector("#main").innerHTML = html_text;
    });
}

function desactivarDios(){
    const maldicion = document.querySelector("#data_maldicion");
    const inputDios = document.querySelector("#data_dios");
    const raza = document.querySelector("#data_raza");
    const hibrido = document.querySelector("#data_hibrido");
    if(raza.value == "Naturis" || hibrido.value == "Naturis") {
        inputDios.value = "Naturaleza";
        inputDios.disabled = true; // Desactiva el input
    } else if (inputDios.value == "Naturaleza") {
        inputDios.value = "";
        inputDios.disabled = false; // Activa el input
    }
    if(razas_no_maldicion.includes(raza.value) || razas_no_maldicion.includes(hibrido.value)) {
        maldicion.value = "!";
        maldicion.disabled = true;
    } else {
        maldicion.disabled = false;
        if(maldicion.value == "!") maldicion.value = "";
    }
    if (maldicion.value === "Sin alma") {
        inputDios.value = "!"; // Borra el valor si estaba escrito
        inputDios.disabled = true; // Desactiva el input
    } else if(inputDios.value == "!") {
        inputDios.value = "";
        inputDios.disabled = false; // Reactiva el input
    }
}

const stats_list = ["agilidad","carisma","puntería","fuerza","inteligencia","percepción","resistencia"];

function cerarstats_in(){
    stats_list.forEach(stat => {
        document.querySelector("#in_"+stat).value = 0;
    });
    distribuidos = 0;
    resetdistribuibles();
}

function cerarstats(){
    stats_list.forEach(stat => {
        document.querySelector("#ra_"+stat).value = 0;
    });
}

function mejorarstat() {
    const stat_list = document.querySelectorAll("#body_stats");
    const mejorada = document.querySelector("#data_stat_mejorada");
    stat_list.forEach(stats => {
        $(stats).css("background-color","unset");
    });

}

function resetdistribuibles(){
    const distribuibles = document.querySelector("#distribuibles");
    distribuibles.value = distribuidos+' de 15';
    if(distribuibles.value == "15 de 15") {
        $("#distribuibles").css("color", "red");
        $("#distribuibles").css("font-weight", "bold");
    } else {
        $("#distribuibles").css("color", "black");
        $("#distribuibles").css("font-weight", "unset");
    }
}

function cambiarstat(stat, valor){
    if(stats_list.includes(stat)){
        const stat_data = document.querySelector("#in_"+stat);
        const stat_raza_data = document.querySelector("#ra_"+stat);
        const stat_val = Number(stat_data.value);
        const stat_raza_val = Number(stat_raza_data.value);
        if(distribuidos+valor > 15 || (stat_val+valor+stat_raza_val > 5 || stat_val+valor < 0)) return;
        stat_data.value = stat_val + valor;
        distribuidos+=valor;
        resetdistribuibles();
    }
}

var dones = [], armas = [], medicinas = []; 

async function cargardones() {
    const dones_lista_existe = document.querySelector("#data_dones");
    if(!dones_lista_existe) return;
    try {
        const res = await fetch("http://localhost:3999/api/datos", {
            method: "POST",
            headers: {
                "Content-Type" : "application/json"
            },
            body: JSON.stringify({
                tabla: "Dones"
            })
        }); 
        const data = await res.json();
        if(data.length > 0) {
            dones = data;
            dones.forEach((don, index) => {
                const option = document.createElement("option");
                option.textContent = don.name;  // El texto de la opción
                option.value = index;        // El valor de la opción (puede ser diferente si quieres)
                option.name = don.name;        // El valor de la opción (puede ser diferente si quieres)
                dones_lista_existe.appendChild(option);
            })
        }
    } catch (e) {
        console.error(e);
    }
}

async function cargararmas() {
    const armas_lista_existe = document.querySelector("#data_arma");
    if(!armas_lista_existe) return;
    try {
        const res = await fetch("http://localhost:3999/api/datos", {
            method: "POST",
            headers: {
                "Content-Type" : "application/json"
            },
            body: JSON.stringify({
                tabla: "ArmasIniciales"
            })
        });
        const data = await res.json();
        if(data.length > 0) {
            armas = data;
            armas.forEach((arma, index) => {
                const option = document.createElement("option");
                option.textContent = arma.name;  // El texto de la opción
                option.value = index;        // El valor de la opción (puede ser diferente si quieres)
                armas_lista_existe.appendChild(option);
            })
        }
    } catch (e) {
        console.error(e);
    }
}

async function cargarmedicinas() {
    const medicina_lista_existe = document.querySelector("#data_medicina");
    if(!medicina_lista_existe) return;
    try {
        const res = await fetch("http://localhost:3999/api/datos", {
            method: "POST",
            headers: {
                "Content-Type" : "application/json"
            },
            body: JSON.stringify({
                tabla: "Objetos",
                categoria: "Medicinas"
            })
        });
        const data = await res.json();
        if(data.length > 0) {
            medicinas = data;
            medicinas.forEach((medic, index) => {
                const option = document.createElement("option");
                option.textContent = medic.name;  // El texto de la opción
                option.value = index;        // El valor de la opción (puede ser diferente si quieres)
                medicina_lista_existe.appendChild(option);
            })
        }
    } catch (e) {
        console.error(e);
    }
}

function informaciondon() {
    const don_list = document.querySelector("#data_dones");
    if(don_list.value != ""){
        document.querySelector("#data_dones_extra").innerHTML = "<b>Descripción del Don.</b> "+dones[don_list.value].desc;
        document.querySelector("#data_dones").setAttribute("name", dones[don_list.value].name);
    } else {
        document.querySelector("#data_dones_extra").innerHTML = "";
        document.querySelector("#data_dones").setAttribute("name", "");
    }
    console.log(document.querySelector("#data_dones").getAttribute("name"));
}

function informaciondmedicina() {
    const medicina_list = document.querySelector("#data_medicina");
    if(medicina_list.value != ""){
        document.querySelector("#data_medicina_extra").innerHTML = "<b>Descripción del objeto.</b> "+medicinas[medicina_list.value].descripcion;
    } else {
        document.querySelector("#data_medicina_extra").innerHTML = 'Puede ser utilizado cualquier objeto de la categorìa "Medicamento" de objetos, en caso de no haber uno, contacta a un administrador';
    }
}

cargardones();
cargararmas();
cargarmedicinas();