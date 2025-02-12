'use strict'

import path from 'path';
import { fileURLToPath } from 'url';
const __dirname = path.dirname(fileURLToPath(import.meta.url));
import express from 'express';
import cookieParser from 'cookie-parser';
import sqlite from 'sqlite3';
import multer from 'multer';
var app = express();
var port = process.env.PORT || 3999;
app.listen(port, () => {console.log("El servidor esta corriendo correctamente en el puerto "+port);});
import {methods as authentication} from "./controllers/authentication.controller.js";
import {methods as authorization} from "./middlewares/authorization.js";
import {methods as personajes} from "./controllers/character.controller.js";

const upload = multer({dest: __dirname + '/files/players/character-images/'});
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, '/files/players/character-images/')
    },
    filename: function (req, file, cb) {
        const uniqueSufix = Date.now() + '-' + Math.round(Math.random() * 1e9);
        cb(null, file.fieldname + '-' + uniqueSufix);
    }
})

//Configuración
app.use(express.static(__dirname + '/public/'));
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

        db.run(`
            CREATE TABLE IF NOT EXISTS Dones (
                name TEXT PRIMARY KEY,
                categoria TEXT,
                desc TEXT
            )    
        `)

        db.run(`
            CREATE TABLE IF NOT EXISTS ArmasIniciales (
                name TEXT
            )    
        `)

        db.run(`
            CREATE TABLE IF NOT EXISTS Objetos (
                name TEXT PRIMARY KEY,
                categoria TEXT,
                pcompra NUMERIC,
                pventa NUMERIC,
                zcomercio TEXT,
                materiales TEXT,
                creadaen TEXT,
                obtenidaen TEXT,
                descripcion TEXT
            )    
        `)
    }
);

app.get('/', (req, res) => res.status(200).sendFile(__dirname + '/pages/index.html'))
app.get('/staff', authorization.onlyAdmin, (req, res) => res.status(200).sendFile(__dirname + '/pages/admin/admin.html'))
app.get('/staff/bestiario', authorization.onlyAdmin, (req, res) => res.status(200).sendFile(__dirname + '/pages/admin/add_bestiario.html'))
app.get('/staff/habilidades', authorization.onlyAdmin, (req, res) => res.status(200).sendFile(__dirname + '/pages/admin/add_habilidades.html'))
app.get('/staff/npc', authorization.onlyAdmin, (req, res) => res.status(200).sendFile(__dirname + '/pages/admin/add_npc.html'))
app.get('/staff/objetos', authorization.onlyAdmin, (req, res) => res.status(200).sendFile(__dirname + '/pages/admin/add_objeto.html'))
app.get('/staff/lore', authorization.onlyAdmin, (req, res) => res.status(200).sendFile(__dirname + '/pages/admin/add_lore.html'))
app.get('/staff/jugadores', authorization.onlyAdmin, (req, res) => res.status(200).sendFile(__dirname + '/pages/admin/jugadores.html'))
app.get('/login', authorization.onlyUnlogged, (req, res) => res.status(200).sendFile(__dirname + '/pages/login.html'))
app.get('/register', authorization.onlyUnlogged, (req, res) => res.status(200).sendFile(__dirname + '/pages/register.html'))
app.get('/account', authorization.onlyLogged, (req, res) => { res.status(200).sendFile(__dirname + '/pages/usuario.html') })
app.get('/account/crearpersonaje', authorization.onlyLogged, (req, res) => { res.status(200).sendFile(__dirname + '/pages/crearpersonaje.html') })
app.post('/api/register', authentication.register);
app.post('/api/login', authentication.login);
app.post('/api/upload', upload.single('file'), (req, res) => res.send("Successfully uploaded"));
app.post('/api/datos', personajes.datos);
app.post('/api/crearpersonaje', personajes.crearpersonaje);
app.get('*', (req, res) => res.status(404).sendFile(__dirname + '/pages/'));