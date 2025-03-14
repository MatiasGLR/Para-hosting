import sqlite3 from 'sqlite3';

import path from 'path';
import { fileURLToPath } from 'url';
const __dirname = path.dirname(fileURLToPath(import.meta.url));

//const db = new sqlite3.Database(path.resolve(__dirname, '../files/db/enforth.db'), (err) => {
const db = new sqlite3.Database('/home/codespace/sqlite-db/enforth.db', (err) => {
    if (err) {
        console.error("Error al conectar con la base de datos:", err.message);
    } else {
        console.log("Conectado correctamente");
    }
});

export default db;