'use strict'

var express = require('express');
var app = express();

app.use('/', (req, res) => {
    return res.status(200).sendFile('./index.html', {root: __dirname });
});

module.exports = app;