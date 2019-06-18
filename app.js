const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");

const app = express();
app.set('view engine', 'ejs');

app.use(express.static("public"));

app.get("/", (req,res) => res.render("home"));

app.get("/login", (req,res)=>res.render("login"));

app.get("/register", (req,res)=> res.render("register"))

app.listen(3000, ()=> console.log(`The server is now online`));