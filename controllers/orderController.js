const Order = require("../model/orderModel");

exports.orderCreate = async (req, res) => {
  const data = new Order({
    _id: req.body._id,
    userID: req.body.userID,
    userAddress: req.body.userAddress,
    totalOrderPrice: req.body.totalOrderPrice,
    orderedItems: req.body.orderedItems,
    orderStatus: req.body.orderStatus,
    orderTime: req.body.orderTime,
  });

  try {
    const dataToSave = await data.save();
    res.status(200).json(dataToSave);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
