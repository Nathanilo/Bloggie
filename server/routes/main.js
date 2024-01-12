const express = require("express");
const mongoose = require("mongoose");
const Post = require("../models/posts");
const router = express.Router();

//Routes

router.get("/", async (req, res) => {
  try {
    const locals = {
      title: "My Blog",
      description: "simple blog created with Node",
    };

    let perPage = 10;
    let page = req.query.page || 1;

    const data = await Post.aggregate([{ $sort: { createdAt: -1 } }])
      .skip(perPage * page - perPage)
      .limit(perPage)
      .exec();

    const count = await Post.countDocuments();
    const nextPage = parseInt(page) + 1;
    const hasNextPage = nextPage <= Math.ceil(count / perPage);

    res.render("index", {
      locals,
      data,
      current: page,
      nextPage: hasNextPage ? nextPage : null,
    });
  } catch (error) {
    console.error(`Unable to fetch ${error}`);
  }
});

router.get("/:id", async (req, res) => {
  const postId = req.params.id;
  try {
    const post = await Post.findById(postId);

    const locals = {
      title: post.title,
      description: "simple blog created with Node",
    };

    res.render("post", { locals, post });
  } catch (error) {
    console.error(`Unable to fetch ${error}`);
  }
});

router.post("/search", async (req, res) => {
  try {
    const locals = {
      title: "search",
      description: "simple blog created with Node",
    };

    const searchTerm = req.body.searchTerm;
    const searchTermNoSpecialChar = searchTerm.replace(/[^a-zA-Z ]/g, "");

    const data = await Post.find({
      $or: [
        { title: { $regex: new RegExp(searchTermNoSpecialChar, "i") } },
        { body: { $regex: new RegExp(searchTermNoSpecialChar, "i") } },
      ],
    });
    console.log(data);
    res.render("search", { data, locals });
  } catch (error) {
    console.log(error);
  }
});

router.get("/about", (req, res) => {
  res.render("about");
});

router.get("/contact", (req, res) => {
  res.render("contact");
});

module.exports = router;
