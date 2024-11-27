const express = require("express");
const axios = require("axios");

const User = require("../models/User");
const Favourite = require("../models/Favourite");
const isAuthenticated = require("../middlewares/isAuthenticated");

const router = express.Router();

/* Add charcter or comic to favorite table*/
router.post("/favourite", isAuthenticated, async (req, res) => {
  try {
    const { favourite_id, type } = req.body;
    const favourite = await Favourite.findOne(req.body);

    if (favourite) {
      return res.status(409).json({ message: "Already in favourite ♥️" });
    } else if (!favourite_id || !type) {
      return res.status(400).json({ message: "Missing parameter 😗" });
    }

    const favouriteExist = await axios.get(
      `${process.env.API}/${type}/${favourite_id}?apiKey=${process.env.API_KEY}`
    );

    const newFavourite = new Favourite({
      favourite_id: favourite_id,
      type: type,
      account: req.user.id,
    });

    await newFavourite.save();

    return res.status(201).json(newFavourite);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

/* Get a list of favourite comics and characters */
router.get("/favourite", isAuthenticated, async (req, res) => {
  try {
    const favourites = await Favourite.find({ account: req.user.id });
    const total = await Favourite.countDocuments({ account: req.user.id });
    let fav = { count: total };
    let results = [];
    for (const favourite of favourites) {
      const response = await axios.get(
        `${process.env.API}/${favourite.type}/${favourite.favourite_id}?apiKey=${process.env.API_KEY}`
      );

      results.push(response.data);
    }
    fav.results = results;

    return res.status(200).json(fav);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

/* Delete a comic or character */
router.delete("/favourite/:favId", isAuthenticated, async (req, res) => {
  try {
    const favToRemove = await Favourite.findOneAndDelete({
      account: req.user.id,
      favourite_id: req.params.favId,
    });
    return res.status(200).json("Remove from fav! 💔");
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});
module.exports = router;
