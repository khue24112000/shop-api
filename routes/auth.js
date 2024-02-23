const router = require("express").Router();
const User = require("../models/User");
const CryptoJS = require("crypto-js");
const jwt = require("jsonwebtoken");
const { verifyTokenAndAdmin, verifyToken } = require("./verifyToken");

// Register
router.post("/register", async (req, res) => {
  const newUser = new User({
    fullName: req.body.fullName,
    username: req.body.username,
    password: CryptoJS.AES.encrypt(
      req.body.password,
      process.env.PASS_SEC
    ).toString(),
    email: req.body.email,
    phoneNumber: req.body.phoneNumber,
    address: req.body.address,
  });

  try {
    const savedUser = await newUser.save();
    res.status(201).json(newUser);
  } catch (err) {
    res.status(500).json(err);
  }
});

router.post("/adminregister", verifyTokenAndAdmin, async (req, res) => {
  console.log(req.body);
  const newUser = new User({
    fullName: req.body.fullName,
    username: req.body.username,
    password: CryptoJS.AES.encrypt(
      req.body.password,
      process.env.PASS_SEC
    ).toString(),
    email: req.body.email,
    phoneNumber: req.body.phoneNumber,
    address: req.body.address,
    isAdmin: req.body.isAdmin,
    status: req.body.status,
  });

  // res.status(200).json(req.body);
  try {
    const savedUser = await newUser.save();
    res.status(201).json(newUser);
  } catch (err) {
    res.status(500).json(err);
  }
});

router.post("/login", async (req, res) => {
  // console.log(req.body);
  try {
    const user = await User.findOne({
      username: req.body.username,
      status: true,
    });

    !user && res.status(401).json("401 Unauthorized");

    const hashedPassword = CryptoJS.AES.decrypt(
      user.password,
      process.env.PASS_SEC
    );
    const Opassword = hashedPassword.toString(CryptoJS.enc.Utf8);

    Opassword !== req.body.password && res.status(401).json("401 Unauthorized");

    const accessToken = jwt.sign(
      {
        id: user._id,
        isAdmin: user.isAdmin,
      },
      process.env.JWT_SEC,
      { expiresIn: "3d" }
    );

    const { password, ...others } = user._doc;

    res.status(200).json({ ...others, accessToken });
  } catch (err) {}
});

router.post("/adminLogin", async (req, res) => {
  // console.log(req.body);
  try {
    const user = await User.findOne({
      username: req.body.username,
      isAdmin: true,
      status: true,
    });

    !user && res.status(401).json("401 Unauthorized");

    const hashedPassword = CryptoJS.AES.decrypt(
      user.password,
      process.env.PASS_SEC
    );
    const Opassword = hashedPassword.toString(CryptoJS.enc.Utf8);

    Opassword !== req.body.password && res.status(401).json("401 Unauthorized");

    const accessToken = jwt.sign(
      {
        id: user._id,
        isAdmin: user.isAdmin,
      },
      process.env.JWT_SEC,
      { expiresIn: "3h" }
    );

    const { password, ...others } = user._doc;

    res.status(200).json({ ...others, accessToken });
  } catch (err) {}
});

router.post("/verifyLogin", (req, res) => {
  const authHeader = req.headers.token;
  if (authHeader) {
    const token = authHeader.split(" ")[1];
    jwt.verify(token, process.env.JWT_SEC, (err, user) => {
      if (err) res.status(403).json(err);
      else res.status(200).json(token);
    });
  }
});

module.exports = router;
