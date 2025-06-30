import bcrypt from 'bcryptjs';
import jsonwebtoken from 'jsonwebtoken';
import dotenv from 'dotenv';

import {methods as authorization} from "../middlewares/authorization.js";

import db from './database.js';

async function listaJugadores(req, res) {
    const name = req.body.name;

    try {
        const rows = await new Promise((resolve, reject) => {
            db.all("SELECT * FROM Jugadores WHERE name LIKE ?", ['%' + name + '%'], (err, rows) => {
                if (err) reject({ status: "Error", message: err.message });
                else resolve(rows);
            });
        });

        // Responder con los jugadores encontrados
        res.status(200).json({ status: "Ok", data: rows });

    } catch (err) {
        res.status(500).json({ status: "Error", message: "Error al recuperar jugadores." });
    }
}

async function listaBestias(req, res) {
    const name = req.body.name ? req.body.name : "";
    const rareza = req.body.rareza ? req.body.rareza : "";
    try {
        const rows = await new Promise((resolve, reject) => {
            db.all("SELECT * FROM Bestiario WHERE LOWER(name) LIKE LOWER(?) AND rareza LIKE ?", ['%' + name + '%', '%' + rareza + '%'], (err, rows) => {
                if (err) reject({ status: "Error", message: err.message });
                else resolve(rows);
            });
        });

        // Responder con los jugadores encontrados
        res.status(200).json({ status: "Ok", data: rows });

    } catch (err) {
        res.status(500).json({ status: "Error", message: "Error al recuperar bestias." });
    }
}

async function listaHechizos(req, res) {
    const categoria = req.body.categoria ? req.body.categoria : "";
    try {
        const rows = await new Promise((resolve, reject) => {
            db.all("SELECT * FROM Hechizos WHERE categoria LIKE ? ORDER BY categoria, name", ['%' + categoria + '%'], (err, rows) => {
                if (err) reject({ status: "Error", message: err.message });
                else resolve(rows);
            });
        });

        // Responder con los jugadores encontrados
        res.status(200).json({ status: "Ok", data: rows });
    } catch (err) {
        res.status(500).json({ status: "Error", message: "Error al recuperar hechizos." });
    }
}


function nombre_rango(rango) {
    switch(rango){
        case 0: return "Usuario";
        case 1: return "Master";
        case 2: return "Moderador";
        case 3: return "Admin";
        case 4: return "Owner";
        default: return "???"
    }
}

async function cambiarRango(req, res) {
    const name = req.body.name,
          rank = req.body.rank;
        try {
            const rows = await new Promise((resolve, reject) => {
                db.run("UPDATE Jugadores SET isadmin=? WHERE name=?", [rank, name], (err, rows) => {
                    if (err) reject({ status: "Error", message: err.message });
                    else res.status(200).json({ status: "Ok", message: "El rango fue cambiado a " + nombre_rango(rank) });
                });
            });
        } catch (err) {
            res.status(500).json({ status: "Error", message: "Error al recuperar jugadores." });
        }
}

async function comprobarAdmin(req, res) {
    const cookies = await authorization.transformarCookies(req.cookies);
    if(!cookies.split("; ").find(c => c.startsWith("kye="))) throw ({ status: "Error", message: "#", error: "Tu cuenta tiene un problema, vuelve a intentarlo mas tarde" });
    const jugador = await authorization.revisarCookie(cookies);

    try {
        const rows = await new Promise((resolve, reject) => {
            db.all("SELECT * FROM Personajes WHERE `jugador`=?", [jugador], (err, rows) => {
                if (err) reject({ status: "Error" });
                else resolve({status: "Ok", rows: rows});
            });
        });

        res.status(200).send({ Status: "Ok", rows: rows });
    }
    catch (e) {
        res.status(500).send({ status: "Error", message: e.message || "Ocurrió un error interno", error: e.error || e });
    }
}

export const methods = {
    listaJugadores,
    comprobarAdmin,
    cambiarRango,
    listaBestias,
    listaHechizos
}