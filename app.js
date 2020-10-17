require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const session = require("express-session");
const passport = require("passport");
const passportLocalMongoose = require("passport-local-mongoose");
const timestampPlugin = require("./timestamp"); //This is a module I made to allow the database to save the current date.
const user = require("./models/User");

const app = express();

//This allows access to the css files.
app.use(express.static("public"));
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

mongoose.connect("mongodb://localhost/blogDB", {
  useNewUrlParser: true,
});

//This tests whether or not the mongoose db connects properly.
var db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", function () {
  console.log("The database is not online.");
});

//This is what hashes and salts the passwords.


// var User = mongoose.model("User", userSchema);

var postSchema = new mongoose.Schema({
  title: String,
  content: String,
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  firstName: String,
  createdAt: {
    type: String,
  },
});

postSchema.plugin(timestampPlugin); //This plugin allows the database to get the date at the time of creating a post. This should be implemented after declaring the associated schema.

let Post = mongoose.model("Post", postSchema);

passport.use(user.createStrategy());

passport.serializeUser(user.serializeUser());
passport.deserializeUser(user.deserializeUser());

app.get("/", function (req, res) {
  Post.find({}, function (err, posts) {
    res.render("home", {
      posts: posts,
    });
  });
});

app.get("/posts/:postId", (req, res) => {
  //Basically this will begin to take in inputs and the inputs can be found in req.params. You must create the route parameter
  //Then you can set the parameter to a variable and query the variable when looking for something
  const requestedPostID = req.params.postId;
  Post.findOne({ _id: requestedPostID }, (err, post) => {
    //This will look for things that match the _id with requestedPostID
    if (err) {
      console.log(err);
    } else {
      res.render("posts", {
        title: post.title,
        content: post.content,
      });
    }
  });
});



app.use("/api/register", require("./routes/register"));
 app.use("/api/auth", require("./routes/auth"));

//Next is middleware that checks whether or not if the user is logged in.
// If not, they are redirected to the login page.

// app.use(function loggedIn(req, res, next) {
//   if (req.user) {
//     //If the user is logged in, move onto the next.
//     next();
//   } else {
//     res.redirect("/login");
//   }
// });

app
  .route("/post")
  .get((req, res) => {
    res.render("post");
  })

  .post((req, res, next) => {
    const title = req.body.title;
    const content = req.body.content;
    const user = req.user;
    //Mongoose saves date in an awkward unchangeable format so instead of saving the schema as Date, I saved it as String.
    //So since the format is string, all I have to do is get the date in Javascript and save to the database and now I can control the format while getting the date.
    let date = new Date();
    let month = date.getMonth();
    let day = date.getDate();
    let year = date.getFullYear();
    let todaysDate = month + 1 + "/" + day + "/" + year;
    const blogPost = new Post({
      title: title,
      content: content,
      user: user._id,
      firstName: user.firstName,
      createdAt: todaysDate,
    });

    blogPost.save();
    res.redirect("/");
  });

app.listen(3000, () => console.log(`The server is now online`));
