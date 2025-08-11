// models/Product.js
const mongoose = require('mongoose');

const productListSchema = new mongoose.Schema(
  {
    sapExamCode: String,
    imageUrl: String,
    title: String,
    price: String,
    category: String,
    status: String,
    action: String,
    samplePdfUrl: { type: String, default: '' },
    mainPdfUrl: { type: String, default: '' },

    dumpsPriceInr: String,
    dumpsPriceUsd: String,
    dumpsMrpInr: String,
    dumpsMrpUsd: String,

    onlinePriceInr: String,
    onlinePriceUsd: String,
    onlineMrpInr: String,
    onlineMrpUsd: String,

    comboPriceInr: String,
    comboPriceUsd: String,
    comboMrpInr: String,
    comboMrpUsd: String,

    sku: String,
    longDescription: String,
    Description: String,
    slug: String,
    metaTitle: String,
    metaKeywords: String,
    metaDescription: String,
    schema: String,

    faqs: [
      {
        question: { type: String, required: true },
        answer: { type: String, required: true },
      },
    ],

    lastUpdatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "UserInfo",
      required: false,
    },
  },
  { timestamps: true }
);

// Prevent model overwrite in development (for Next.js hot reload)
module.exports =
  mongoose.models.Product || mongoose.model('Product', productListSchema);
