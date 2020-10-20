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

module.exports = router;
