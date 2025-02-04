'use strict'

var app = require('./app');
var port = process.env.PORT || 3999;

app.listen(port, () => {
    console.log("El servidor esta corriendo correctamente en el puerto "+port);
});