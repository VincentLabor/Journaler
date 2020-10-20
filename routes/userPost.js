const express = require("express");
const router = express.Router();
const Post = require("../models/Post");

//This basically grabs the information from the database and displays the page
router.get("/", (req, res) => res.render("post"));

router.get("/posts/:postId", (req, res) => {
  try {
    const requestedPostID = req.params.postId;
    Post.findOne({ _id: requestedPostID });
    //The object is extra variables for the view.
    res.render("posts", {
      title: post.title,
      content: post.content,
    });
  } catch (error) {
    console.log(error);
  }
});

router.post("/", (req, res) => {
    const title = req.body.title;
    const content = req.body.content;
    const user = req.user;
    //Mongoose saves date in an awkward unchangeable format so instead of saving the schema as Date, I saved it as String.
    //So since the format is string, all I have to do is get the date in Javascript and save to the database and now I can control the format while getting the date.
    let date = new Date();
    let month = date.getMonth();
    let day = date.getDate();
    let year = date.getFullYear();
    let todaysDate = month + 1 + "/" + day + "/" + year;
    const blogPost = new Post({
      title: title,
      content: content,
      user: user._id,
      firstName: user.firstName,
      createdAt: todaysDate,
    });
    blogPost.save();
    res.redirect("/");
});

module.exports = router;
