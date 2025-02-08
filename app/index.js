'use strict'

import path from 'path';
import { fileURLToPath } from 'url';
const __dirname = path.dirname(fileURLToPath(import.meta.url));
import express from 'express';
import cookieParser from 'cookie-parser';
import sqlite from 'sqlite3';
var app = express();
var port = process.env.PORT || 3999;
app.listen(port, () => {console.log("El servidor esta corriendo correctamente en el puerto "+port);});
import {methods as authentication} from "./controllers/authentication.controller.js";
import {methods as authorization} from "./middlewares/authorization.js";

//Configuración
app.use(express.static(__dirname + '/public'));
app.use(express.static(__dirname + '/public/files/fonts/Kings'));
app.use(express.static(__dirname + '/public/files/fonts/Rajdhani'));
app.use(express.json());
app.use(cookieParser());

// Base de datos
const db = new sqlite.Database(
    path.resolve(__dirname, './files/db/enforth.db'),
    (error) => {
        if(error) {
            return console.error(error);
        }

        db.run(`
            CREATE TABLE IF NOT EXISTS Jugadores (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                name VARCHAR(30) NOT NULL,
                email TEXT NOT NULL,
                pass TEXT NOT NULL
            )
        `, (error) => {if(error) return console.error(error)})
    }
);

app.get('/', (req, res) => res.status(200).sendFile(__dirname + '/pages/index.html'))
app.get('/staff', authorization.onlyAdmin, (req, res) => res.status(200).sendFile(__dirname + '/pages/admin/admin.html'))
app.get('/login', authorization.onlyUnlogged, (req, res) => res.status(200).sendFile(__dirname + '/pages/login.html'))
app.get('/register', authorization.onlyUnlogged, (req, res) => res.status(200).sendFile(__dirname + '/pages/register.html'))
app.get('/account', authorization.onlyLogged, (req, res) => { res.status(404).sendFile(__dirname + '/pages/usuario.html') })
app.post('/api/register', authentication.register);
app.post('/api/login', authentication.login);
app.get('*', (req, res) => res.status(404).sendFile(__dirname + '/pages/'));