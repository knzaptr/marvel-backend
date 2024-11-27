const mongoose = require("mongoose");

const Favourite = mongoose.model("Favourite", {
  favouriteCharCom: String,
  type: String,
  account: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
});

module.exports = Favourite;
