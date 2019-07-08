require('dotenv').config()
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const session = require('express-session');
const passport = require('passport');
const passportLocalMongoose = require('passport-local-mongoose')
const timestampPlugin = require('./timestamp'); //This is a module I made to allow the database to save the current date. 


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

var userSchema = new mongoose.Schema({
  firstName: String,
  lastName: String,
  username: String,
  password: String,
  posts: [{
    title: String,
    ref: String
  }]
})

//This is what hashes and salts the passwords. 
userSchema.plugin(passportLocalMongoose);

var User = mongoose.model("User", userSchema);

var postSchema = new mongoose.Schema({
  title: String,
  content: String,
  user: String,
  firstName: String,
  createdAt: {
    type: Date
  }
});

postSchema.plugin(timestampPlugin); //This plugin allows the database to get the date at the time of creating a post. This should be implemented after declaring the associated schema.

let Post = mongoose.model('Post', postSchema);

passport.use(User.createStrategy());

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.get("/", function (req, res) {

  Post.find({}, function (err, posts) {
    res.render("home", {
      posts: posts
    });
  })
});

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
      firstName: req.body.firstName,
      lastName: req.body.lastName,
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

  app.use(function loggedIn(req,res,next){
    console.log(req.user);
    if(req.user){
        next();
    } else {
        res.redirect('/login');
    }
})

app.route('/posts')
  .get((req, res) => {
    res.render('posts')
  })

  .post((req, res, next) => {
    const title = req.body.title;
    const content = req.body.content;
    const user = req.user;
    let today = new Date();
    let todaysDate = (today.getMonth() + 1)

    console.log(user);
    const blogPost = new Post({
      title: title,
      content: content,
      user: user.username,
      firstName: user.firstName,
      date: todaysDate
    })

    blogPost.save();
    res.redirect("/")
  });



app.listen(3000, () => console.log(`The server is now online`));