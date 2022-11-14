const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const RiderSchema = new mongoose.Schema({
  /*
  _id: {
    required: true,
    type: String,
  },
  */

  riderID: {
    required: true,
    type: String,
  },

  itemsToDeliver: {
    required: false,
    type: Array, // array of order IDs with 'DELIVERING' status
  },
});

const riderSchema = mongoose.model("riderSchema", RiderSchema);
module.exports = {
  Rider: riderSchema,
};
