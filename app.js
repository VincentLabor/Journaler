require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const session = require("express-session");
const passport = require("passport"),
  LocalStrategy = require("passport-local").Strategy;
const user = require("./models/User");
const Post = require("./models/Post");
const mobileMenu = require("./src/Components/mobileMenu");
const path = require("path");

const app = express();

//This allows access to the css files.
app.use(express.static("public"));
app.use(express.static(path.join(__dirname, "src")));
//This allows access to the form in the ejs files, allowing us to pull data from what users type.
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);
app.set("view engine", "ejs");

//express-session goes before the mongoose connection string
app.use(
  session({
    secret: process.env.CLIENT_SECRET,
    resave: false,
    saveUninitialized: false,
    
  })
);

//Because this is an express based application, passport.initialize is used to initialize passport.
app.use(passport.initialize());
//Because we will be using persistent logins, passport.session is called. This must be the order to call initialize and session.
app.use(passport.session());

// try {
//   mongoose.connect("mongodb://localhost/blogDB", {
//   useNewUrlParser: true,
//   useUnifiedTopology: true
// });
// } catch (error) {
//   console.log(error.message)
// }

try {
  mongoose.connect("mongodb+srv://AdminUser1:dEW73Xv2HxaxM1v1@journaler.naatq.mongodb.net/Journaler?retryWrites=true&w=majority", {
  useNewUrlParser: true,
  useUnifiedTopology: true
});
} catch (error) {
  console.log(error.message)
}

//This tests whether or not the mongoose db connects properly.
var db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
  console.log("The database is now online.");
});

passport.use(user.createStrategy());
passport.serializeUser(user.serializeUser());
passport.deserializeUser(user.deserializeUser());

app.use("/api/register", require("./routes/register"));
app.use("/api/auth", require("./routes/auth"));
app.use("/api/userPost", require("./routes/userPost"));
app.use((req, res, next) => {
  res.locals.currentUser = req.user;
  next();
});
// app.use('api/mobileMenu', require("./routes/mobileMenu"))

// mobileMenu();

app.get("/", async (req, res) => {
  await Post.find({}, (err, posts) => {
    res.render("home", {
      //I have no idea what the posts is here.
      //Guessing all of the posts of the Post model.
      posts,
      currentUser: req.user,
    });
  });
});

app.listen(3000, () => console.log(`The server is now online`));
