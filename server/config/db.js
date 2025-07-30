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

async function createUsersTable() {
  const createTableQuery = `
    CREATE TABLE IF NOT EXISTS users (
      id INT AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(100) NOT NULL,
      email VARCHAR(100) NOT NULL UNIQUE,
      password VARCHAR(255) NOT NULL,
      age INT,
      gender ENUM('male', 'female', 'other'),
      city VARCHAR(100),
      hobbies TEXT,
      preferences TEXT,
      bio TEXT,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `;

  const userLikes = `CREATE TABLE user_likes (
      id INT PRIMARY KEY AUTO_INCREMENT,
      liker_id INT NOT NULL,
      liked_id INT NOT NULL,
      liked_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  
      FOREIGN KEY (liker_id) REFERENCES users(id) ON DELETE CASCADE,
      FOREIGN KEY (liked_id) REFERENCES users(id) ON DELETE CASCADE,
      
      UNIQUE (liker_id, liked_id) -- prevent duplicate likes
    );`;

    const message = `CREATE TABLE messages (
      id INT AUTO_INCREMENT PRIMARY KEY,
      sender_id INT NOT NULL,
      receiver_id INT NOT NULL,
      message TEXT NOT NULL,
      timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (sender_id) REFERENCES users(id) ON DELETE CASCADE,
      FOREIGN KEY (receiver_id) REFERENCES users(id) ON DELETE CASCADE
    );`;

  try {
    await connection.execute(createTableQuery);
    await connection.execute(userLikes);
    await connection.execute(message);
    console.log("Users table is ready.");
  } catch (error) {
    console.error("Error creating users table:", error.message);
  }
}

async function createProfileInfoTable() {
  const createTableQuery = `
    CREATE TABLE IF NOT EXISTS profile_info (
      id INT AUTO_INCREMENT PRIMARY KEY,
      user_id INT NOT NULL,
      photo_url VARCHAR(255),
      height VARCHAR(20),
      education VARCHAR(100),
      occupation VARCHAR(100),
      relationship_status VARCHAR(50),
      looking_for VARCHAR(100),
      about_me TEXT,
      location VARCHAR(100),
      matches INT DEFAULT 0,
      likes INT DEFAULT 0,
      profile_complete_percentage INT DEFAULT 0,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      CONSTRAINT fk_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    );
  `;

  try {
    await connection.execute(createTableQuery);
    console.log("Profile info table is ready.");
  } catch (error) {
    console.error("Error creating profile_info table:", error.message);
  }
}

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
createUsersTable();
createProfileInfoTable();

module.exports = connection;
