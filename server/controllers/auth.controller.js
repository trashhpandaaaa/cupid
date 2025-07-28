// signup & login logic

const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const {registrationSchema, loginSchema} = require("../schema/schema.js");
const connection = require("../config/db.js");

require("dotenv").config();

const signup = async (req, res) => {
    try {
        const parsedData = registrationSchema.safeParse(req.body);
        if (!parsedData.success) {
            return res.status(400).json({
                message: "Validation failed",
                errors: parsedData.error.format()
            });
        }
        
        const {name, email, password, age, gender, city } = parsedData.data;        
        
        const [existing] = await connection.execute(
            "SELECT 1 FROM users WHERE email = ? LIMIT 1", 
            [email]
        );

        if(existing.length > 0) {
            return res.status(409).json({"message": "User Already Exists"});
        }
        
        const salt = await bcrypt.genSalt(10);
        const hashPassword = await bcrypt.hash(password, salt);
    
        await connection.execute(      
            "INSERT INTO users (name, email, password, age, gender, city) VALUES (?, ?, ?, ?, ?, ?)",
            [name, email, hashPassword, age, gender, city]
        );
        
        return res.status(201).json({"message": "SignUp Successful"});
    } catch(err) {
        console.log(err);
        return res.status(500).json({
            "message": "Internal Server Error",
            "error": err.message
        })
    }
}

const signin = async (req, res) => {
    try {
        const parsedData = loginSchema.safeParse(req.body);
        if(!parsedData.success) return res.status(400).json({"message": "Validation Failed"});
        
        const {email, password} = parsedData.data;
        const [user] = await connection.execute(
            "SELECT * FROM users WHERE email = ?",
            [email]
        );

        if(user.length <= 0) return res.status(404).json({"message": "User Not Found"});
    
        const validPassword = await bcrypt.compare(password, user[0].password);
        if(!validPassword) return res.status(401).json({"message": "Wrong Password"});
        
        const SECRET_KEY = process.env.SECRET_KEY;
        const token = jwt.sign({id: user[0].id}, SECRET_KEY);
        
        return res.status(200).json({
            "message": "Login Successful",
            "token": token
        });
    } catch(err) {
        console.log(err);
        return res.status(500).json({
            "message": "Internal Server Error",
            "error": err.message
        })
    }
}

module.exports = {signup, signin};
