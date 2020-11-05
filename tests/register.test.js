const mongoose = require("mongoose");
const UserModel = require("../models/User");

const userData = {
  firstName: "Jeremy",
  lastName: "Ford",
  username: "jj@j.com ",
  password: "jj",
  posts: [],
};

//Describe groups similar tests together
describe("User Model Test", () => {
  beforeAll(async () => {
    await mongoose.connect(
      "mongodb://localhost/blogDB",
      {
        useNewUrlParser: true,
        useCreateIndex: true,
      },
      (err) => {
        if (err) {
          console.log(err);
          process.exit(1);
        }
      }
    );
  });

  it("Check if User was saved succcessfully", async () => {
    const validUser = new UserModel(userData);
    const savedUser = await validUser.save();

    expect(savedUser.firstName).toBe(userData.firstName);
    expect(savedUser.lastName).toBe(userData.lastName);
    expect(savedUser.username).toBe(userData.username);
    expect(savedUser.posts).toBeTruthy();
  });

  //   This checks for users that users created with random fields
  it("Successful User insert but improper fields", async () => {
    const validUserButInvalidField = new UserModel({
      firstName: "Jeremy",
      lastName: "Ford",
      username: "jj@j.com ",
      password: "jj",
      availability: false,
    });

    const saveValidButInvalidField = await validUserButInvalidField.save();
    expect(saveValidButInvalidField.firstName).toBeDefined();
    expect(saveValidButInvalidField.availability).toBeUndefined();
  });

  it("Create a user without required fields which should fail", async () => {
    const userWithIncorrectFields = new UserModel({
      firstName: "Jeremy",
    });
    let err; 

    try {
      const savedUserWithIncorrectFields = await userWithIncorrectFields.save();
      error = savedUserWithIncorrectFields;
    } catch (error) {
      err = error;
    }
//Basically error is a failure because of the objects keys whose paths failed. 
    expect(err).toBeInstanceOf(mongoose.Error.ValidationError)
    // expect(err.error.username).toBeUndefined();

  });
});
