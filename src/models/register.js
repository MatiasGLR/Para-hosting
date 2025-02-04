const db = require('../app');

const create = (name, pass, callback) => {
    const sql = `INSERT INTO Jugadores (name, pass) VALUES (?, ?)`
    db.run(sql, [name,pass], function(error) {
        if (error) return callback(error);
        callback(null, this.lastID);
    })
}

module.exports = {
    create
}