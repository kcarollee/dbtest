const express = require("express");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
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

/*
router.post("/user", async (req, res) => {
  // automatic error message for duplicate id.
  const data = new User({
    _id: req.body._id,
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
*/

//USER OPERATIONS

router.post("/user/register", async (req, res) => {
  const data = new User({
    _id: req.body._id,
    userName: req.body.userName,
    userAddress: req.body.userAddress,
    userOrderNum: req.body.userOrderNum,
    userLevel: req.body.userLevel,
    userAction: req.body.userAction,
  });

  data.hash_password = bcrypt.hashSync(req.body.hash_password, 10);

  try {
    const dataToSave = await data.save();
    res.status(200).json(dataToSave);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.post("/user/sign_in", async (req, res) => {
  //console.log(User.findOne({ userName: req.body.userName }));

  let user = User.findOne({ userName: req.body.userName });
  console.log(user);
  if (!user || !user.comparePassword(req.body.hash_password)) {
    return res.status(401).json({
      message: "Authentication failed. Invalid user or password.",
    });
  }
  return res.json({
    token: jwt.sign(
      {
        _id: user._id,
        userName: user.userName,
        userAddress: user.userAddress,
        userOrderNum: user.userOrderNum,
        userLevel: user.userLevel,
        userAction: user.userAction,
      },
      "RESTFULAPIs"
    ),
  });

  //Delete by ID Method
  router.delete("/user/:id", async (req, res) => {
    try {
      const id = req.params._id;
      const data = await User.findByIdAndDelete(id);
      res.send(`Document with ${data.name} has been deleted..`);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  });

  /*
  User.findOne(
    {
      userName: req.body.userName,
    },
    function (err, user) {
      if (err) throw err;
      console.log(user);
      if (!user || !user.comparePassword(req.body.hash_password)) {
        return res.status(401).json({
          message: "Authentication failed. Invalid user or password.",
        });
      }
      return res.json({
        token: jwt.sign(
          {
            _id: user._id,
            userName: user.userName,
            userAddress: user.userAddress,
            userOrderNum: user.userOrderNum,
            userLevel: user.userLevel,
            userAction: user.userAction,
          },
          "RESTFULAPIs"
        ),
      });
    }
  );
  */
});

router.patch("/user/:id", async (req, res) => {
  try {
    const id = req.params._id;
    const updatedData = req.body;
    const options = { new: true };

    const result = await User.findByIdAndUpdate(id, updatedData, options);

    res.send(result);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

//ORDER OPERATIONS

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

router.patch("/order/:id", async (req, res) => {
  try {
    const id = req.params._id;
    const customerID = req.params.userID;
    const updatedData = req.body;
    const options = { new: true };

    const result = await Order.findByIdAndUpdate(id, updatedData, options);

    res.send(result);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.delete("/order/:id", async (req, res) => {
  try {
    const id = req.params._id;
    const data = await Order.findByIdAndDelete(id);
    res.send(`Document with ${data.name} has been deleted..`);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// INGREDIENT OPERATIONS

router.post("/ingredient", async (req, res) => {
  const data = new Ingredient({
    _id: req.body._id,
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

router.patch("/ingredient/:id", async (req, res) => {
  try {
    const id = req.params._id;
    const updatedData = req.body;
    const options = { new: true };

    const result = await Ingredient.findByIdAndUpdate(id, updatedData, options);

    res.send(result);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// RIDER OPERATIONS

router.post("/rider", async (req, res) => {
  const data = new Rider({
    _id: req.body._id,
    orderTableUserID: req.body.orderTableUserID,
  });

  try {
    const dataToSave = await data.save();
    res.status(200).json(dataToSave);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.patch("/rider/:id", async (req, res) => {
  try {
    const id = req.params._id;
    const updatedData = req.body;
    const options = { new: true };

    const result = await Rider.findByIdAndUpdate(id, updatedData, options);

    res.send(result);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.delete("/rider/:id", async (req, res) => {
  try {
    const id = req.params._id;
    const data = await Rider.findByIdAndDelete(id);
    res.send(`Document with ${data.name} has been deleted..`);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});
