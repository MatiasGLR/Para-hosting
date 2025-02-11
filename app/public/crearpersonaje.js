const caracteres_prohibidos = ["'","/","=",",",".","`","´","_","-"];

document.querySelector("#personaje-form").addEventListener("submit", async (e) => {
    e.preventDefault();
    const name = e.target.querySelector("#data_nombre").value,
          edad = e.target.querySelector("#data_edad").value,;
    console.log(name + edad);
    /*const res = await fetch("http://localhost:3999/api/crearpersonaje", {
        method: "POST",
        headers: {
            "Content-Type" : "application/json"
        },
        body: JSON.stringify({
            user: e.target.children.name.value,
            email: e.target.children.email.value,
            contra: e.target.children.contra.value,
            vcontra: e.target.children.vcontra.value
        })
    }) 
    if(!res.ok) {
        return 
    }
    const resJson = await res.json();
    if(resJson.redirect) {
        window.location.href = resJson.redirect;
    }*/
});