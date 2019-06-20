require('dotenv').config()
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const session = require('express-session');
const passport = require('passport');
const passportLocalMongoose = require('passport-local-mongoose')

const app = express();

//This allows access to the css files.
app.use(express.static("public"));
//This allows access to the form in the ejs files, allowing us to pull data from what users type.
app.use(bodyParser.urlencoded({
  extended: true
}));
app.set('view engine', 'ejs');

//express-session goes before the mongoose connection string
app.use(session({
  secret: process.env.CLIENT_SECRET,
  resave: false,
  saveUninitialized: false
}));

//Because this is an express based application, passport.initialize is used to initialize passport. 
app.use(passport.initialize());
//Because we will be using persistent logins, passport.session is called. This must be the order to call initialize and session. 
app.use(passport.session());

mongoose.connect('mongodb://localhost/blogDB', {
  useNewUrlParser: true
})

//This tests whether or not the mongoose db connects properly.
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () {
  console.log("We are connected to the database!")
});

var blogSchema = new mongoose.Schema({
  username: String,
  password: String,
  blogPost: [{
    title: String,
    content: String
  }]
})

//This is what hashes and salts the passwords. 
blogSchema.plugin(passportLocalMongoose);

var User = mongoose.model("User", blogSchema);

var vBlog = new User({
  username: "lamnbda@1.com"
});

passport.use(User.createStrategy());

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.get("/", (req, res) => res.render("home"));

app.route("/login")
  .get((req, res) => res.render("login"))

  .post((req, res) => {
    const user = new User({
      username: req.body.username,
      password: req.body.password
    });

    req.login(user, function (err) {
      if (err) {
        console.log(err);
        res.redirect('/login');
      } else {
        passport.authenticate('local')(req, res, function () {
          res.redirect('/')
        })
      }
    })
  });

app.route("/register")
  .get((req, res) => res.render("register"))

  .post((req, res) => {
    User.register({
      username: req.body.username,
      active: false
    }, req.body.password, function (err, user) {
      if (err) {
        console.log(err);
      } else {
        passport.authenticate('local')(req, res, function () {
          res.redirect("/");
        })
      }
    })
  });




app.listen(3000, () => console.log(`The server is now online`));