const db = require('sqlite3');

const model = require('../models/register');

const create = (req, res) => {
    res.render("/create");
}

const store = (req, res) => {
    const {name, pass} = req.body;

    model.create(name, pass, (error,id) => {
        if(error) return console.error(error)
        console.log(id)
    });

    res.redirect("/")
}