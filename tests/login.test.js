const mongoose = require("mongoose");
const UserModel = require("../models/User");
const session = require("express-session");
const passport = require("passport"),
  LocalStrategy = require("passport-local").Strategy;

const userData = {
  username: "king@king.com ",
  password: "king",
};

describe("Login Tests", () => {
  beforeAll(async () => {
    await mongoose.connect(
      "mongodb://localhost/blogDB",
      { useNewUrlParser: true, useCreateIndex: true },
      (err) => {
        if (err) {
          console.log(err);
          process.exit(1);
        }
      }
    );
  });

  it("User logs in successfully", async () => {
    const validLogin = new UserModel(userData);
    const savedLogin = await validLogin.save();
    expect(savedLogin.username).toBeTruthy();
    expect(savedLogin.password).toBeTruthy();
  });

  it("User incorrectly types password in", ()=>{
      const incorrectPass = new UserModel({
          username: "king@king.com",
          password: "NotKing"
      })
      let err;

      try {
          error = 
      } catch (error) {
          err = error
      }

  })
});
