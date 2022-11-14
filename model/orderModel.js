const mongoose = require("mongoose");

// orderStatus:
/*
ORDER_NOT_RECEIVED 미접수
COOKING 조리중 or 조리??
COOKING_FINISHED 조리 완료
DELIVERING 배달중
DELIVERY_FINISHED 배달완료
CANCELLED 주문취소

*/
const OrderSchema = new mongoose.Schema({
  /*
  _id: {
    required: false,
    type: String,
  },
  */
  /*
  orderID: {
    required: true,
    type: String,
  },
*/
  userID: {
    required: false,
    type: String,
  },

  orderedDinner: {
    required: true,
    type: String,
  },
  dinnerStyle: {
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
    type: Array, // [name, price, amount]
  },
  orderStatus: {
    required: true,
    type: String,
  },
  orderTime: {
    required: true,
    type: String,
  },
});
const orderSchema = mongoose.model("orderSchema", OrderSchema);

module.exports = {
  Order: orderSchema,
};
