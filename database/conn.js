var mysql = require("mysql")
require('dotenv').config();

var conn = mysql.createConnection({
    host: process.env.HOST_NAME,
    user: process.env.HOST_USER,
    password: process.env.HOST_PASSWORD,
    database: process.env.DB_NAME
})

conn.connect((err) => {
    if (err) throw err;
    console.log("Database Connected...")
})

module.exports = conn;