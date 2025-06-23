'use strict'

import path from 'path';
import { fileURLToPath } from 'url';
const __dirname = path.dirname(fileURLToPath(import.meta.url));
import express from 'express';
import cookieParser from 'cookie-parser';
import http from "http";
import { Server } from "socket.io";
import sqlite from 'sqlite3';
import multer from 'multer';

var app = express();
const server = http.createServer(app);
const io = new Server(server);

var port = process.env.PORT || 10000;

io.on('connection', (socket) => {
    console.log('Un usuario se ha conectado');
    
    // Cuando un mensaje es enviado desde un cliente
    socket.on('chatMessage', (data) => {
      // Emitir el mensaje a todos los clientes
      io.emit('chatMessage', data); 
    });
  
    // Manejar desconexión
    socket.on('disconnect', () => {
      console.log('Un usuario se ha desconectado');
    });
  });

server.listen(port, '0.0.0.0', () => {
    console.log("Servidor corriendo en http://localhost:"+port);
});

import {methods as authentication} from "./controllers/authentication.controller.js";
import {methods as staff} from "./controllers/admin.controller.js";
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
                pass TEXT NOT NULL,
                isadmin INTEGER NOT NULL DEFAULT 0
            )
        `, (error) => {if(error) return console.error(error)})

        db.run(`
            CREATE TABLE IF NOT EXISTS Dones (
                name TEXT PRIMARY KEY,
                categoria TEXT,
                desc TEXT
            )    
        `, (error) => {if(error) return console.error(error)})

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
                descripcion TEXT,
                funcionalidad TEXT,
                imagen TEXT
            )    
        `, (error) => {if(error) return console.error(error)})

        db.run(`
            CREATE TABLE IF NOT EXISTS Mensajes (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                nombre TEXT,
                color TEXT,
                mensaje TEXT,
                fecha TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );    
        `)

        db.run(`CREATE TABLE IF NOT EXISTS Bestiario (
                name TEXT,
                image_link TEXT,
                agilidad TEXT,
                punteria TEXT,
                resistencia TEXT,
                fuerza TEXT,
                carisma TEXT,
                percepcion TEXT,
                inteligencia TEXT,
                suerte TEXT,
                otras_stats TEXT,
                zonadeaparicion TEXT,
                drops TEXT,
                domesticable TEXT,
                objeto_domes TEXT,
                nivel_domes NUMERIC,
                dificultad_domes NUMERIC,
                vida TEXT,
                acciones TEXT,
                efecto TEXT,
                prob_base TEXT,
                efec_resistencia TEXT,
                inmunidad TEXT
            )`)
    }
);

app.get('/', (req, res) => res.status(200).sendFile(__dirname + '/pages/index.html'))
app.get('/objetos', (req, res) => res.status(200).sendFile(__dirname + '/pages/objetos.html'))
app.get('/habilidades', (req, res) => res.status(200).sendFile(__dirname + '/pages/hechizos.html'))
app.get('/staff'/*, authorization.onlyAdmin*/, (req, res) => res.status(200).sendFile(__dirname + '/pages/admin/admin.html'))
app.get('/list_adm_best'/*, authorization.onlyAdmin*/, (req, res) => res.status(200).sendFile(__dirname + '/pages/admin/bestiario.html'))
app.get('/staff/habilidades'/*, authorization.onlyAdmin*/, (req, res) => res.status(200).sendFile(__dirname + '/pages/admin/add_habilidades.html'))
app.get('/staff/npc'/*, authorization.onlyAdmin*/, (req, res) => res.status(200).sendFile(__dirname + '/pages/admin/add_npc.html'))
app.get('/staff/objetos'/*, authorization.onlyAdmin*/, (req, res) => res.status(200).sendFile(__dirname + '/pages/admin/add_objeto.html'))
app.get('/staff/lore'/*, authorization.onlyAdmin*/, (req, res) => res.status(200).sendFile(__dirname + '/pages/admin/add_lore.html'))
app.get('/staff/jugadores'/*, authorization.onlyAdmin*/, (req, res) => res.status(200).sendFile(__dirname + '/pages/admin/jugadores.html'))
app.get('/login'/*, authorization.onlyUnlogged*/, (req, res) => res.status(200).sendFile(__dirname + '/pages/login.html'))
app.get('/register'/*, authorization.onlyUnlogged*/, (req, res) => res.status(200).sendFile(__dirname + '/pages/register.html'))
app.get('/chat'/*, authorization.onlyLogged*/, (req, res) => { res.status(200).sendFile(__dirname + '/pages/chat.html') })
app.post('/api/bestiario', staff.listaBestias);
app.post('/api/revisarjugador', authorization.devolverNombre);
app.post('/api/cargarjugadores', staff.listaJugadores);
app.post('/api/cambiarrango', staff.cambiarRango);
app.post('/api/register', authentication.register);
app.post('/api/login', authentication.login);
app.post('/api/guardarmensaje', authorization.guardarmensaje);
app.post('/api/upload', upload.single('file'), (req, res) => res.send("Successfully uploaded"));
app.get('*', (req, res) => res.status(404).sendFile(__dirname + '/pages/'));
app.get('/account'/*, authorization.onlyLogged*/, (req, res) => { res.status(200).sendFile(__dirname + '/pages/usuario.html') })












/*
app.get('/account/crearpersonaje', authorization.onlyLogged, (req, res) => { res.status(200).sendFile(__dirname + '/pages/crearpersonaje.html') })
app.get('/account/mis_personajes', authorization.onlyLogged, (req, res) => { res.status(200).sendFile(__dirname + '/pages/mis_personajes.html') })
app.get("/account/personaje", authorization.onlyLogged, (req, res) => {
    const nombrePersonaje = decodeURIComponent(req.query.nombre || ""); // Capturar el nombre del personaje desde la URL

    if (!nombrePersonaje) {
        return res.status(400).send("Falta el nombre del personaje");
    }

    res.status(200).sendFile(__dirname + '/pages/personaje.html');
});
app.post('/api/crearpersonaje', authorization.onlyLogged, async (req, res) => { await personajes.crearpersonaje(req,res) } );
app.post('/api/cargarpersonaje', authorization.onlyLogged, async (req, res) => { await personajes.cargarpersonaje(req,res) } );
app.post('/api/cargarpersonajes', authorization.onlyLogged, async (req, res) => { await personajes.cargarpersonajes(req,res) } );
app.post('/api/datos', personajes.datos);
*/