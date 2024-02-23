const { ObjectId } = require("mongodb");
const mongoose = require("mongoose");

const ProductSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    desc: { type: String, required: true },
    categories: { type: Array, required: true },
    size: { type: Array, required: true },
    color: {
      type: mongoose.Schema.Types.Array,
      schema: {
        colorName: { type: String, required: true },
        colorImg: { type: String, required: true },
        productImg: { type: String, required: true },
      },
    },
    price: { type: Number, required: true },
    amount: { type: Number, required: true },
    status: { type: Boolean, default: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Product", ProductSchema);
