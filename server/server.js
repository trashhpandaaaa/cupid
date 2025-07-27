// main server logic

const express = require("express");
const app = express();

require("dotenv").config();

const port = process.env.PORT

app.get("/", (req, res) => {
    res.send("Hello");
});

app.listen(port, () => {
    console.log(`Listening to the port: ${port}`); 
});
