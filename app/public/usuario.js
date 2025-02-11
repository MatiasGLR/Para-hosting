const razas_no_maldicion = ["Demonio", "Naturis", "Automata"];
const raza_no_hibridable = ["Naturis", "Automata", "Benirie", "Draieach"];
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
                    document.querySelector('#data_imagen_mostrar').innerHTML = '<img src='+e.target.result+' style="width:100%; height:100%"></img>';
                }
            }
        };

        reader.readAsDataURL(input.files[0]);
    }
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
        if (option) {
            if(option.value == "") option.disabled = false;
            option.disabled = true;
        }
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