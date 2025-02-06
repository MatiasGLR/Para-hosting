document.querySelector("#register-form").addEventListener("submit", async (e) => {
    e.preventDefault();
    const res = await fetch("http://localhost:3999/api/register", {
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
});