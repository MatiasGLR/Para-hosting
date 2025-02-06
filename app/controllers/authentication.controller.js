import bcrypt from 'bcryptjs';
import jsonwebtoken from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

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
    const usuario_a_revisar = usuarios.find(usuario => usuario.user === user);
    if(usuario_a_revisar){
        return res.status(400).send({status:"Error",message:"El usuario ya existe"});
    }
    const salt = await bcrypt.genSalt(12);
    const hash = await bcrypt.hash(pass,salt);
    const nuevo_usuario = {
        user, email, pass: hash
    }
    console.log(nuevo_usuario);
    usuarios.push(nuevo_usuario);
    return res.status(201).send({status:"ok", message:"Usuario "+nuevo_usuario.user+" agregado", redirect:"/login"});
}

export const methods = {
    login,
    register
}