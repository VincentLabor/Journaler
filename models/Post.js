const mongoose = require('mongoose');
const passportLocalMongoose = require("passport-local-mongoose");
const timestampPlugin = require("../timestamp"); //This is a module I made to allow the database to save the current date.

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
  
module.exports = mongoose.model("Post", postSchema);