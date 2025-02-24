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
    transformarCookies
}