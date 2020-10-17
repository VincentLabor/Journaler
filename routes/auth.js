const express = require("express");
const mongoose = require("mongoose");
const session = require("express-session");
const passport = require("passport");
const passportLocalMongoose = require("passport-local-mongoose");
const router = express.Router();
const User = require('../models/User');

router.get("/", async (req, res) => {
  res.render("login");
});

router.post("/", (req, res) => {
  const user = new User({
    username: req.body.username,
    password: req.body.password,
  });
  req.login(user, function (err) {
    if (err) {
      console.log(err);
      res.redirect("/");
    } else {
      passport.authenticate("local")(req, res, function () {
        res.redirect("/");
      });
    }
  });
});
// app
//   .route("/login")
//   .get((req, res) => res.render("login"))

//   .post((req, res) => {
//     const user = new User({
//       username: req.body.username,
//       password: req.body.password,
//     });

//     req.login(user, function (err) {
//       if (err) {
//         console.log(err);
//         res.redirect("/");
//       } else {
//         passport.authenticate("local")(req, res, function () {
//           res.redirect("/");
//         });
//       }
//     });
//   });

//I dont know what this does. 
// router.post("/", async (req, res, next) => {
//     try {
//       if (req.user) {
//         await next();
//       } else {
//         res.redirect("/");
//       }
//     } catch (error) {
//       console.log(error);
//     }
//   });

//Next is middleware that checks whether or not if the user is logged in.
//If not, they are redirected to the login page.
// app.use(function loggedIn(req, res, next) {
//   if (req.user) {
//     //If the user is logged in, move onto the next.
//     next();
//   } else {
//     res.redirect("/login");
//   }
// });

module.exports = router;
