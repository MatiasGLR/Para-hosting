function barra_lateral() {
    const barra_lateral = document.querySelector("#menuopciones");
    const flecha = document.querySelector("#flecha");
    barra_lateral.classList.toggle("hide");
    flecha.classList.toggle("hide");
    document.querySelector("#abierto").classList.toggle("invisible");
    document.querySelector("#cerrado").classList.toggle("invisible");
}