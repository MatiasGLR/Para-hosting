async function cargarpersonaje() {
    const params = new URLSearchParams(window.location.search);
    const nombrePersonaje = ""+params.get("nombre");
    try {
        const res = await fetch("http://localhost:3999/api/cargarpersonaje", {
            method: "POST",
            headers: {
                "Content-Type" : "application/json"
            },
            credentials: "include",
            body: JSON.stringify({
                personaje: nombrePersonaje
            })
        });
        const resJson = await res.json();
        if(resJson.status === "Ok") {
            const datos = JSON.parse(resJson.rows[0].datos);
            document.querySelector("#personaje_datos-imagen").innerHTML = "<img style='max-width:300px' src='"+resJson.rows[0].imagen+"' alt='char_Imagen'>";

            document.querySelector("#personaje_datos-nombre").innerHTML = nombrePersonaje;
            document.querySelector("#personaje_datos-edad").value = datos.edad;
            document.querySelector("#personaje_datos-estatura").value = datos.estatura;
            document.querySelector("#personaje_datos-peso").value = datos.peso;

            document.querySelector("#personaje_datos-genero").innerHTML = datos.genero == "Masculino" ? '<i class="bi bi-gender-male"></i>' : '<i class="bi bi-gender-female"></i>';
            document.querySelector("#personaje_datos-raza").value = datos.raza;
            document.querySelector("#personaje_datos-hibrido").value = datos.hibrido;
            document.querySelector("#personaje_datos-maldicion").value = datos.maldicion.nombre;

            document.querySelector("#personaje_datos-dios").value = datos.dios;
            document.querySelector("#personaje_datos-karmapos").value = datos.karmapos;
            document.querySelector("#personaje_datos-karmaneg").value = datos.karmaneg;
            document.querySelector("#personaje_datos-karmatotal").value = datos.karmapos+datos.karmaneg;
        }
    } catch (error) {
        console.error(error);
    }
}

cargarpersonaje();

function karmatotal() {
    const karmapos = Number(document.querySelector("#personaje_datos-karmapos").value) || 0;
    const karmaneg = Number(document.querySelector("#personaje_datos-karmaneg").value) || 0;
    document.querySelector("#personaje_datos-karmatotal").value = karmapos-karmaneg;
}