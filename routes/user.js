const express = require("express");
const SHA256 = require("crypto-js/sha256");
const encBase64 = require("crypto-js/enc-base64");
const uid2 = require("uid2");

const User = require("../models/User");

const router = express.Router();

/* Sign Up */
router.post("/user/signup", async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });

    if (user) {
      return res
        .status(409)
        .json({ message: "This e-mail address is already in use 🤔" });
    } else if (!req.body.username || !req.body.email || !req.body.password) {
      return res.status(400).json({ message: "Missing parameter 😗" });
    }

    const password = req.body.password;
    const salt = uid2(16);
    const hash = SHA256(password + salt).toString(encBase64);
    const token = uid2(64);

    const newUser = new User({
      email: req.body.email,
      username: req.body.username,
      token: token,
      hash: hash,
      salt: salt,
    });

    await newUser.save();

    return res.status(201).json({
      _id: newUser._id,
      token: newUser.token,
      account: newUser.account,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

/* Log In */
router.post("/user/login", async (req, res) => {
  try {
    const userLogin = await User.findOne({ email: req.body.email });

    if (!userLogin) {
      return res.status(400).json({
        message: "No account at this e-mail address or incorrect password 🤔",
      });
    } else {
      const hashToCompare = SHA256(req.body.password + userLogin.salt).toString(
        encBase64
      );
      if (hashToCompare !== userLogin.hash) {
        return res.status(400).json({
          message: "No account at this e-mail address or incorrect password 🤔",
        });
      } else if (hashToCompare === userLogin.hash) {
        return res.status(200).json({
          _id: userLogin._id,
          token: userLogin.token,
          account: userLogin.account,
        });
      }
    }
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

module.exports = router;
