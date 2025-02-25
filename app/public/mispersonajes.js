document.querySelector("#filtro_nombre").addEventListener("input", cargarpersonajes);
document.querySelector("#filtro_raza").addEventListener("input", cargarpersonajes);

document.addEventListener("DOMContentLoaded", cargarpersonajes);

async function cargarpersonajes() {
    try {
        const res = await fetch("http://localhost:3999/api/cargarpersonajes", {
            method: "POST",
            headers: {
                "Content-Type" : "application/json"
            },
            credentials: "include"
        });
        const resJson = await res.json();
        if(resJson.status === "Ok") {
            const rows = resJson.rows;
            let str = "";
            const filtro_nombre = document.querySelector("#filtro_nombre").value;
            const filtro_raza = document.querySelector("#filtro_raza").value;
            rows.forEach(row => {
                const datos = JSON.parse(row.datos);
                if(String(row.name).toLowerCase().includes(filtro_nombre.toLowerCase()) && (String(datos.raza).toLowerCase().includes(filtro_raza.toLowerCase()) || String(datos.hibrido).toLowerCase().includes(filtro_raza.toLowerCase()))) {
                    str = str + `
                    <tr id="personajes" onclick="window.location.href='/account/personaje?nombre=${encodeURIComponent(row.name)}'">
                        <td>
                            <img src="${row.imagen}" style="width:50px" alt="Char_${row.name}">
                        </td>
                        <td>
                            <span>${row.name}</span>
                        </td>
                        <td>
                            <span>${datos.raza}${datos.hibrido == "" ? "" : " / " + datos.hibrido}</span>
                        </td>
                    </tr>
                    `
                }
                $("#mispersonajes").html(str)
            })
        }
    } catch (error) {
        console.error(error);
    }
}