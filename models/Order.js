const mongoose = require("mongoose");

const Order = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.ObjectId, ref: "User" },
    fullName: { type: String, required: true },
    email: { type: String },
    phoneNumber: { type: String, required: true },
    paymentMethod: { type: String, required: true, default: "COD" },
    address: { type: String, required: true },
    note: { type: String },
    products: [
      {
        productId: {
          type: mongoose.Schema.ObjectId,
          ref: "Product",
        },
        quantity: { type: Number, default: 1 },
        size: { type: String, required: true },
        color: { type: Object, required: true },
      },
    ],
    status: { type: String, default: "Đang xử lý" },
    shippingCost: { type: Number, required: true },
    totalPrice: { type: Number, required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Order", Order);
