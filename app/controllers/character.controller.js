import db from './database.js';

const tablas = ["ArmasIniciales", "Dones", "Objetos", "Habilidades", "Jugadores", "NPCs", "Bestiario"];
const razas = ["Humano","Orco","Shira","Fjereo","Lhanie","Turbe","Sarka","Demonio","Automata","Draieach","Benirie","Naturis"];
const categorias = ["Medicinas"];
const maldiciones = ["","Bestia","Vampiro","Sin alma"];
const dioses = ["","Sol","Luna","Combate","Miseria","Muerte","Barlghon","Justicia","Naturaleza"];
const profesiones = ["Alquimista", "Armero", "Bardo", "Cantinero", "Carpintero", "Cazador", "Domador", "Explorador", "Granjero", "Guardia", "Herrero", "Ingeniero", "Joyero", "Ladrón", "Médico", "Mercader", "Mercenario", "Minero", "Talabartero"];
const estadisticas = ["Agilidad","Carisma","Puntería","Fuerza","Inteligencia","Percepción","Resistencia","Suerte"];
const divisas = ["Qurs","Kalis","Sarix"];

const caracteres_prohibidos = ["'","/","=",",",".","`","´","_","-"];

async function datos(req, res){
    const dones_array = [];
    if(!req.body.tabla) return res.status(200).send({status:"Error",message:"Los campos están incompletos"});
    if(!tablas.includes(req.body.tabla)) return res.status(200).send({status:"Error",message:"La tabla no existe"});
    let query;
    if(!req.body.categoria) query = "SELECT * FROM " + req.body.tabla;
    else {
        if(!categorias.includes(req.body.categoria)) return res.status(200).send({status:"Error",message:"La categoría no existe"});
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
        if(!contentType || !contentType.startsWith("image/")) return res.status(200).send({status:"Error",message:"data_imagen",error:"La imagen recibida no es válida"}); 
    } catch (error) {
        return res.status(200).send({status:"Error",message:"data_imagen",error:"Debes colocar el link de una imagen"}); 
    }
    const name = req.body.name;
    caracteres_prohibidos.forEach(caracter => {
        if(name.includes(caracter)) return res.status(200).send({status:"Error",message:"data_nombre",error:"Debes colocar un nombre válido"}); 
    })
    const edad = req.body.edad;
    if(!Number(edad) || (edad < 21 || edad > 100)) return res.status(200).send({status:"Error",message:"data_edad",error:"Debes colocar una edad entre 21 y 100"}); 
    const genero = req.body.genero;
    if(genero != "Masculino" && genero != "Femenino") return res.status(200).send({status:"Error",message:"data_genero",error:"Debes elegir un género"}); 
    const estatura = req.body.estatura;
    if(!Number(estatura) || (estatura < 100 || estatura > 220)) return res.status(200).send({status:"Error",message:"data_estatura",error:"La estatura debe estar entre 100 y 220cm"}); 
    const peso = req.body.peso;
    if(!Number(peso) || (peso < 50 || peso > 140)) return res.status(200).send({status:"Error",message:"data_peso",error:"El peso debe estar entre 50 y 140kg"}); 
    var raza = req.body.raza;
    if(!razas.includes(raza)) return res.status(200).send({status:"Error",message:"data_raza",error:"Debes elegir una raza principal"}); 
    var hibrido = req.body.hibrido;
    if(hibrido.includes("!")) hibrido = "";
    if(!razas.includes(hibrido) && hibrido != "") return res.status(200).send({status:"Error",message:"data_hibrido",error:"Hibrido no válido"}); 
    var maldicion = req.body.maldicion;
    if(maldicion == "!") maldicion = "";
    if(!maldiciones.includes(maldicion)) return res.status(200).send({status:"Error",message:"data_maldicion",error:"Maldición no válida"}); 
    const dios = req.body.dios;
    if(dios == "!") dios = "";
    if(!dioses.includes(dios) || (dios == "" && maldicion != "Sin alma")) return res.status(200).send({status:"Error",message:"data_dios",error:"Debes elegir un dios"}); 
    const profesion = req.body.profesion;
    if(!profesiones.includes(profesion)) return res.status(200).send({status:"Error",message:"data_profesion",error:"Debes elegir una profesión inicial"}); 
    const dones = req.body.dones;
    if(dones != "") {
        db.get("SELECT * FROM `Dones` WHERE `name`=?", [dones], (err, row) => {
            if(err || row == undefined) return res.status(200).send({status:"Error",message:"data_dones",error:"Debes elegir un don"});
        });
    } else return res.status(200).send({status:"Error",message:"data_dones"});
    const stat_mejorada = req.body.stat_mejorada;
    if(!estadisticas.includes(stat_mejorada)) return res.status(200).send({status:"Error",message:"data_stat_mejorada",error:"Debes elegir una estadística mejorada"}); 
    const in_agilidad = Number(req.body.in_agilidad);
    const ra_agilidad = Number(req.body.ra_agilidad);
    if (!isNaN(in_agilidad) && !isNaN(ra_agilidad)) {
        if(in_agilidad + ra_agilidad > 5) return res.status(200).send({status:"Error",message:"in_agilidad",error:"La estadística no debe superar el 5 total"});
    } else return res.status(200).send({status:"Error",message:"in_agilidad",error:"Datos ingresados no válidos"});
    const in_carisma = Number(req.body.in_carisma);
    const ra_carisma = Number(req.body.ra_carisma);
    if (!isNaN(in_carisma) && !isNaN(ra_carisma)) {
        if(Number(in_carisma) + Number(ra_carisma) > 5) return res.status(200).send({status:"Error",message:"in_carisma",error:"La estadística no debe superar el 5 total"});
    } else return res.status(200).send({status:"Error",message:"in_carisma",error:"Datos ingresados no válidos"});
    const in_puntería = Number(req.body.in_puntería);
    const ra_puntería = Number(req.body.ra_puntería);
    if (!isNaN(in_puntería) && !isNaN(ra_puntería)) {
        if(Number(in_puntería) + Number(ra_puntería) > 5) return res.status(200).send({status:"Error",message:"in_puntería",error:"La estadística no debe superar el 5 total"});
    } else return res.status(200).send({status:"Error",message:"in_puntería",error:"Datos ingresados no válidos"});
    const in_fuerza = Number(req.body.in_fuerza);
    const ra_fuerza = Number(req.body.ra_fuerza);
    if (!isNaN(in_fuerza) && !isNaN(ra_fuerza)) {
        if(Number(in_fuerza) + Number(ra_fuerza) > 5) return res.status(200).send({status:"Error",message:"in_fuerza",error:"La estadística no debe superar el 5 total"});
    } else return res.status(200).send({status:"Error",message:"in_fuerza",error:"Datos ingresados no válidos"});
    const in_inteligencia = Number(req.body.in_inteligencia);
    const ra_inteligencia = Number(req.body.ra_inteligencia);
    if (!isNaN(in_inteligencia) && !isNaN(ra_inteligencia)) {
        if(Number(in_inteligencia) + Number(ra_inteligencia) > 5) return res.status(200).send({status:"Error",message:"in_inteligencia",error:"La estadística no debe superar el 5 total"});
    } else return res.status(200).send({status:"Error",message:"in_inteligencia",error:"Datos ingresados no válidos"});
    const in_percepción = Number(req.body.in_percepción);
    const ra_percepción = Number(req.body.ra_percepción);
    if (!isNaN(in_percepción) && !isNaN(ra_percepción)) {
        if(Number(in_percepción) + Number(ra_percepción) > 5) return res.status(200).send({status:"Error",message:"in_percepción",error:"La estadística no debe superar el 5 total"});
    } else return res.status(200).send({status:"Error",message:"in_percepción",error:"Datos ingresados no válidos"});
    const in_resistencia = Number(req.body.in_resistencia);
    const ra_resistencia = Number(req.body.ra_resistencia);
    if (!isNaN(in_resistencia) && !isNaN(ra_resistencia)) {
        if(Number(in_resistencia) + Number(ra_resistencia) > 5) return res.status(200).send({status:"Error",message:"in_resistencia",error:"La estadística no debe superar el 5 total"});
    } else return res.status(200).send({status:"Error",message:"in_resistencia",error:"Datos ingresados no válidos"});
    const ra_suerte = Number(req.body.ra_suerte);
    if (!isNaN(ra_suerte)) {
        if(Number(ra_suerte) > 1) return res.status(200).send({status:"Error",message:"ra_suerte",error:"La estadística no debe superar el 1 total"});
    } else return res.status(200).send({status:"Error",message:"ra_suerte",error:"Datos ingresados no válidos"});
    if((in_agilidad + in_carisma + in_fuerza + in_inteligencia + in_percepción + in_puntería + in_resistencia) > 15) {
        return res.status(200).send({status:"Error",message:"ra_suerte",error:"Has distribuido mas de 15 puntos, intentalo de nuevo"});
    }
    if((ra_agilidad + ra_carisma + ra_fuerza + ra_inteligencia + ra_percepción + ra_puntería + ra_resistencia + ra_suerte) > 1) {
        return res.status(200).send({status:"Error",message:"ra_suerte",error:"Puntos de raza establecidos de forma incorrecta, reinicia, y, si el problema persiste, contacta a un administrador"});
    }
    const arma = req.body.arma;
    if(arma != "") {
        db.get("SELECT * FROM `ArmasIniciales` WHERE `name`=?", [arma], (err, row) => {
            if(err || row == undefined) return res.status(200).send({status:"Error",message:"data_arma",error:"Debes elegir un arma inicial"});
        })
    } else return res.status(200).send({status:"Error",message:"data_arma"});
    const medicina = req.body.medicina;
    if(medicina != "") {
        db.get("SELECT * FROM `Objetos` WHERE `name`=?", [medicina], (err, row) => {
            if(err || row == undefined) return res.status(200).send({status:"Error",message:"data_medicina",error:"Debes elegir una medicina inicial"});
        }) 
    }else return res.status(200).send({status:"Error",message:"data_medicina"});
    const dinero = req.body.dinero;
    if(!divisas.includes("dinero") || dinero == "") return res.status(200).send({status:"Error",message:"data_dinero",error:"Debes elegir una divisa inicial"});  
    
    
    return res.status(200).send({status:"ok", message:"Completado"})
    /*const usuario = db.get("SELECT * FROM `Jugadores` WHERE `name`=?", [user], (err,row) => {
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
                        
                    } else return res.status(200).send({status:"Error", message:"Datos incorrectos"});
                })();
            }
            catch(err) {
                console.error(err);
                return res.status(500).send({ status: "Error", message: "Error al procesar la contraseña" });
            }
            
        } else return res.status(200).send({status:"Error", message:"Datos incorrectos"});
    });*/
}

export const methods = {
    datos,
    crearpersonaje
}