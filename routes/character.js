const axios = require("axios");
const express = require("express");
const router = express.Router();

require("dotenv").config();

/* Get a list of characters */
router.get("/characters", async (req, res) => {
  try {
    const response = await axios.get(
      `${process.env.API}/characters?apiKey=${process.env.API_KEY}`
    );
    return res.status(200).json(response.data);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

/* Get a the infos of a specific character */
router.get("/character/:characterId", async (req, res) => {
  try {
    const response = await axios.get(
      `${process.env.API}/character/${req.params.characterId}?apiKey=${process.env.API_KEY}`
    );
    return res.status(200).json(response.data);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});
module.exports = router;
