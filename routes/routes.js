const express = require("express");
const jwt = require("jsonwebtoken");

const kakaoAuth = require("./kakaoAuth");

const router = express.Router();
/*
const { User } = require("../model/model");
const { Order } = require("../model/model");
const { Ingredient } = require("../model/model");
const { Rider } = require("../model/model");
*/
const { User } = require("../model/userModel");
const { Order } = require("../model/orderModel");
const { Ingredient } = require("../model/ingredientModel");
const { Cook } = require("../model/cookModel");
const { Rider } = require("../model/riderModel");

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
    res.status(404).json({ 
      status : 404,
      message: "SOMETHING WENT WRONG" });
  }
});
*/

// USER OPERATIONS

//사용자 회원가입
router.post("/user/register", async (req, res) => {
  // TRY CATCH 사용해서 코드에 뭔가 잘못돼도 터지지 않게 해보자

  /*
  const newUser = new User({
    //_id: req.body._id,
    _id: req.body._id, // 카카오톡 ID가 primary key가 됩니다.
    userName: req.body.userName,
    userAddress: req.body.userAddress,
    userOrderNum: 0,
    userLevel: "BASIC",
    userAction: req.body.userAction,
  });
  const userAction = req.body.userAction;
  */

  // if userAction is COOK or RIDER, generate corresponding documents

  try {
    const accessToken = req.body.accessToken;
    const result = await kakaoAuth.getProfile(accessToken);
    const kakaoUser = JSON.parse(result).kakao_account;
    const userEmailAddress = kakaoUser.email;
    console.log(kakaoUser);
    const user = await User.findOne({
      _id: userEmailAddress,
    });
    // 유저가 있다면
    if (user != undefined) {
      console.log("USER ALREADY EXISTS");
      throw "USER ALREADY EXISTS";
    }
    // 유저가 없다면 새 유저 생성
    else {
      const newUser = new User({
        _id: userEmailAddress,
        accessToken: accessToken,
        userName: req.body.userName,
        userAddress: req.body.userAddress,
        userAction: req.body.userAction,
        userOrderNum: 0,
        userLevel: "BASIC",
      });

      const userAction = req.body.userAction;
      const verificationCode = req.body.verificationCode;
      // verificationCode = 1234
      if (userAction != "USER" && verificationCode != "1234") {
        console.log("WRONG VERIFICATION CODE");
        throw "WRONG VERIFICATION CODE";
      }
      switch (userAction) {
        case "COOK":
          const newCook = new Cook({
            cookID: userEmailAddress,
          });
          await newCook.save();
          break;
        case "RIDER":
          const newRider = new Rider({
            riderID: userEmailAddress,
          });
          await newRider.save();
          break;
        case "MANAGER":
          break;
      }

      let jwtSecretKey = process.env.JWT_SECRET_KEY;
      //console.log(jwtSecretKey);

      // token generation
      let tokenData = {
        time: Date(),
        kakaoToken: newUser._id, // 새 유저의 _id를 기반으로 jwtToken 생성
      };

      const token = jwt.sign(tokenData, jwtSecretKey);
      newUser.userJWTToken = token;

      newUser.save();
    }
    res.status(200).json({ status: 200 });
  } catch (error) {
    res.status(404).json({
      status: 404,
      message: "SOMETHING WENT WRONG",
    });
  }
});

// 시용자 로그인

router.post("/user/login", async (req, res) => {
  try {
    const accessToken = req.body.accessToken;
    const result = await kakaoAuth.getProfile(accessToken);
    const kakaoUser = JSON.parse(result).kakao_account;

    const userEmailAddress = kakaoUser.email;
    const user = await User.findOne({ _id: userEmailAddress });
    const toSend = {
      _id: user._id,
      userJWTToken: user.userJWTToken,
      status: 200,
      userAction: user.userAction,
    };
    res.status(200).json(toSend);
  } catch (error) {
    res.status(404).json({
      status: 404,
      message: "USER NOT AVAILABLE",
    });
  }
});

//사용자 회원 탈퇴
router.delete("/user/:userID", async (req, res) => {
  try {
    const id = req.params.userID;
    const data = await User.findOneAndDelete({ _id: id });
    res.status(200).json({
      status: 200,
      message: "USER HAS BEEN DELETED",
    });
  } catch (error) {
    res.status(404).json({
      status: 404,
      message: "SOMETHING WENT WRONG",
    });
  }
});

//사용자 정보 수정
router.patch("/user/:userID", async (req, res) => {
  try {
    //const id = req.params.userID;
    const updatedData = req.body;
    const options = { new: true };

    //await User.findByIdAndUpdate(id, updatedData, options);
    await User.findOneAndUpdate(
      { _id: req.params.userID },
      updatedData,
      options
    );
    res.status(200).json({ message: "USER PATCHED" });
  } catch (error) {
    res.status(404).json({
      status: 404,
      message: "SOMETHING WENT WRONG",
    });
  }
});

// 사용자 정보 가져오기
router.get("/user/:userID", async (req, res) => {
  try {
    const userQuery = { _id: req.params.userID };

    const user = await User.findOne(userQuery);

    const userDto = {
      userName: user.userName,
      userAddress: user.userAddress,
      userLevel: user.userLevel,
    };
    res.status(200).json(userDto);
  } catch (error) {
    res.status(500).json({ status: 500, message: "SOMETHING WENT WRONG" });
  }
});

//ORDER OPERATIONS
// userName과 userID는 엄연히 다른것
// userID: _id에 저장
// userName은 그냥 유저 네임

// orderID는 없고 그냥 _id로 가기
// 주문의 _id는 백엔드에서 자동 생성되게 한다.
// 주문 추가
router.post("/order", async (req, res) => {
  try {
    const newOrder = new Order({
      //_id: req.body._id,
      //orderID: req.body.orderID,
      userID: req.body.userID,
      userAddress: req.body.userAddress,
      totalOrderPrice: req.body.totalOrderPrice,
      orderedItems: req.body.orderedItems,
      orderStatus: req.body.orderStatus,
      orderTime: req.body.orderTime,
      orderedDinner: req.body.orderedDinner,
      dinner: req.body.dinner,
      style: req.body.style,
    });

    // updating user's orderNum and saving
    const query = { _id: req.body.userID };

    const user = await User.findOne(query);
    user.userOrderNum++;
    if (user.userOrderNum < 10) user.userLevel = "BASIC";
    else if (user.userOrderNum < 20) user.userLevel = "GOLD";
    else if (user.userOrderNum < 30) user.userLevel = "PLATINUM";
    else if (user.userOrderNum < 40) user.userLevel = "DIAMOND";
    else if (user.userOrderNum < 50) user.userLevel = "MASTER";
    else if (user.userOrderNum < 60) user.userLevel = "GRANDMASTER";
    else user.userLevel = "LEGEND";

    user.userOrders.push(newOrder._id);
    user.save();
    const dataToSave = await newOrder.save();
    res.status(200).json({ status: 200 });
  } catch (error) {
    res.status(404).json({ status: 404, message: "SOMETHING WENT WRONG" });
  }
});
// 주문 내역 조회
router.get("/getUserOrders/:userID", async (req, res) => {
  try {
    const userQuery = { _id: req.params.userID };
    const user = await User.findOne(userQuery);

    const userOrderIDArray = user.userOrders;
    const userOrderArray = [];

    for (const orderID of userOrderIDArray) {
      const order = await Order.findOne({ _id: orderID });
      userOrderArray.push(order);
    }
    res.status(200).json(userOrderArray);
  } catch (error) {
    res.status(500).json({ status: 500, message: "SOMETHING WENT WRONG" });
  }
});

// 주문 상세 조회
router.get("/getOrderDetail/:userID/:orderID", async (req, res) => {
  try {
    const orderQuery = { _id: req.params.orderID };

    const order = await Order.findOne(orderQuery);
    res.status(200).json(order);
  } catch (error) {
    res.status(500).json({ status: 500, message: "SOMETHING WENT WRONG" });
  }
});

// 주문 취소
router.patch("/order/:orderID", async (req, res) => {
  try {
    const id = req.params.orderID;

    const updatedData = req.body;
    const options = { new: true };

    const order = await Order.findByIdAndUpdate(id, updatedData, options);
    const user = await User.findOne({ _id: order.userID });

    order.orderStatus = "CANCELLED";
    order.save();
    // 주문 취소함에 따라 유저 등급 다시 책정
    user.userOrderNum--;
    if (user.userOrderNum < 10) user.userLevel = "BASIC";
    else if (user.userOrderNum < 20) user.userLevel = "GOLD";
    else if (user.userOrderNum < 30) user.userLevel = "PLATINUM";
    else if (user.userOrderNum < 40) user.userLevel = "DIAMOND";
    else if (user.userOrderNum < 50) user.userLevel = "MASTER";
    else if (user.userOrderNum < 60) user.userLevel = "GRANDMASTER";
    else user.userLevel = "LEGEND";
    user.save();

    res.status(200).json({ status: 200 });
  } catch (error) {
    res.status(404).json({
      status: 404,
      message: "SOMETHING WENT WRONG",
    });
  }
});

/*
router.delete("/order/:orderID", async (req, res) => {
  const userQuery = { userName: req.params.userID };
  const orderQuery = { orderID: req.params.orderID };
  const user = await User.findOne(userQuery);
  const order = await Order.findOne(orderQuery);
  try {
    const id = req.params._id;
    const data = await Order.findByIdAndDelete(id);
    res.send(`Document with ${data.name} has been deleted..`);
  } catch (error) {
    res.status(404).json({ 
      status : 404,
      message: "SOMETHING WENT WRONG" });
  }
});
*/

// INGREDIENT OPERATIONS
// 식자재 등록 (미리 해두기)
router.post("/ingredient", async (req, res) => {
  try {
    const data = new Ingredient({
      _id: req.body._id,
      remainingNum: req.body.remainingNum,
      ingredientPrice: req.body.ingredientPrice,
    });
    const dataToSave = await data.save();
    res.status(200).json(dataToSave);
  } catch (error) {
    res.status(404).json({
      status: 404,
      message: "SOMETHING WENT WRONG",
    });
  }
});

// 식자재 조회
router.get("/ingredient", async (req, res) => {
  try {
    const ingredients = await Ingredient.find();
    res.status(200).json(ingredients);
  } catch (error) {
    res.status(500).json({ status: 500, message: "SOMETHING WENT WRONG" });
  }
});

// 식자재 개수 변경
router.patch("/ingredient", async (req, res) => {
  try {
    const ingredientsToUpdate = req.body; // a whole array of updated ingredients, in model form
    for (let i = 0; i < ingredientsToUpdate.length; i++) {
      const ingInfoNew = ingredientsToUpdate[i];
      const ingName = ingInfoNew.ingredientName;
      await Ingredient.findOneAndUpdate(
        { ingredientName: ingName },
        ingInfoNew,
        {
          new: true,
        }
      );
    }
    res.status(200).json({ status: 200 });
  } catch (error) {
    res.status(404).json({
      status: 404,
      message: "SOMETHING WENT WRONG",
    });
  }
});

// COOK OPERATIONS
/// 이건 사실 필요없는게 라이더 및 요리사 document는 회원가입에서 userAction 설정시
// 자동으로 생성되긴 함
router.post("/cook", async (req, res) => {
  try {
    res.status(200);
  } catch (error) {
    res.status(500).json({ status: 500, message: "SOMETHING WENT WRONG" });
  }
});
// 조리 목록 조회
router.get("/cook", async (req, res) => {
  try {
    const order = await Order.find({
      $or: [{ orderStatus: "NOT_RECEIVED" }, { orderStatus: "COOKING" }],
    });
    res.status(200).json(order);
  } catch (error) {
    res.status(500).json({ status: 500, message: "SOMETHING WENT WRONG" });
  }
});
// 요리사의 조리 목록 조회
router.get("/cook/:cookID", async (req, res) => {
  try {
    const cook = await Cook.findOne({ _id: req.params.cookID });
    const itemsToCook = [];
    for (const orderID of cook.itemsToCook) {
      const order = await Order.findOne({ _id: orderID });
      itemsToCook.push(order);
    }
    res.status(200).json(itemsToCook);
  } catch (error) {
    res.status(500).json({ status: 500, message: "SOMETHING WENT WRONG" });
  }
});

// 조리 시작
router.post("/cook/:cookID/:orderID", async (req, res) => {
  try {
    const cook = await Cook.findOne({ cookID: req.params.cookID });
    const order = await Order.findOne({ _id: req.params.orderID });
    cook.itemsToCook.push(order._id);
    cook.save();
    order.orderStatus = "COOKING";
    order.save();
    res.status(200).json({ status: 200 });
  } catch (error) {
    res.status(404).json({
      status: 404,
      message: "SOMETHING WENT WRONG",
    });
  }
});
// 조리 완료
router.patch("/cook/:cookID/:orderID", async (req, res) => {
  try {
    const cook = await Cook.findOne({ cookID: req.params.cookID });
    const order = await Order.findOne({ _id: req.params.orderID });
    order.orderStatus = "COOKING_FINISHED";
    order.save();

    // delete orderID from cook's itemsToCook array
    const toDeleteIndex = 0;
    for (let i = 0; i < cook.itemsToCook.length; i++) {
      if (cook.itemsToCook[i]._id === order._id) {
        toDeleteIndex = i;
      }
    }
    delete cook.itemsToCook[toDeleteIndex];
    cook.save();
    res.status(200).json({ status: 200 });
  } catch (error) {
    res.status(404).json({
      status: 404,
      message: "SOMETHING WENT WRONG",
    });
  }
});

// RIDER OPERATIONS
// 이건 사실 필요없는게 라이더 및 요리사 document는 회원가입에서 userAction 설정시
// 자동으로 생성되긴 함
router.post("/rider", async (req, res) => {
  try {
    const newRider = new Rider({
      _id: req.body._id,
      orderTableUserID: req.body.orderTableUserID,
    });
    const dataToSave = await newRider.save();
    res.status(200).json(dataToSave);
  } catch (error) {
    res.status(404).json({
      status: 404,
      message: "SOMETHING WENT WRONG",
    });
  }
});

// 배달 목록 조휘
router.get("/delivery", async (req, res) => {
  try {
    const order = await Order.find({
      $or: [{ orderStatus: "COOKING_FINISHED" }, { orderStatus: "DELIVERING" }],
    });
    res.status(200).json(order);
  } catch (error) {
    res.status(500).json({ status: 500, message: "SOMETHING WENT WRONG" });
  }
});
// 배달원의 배달 목록 조회
router.get("/delivery/:riderID", async (req, res) => {
  try {
    const rider = await Rider.findOne({ riderID: req.params.riderID });
    const itemsToDeliver = [];
    for (const orderID of rider.itemsToDeliver) {
      const order = await Order.findOne({ _id: orderID });
      itemsToDeliver.push(order);
    }
    res.status(200).json(itemsToDeliver);
  } catch (error) {
    res.status(500).json({ status: 500, message: "SOMETHING WENT WRONG" });
  }
});

// 배달 시작 요청
router.post("/delivery/:riderID/:orderID", async (req, res) => {
  try {
    const rider = await Rider.findOne({ riderID: req.params.riderID });
    const order = await Order.findOne({ _id: req.params.orderID });
    order.orderStatus = "DELIVERING";
    order.save();
    rider.itemsToDeliver.push(order._id);
    rider.save();
    res.status(200).json({ status: 200 });
  } catch (error) {
    res.status(404).json({
      status: 404,
      message: "SOMETHING WENT WRONG",
    });
  }
});

// 배달 완료 요청
router.patch("/delivery/:riderID/:orderID", async (req, res) => {
  try {
    const rider = await Rider.findOne({ riderID: req.params.riderID });
    const order = await Order.findOne({ _id: req.params.orderID });
    order.orderStatus = "DELIVERED";
    order.save();
    // delete orderID from rider's itemsToDeliver array
    const toDeleteIndex = 0;
    for (let i = 0; i < rider.itemsToDeliver.length; i++) {
      if (rider.itemsToDeliver[i]._id === orderID) {
        toDeleteIndex = i;
      }
    }
    delete rider.itemsToDeliver[toDeleteIndex];
    rider.save();
    res.status(200).json({ status: 200 });
  } catch (error) {
    res.status(404).json({
      status: 404,
      message: "SOMETHING WENT WRONG",
    });
  }
});
