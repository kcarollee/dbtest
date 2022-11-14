const mongoose = require("mongoose");
// SALAD, SCRAMBLED_EGGS, BACON, BAGUETTE
// STEAK
// WINE, CHAMPAGNE, COFFEE
const FoodSchema = new mongoose.Schema({
  _id: {
    required: true,
    type: String,
  },
  foodName: {
    required: true,
    type: String,
  },
  foodPrice: {
    required: true,
    type: Number,
  },
});
const foodSchema = mongoose.model("foodSchema", FoodSchema);

module.exports = {
  Food: foodSchema,
};
