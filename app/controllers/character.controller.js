import db from './database.js';

const tablas = ["ArmasIniciales", "Dones", "Objetos", "Habilidades", "Jugadores", "NPCs", "Bestiario"];
const categorias = ["Medicinas"];

const caracteres_prohibidos = ["'","/","=",",",".","`","´","_","-"];

async function datos(req, res){
    const dones_array = [];
    if(!req.body.tabla) return res.status(400).send({status:"Error",message:"Los campos están incompletos"});
    if(!tablas.includes(req.body.tabla)) return res.status(400).send({status:"Error",message:"La tabla no existe"});
    let query;
    if(!req.body.categoria) query = "SELECT * FROM " + req.body.tabla;
    else {
        if(!categorias.includes(req.body.categoria)) return res.status(400).send({status:"Error",message:"La categoría no existe"});
        query = "SELECT name,descripcion FROM " + req.body.tabla + " WHERE `categoria`='"+ req.body.categoria +"'";
        console.log(query)
    }
    const dones = db.all(query, (err, rows) => {
        if(err) return console.error(err);
        res.json(rows);
    });
}

async function crearpersonaje(req, res){
    const imagen = req.body.imagen;
    try {
        const response = await fetch(imagen, { method: "HEAD" }); // Solo obtenemos los headers
        const contentType = response.headers.get("Content-Type");
        if(!contentType || !contentType.startsWith("image/")) return res.status(400).send({status:"Error",message:"data_imagen"}); 
    } catch (error) {
        return res.status(400).send({status:"Error",message:"data_imagen"}); 
    }
    const name = req.body.name;
    caracteres_prohibidos.forEach(caracter => {
        if(name.includes(caracter)) return res.status(400).send({status:"Error",message:"data_nombre"}); 
    })
    const edad = req.body.edad;
    const genero = req.body.genero;
    const estatura = req.body.estatura;
    const peso = req.body.peso;
    const raza = req.body.raza;
    const hibrido = req.body.hibrido;
    const maldicion = req.body.maldicion;
    const dios = req.body.dios;
    const profesion = req.body.profesion;
    const dones = req.body.dones;
    const stat_mejorada = req.body.stat_mejorada;
    const in_agilidad = req.body.in_agilidad;
    const ra_agilidad = req.body.ra_agilidad;
    const in_carisma = req.body.in_carisma;
    const ra_carisma = req.body.ra_carisma;
    const in_puntería = req.body.in_puntería;
    const ra_puntería = req.body.ra_puntería;
    const in_fuerza = req.body.in_fuerza;
    const ra_fuerza = req.body.ra_fuerza;
    const in_inteligencia = req.body.in_inteligencia;
    const ra_inteligencia = req.body.ra_inteligencia;
    const in_percepción = req.body.in_percepción;
    const ra_percepción = req.body.ra_percepción;
    const in_resistencia = req.body.in_resistencia;
    const ra_resistencia = req.body.ra_resistencia;
    const in_suerte = req.body.in_suerte;
    const ra_suerte = req.body.ra_suerte;
    const arma = req.body.arma;
    const medicina = req.body.medicina;
    const dinero = req.body.dinero;
    const usuario = db.get("SELECT * FROM `Jugadores` WHERE `name`=?", [user], (err,row) => {
        if(err) return console.error(err);
        else if(row != undefined) {
            try {
                (async () => {

                    const login_correcto = await bcrypt.compare(pass, row.pass);

                    if(login_correcto) {

                        const token = jsonwebtoken.sign(
                            {user:row.user}, 
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

export const methods = {
    datos,
    crearpersonaje
}