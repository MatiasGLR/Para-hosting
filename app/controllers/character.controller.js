import db from './database.js';

const tablas = ["ArmasIniciales", "Dones", "Objetos", "Habilidades", "Jugadores", "NPCs", "Bestiario"];
const categorias = ["Medicinas"];

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

}

export const methods = {
    datos,
    crearpersonaje
}