const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
var mongoose = require("mongoose");

const app = express();
app.use(express.static("public"));

var urlencodedParser = bodyParser.urlencoded({ extended: true })

mongoose.connect('mongodb://localhost/blogDB', {useNewUrlParser: true})

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  console.log("We are connected to the database!")
});

app.set('view engine', 'ejs');

app.get("/", (req,res) => res.render("home"));

app.get("/login", (req,res)=>res.render("login"));

app.get("/register", (req,res)=> res.render("register"))

app.listen(3000, ()=> console.log(`The server is now online`));