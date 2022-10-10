const mongoose = require("mongoose");

// a schema that defines the DB structure
const UserTable = new mongoose.Schema({
  userID: {
    required: true,
    type: String,
  },
  userName: {
    required: true,
    type: String,
  },
  userAddress: {
    required: true,
    type: String,
  },
  userOrderNum: {
    required: true,
    type: Number,
  },
  userLevel: {
    required: true,
    type: String,
  },
  userAction: {
    required: true,
    type: String,
  },
});

const OrderTable = new mongoose.Schema({
  userID: {
    required: true,
    type: String,
  },
  userAddress: {
    required: true,
    type: String,
  },
  totalOrderPrice: {
    required: true,
    type: Number,
  },
  orderedItems: {
    required: true,
    type: Array,
  },
  orderStatus: {
    required: true,
    type: String,
  },
  miscInfo: {
    required: false,
    type: String,
  },
});

const IngredientTable = new mongoose.Schema({
  ingredientName: {
    required: true,
    type: String,
  },
  remainingNum: {
    required: true,
    type: Number,
  },
});

const RiderTable = new mongoose.Schema({
  riderID: {
    required: true,
    type: String,
  },
  orderTableUserID: {
    required: true,
    type: String,
  },
});

// exporting the schema model

const userSchema = mongoose.model("userTable", UserTable);
const orderSchema = mongoose.model("orderTable", OrderTable);
const ingredientSchema = mongoose.model("ingredientTable", IngredientTable);
const riderSchema = mongoose.model("riderTable", RiderTable);

//module.exports = mongoose.model("Data", dataSchema);

module.exports = {
  User: userSchema,
  Order: orderSchema,
  Ingredient: ingredientSchema,
  Rider: riderSchema,
};
