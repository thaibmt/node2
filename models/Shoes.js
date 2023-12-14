const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const ShoesSchema = new Schema({
  title: {
    type: String,
    required: true,
  },

  price: {
    type: String,
    required: false,
    default: 0
  },

  description: {
    type: String,
    required: false,
  },
});

module.exports = mongoose.model("shoess", ShoesSchema);
