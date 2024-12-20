const axios = require("axios");
const express = require("express");
const router = express.Router();

require("dotenv").config();

/*Get a list of comics*/
router.get("/comics", async (req, res) => {
  try {
    let limit = 100;
    let filters = "";

    if (req.query.title) {
      filters += `&title=${req.query.title}`;
    }
    if (req.query.limit) {
      limit = req.query.limit;
    }
    if (req.query.page) {
      filters += `&skip=${(req.query.page - 1) * limit}`;
    }

    const response = await axios.get(
      `${process.env.API}/comics?apiKey=${process.env.API_KEY}${filters}&limit=${limit}`
    );
    return res.status(200).json(response.data);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

/*Get a list of comics containing a specific character*/
router.get("/comics/:characterId", async (req, res) => {
  try {
    const response = await axios.get(
      `${process.env.API}/comics/${req.params.characterId}?apiKey=${process.env.API_KEY}`
    );
    return res.status(200).json(response.data);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

/*Get all informations of specific comic*/
router.get("/comic/:comicId", async (req, res) => {
  try {
    const response = await axios.get(
      `${process.env.API}/comic/${req.params.comicId}?apiKey=${process.env.API_KEY}`
    );
    return res.status(200).json(response.data);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});
module.exports = router;
