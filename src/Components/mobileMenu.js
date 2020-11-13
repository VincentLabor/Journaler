  // const hamburgerMenu = document.querySelector(".hamburgerMenu");
//   const menu = document.querySelector(".mobileNav");
//   hamburgerMenu.addEventListener(onclick, toggleHamburger);
 const mobileMenu = () => {
     // const toggleHamburger = () => {
     //   menu.classList.toggle("mobileNav");
     // };

      console.log("Some idea");
   };

   module.exports = mobileMenu;
  
  
  // <% const hamburgerMenu = document.querySelector(".hamburgerMenu"); %>
  // <% const menu = document.querySelector(".mobileNav"); %>
  // <% hamburgerMenu.addEventListener(onclick, toggleHamburger);%>
  // <% const toggleHamburger = () => { %>
  // <%   console.log("Smiles all around") %>
  // <% }; %>

  const express = require("express");
const mongoose = require("mongoose");
const session = require("express-session");
const passport = require("passport");
const passportLocalMongoose = require("passport-local-mongoose");
const router = express.Router();
const User = require("../../models/User");
