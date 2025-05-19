window.cargarmanual = function(url, to="main"){
    fetch(url)
        .then(response => {
            if (!response.ok) {
                throw new Error(`Error al cargar ${url}: ${response.statusText}`);
            }
            return response.text();
        })
        .then(html => {
            document.getElementById(to).innerHTML = html;
        })
        .catch(error => console.error("Error cargando la sección:", error));
};

cargarmanual("/manual-secciones/objeto.html", "main");