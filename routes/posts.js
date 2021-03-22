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

router.get("/:id", async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    res.json(post);
  } catch (error) {
    res.status(400).json({ error });
  }
});

router.patch("/:id", async (req, res) => {
  try {
    await Post.findByIdAndUpdate(
      req.params.id,
      {
        ...req.body,
      },
      { useFindAndModify: false }
    );

    const updated = await Post.findOne({ _id: req.params.id });
    res.json(updated);
  } catch (error) {
    res.status(400).json({ error });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    await Post.findByIdAndRemove(req.params.id, {
      useFindAndModify: false,
    });
    res.status(204);
  } catch (error) {
    res.status(400).json({ error });
  }
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
