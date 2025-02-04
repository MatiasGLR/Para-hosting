'use strict'

var path = require('path');
var express = require('express');
var sqlite = require('sqlite3');
var app = express();

const db = new sqlite.Database(
    path.resolve(__dirname, './src/files/db/enforth.db'),
    (error) => {
        if(error) {
            return console.error(error);
        }

        db.run(`
            CREATE TABLE IF NOT EXISTS Jugadores (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                name VARCHAR(30) NOT NULL,
                pass TEXT NOT NULL
            )
        `, (error) => {if(error) return console.error(error)})
    }
);

app.use('/', (req, res) => {
    return res.status(200).sendFile('./index.html', {root: __dirname });
});

module.exports = app;