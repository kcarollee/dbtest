const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
// a schema that defines the DB structure
// USER ACTION: USER, COOK, RIDER
const UserSchema = new mongoose.Schema({
  /*
  _id: {
    required: true,
    type: String,
  },
  */

  // USE ID VALUE FOR NOW
  _id: {
    required: false,
    type: String,
  },

  accessToken: {
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
    required: false,
    type: Number,
  },
  userLevel: {
    required: false,
    type: String,
  },
  userAction: {
    required: true,
    type: String,
  },

  userOrders: {
    required: false,
    type: Array,
  },

  userJWTToken: {
    required: false,
    type: String,
  },
  /*
  hash_password: {
    required: true,
    type: String,
  },
  */
});

UserSchema.methods.comparePassword = async function (password) {
  return bcrypt.compareSync(password, this.hash_password);
};

const userSchema = mongoose.model("userSchema", UserSchema);
module.exports = {
  User: userSchema,
};
