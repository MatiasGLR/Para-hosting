import jsonwebtoken from 'jsonwebtoken';
import dotenv from 'dotenv';
import db from './../controllers/database.js'

dotenv.config();

function onlyAdmin(req,res,next){
    const logueado = revisarCookie(req);
    if(logueado) return next();
    return res.redirect("/");
}

function onlyUnlogged(req,res,next){
    const logueado = revisarCookie(req);
    if(!logueado) return next();
    return res.redirect("/account");
}

function onlyLogged(req,res,next){
    const logueado = revisarCookie(req);
    if(logueado) return next();
    return res.redirect("/login");
}

function revisarCookie(req){
    try {
        const cookie_kye = req.headers.cookie.split("; ").find(cookie => cookie.startsWith("kye=")).slice(4);
        const decodify = jsonwebtoken.verify(cookie_kye, process.env.KYE);
        const usuario_a_revisar = db.get("SELECT * FROM `Jugadores` WHERE `name`=?", decodify.user);
        //const usuario_a_revisar = usuarios.find(usuario => usuario.user === decodify.user);
        if(usuario_a_revisar === undefined) return false
        else return true
    } catch {
        return false
    }
}

export const methods = {
    onlyAdmin,
    onlyUnlogged,
    onlyLogged
}