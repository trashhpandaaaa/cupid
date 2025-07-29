// main server logic
const verifytoken = require("./middleware/auth.middleware.js");
const express = require("express");
const app = express();

const {signup, signin} = require("./controllers/auth.controller.js");
const {getUsers, getProfile, getUsersSwipe} = require("./controllers/user.controller.js");

require("dotenv").config();

const port = process.env.PORT

const cors = require('cors');
app.use(cors());
app.use(express.json());

app.post("/signup", signup);
app.post("/signin", signin); 
app.post("/getuser", verifytoken, getUsers);
app.post("/getprofile", verifytoken, getProfile);
app.get("/getuserswipe", verifytoken, getUsersSwipe);
app.post("/test", (req, res) => {
    res.status(200).json({ message: "POST /test works", body: req.body });
});
app.get("/", async(req, res)=>{
    res.status(200).send("Hello");
});
app.listen(port, () => {
    console.log(`Listening to the port: ${port}`); 
});
