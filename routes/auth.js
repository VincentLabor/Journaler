const express = require("express");
const mongoose = require("mongoose");
const session = require("express-session");
const passport = require("passport");
const passportLocalMongoose = require("passport-local-mongoose");
const router = express.Router();



router.post("/", async (req,res)=> {
    req.user
})

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
