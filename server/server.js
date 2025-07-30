// main server logic
const verifytoken = require("./middleware/auth.middleware.js");
const express = require("express");
const { createServer } = require("node:http");
const Server = require("socket.io");
const { join } = require('node:path');
const app = express();
const server = createServer(app);

const {signup, signin} = require("./controllers/auth.controller.js");
const {getUsers, getProfile, getUsersSwipe, matchUsers, allUsers, setProfile} = require("./controllers/user.controller.js");

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
app.post("/matchuser", verifytoken, matchUsers);
app.get("/getalluser", verifytoken, allUsers);
app.post("/setprofile", verifytoken, setProfile);
app.post("/test", (req, res) => {
    res.status(200).json({ message: "POST /test works", body: req.body });
});

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../client/pages/messages.html'));
});

server.listen(port, () => {
    console.log(`Listening to the port: ${port}`); 
});
