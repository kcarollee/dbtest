const mongoose = require("mongoose");

// INGREDIENTS:
/*
// USE INGREDIENTS NAME AS PRIMARY KEY
// SALAD 샐러드 - VEGETABLE_MIX 채소믹스, CHICKEN_BREAST 닭가슴살
// SCRAMBLED_EGGS - EGG 달걀
// BACON - BACON 베이컨
// BAGUETTE - BAGUETTE 바케트

// STEAK - BEEF 소고기, BUTTER 버터

// WINE - WINE 와인
// CHAMPAGNE - CHAMPAGNE 샴페인
// COFFEE - COFFE_BEANS 커피원두


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
