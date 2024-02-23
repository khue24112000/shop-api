const Order = require("../models/Order");
const {
  verifyToken,
  verifyTokenAndAuthorization,
  verifyTokenAndAdmin,
} = require("./verifyToken");

const router = require("express").Router();

// Create
router.post("/", async (req, res) => {
  const newOrder = new Order(req.body);
  try {
    const savedOrder = await newOrder.save();
    res.status(201).json(savedOrder);
  } catch (err) {
    res.status(500).json(err);
  }
});

// Update;
router.put("/:id", verifyTokenAndAdmin, async (req, res) => {
  try {
    const updatedOrder = await Order.findByIdAndUpdate(
      req.params.id,
      {
        $set: req.body,
      },
      { new: true }
    );
    res.status(200).json(updatedOrder);
  } catch (err) {
    res.status(500).json(err);
  }
});

// delete
router.delete("/:id", verifyTokenAndAdmin, async (req, res) => {
  try {
    await Order.findByIdAndDelete(req.params.id);
    res.status(200).json("order has been deleted...");
  } catch (err) {
    res.status(500).json(err);
  }
});

// get order by userId
router.get("/find/:userId", verifyTokenAndAuthorization, async (req, res) => {
  try {
    const order = await Order.find({ userId: req.params.userId });
    res.status(200).json(order);
  } catch (err) {
    res.status(500).json(err);
  }
});

// get order by id
router.get("/find", async (req, res) => {
  try {
    const order = await Order.find({ _id: req.query.id });
    res.status(200).json(order);
  } catch (err) {
    res.status(500).json(err);
  }
});

// get order by productId
router.get("/find", verifyTokenAndAdmin, async (req, res) => {
  try {
    const order = await Order.find({
      "products.productId": req.query.productId,
    });
    res.status(200).json(order);
  } catch (err) {
    res.status(500).json(err);
  }
});
// get order list
router.get("/", verifyTokenAndAuthorization, async (req, res) => {
  try {
    orders = await Order.find();

    res.status(200).json(orders);
  } catch (err) {
    res.status(500).json(err);
  }
});

// get revenue
router.get("/revenue", async (req, res) => {
  const date = new Date();
  const lastYear = new Date(date.setFullYear(date.getFullYear() - 1));
  try {
    const data = await Order.aggregate([
      { $match: { updatedAt: { $gte: lastYear }, status: "Hoàn thành" } },
      {
        $project: {
          month: { $month: "$updatedAt" },
          totalPrice: 1,
        },
      },
      {
        $group: {
          _id: "$month",
          // total: { $sum: 1 },
          tong: { $sum: "$totalPrice" },
        },
      },
    ]);

    res.status(200).json(data);
  } catch (err) {
    res.status(500).json(err);
  }
});

// // get user stats
// router.get("/stats", verifyTokenAndAdmin, async (req, res) => {
//   const date = new Date();
//   const lastYear = new Date(date.setFullYear(date.getFullYear() - 1));
//   try {
//     const data = await User.aggregate([
//       { $match: { createdAt: { $gte: lastYear } } },
//       {
//         $project: {
//           month: { $month: "$createdAt" },
//         },
//       },
//       {
//         $group: {
//           _id: "$month",
//           total: { $sum: 1 },
//         },
//       },
//     ]);

//     res.status(200).json(data);
//   } catch (err) {
//     res.status(500).json(err);
//   }
// });
module.exports = router;
