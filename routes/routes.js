const express = require("express");
const router = express.Router();
const { User } = require("../model/model");
const { Order } = require("../model/model");
const { Ingredient } = require("../model/model");
const { Rider } = require("../model/model");
module.exports = router;

// five methods that use the REST Methods of Post, Get, Patch, and Delete
// the router takes the route as the first param, and a callback as the second param

//Post Method
// res: response, req: request
// res: for sending responses to a client such as Postman or any front end client
// req: for receiving requests from a client app like Postman
/*
router.post("/post", (req, res) => {
  res.send("Post API");
});
*/

router.post("/user", async (req, res) => {
  const data = new User({
    userID: req.body.userID,
    userName: req.body.userName,
    userAddress: req.body.userAddress,
    userOrderNum: req.body.userOrderNum,
    userLevel: req.body.userLevel,
    userAction: req.body.userAction,
  });

  try {
    const dataToSave = await data.save();
    res.status(200).json(dataToSave);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.post("/order", async (req, res) => {
  const data = new Order({
    userID: req.body.userID,
    userAddress: req.body.userAddress,
    totalOrderPrice: req.body.totalOrderPrice,
    orderedItems: req.body.orderedItems,
    orderStatus: req.body.orderStatus,
    miscInfo: req.body.miscInfo,
  });

  try {
    const dataToSave = await data.save();
    res.status(200).json(dataToSave);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.post("/ingredient", async (req, res) => {
  const data = new Ingredient({
    ingredientName: req.body.ingredientName,
    remainingNum: req.body.remainingNum,
  });

  try {
    const dataToSave = await data.save();
    res.status(200).json(dataToSave);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.post("/rider", async (req, res) => {
  const data = new Rider({
    riderID: req.body.riderID,
    orderTableUserID: req.body.orderTableUserID,
  });

  try {
    const dataToSave = await data.save();
    res.status(200).json(dataToSave);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

//Get all Method
// getting data
// using Model.find method to fetch all the data from the database
/*
router.get("/getAll", async (req, res) => {
  try {
    const data = await Model.find();
    res.json(data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
*/

//Get by ID Method
// taking a response from a client app.
// printing an ID in this case
/*
router.get("/getOne/:id", (req, res) => {
  res.send(req.params.id);
});
*/
//Get by ID Method
/*
router.get("/getOne/:id", async (req, res) => {
  try {
    const data = await Model.findById(req.params.id);
    res.json(data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
*/
//Update by ID Method
// 일단 req.body 전체적으로 업데이트하도록 했는데
// updateUserName, updateUserAddress 이렇게 세부적으로 필요한지?
router.patch("/user/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const updatedData = req.body;
    const options = { new: true };

    const result = await User.findByIdAndUpdate(id, updatedData, options);

    res.send(result);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.patch("/order/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const updatedData = req.body;
    const options = { new: true };

    const result = await Order.findByIdAndUpdate(id, updatedData, options);

    res.send(result);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.patch("/ingredient/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const updatedData = req.body;
    const options = { new: true };

    const result = await Ingredient.findByIdAndUpdate(id, updatedData, options);

    res.send(result);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.patch("/rider/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const updatedData = req.body;
    const options = { new: true };

    const result = await Rider.findByIdAndUpdate(id, updatedData, options);

    res.send(result);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

//Delete by ID Method
router.delete("/user/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const data = await User.findByIdAndDelete(id);
    res.send(`Document with ${data.name} has been deleted..`);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.delete("/order/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const data = await Order.findByIdAndDelete(id);
    res.send(`Document with ${data.name} has been deleted..`);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.delete("/rider/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const data = await Rider.findByIdAndDelete(id);
    res.send(`Document with ${data.name} has been deleted..`);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});
