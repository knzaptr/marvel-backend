const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const characterRouter = require("./routes/character.js");
const comicsRouter = require("./routes/comic.js");
const userRouter = require("./routes/user.js");
const favouriteRouter = require("./routes/favourite.js");
require("dotenv").config();

const app = express();
app.use(express.json());
app.use(cors());
app.use(characterRouter);
app.use(comicsRouter);
app.use(userRouter);
app.use(favouriteRouter);
mongoose.connect(process.env.MONGODB);

app.get("/", (req, res) => {
  try {
    return res.status(200).json({ message: "Welcome to Marvel World !" });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

// Pour les routes inconnues
app.all("*", (req, res) => {
  return res.status(404).json({ error: "This route does not exist 🤔" });
});

app.listen(process.env.PORT, () => {
  console.log("Server started 🚀");
});
