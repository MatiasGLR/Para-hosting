import db from './database.js';
import {methods as authorization} from "../middlewares/authorization.js";
import cookieParser from 'cookie-parser';
import { Console } from 'console';

const tablas = ["Dones", "Objetos", "Habilidades", "Jugadores", "NPCs", "Bestiario"];
const razas = ["Humano", "Orco", "Shira", "Fjereo", "Lhanie", "Turbe", "Sarka", "Demonio", "Automata", "Draieach", "Benirie", "Naturis"];
const categorias = ["Medicinas", "Pociones", "Armas"];
const maldiciones = ["", "Bestia", "Vampiro", "Sin alma"];
const dioses = ["", "Sol", "Luna", "Combate", "Miseria", "Muerte", "Barlghon", "Justicia", "Naturaleza"];
const profesiones = ["Alquimista", "Armero", "Bardo", "Cantinero", "Carpintero", "Cazador", "Domador", "Explorador", "Granjero", "Guardia", "Herrero", "Ingeniero", "Joyero", "Ladrón", "Médico", "Mercader", "Mercenario", "Minero", "Talabartero"];
const estadisticas = ["Agilidad", "Carisma", "Puntería", "Fuerza", "Inteligencia", "Percepción", "Resistencia", "Suerte"];
const divisas = ["Qurs", "Kalis", "Sarix"];
const lista_idiomas = ["Emión", "Esder", "Koi", "Ledusval", "Liven", "Naturio", "Revent", "Selga", "Terak", "Prix"];
const conocimientos_generales = ["Agricultura","Alquimia","Armamentística","Cacería","Carpintería","Cocina","Herbolaria","Herrería","Ingeniería","Joyería","Manualidades","Medicina","Montura","Música","Talabartería"];
const conocimientos_basicos = ["Arcana","Electricidad","Fuego","Hielo"];
const conocimientos_semiavanzados = ["Alma","Luz","Oscuridad","Veneno"];
const conocimientos_avanzados = ["Divina","Fe","Mental","Naturaleza","Sangre","Tiempo","Viento","Agua"];
const regiones = ["abbasel","foreignfrontier","redain","fostade","amandia","suredozo","loux","skyslay"];
const ciudades_abbasel = ["Shiruzful","Hashire", "Teran"];

const caracteres_prohibidos = ["'", "/", "=", ",", ".", "`", "´", "_", "-"];

function datos(req, res) {
    const dones_array = [];
    if (!req.body.tabla) return res.status(400).send({ status: "Error", message: "Los campos están incompletos" });
    if (!tablas.includes(req.body.tabla)) return res.status(400).send({ status: "Error", message: "La tabla no existe" });
    let query;
    if (!req.body.categoria) query = "SELECT * FROM " + req.body.tabla;
    else {
        if (!categorias.includes(req.body.categoria)) return res.status(400).send({ status: "Error", message: "La categoría no existe" });
        query = "SELECT name,descripcion FROM " + req.body.tabla + " WHERE `categoria`='" + req.body.categoria + "'";
    }
    const dones = db.all(query, async (err, rows) => {
        if (err) return console.error(err);

        res.json(rows);
    });
}

const verificarDon_nose = (dones) => {
    return new Promise((resolve, reject) => {
        db.get("SELECT * FROM `Dones` WHERE `name`=?", [dones], (err, row) => {
            if (err || row == undefined) {
                reject({ status: "Error", message: "data_dones", error: "Debes elegir un don válido" });
            } else {
                resolve(row);
            }
        });
    });
}

const verificarDon = async (dones) => {
    try {
        const resultado = await verificarDon_nose(dones);
        return resultado;
    } catch (error) {
        console.error("Error al verificar el don:", error);
    }
}

const verificarMedicina = async (dones) => {
    try {
        const resultado = await verificarArma_nose(dones);
        return resultado;
    } catch (error) {
        console.error("Error al verificar la medicina:", error);
    }
}

const verificarArma = async (dones) => {
    try {
        const resultado = await verificarMedicina_nose(dones);
        return resultado;
    } catch (error) {
        console.error("Error al verificar el arma:", error);
    }
}

const verificarArma_nose = (arma) => {
    return new Promise((resolve, reject) => {
        db.get("SELECT * FROM Objetos WHERE `name`=?", [arma], (err, row) => {
            if (err || row == undefined) {
                reject({ status: "Error", message: "data_arma", error: "Debes elegir un arma inicial válida" });
            } else {
                resolve(row);
            }
        });
    });
}

const verificarMedicina_nose = (medicina) => {
    return new Promise((resolve, reject) => {
        db.get("SELECT * FROM `Objetos` WHERE `name`=?", [medicina], (err, row) => {
            if (err || row == undefined) {
                reject({ status: "Error", message: "data_medicina", error: "Debes elegir una medicina inicial válida" });
            } else {
                resolve(row);
            }
        });
    });
}

const verificarPocion = (pocion) => {
    return new Promise((resolve, reject) => {
        db.get("SELECT * FROM `Objetos` WHERE `name`=?", [pocion], (err, row) => {
            if (err || row == undefined) {
                reject({ status: "Error", message: "data_pocion", error: "Debes elegir una poción inicial válida" });
            } else {
                resolve(row);
            }
        });
    });
}

const verificarPersonaje = async (personaje, jugador) => {
    return new Promise((resolve, reject) => {
        console.log("Personaje:" + personaje + ". Jugador:" + jugador);
        db.get("SELECT * FROM Personajes WHERE `jugador`=? AND `name`=?", [jugador,personaje], (err, row) => {
            if (err) {
                console.error("Error en la consulta SQL:", err); // Muestra el error de la base de datos
                reject({ status: "Error", message: "data_nombre", error: "Error al verificar el personaje en la base de datos" });
                return;
            }

            if (row) {
                console.log("Personaje encontrado:", row.jugador); // Verifica si el personaje ya existe
                reject({ status: "Error", message: "data_nombre", error: "Ya tienes un personaje con este nombre" });
            } else {
                console.log("Personaje no encontrado, puedes crear uno nuevo."); // Verifica si el personaje no existe
                resolve("Confirmado"); // Si no se encuentra el personaje, resuelve la promesa
            }
        });
    });
}

async function crearpersonaje(req, res) {
    try {
        const cookies = await authorization.transformarCookies(req.cookies);
        if(!cookies.split("; ").find(c => c.startsWith("kye="))) throw ({ status: "Error", message: "data_imagen", error: "Tu cuenta tiene un problema, vuelve a intentarlo mas tarde" });
        const jugador = await authorization.revisarCookie(cookies);
        const imagen = req.body.imagen;
        try {
            const response = await fetch(imagen, { method: "HEAD" }); // Solo obtenemos los headers
            const contentType = response.headers.get("Content-Type");
            if (!contentType || !contentType.startsWith("image/")) throw ({ status: "Error", message: "data_imagen", error: "La imagen recibida no es válida" });
        } catch (error) {
            throw ({ status: "Error", message: "data_imagen", error: "Debes colocar el link de una imagen" });
        }
        const name = req.body.name;
        if (name.length < 3 || name.length > 40) throw ({ status: "Error", message: "data_nombre", error: "El nombre debe tener entre 4 y 40 dígitos" });
        caracteres_prohibidos.forEach(caracter => {
            if (name.includes(caracter)) throw ({ status: "Error", message: "data_nombre", error: "Debes colocar un nombre válido" });
        })
        try {
            if (name != "") {
                const resultado = await verificarPersonaje(name, jugador);
                if(typeof resultado === "object") 
                    if(resultado.status && resultado.message && resultado.error) throw ({status:resultado.status, message:resultado.message, error:resultado.error});
            } else {
                throw ({ status: "Error", message: "data_nombre", error: "Debes colocar un nombre válido" });
            }
        } catch (error) {
            console.error(error)
            throw ({ status: error.error, message: error.message, error: error.error });
        }
        const edad = Number(req.body.edad);
        if (isNaN(edad) || (edad < 21 || edad > 100)) throw ({ status: "Error", message: "data_edad", error: "Debes colocar una edad entre 21 y 100" });
        const genero = req.body.genero;
        if (genero != "Masculino" && genero != "Femenino") throw ({ status: "Error", message: "data_genero", error: "Debes elegir un género" });
        const estatura = Number(req.body.estatura);
        if (isNaN(estatura) || (estatura < 100 || estatura > 220)) throw ({ status: "Error", message: "data_estatura", error: "La estatura debe estar entre 100 y 220cm" });
        const peso = req.body.peso;
        if (!Number(peso) || (peso < 50 || peso > 140)) throw ({ status: "Error", message: "data_peso", error: "El peso debe estar entre 50 y 140kg" });
        var raza = req.body.raza;
        if (!razas.includes(raza)) throw ({ status: "Error", message: "data_raza", error: "Debes elegir una raza principal" });
        var hibrido = req.body.hibrido;
        if (hibrido.includes("!")) hibrido = "";
        if (!razas.includes(hibrido) && hibrido != "") throw ({ status: "Error", message: "data_hibrido", error: "Hibrido no válido" });
        var maldicion = req.body.maldicion;
        if (maldicion == "!") maldicion = "No tienes un dios";
        if (!maldiciones.includes(maldicion)) throw ({ status: "Error", message: "data_maldicion", error: "Maldición no válida" });
        const dios = req.body.dios;
        if (dios == "!") dios = "";
        if (!dioses.includes(dios) || (dios == "" && maldicion != "Sin alma")) throw ({ status: "Error", message: "data_dios", error: "Debes elegir un dios" });
        const profesion = req.body.profesion;
        if (!profesiones.includes(profesion)) throw ({ status: "Error", message: "data_profesion", error: "Debes elegir una profesión inicial" });
        const dones = req.body.dones;
        try {
            if (dones != "") {
                await verificarDon(dones);
            } else {
                throw ({ status: "Error", message: "data_dones", error: "Debes elegir un don" });
            }
        } catch (error) {
            throw ({ status: "Error", message: "data_dones", error: "Debes elegir un don" });;
        }
        const stat_mejorada = req.body.stat_mejorada;
        if (!estadisticas.includes(stat_mejorada)) throw ({ status: "Error", message: "data_stat_mejorada", error: "Debes elegir una estadística mejorada" });
        const in_agilidad = Number(req.body.in_agilidad);
        const ra_agilidad = Number(req.body.ra_agilidad);
        if (!isNaN(in_agilidad) && !isNaN(ra_agilidad)) {
            if (in_agilidad + ra_agilidad > 5) throw ({ status: "Error", message: "in_agilidad", error: "La estadística no debe superar el 5 total" });
        } else throw ({ status: "Error", message: "in_agilidad", error: "Datos ingresados no válidos" });
        const in_carisma = Number(req.body.in_carisma);
        const ra_carisma = Number(req.body.ra_carisma);
        if (!isNaN(in_carisma) && !isNaN(ra_carisma)) {
            if (Number(in_carisma) + Number(ra_carisma) > 5) throw ({ status: "Error", message: "in_carisma", error: "La estadística no debe superar el 5 total" });
        } else throw ({ status: "Error", message: "in_carisma", error: "Datos ingresados no válidos" });
        const in_puntería = Number(req.body.in_puntería);
        const ra_puntería = Number(req.body.ra_puntería);
        if (!isNaN(in_puntería) && !isNaN(ra_puntería)) {
            if (Number(in_puntería) + Number(ra_puntería) > 5) throw ({ status: "Error", message: "in_puntería", error: "La estadística no debe superar el 5 total" });
        } else throw ({ status: "Error", message: "in_puntería", error: "Datos ingresados no válidos" });
        const in_fuerza = Number(req.body.in_fuerza);
        const ra_fuerza = Number(req.body.ra_fuerza);
        if (!isNaN(in_fuerza) && !isNaN(ra_fuerza)) {
            if (Number(in_fuerza) + Number(ra_fuerza) > 5) throw ({ status: "Error", message: "in_fuerza", error: "La estadística no debe superar el 5 total" });
        } else throw ({ status: "Error", message: "in_fuerza", error: "Datos ingresados no válidos" });
        const in_inteligencia = Number(req.body.in_inteligencia);
        const ra_inteligencia = Number(req.body.ra_inteligencia);
        if (!isNaN(in_inteligencia) && !isNaN(ra_inteligencia)) {
            if (Number(in_inteligencia) + Number(ra_inteligencia) > 5) throw ({ status: "Error", message: "in_inteligencia", error: "La estadística no debe superar el 5 total" });
        } else throw ({ status: "Error", message: "in_inteligencia", error: "Datos ingresados no válidos" });
        const in_percepción = Number(req.body.in_percepción);
        const ra_percepción = Number(req.body.ra_percepción);
        if (!isNaN(in_percepción) && !isNaN(ra_percepción)) {
            if (Number(in_percepción) + Number(ra_percepción) > 5) throw ({ status: "Error", message: "in_percepción", error: "La estadística no debe superar el 5 total" });
        } else throw ({ status: "Error", message: "in_percepción", error: "Datos ingresados no válidos" });
        const in_resistencia = Number(req.body.in_resistencia);
        const ra_resistencia = Number(req.body.ra_resistencia);
        if (!isNaN(in_resistencia) && !isNaN(ra_resistencia)) {
            if (Number(in_resistencia) + Number(ra_resistencia) > 5) throw ({ status: "Error", message: "in_resistencia", error: "La estadística no debe superar el 5 total" });
        } else throw ({ status: "Error", message: "in_resistencia", error: "Datos ingresados no válidos" });
        const ra_suerte = Number(req.body.ra_suerte);
        if (!isNaN(ra_suerte)) {
            if (Number(ra_suerte) > 1) throw ({ status: "Error", message: "ra_suerte", error: "La estadística no debe superar el 1 total" });
        } else throw ({ status: "Error", message: "ra_suerte", error: "Datos ingresados no válidos" });
        if ((in_agilidad + in_carisma + in_fuerza + in_inteligencia + in_percepción + in_puntería + in_resistencia) != 15) {
            throw ({ status: "Error", message: "ra_suerte", error: "Debes distribuir tus 15 puntos en estadística" });
        }
        if ((ra_agilidad + ra_carisma + ra_fuerza + ra_inteligencia + ra_percepción + ra_puntería + ra_resistencia + ra_suerte) > 1) {
            throw ({ status: "Error", message: "ra_suerte", error: "Puntos de raza establecidos de forma incorrecta, reinicia, y, si el problema persiste, contacta a un administrador" });
        }
        const arma = req.body.arma;
        try {
            if (arma != "") {
                await verificarArma(arma);
            } else {
                throw ({ status: "Error", message: "data_arma", error: "Debes elegir un arma inicial" });
            }
        } catch (error) {
            throw ({ status: "Error", message: "data_arma", error: "Debes elegir un arma inicial" });
        }
        const medicina = req.body.medicina;
        try {
            if (medicina != "") {
                await verificarMedicina(medicina);
            } else {
                throw ({ status: "Error", message: "data_medicina", error: "Debes elegir una medicina inicial" });
            }
        } catch (error) {
            throw ({ status: "Error", message: "data_medicina", error: "Debes elegir una medicina inicial" });
        }
        const pocion = req.body.pocion;
        try {
            if (pocion != "") {
                await verificarPocion(pocion);
            } else {
                throw ({ status: "Error", message: "data_pocion", error: "Debes elegir una pocion inicial" });
            }
        } catch (error) {
            throw ({ status: "Error", message: "data_medicina", error: "Debes elegir una medicina inicial" });
        }
        const dinero = req.body.dinero;
        if (!divisas.includes(dinero) || dinero == "") throw ({ status: "Error", message: "data_dinero", error: "Debes elegir una divisa inicial" });
        
        let datos = {
            "general": {
                "fichaversion": "1.0",
                "edad": edad,
                "genero": genero,
                "estatura": estatura,
                "peso": peso,
                "raza": raza,
                "hibrido": hibrido,
                "raza_lv": 1,
                "maldicion": {
                    "nombre": maldicion,
                    "nivel": 0
                },
                "dios": dios,
                "karmapos": 0,
                "karmaneg": 0,
                "profesion": profesion,
                "dones": {
                    "uno": dones,
                    "dos": ""
                },
                "dobleherencia": false,
                "enexploracion": false,
                "stat_mejorada": stat_mejorada,
                "clase_1": {
                    "nombre": "",
                    "nivel": 0
                },
                "clase_2": {
                    "nombre": "",
                    "nivel": 0
                },
                "clase_3": {
                    "nombre": "",
                    "nivel": 0
                }
            },
            "stats": {
                "ag": (stat_mejorada == "Agilidad") ? (in_agilidad + 1) : in_agilidad,
                "ca": (stat_mejorada == "Carisma") ? (in_carisma + 1) : in_carisma,
                "fu": (stat_mejorada == "Fuerza") ? (in_fuerza + 1) : in_fuerza,
                "in": (stat_mejorada == "Inteligencia") ? (in_inteligencia + 1) : in_inteligencia,
                "pe": (stat_mejorada == "Percepción") ? (in_percepción + 1) : in_percepción,
                "pu": (stat_mejorada == "Puntería") ? (in_puntería + 1) : in_puntería,
                "re": (stat_mejorada == "Resistencia") ? (in_resistencia + 1) : in_resistencia,
                "su": 0,
                "r_ag": ra_agilidad,
                "r_ca": ra_carisma,
                "r_fu": ra_fuerza,
                "r_in": ra_inteligencia,
                "r_pe": ra_percepción,
                "r_pu": ra_puntería,
                "r_re": ra_resistencia,
                "r_su": ra_suerte,
                "t_ag": 0,
                "t_ca": 0,
                "t_fu": 0,
                "t_in": 0,
                "t_pe": 0,
                "t_pu": 0,
                "t_re": 0,
                "t_su": 0,
                "p_ag": 0,
                "p_ca": 0,
                "p_fu": 0,
                "p_in": 0,
                "p_pe": 0,
                "p_pu": 0,
                "p_re": 0,
                "p_su": 0
            },
            "inventario": {
                "mochila_tamaño": 1,
                "tiene_riñonera": false,
                "tiene_cinturon": false,
                "fe_6": { objeto: dinero, categoría: "Dinero", cantidad: 1000, funcion: "" },
                "fe_7": { objeto: pocion, categoría: "Pociones", cantidad: 1, funcion: "" },
                "fe_8": { objeto: medicina, categoría: "Medicinas", cantidad: 1, funcion: "" },
                "arma_izq": { objeto: arma, categoría: "Armas", cantidad: 1, funcion: "{valor:1d6,efecto:'Quemadura',efecto_prob:'5%'}" } //Respetar espacios > split ' de ' (Espada larga|hierro) si tiene "con" split ' con ' (Espada larga|hierro|turmalina), 
            },
            "idiomas": {},
            "conocimientos": {},
            "profesiones": {},
            "cofrerro": {
                "slots": 0,
                "slot_1": { objeto: "", categoría: "", cantidad: 0, funcion: "" },
                "slot_2": { objeto: "", categoría: "", cantidad: 0, funcion: "" },
                "slot_3": { objeto: "", categoría: "", cantidad: 0, funcion: "" },
                "slot_4": { objeto: "", categoría: "", cantidad: 0, funcion: "" },
                "slot_5": { objeto: "", categoría: "", cantidad: 0, funcion: "" }
            },
            "carreta": {
                "mejoras": 0,
                "slot_1": { objeto: "", categoría: "", cantidad: 0, funcion: "" },
                "slot_2": { objeto: "", categoría: "", cantidad: 0, funcion: "" },
                "slot_3": { objeto: "", categoría: "", cantidad: 0, funcion: "" },
                "slot_4": { objeto: "", categoría: "", cantidad: 0, funcion: "" },
                "slot_5": { objeto: "", categoría: "", cantidad: 0, funcion: "" },
                "slot_6": { objeto: "", categoría: "", cantidad: 0, funcion: "" }
            },
            "casas": {},
            "reputacion": {},
            "mascotas": {},
            "recetas": {},
            "habilidades": {},
            "hechizos": {}
        }

        const limite_inventario = 14,
            limite_riñonera = 4,
            limite_cinturón = 3,
            limite_fundaextra = 5;

        regiones.forEach(region => {
            datos.reputacion[region] = {};
        })

        lista_idiomas.forEach(idioma => {
            datos.idiomas[idioma] = (idioma == "Revent") || (raza == "Naturis" && idioma == "Naturio") || (raza == "Demonio" && idioma == "Selga") || (dones == "Don del Traductor") ? true : false;
        })

        conocimientos_generales.forEach(con => {
            datos.conocimientos[con] = false;
        })
        conocimientos_basicos.forEach(con => {
            datos.conocimientos[con] = false;
        })
        conocimientos_semiavanzados.forEach(con => {
            datos.conocimientos[con] = false;
        })
        conocimientos_avanzados.forEach(con => {
            datos.conocimientos[con] = false;
        })

        profesiones.forEach(prof => {
            datos.profesiones[prof] = prof == profesion ? 60 : 0;
        })

        

        for (let i = 0; i < limite_inventario; i++) {
            const slot = i + 1;
            datos.inventario["inv_" + slot] = { objeto: "", categoría: "", cantidad: 0, funcion: "" };
            if (i < limite_riñonera) datos.inventario["ri_" + slot] = { objeto: "", categoría: "", cantidad: 0, funcion: "" };
            if (i < limite_cinturón) datos.inventario["ci_" + slot] = { objeto: "", categoría: "", cantidad: 0, funcion: "" };
            if (i < limite_fundaextra) datos.inventario["fe_" + slot] = { objeto: "", categoría: "", cantidad: 0, funcion: "" };
        }
        
        db.run("INSERT INTO Personajes (`jugador`,`imagen`,`name`,`datos`,`inventario`,`idiomas`,`conocimientos`,`profesiones`,`cofrerro`,`carreta`,`casas`,`reputacion`,`mascotas`,`recetas`,`habilidades`,`hechizos`) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)",
            [
                jugador, imagen, name, 
                JSON.stringify(datos.general), 
                JSON.stringify(datos.inventario), 
                JSON.stringify(datos.idiomas), 
                JSON.stringify(datos.conocimientos), 
                JSON.stringify(datos.profesiones), 
                JSON.stringify(datos.cofrerro),
                JSON.stringify(datos.carreta), 
                JSON.stringify(datos.casas), 
                JSON.stringify(datos.reputacion), 
                JSON.stringify(datos.mascotas), 
                JSON.stringify(datos.recetas), 
                JSON.stringify(datos.habilidades), 
                JSON.stringify(datos.hechizos)
            ], (err, row) => {
                if(err) throw ({ status: "Error", message: "data_imagen", error: err });
            }
        )
        const mensaje_creado = "Personaje creado: " + name;
        throw ({status:"ok", redirect:"/account", message:mensaje_creado})
    } catch (error) {
        console.error(error)
        if (error.redirect) res.status(200).send({ status: error.status, message: error.message, redirect: error.redirect });
        else if (error.status && error.message && error.error && !error.redirect) res.status(200).send({ status: error.status, message: error.message, error: error.error });
        else {
            console.log("Error no manejado:", error); // Esto te ayudará a detectar cualquier otro error no esperado
            res.status(500).send({ status: "Error", message: "Error inesperado", error: "Ha ocurrido un error inesperado" });
        }
    }

    //return res.json({status:"Error", message:"Completado"});
}

async function cargarpersonaje(req, res) {
    try {
        const cookies = authorization.transformarCookies(req.cookies);
        if(!cookies.split("; ").find(c => c.startsWith("kye="))) throw ({ status: "Error", message: "#", error: "Tu cuenta tiene un problema, vuelve a intentarlo mas tarde" });
        
        const jugador = await authorization.revisarCookie(cookies);
        const personaje = req.body.personaje;

        const rows = await new Promise((resolve, reject) => {
            db.all("SELECT * FROM Personajes WHERE `jugador`=? AND `name`=?", [jugador, personaje], (err, rows) => {
                if (err) reject({status: "Error"});
                else resolve({status: "Ok", rows: rows});
            });
        });

        return res.status(200).send({ status: rows.status, rows: rows.rows });
    } catch(error) {
        if (error.status === "Ok") return res.status(200).send({ status: error.status, rows:error.rows });
        else if (error.status === "Error" && error.message && error.error && !error.redirect) return res.status(200).send({ status: error.status, message: error.message, error: error.error });
        else {
            console.log("Error no manejado:", error);
            return res.status(500).send({ status: "Error", message: "Error inesperado", error: "Ha ocurrido un error inesperado" });
        }
    }
}

async function cargarpersonajes(req, res) {
    try {
        const cookies = await authorization.transformarCookies(req.cookies);
        if(!cookies.split("; ").find(c => c.startsWith("kye="))) throw ({ status: "Error", message: "#", error: "Tu cuenta tiene un problema, vuelve a intentarlo mas tarde" });
        const jugador = await authorization.revisarCookie(cookies);

        const rows = await new Promise((resolve, reject) => {
            db.all("SELECT * FROM Personajes WHERE `jugador`=?", [jugador], (err, rows) => {
                if (err) reject({ status: "Error" });
                else resolve({status: "Ok", rows: rows});
            });
        });

       throw (rows);
    } catch(error) {
        if (error.status === "Ok") return res.status(200).send({ status: error.status, rows:error.rows });
        else if (error.status === "Error" && error.message && error.error && !error.redirect) return res.status(200).send({ status: error.status, message: error.message, error: error.error });
        else {
            console.log("Error no manejado:", error); // Esto te ayudará a detectar cualquier otro error no esperado
            return res.status(500).send({ status: "Error", message: "Error inesperado", error: "Ha ocurrido un error inesperado" });
        }
    }
}

export const methods = {
    datos,
    crearpersonaje,
    cargarpersonajes,
    cargarpersonaje
}