import bcrypt from 'bcryptjs';
import jsonwebtoken from 'jsonwebtoken';
import dotenv from 'dotenv';
import sqlite from 'sqlite3';

import path from 'path';
import { fileURLToPath } from 'url';
const __dirname = path.dirname(fileURLToPath(import.meta.url));

dotenv.config();

const db = new sqlite.Database(
    path.resolve(__dirname, '../files/db/enforth.db'),
    (error) => {
        if(error) {
            return console.error(error);
        }
    }
);

export const usuarios = [
    {
        user: "matias", 
        email: "a@a.a", 
        pass: "$2a$12$RhPiZvzwlsASsnixjv9NFeMvswe2RPDI//SowD2o0EgNNo0Xx.R4K"
    }
]

async function login (req,res) {
    const user = req.body.user;
    const pass = req.body.contra;
    if(!user || !pass){
        return res.status(400).send({status:"Error",message:"Los campos están incompletos"});
    }
    const usuario_a_revisar = usuarios.find(usuario => usuario.user === user);
    if(!usuario_a_revisar){
        return res.status(400).send({status:"Error",message:"Datos incorrectos"});
    }
    const login_correcto = await bcrypt.compare(pass, usuario_a_revisar.pass)
    if(!login_correcto) {
        return res.status(400).send({status:"Error",message:"Datos incorrectos"});
    }
    const token = jsonwebtoken.sign(
        {user:usuario_a_revisar.user}, 
        process.env.KYE, 
        {expiresIn:process.env.KYE_EXPIRE})

    const cookieOption = {
        expires: new Date(Date.now() + process.env.KYE_COOKIE_EXPIRES * 24 * 60 * 60 * 1000),
        path: "/"
    }

    res.cookie("kye", token, cookieOption);
    res.send({status:"ok", message:"Usuario logueado", redirect:"/account"})
}

async function register (req,res) {
    console.log(req.body);
    const user = req.body.user;
    const pass = req.body.contra;
    const vpass = req.body.vcontra;
    const email = req.body.email;
    if(!user || !pass || !vpass || !email){
        return res.status(400).send({status:"Error",message:"Los campos están incompletos"});
    }
    if(pass != vpass) return res.status(400).send({status:"Error",message:"Las contraseñas no coinciden"});
    //Ver si usuario existe
    const usuario = await db.get("SELECT * FROM `Jugadores` WHERE `name` = ? OR `email` = ?", [user], [email], (err, row) => {
        if(err) return console.error(err);
        else if(row === undefined)  {
            (async () => {
                try {
                    const salt = await bcrypt.genSalt(10);
                    const hash = await bcrypt.hash(pass,salt);

                    db.run("INSERT INTO `Jugadores` (name,email,pass) VALUES (?,?,?)", [user, email, hash], (err) => {
                        if(err) {
                            console.error('Error al insertar el usuario:', err);
                            return res.status(500).send({ status: "Error", message: "Error al agregar el usuario" });
                        }
                        return res.status(201).send({status:"ok", message:"Usuario "+user+" agregado", redirect:"/login"});
                    }
                        
                    );
                }
                catch (err) {
                    console.error(err);
                    return res.status(500).send({ status: "Error", message: "Error al procesar la contraseña" });
                }
            })();
        }
        else return res.status(400).send({status:"Error",message:"El usuario o email ya existe"});
        
    });
    

    //Agregar usuario

    //return res.status(201).send({status:"ok", message:"Usuario "+nuevo_usuario.user+" agregado", redirect:"/login"});
}

export const methods = {
    login,
    register
}