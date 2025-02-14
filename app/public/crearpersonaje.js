const caracteres_prohibidos = ["'","/","=",",",".","`","´","_","-"];

const razatdinput = document.querySelectorAll(".raza_td");

razatdinput.forEach(inp => {
    inp.style.visibility = "hidden";
    document.querySelector("#"+inp.id+"_show").style.visibility = "hidden";
    inp.addEventListener("change", (x) => {
        const id = x.target.id;
        const e = document.querySelector("#"+id+"_show");
        if(x.target.value === "0") e.style.visibility = "hidden";
        else {
            e.style.visibility = "visible";
            e.value = "+" + x.target.value + "";
        }
    });
})

document.querySelector("#personaje-form").addEventListener("submit", async (e) => {
    e.preventDefault();
    /*const imagen = e.target.querySelector("#imagen_mostrada").value,
          name = e.target.querySelector("#data_nombre").value,
          edad = e.target.querySelector("#data_edad").value,
          genero = e.target.querySelector("#data_genero").value,
          estatura = e.target.querySelector("#data_estatura").value,
          peso = e.target.querySelector("#data_peso").value,
          raza = e.target.querySelector("#data_raza").value,
          hibrido = e.target.querySelector("#data_hibrido").value,
          maldicion = e.target.querySelector("#data_maldicion").value,
          dios = e.target.querySelector("#data_dios").value,
          profesion = e.target.querySelector("#data_profesion").value,
          dones = e.target.querySelector("#data_dones").value,
          stat_mejorada = e.target.querySelector("#data_stat_mejorada").value,
          in_agilidad = e.target.querySelector("#in_agilidad").value,
          ra_agilidad = e.target.querySelector("#ra_agilidad").value,
          in_carisma = e.target.querySelector("#in_carisma").value,
          ra_carisma = e.target.querySelector("#ra_carisma").value,
          in_puntería = e.target.querySelector("#in_puntería").value,
          ra_puntería = e.target.querySelector("#ra_puntería").value,
          in_fuerza = e.target.querySelector("#in_fuerza").value,
          ra_fuerza = e.target.querySelector("#ra_fuerza").value,
          in_inteligencia = e.target.querySelector("#in_inteligencia").value,
          ra_inteligencia = e.target.querySelector("#ra_inteligencia").value,
          in_percepción = e.target.querySelector("#in_percepción").value,
          ra_percepción = e.target.querySelector("#ra_percepción").value,
          in_resistencia = e.target.querySelector("#in_resistencia").value,
          ra_resistencia = e.target.querySelector("#ra_resistencia").value,
          in_suerte = e.target.querySelector("#in_suerte").value,
          ra_suerte = e.target.querySelector("#ra_suerte").value,
          arma = e.target.querySelector("#data_arma").value,
          medicina = e.target.querySelector("#data_medicina").value,
          dinero = e.target.querySelector("#data_dinero").value;*/
    const res = await fetch("http://localhost:3999/api/crearpersonaje", {
        method: "POST",
        headers: {
            "Content-Type" : "application/json"
        },
        body: JSON.stringify({
            imagen: e.target.querySelector("#data_imagen").value,
            name: e.target.querySelector("#data_nombre").value,
            edad: e.target.querySelector("#data_edad").value,
            genero: e.target.querySelector("#data_genero").value,
            estatura: e.target.querySelector("#data_estatura").value,
            peso: e.target.querySelector("#data_peso").value,
            raza: e.target.querySelector("#data_raza").value,
            hibrido: e.target.querySelector("#data_hibrido").value,
            maldicion: e.target.querySelector("#data_maldicion").value,
            dios: e.target.querySelector("#data_dios").value,
            profesion: e.target.querySelector("#data_profesion").value,
            dones: document.querySelector("#data_dones").getAttribute("name"),
            stat_mejorada: e.target.querySelector("#data_stat_mejorada").value,
            in_agilidad: e.target.querySelector("#in_agilidad").value,
            ra_agilidad: e.target.querySelector("#ra_agilidad").value,
            in_carisma: e.target.querySelector("#in_carisma").value,
            ra_carisma: e.target.querySelector("#ra_carisma").value,
            in_puntería: e.target.querySelector("#in_puntería").value,
            ra_puntería: e.target.querySelector("#ra_puntería").value,
            in_fuerza: e.target.querySelector("#in_fuerza").value,
            ra_fuerza: e.target.querySelector("#ra_fuerza").value,
            in_inteligencia: e.target.querySelector("#in_inteligencia").value,
            ra_inteligencia: e.target.querySelector("#ra_inteligencia").value,
            in_percepción: e.target.querySelector("#in_percepción").value,
            ra_percepción: e.target.querySelector("#ra_percepción").value,
            in_resistencia: e.target.querySelector("#in_resistencia").value,
            ra_resistencia: e.target.querySelector("#ra_resistencia").value,
            ra_suerte: e.target.querySelector("#ra_suerte").value,
            pocion: document.querySelector("#data_pocion").getAttribute("name"),
            arma: document.querySelector("#data_arma").getAttribute("name"),
            medicina: document.querySelector("#data_medicina").getAttribute("name"),
            dinero: e.target.querySelector("#data_dinero").value
        })
    })
    const resJson = await res.json();
    if(resJson.message) {
        if(resJson.message == "Completado") return alert("Completado");
        window.location.href = "#"+resJson.message;
        $("select").css("background-color", "gainsboro");
        $("input").css("background-color", "gainsboro");
        $("#"+resJson.message).css("background-color", "#fda3a3");
        document.querySelector("#error_box_text").innerHTML = "⚠️ " + resJson.error;
        $("#error").css("display", "flex");
    }
    return 
});