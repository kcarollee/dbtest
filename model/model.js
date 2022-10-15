const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
// a schema that defines the DB structure
const UserTable = new mongoose.Schema({
  _id: {
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
  hash_password: {
    required: true,
    type: String,
  },
});

UserTable.methods.comparePassword = function (pw) {
  return bcrypt.compareSync(password, this.hash_password);
};

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
  _id: {
    required: true,
    type: String,
  },
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
  _id: {
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
