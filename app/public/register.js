const mensaje_error = document.querySelector("#error");

document.querySelector("#register-form").addEventListener("submit", async (e) => {
    e.preventDefault();
    const res = await fetch("https://turbo-bassoon-6756vq5wv5jh47w-3999.app.github.dev/api/register", {
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