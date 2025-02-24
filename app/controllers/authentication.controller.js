import bcrypt from 'bcryptjs';
import jsonwebtoken from 'jsonwebtoken';
import dotenv from 'dotenv';

import db from './database.js';

dotenv.config();

async function login (req,res) {
    const user = req.body.user;
    if(user.length > 15) return res.status(400).send({status:"Error",message:"El nombre solo puede tener hasta 15 digitos"});
    const pass = req.body.contra;
    if(pass.length > 25) return res.status(400).send({status:"Error",message:"La contraseña solo puede tener hasta 25 digitos"});
    if(!user || !pass){
        return res.status(400).send({status:"Error",message:"Los campos están incompletos"});
    }
    const usuario = db.get("SELECT * FROM Jugadores WHERE `name`=?", [user], (err,row) => {
        if(err) return console.error(err);
        else if(row != undefined) {
            try {
                (async () => {

                    const login_correcto = await bcrypt.compare(pass, row.pass);

                    if(login_correcto) {

                        const token = jsonwebtoken.sign(
                            {user:row.name}, 
                            process.env.KYE, 
                            {expiresIn:process.env.KYE_EXPIRE})
                    
                        const cookieOption = {
                            expires: new Date(Date.now() + process.env.KYE_COOKIE_EXPIRES * 24 * 60 * 60 * 1000),
                            path: "/"
                        }
                    
                        res.cookie("kye", token, cookieOption);

                        res.send({status:"ok", message:"Usuario logueado", redirect:"/account"})
                        
                    } else return res.status(400).send({status:"Error", message:"Datos incorrectos"});
                })();
            }
            catch(err) {
                console.error(err);
                return res.status(500).send({ status: "Error", message: "Error al procesar la contraseña" });
            }
            
        } else return res.status(400).send({status:"Error", message:"Datos incorrectos"});
    });
    
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