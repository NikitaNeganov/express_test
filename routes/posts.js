var express = require("express");
var router = express.Router();

const Post = require("../models/Post");

/* GET users listing. */
router.get("/", async (req, res, next) => {
  try {
    const count = await Post.countDocuments();
    const posts = await Post.find()
      .skip(parseInt(req.query.offset, 10) || 0)
      .limit(parseInt(req.query.limit, 10) || 0);

    res.json({
      count,
      results: posts,
    });
  } catch (error) {
    res.json({ error });
  }
});

router.get("/:id", async (req, res, next) => {
  console.log(req.params, req.query);
  // try {
  //   const posts = await Post.find();
  //   res.json(posts);
  // } catch (error) {
  //   res.json({ error });
  // }
});

router.post("/", function (req, res, next) {
  const post = new Post({
    title: req.body.title,
    description: req.body.description,
  });
  post
    .save()
    .then((data) => res.status(200).json(data))
    .catch((error) => {
      console.log(error);
      res.json(error);
    });
});

// router.post("/fill", function (req, res, next) {
//   for (let i = 0; i < 100; i++) {
//     const post = new Post({
//       title: `Post #${i}`,
//       description: "Dummy desription",
//     });
//     post.save().catch((error) => {
//       console.log(error);
//       res.json(error);
//     });
//   }
// });

module.exports = router;
