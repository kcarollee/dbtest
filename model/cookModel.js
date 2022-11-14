const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const CookSchema = new mongoose.Schema({
  /*
  _id: {
    required: true,
    type: String,
  },
  */
  cookID: {
    required: true,
    type: String,
  },

  itemsToCook: {
    required: false,
    type: Array, // array of orderID's with 'COOKING' status
  },
});

const cookSchema = mongoose.model("cookSchema", CookSchema);
module.exports = {
  Cook: cookSchema,
};
