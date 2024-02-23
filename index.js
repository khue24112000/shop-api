const express = require("express");
const app = express();
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const userRoute = require("./routes/user");
const authRoute = require("./routes/auth");
const productRoute = require("./routes/product");
const cartRoute = require("./routes/cart");
const orderRoute = require("./routes/order");
const categoryRoute = require("./routes/category");
const cors = require("cors");
const CryptoJS = require("crypto-js");
const jwt = require("jsonwebtoken");

app.use(cors());
dotenv.config();

mongoose
  .connect(process.env.MONGO_URL)
  .then(() => console.log("DB connected"))
  .catch((err) => console.log(err));

app.use(express.json());

app.use("/api/user", userRoute);
app.use("/api/auth", authRoute);
app.use("/api/product", productRoute);
app.use("/api/cart", cartRoute);
app.use("/api/order", orderRoute);
app.use("/api/category", categoryRoute);

// console.log(
//   CryptoJS.AES.decrypt(
//     "U2FsdGVkX18yaCUMTfUTt9zoqMxZKV7S2ShD3eIXEIo=",
//     process.env.PASS_SEC
//   ).toString(CryptoJS.enc.Utf8)
// );

// jwt.verify(
//   "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY1MmZhMzMxM2FlOTFiNjM0ZDhmMjlhOCIsImlzQWRtaW4iOnRydWUsImlhdCI6MTY5ODQ4ODkyNiwiZXhwIjoxNjk4NDg4OTU2fQ.A1iD7einyydojugC1SGv9hwe8WnDH3y-CJNewxzBJtQ",
//   process.env.JWT_SEC,
//   (err, user) => {
//     if (err) console.log(err);
//     console.log(user);
//   }
// );

app.listen(process.env.PORT || 5000, () => {
  console.log("backend is running");
});

// console.log(
//   CryptoJS.AES.decrypt(
//     "U2FsdGVkX1/XKQKBfZcXWpj7H6NRkNuGwOhIO/Y8o8c=",
//     process.env.PASS_SEC
//   ).toString(CryptoJS.enc.Utf8)
// );
