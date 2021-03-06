const express = require("express");
const mongoose = require("mongoose");
const session = require("express-session");
const passport = require("passport");
const passportLocalMongoose = require("passport-local-mongoose");
const router = express.Router();
const User = require("../models/User");

router.get("/", async (req, res) => await res.render("register"));

router.post("/", (req, res) => {
  try {
    User.register(
      {
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        username: req.body.username,
        active: false,
      },
      req.body.password,
      function (err, user) {
        if (err) {
          console.log(err);
        } else {
          //Refer to passport local docs.
          //If Auth is successful, req.user contains user. 
          passport.authenticate("local", {
            successRedirect: "/",
          })(req, res);
        }
      }
    );
  } catch (error) {
    console.log(error);
  }
});

module.exports = router;
