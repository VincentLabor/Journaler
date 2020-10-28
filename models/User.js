const mongoose = require("mongoose");
const passportLocalMongoose = require("passport-local-mongoose");

const userSchema = new mongoose.Schema({
  firstName: { type: String },
  lastName: { type: String },
  username: { type: String, required: true },
  password: { type: String },
  posts: [
    {
      title: { type: String },
      ref: { type: String },
    },
  ],
});

userSchema.plugin(passportLocalMongoose);
module.exports = mongoose.model("user", userSchema);
