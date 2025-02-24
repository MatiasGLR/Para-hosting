document.addEventListener("DOMContentLoaded", async () => {
    const res = await fetch("http://localhost:3999/api/crearpersonaje", {
        method: "POST",
        headers: {
            "Content-Type" : "application/json"
        },
        credentials: "include"
    });
    const resJson = await res.json();
    console.log(resJson);
});