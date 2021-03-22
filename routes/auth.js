var express = require("express");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

var router = express.Router();
const User = require("../models/User");
const { validateRegister } = require("../validation/auth");

const { createAccess, createRefresh } = require("../utils/auth");

router.post("/register", async (req, res, next) => {
  const exists = await User.findOne({ username: req.body.username });
  if (exists) {
    return res.status(400).json({
      error: {
        details: {
          message: "This username is already taken.",
          path: ["username"],
        },
      },
    });
  }
  const { error } = validateRegister(req.body);

  if (error) {
    return res.status(400).json({ error });
  }

  const { username, password, phoneNumber } = req.body;
  const hashedPassword = bcrypt.hashSync(req.body.password, 8);
  const params = { username, password: hashedPassword };

  if (phoneNumber) {
    params.phoneNumber = phoneNumber;
  }

  const user = new User({
    ...params,
  });

  const access = createAccess(user._id);

  const refresh = createRefresh(user._id);

  try {
    const savedUser = await user.save();
    res.status(200).json({ access, refresh, user: savedUser });
  } catch (error) {
    res.status(400).json({ error });
  }
});

router.post("/token/obtain", async (req, res, next) => {
  const { username, password } = req.body;

  User.findOne({ username }, (error, user) => {
    if (error) {
      return res.status(500).json({ error });
    }
    if (!user) {
      return res
        .status(404)
        .json({ error: { message: "No user found with these credentials." } });
    }

    const passwordIsValid = bcrypt.compareSync(password, user.password);

    if (!passwordIsValid) {
      return res
        .status(401)
        .json({ error: { message: "No user found with these credentials." } });
    }

    const access = createAccess(user._id);
    const refresh = createAccess(user._id);

    const { password: omittedPassword, ...rest } = user;

    res.json({ access, refresh, user: rest });
  });
});

router.post("/token/verify", async (req, res, next) => {
  const { access } = req.body;
  await jwt.verify(
    access,
    process.env.ACCESS_TOKEN_SECRET,
    async (error, decoded) => {
      if (error) {
        return res
          .status(500)
          .json({ error: { message: "couldnt verify", error } });
      }

      const access = createAccess(decoded.id);
      const refresh = createRefresh(decoded.id);
      const user = await User.findById(decoded.id, { password: 0 });

      if (!user) {
        return res
          .status(404)
          .json({ error: { message: "No user found for these credentials" } });
      }

      res.json({ access, refresh, user });
    }
  );
});

router.post("/token/refresh", async (req, res) => {
  const { refresh } = req.body;

  await jwt.verify(
    refresh,
    process.env.REFRESH_TOKEN_SECRET,
    async (error, decoded) => {
      if (error) {
        return res.status(500).json({ error });
      }

      const user = await User.findById(decoded.id, { password: 0 });
      const access = createAccess(decoded.id);
      const refresh = createRefresh(decoded.id);

      res.json({ access, refresh, user });
    }
  );
});

module.exports = router;
