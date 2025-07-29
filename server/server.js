// main server logic
const verifytoken = require("./middleware/auth.middleware.js");
const express = require("express");
const app = express();

const {signup, signin} = require("./controllers/auth.controller.js");

require("dotenv").config();

const port = process.env.PORT

const cors = require('cors');
app.use(cors());
app.use(express.json());

app.post("/signup", signup);
app.post("/signin", signin); 
app.get("/",verifytoken,async(req, res)=>{
    res.status(200).send("Hello");
});
app.listen(port, () => {
    console.log(`Listening to the port: ${port}`); 
});
