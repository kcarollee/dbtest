require("dotenv").config();
const express = require("express"); // middleware to create various CRUD endpoints
const mongoose = require("mongoose"); // manage data in MongoDB using various queries

const mongoString = process.env.DATABASE_URL;
const routes = require("./routes/routes");

// connecting the db to the server using mongoose
mongoose.connect(mongoString);
const database = mongoose.connection;

// connect to db, throw error if connection fails
database.on("error", (error) => {
  console.log(error);
});

// will run only once
database.once("connected", () => {
  console.log("Database Connected");
});

const app = express();

app.use(express.json());

app.use("/api", routes);

app.listen(3000, () => {
  console.log(`Server started at ${3000}`);
});
