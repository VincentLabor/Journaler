const express = require("express");
const mongoose = require("mongoose");
const session = require("express-session");
const passport = require('passport')
  , LocalStrategy = require('passport-local').Strategy;
const passportLocalMongoose = require("passport-local-mongoose");
const router = express.Router();
const User = require('../models/User');

// passport.use(new LocalStrategy(
//   function(username, password, done) {
//     User.findOne({ username: username }, function (err, user) {
//       if (err) { return done(err); }
//       if (!user) {
//         return done(null, false, { message: 'Incorrect username.' });
//       }
//       if (!user.validPassword(password)) {
//         return done(null, false, { message: 'Incorrect password.' });
//       }
//       return done(null, user);
//     });
//   }
// ));

router.get("/", async (req, res) => {
  res.render("login");
});

router.get("/", async (req,res)=>{
 const currentUser = User.findOne({firstName: req.user_id})
})

router.post("/", (req, res) => {
  const user = new User({
    username: req.body.username,
    password: req.body.password,
  });
  req.login(user, function (err) {
    if (err) {
      console.log(err);
      res.redirect("/api/auth");
      //Need to display an error today. 
    } else {
      //Refer to passport local for documentation.
      //If Auth is successful, req.user contains user. 
      passport.authenticate('local', {
        successRedirect: "/"
      })(req,res);
      
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
