const mongoose = require('mongoose');

const blogCategorySchema = new mongoose.Schema(
  {
    sectionName: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },
    category: {
      type: String,
      required: true,
    },
    imageUrl: {
      type: String,
      required: true,
    },
    imagePublicId: {
      type: String,
    },
    metaTitle: {
      type: String,
      required: true,
      trim: true,
      maxlength: 60,
    },
    metaKeywords: {
      type: String,
      required: true,
      trim: true,
    },
    metaDescription: {
      type: String,
      required: true,
      trim: true,
      maxlength: 160,
    },
    schema: {
      type: String,
      required: true,
      trim: true,
      validate: {
        validator: (v) => {
          try {
            JSON.parse(v);
            return true;
          } catch {
            return false;
          }
        },
        message: 'Invalid JSON-LD schema',
      },
    },
  },
  { timestamps: true }
);

// ✅ Prevent OverwriteModelError in Next.js dev environment
module.exports = mongoose.models.BlogCategory || mongoose.model('BlogCategory', blogCategorySchema);
