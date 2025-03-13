import jsonwebtoken from 'jsonwebtoken';
import dotenv from 'dotenv';
import db from '../controllers/database.js';

dotenv.config();

async function onlyAdmin(req,res,next){
    const logueado = await revisarCookie(req);
    if(logueado) return next();
    return res.redirect("/");
}

async function onlyUnlogged(req,res,next){
    const logueado = await revisarCookie(req);
    if(!logueado) return next();
    return res.redirect("/account");
}

async function onlyLogged(req,res,next){
    const logueado = await revisarCookie(req);
    if(logueado) return next();
    return res.redirect("/login");
}

async function devolverNombre(req, res){
    try {
        let cookies = [];
        if (typeof req === "string") {
            cookies = req.split("; ");
        } else if (req.headers && req.headers.cookie) {
            cookies = req.headers.cookie.split("; ");
        }

        if (cookies.length === 0) return false;

        const cookie_check = cookies.find(cookie => cookie.startsWith("kye="));

        const cookie_kye = cookie_check ? cookie_check.slice(4) : false;
        if(!cookie_kye) return false;

        const decodify = jsonwebtoken.verify(cookie_kye, process.env.KYE);
        const jugador = await new Promise((resolve) => {
            db.get("SELECT * FROM Jugadores WHERE `name`=?", [decodify.user], (err, row) => {
                if(err || !row) {
                    console.log(err);
                    return resolve("NaN");
                }
                else return resolve(decodify.user);
            });
        }) 
        const mensajes = await new Promise((resolve) => {
            db.all("SELECT * FROM Mensajes", (err, rows) => {
                if(err || !rows) {
                    console.log(err);
                    return resolve([]);
                }
                else return resolve(rows);
            });
        }) 
        return res.status(200).send({nombre:jugador, mensajes:mensajes});
    } catch {
        return false
    }
}

async function guardarmensaje(req, res){
    
    try {
        if(req.body.user && req.body.message && req.body.color) {
            let user = String(req.body.user);
            if(user.includes(" [Dados]")) user = user.replace(" [Dados]", "");
            db.run("INSERT INTO Mensajes (nombre,color,mensaje) VALUES (?,?,?)", [user, req.body.color, req.body.message], (err,row) => {
                if (err) console.error("Error al eliminar mensajes antiguos:", err);
            });
            db.run("DELETE FROM Mensajes WHERE id NOT IN (SELECT id FROM Mensajes ORDER BY fecha DESC LIMIT 200)", (err,row) => {
                if (err) console.error("Error al eliminar mensajes antiguos:", err);
            });
        }
    } catch(e) {
        console.error(e);
    }
}

async function revisarCookie(req){
    try {
        let cookies = [];
        if (typeof req === "string") {
            cookies = req.split("; ");
        } else if (req.headers && req.headers.cookie) {
            cookies = req.headers.cookie.split("; ");
        }

        if (cookies.length === 0) return false;

        const cookie_check = cookies.find(cookie => cookie.startsWith("kye="));

        const cookie_kye = cookie_check ? cookie_check.slice(4) : false;
        if(!cookie_kye) return false;

        const decodify = jsonwebtoken.verify(cookie_kye, process.env.KYE);
        const jugador = await new Promise((resolve,reject) => {
            db.get("SELECT * FROM Jugadores WHERE `name`=?", [decodify.user], (err, row) => {
                if(err || !row) return resolve(false);
                if (typeof req === "string") return resolve(row.name);
                else if (req.headers && req.headers.cookie) return resolve(true);
            });
        }) 

        return jugador;
    } catch {
        return false
    }
}

function transformarCookies(objCookies) {
    return Object.entries(objCookies)
        .map(([clave, valor]) => `${clave}=${encodeURIComponent(valor)}`)
        .join("; ");
}

export const methods = {
    onlyAdmin,
    onlyUnlogged,
    onlyLogged,
    revisarCookie,
    transformarCookies,
    devolverNombre,
    guardarmensaje
}