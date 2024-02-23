const { ObjectId } = require("mongodb");
const Cart = require("../models/Cart");
const Order = require("../models/Order");
const Product = require("../models/Product");
const {
  verifyToken,
  verifyTokenAndAuthorization,
  verifyTokenAndAdmin,
} = require("./verifyToken");

const router = require("express").Router();

// Create
router.post("/", verifyTokenAndAdmin, async (req, res) => {
  const newProduct = new Product(req.body);
  try {
    const savedProduct = await newProduct.save();
    res.status(201).json(savedProduct);
  } catch (err) {
    res.status(500).json(err);
  }
});

// Update;
router.put("/:id", async (req, res) => {
  try {
    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      {
        $set: req.body,
      },
      { new: true }
    );
    res.status(200).json(updatedProduct);
  } catch (err) {
    res.status(500).json(err);
  }
});

// delete
router.delete("/:id", verifyTokenAndAdmin, async (req, res) => {
  try {
    await Product.findByIdAndDelete(req.params.id);

    res.status(200).json("product has been deleted...");
  } catch (err) {
    res.status(500).json(err);
  }
});

// router.get("/order", async (req, res) => {

//     // const newArr = getOrder.map((item) => {
//     //   return item.products.filter((i, index) => {
//     //     return i.productId != productId;
//     //   });
//     // await Order.findByIdAndUpdate(item._id, {
//     //   $set: {
//     //     products: item.products.filter((i) => i.productId !== productId),
//     //   },
//     // });
//     // });
//     res.status(200).json(getOrder);
//   } catch (err) {
//     res.status(500).json(err);
//   }
// });

// get user by id
router.get("/find/:id", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    res.status(200).json(product);
  } catch (err) {
    res.status(500).json(err);
  }
});

router.get("/find", async (req, res) => {
  const searchQuery = req.query.search;
  try {
    const product = await Product.find({
      name: { $regex: new RegExp(searchQuery) },
      // status: true,
    });
    res.status(200).json(product);
  } catch (err) {
    res.status(500).json(err);
  }
});

// get product list
router.get("/", async (req, res) => {
  const qCategory = req.query.category;
  const qType = req.query.type;
  const qSize = req.query.size;
  const qColor = req.query.color;
  try {
    let products;
    if (qCategory === "new") {
      const date = new Date();
      date.setMonth(date.getMonth() - 1);
      products = await Product.find({ createdAt: { $gte: date } });
    } else if (qCategory === "all") {
      products = await Product.find();
    } else if (qCategory) {
      products = await Product.find({ categories: { $in: [qCategory] } });
    } else {
      products = await Product.find();
    }
    res.status(200).json(products);
  } catch (err) {
    res.status(500).json(err);
  }
});

// getProduct for customer
router.get("/customer", async (req, res) => {
  const qCategory = req.query.category;
  const qType = req.query.type;
  const qSize = req.query.size;
  const qColor = req.query.color;
  try {
    let products;
    if (qCategory === "new") {
      const date = new Date();
      date.setMonth(date.getMonth() - 1);
      products = await Product.find({
        createdAt: { $gte: date },
        status: true,
      });
    } else if (qCategory === "all") {
      products = await Product.find({ status: true });
    } else if (qCategory) {
      products = await Product.find({
        categories: { $in: [qCategory] },
        status: true,
      });
    } else {
      products = await Product.find({ status: true });
    }
    res.status(200).json(products);
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
