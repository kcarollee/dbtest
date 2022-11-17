const mongoose = require("mongoose");

// INGREDIENTS:
/*
// USE INGREDIENTS NAME AS PRIMARY KEY
// SALAD - VEGETABLE_MIX, CHICKEN_BREAST
// SCRAMBLED_EGGS - EGG
// BACON - BACON
// BAGUETTE - BAGUETTE

// STEAK - BEEF, BUTTER

// WINE - WINE
// CHAMPAGNE - CHAMPAGNE
// COFFEE - COFFE_BEANS
*/
const IngredientSchema = new mongoose.Schema({
  _id: {
    required: true,
    type: String,
  },

  remainingNum: {
    required: true,
    type: Number,
  },
  ingredientPrice: {
    required: true,
    type: Number,
  },
});

const ingredientSchema = mongoose.model("ingredientSchema", IngredientSchema);

module.exports = {
  Ingredient: ingredientSchema,
};
