//mysql connection

const mysql = require("mysql2/promise");
require("dotenv").config();

const connection = mysql.createPool({
    host: process.env.HOST,
    user: "root",
    password: process.env.PASSWORD,
    database: process.env.DATABASE,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

async function testConnection() {
    try{
        const conn = await connection.getConnection();
        await conn.ping();
        console.log("Database Sucessfully connected");
        conn.release();
    } catch(error) {
        console.error('Error connecting to the database:', error.message);
        process.exit(1);  
    }
}

testConnection();

module.exports = connection;
