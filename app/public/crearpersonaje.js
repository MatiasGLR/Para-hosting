const caracteres_prohibidos = ["'","/","=",",",".","`","´","_","-"];

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
            dones: e.target.querySelector("#data_dones").value,
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
            arma: e.target.querySelector("#data_arma").value,
            medicina: e.target.querySelector("#data_medicina").value,
            dinero: e.target.querySelector("#data_dinero").value
        })
    }) 
    if(!res.ok) {
        const resJson = await res.json();
        if(resJson.message) {
            window.location.href = "#"+resJson.message;
            $("#"+resJson.message).css("background-color", "#fda3a3");
        }
        return 
    }
    if(resJson.redirect) {
        window.location.href = resJson.redirect;
    }
});