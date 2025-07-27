// models/ProductCategory.js
const mongoose = require("mongoose");

const productCategorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },
    image: { type: String },
    public_id: { type: String },
    status: {
      type: String,
      enum: ["Ready", "Publish"],
      default: "Ready",
    },
  },
  { timestamps: true }
);

// Prevent model overwrite in development (for Next.js hot reload)
module.exports =
  mongoose.models.ProductCategory ||
  mongoose.model("ProductCategory", productCategorySchema);
