const express = require("express");
const axios = require("axios");

const User = require("../models/User");
const Favourite = require("../models/Favourite");
const isAuthenticated = require("../middlewares/isAuthenticated");

const router = express.Router();

/* Add and delete charcter or comic to and from favorite table*/
router.post("/favourite", isAuthenticated, async (req, res) => {
  try {
    const { favouriteCharCom, type } = req.body;
    const favourite = await Favourite.findOne({
      account: req.user.id,
      favouriteCharCom: favouriteCharCom,
      type: type,
    });

    if (favourite) {
      await Favourite.findOneAndDelete({
        account: req.user.id,
        favouriteCharCom: favouriteCharCom,
        type: type,
      });
      return res.status(200).json({ message: "Remove from fav! 💔" });
    } else if (!favouriteCharCom || !type) {
      return res.status(400).json({ message: "Missing parameter 😗" });
    } else {
      const newFavourite = new Favourite({
        favouriteCharCom: favouriteCharCom,
        type: type,
        account: req.user.id,
      });

      await newFavourite.save();
      return res.status(201).json(newFavourite);
    }
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

/* Get a list of favourite comics and characters */
router.get("/favourite", isAuthenticated, async (req, res) => {
  try {
    const favourites = await Favourite.find({ account: req.user.id }).select(
      "-_id -account -__v"
    );
    const total = await Favourite.countDocuments({ account: req.user.id });
    const fav = { count: total, results: favourites };
    return res.status(200).json(fav);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

module.exports = router;
