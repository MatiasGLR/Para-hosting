const mensaje_error = document.querySelector("#error");

document.querySelector("#register-form").addEventListener("submit", async (e) => {
    e.preventDefault();
    const user = e.target.children.name.value;
    const contra = e.target.children.contra.value;
    const res = await fetch("https://cuentos-de-enforth.onrender.com/api/login", {
        method: "POST",
        headers: {
            "Content-Type" : "application/json"
        },
        body: JSON.stringify({
            user, contra
        })
    });
    if(!res.ok) {
        mensaje_error.classList.toggle("escondido", false);
        let mensaje = await res.json();
        if(mensaje.message) mensaje_error.innerHTML = mensaje.message;
        return 
    }
    const resJson = await res.json();
    if(resJson.redirect) {
        window.location.href = resJson.redirect;
    }
});