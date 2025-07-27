const mongoose = require('mongoose');

const blogListSchema = new mongoose.Schema(
  {
    imageUrl: {
      type: String,
      required: true,
      trim: true,
      validate: {
        validator: (v) => /^https?:\/\/.+\.(jpg|jpeg|png|gif)$/.test(v),
        message: 'Invalid image URL',
      },
    },
    imagePublicId: {
      type: String,
      required: false,
    },
    title: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },
    language: {
      type: String,
      required: true,
      trim: true,
      enum: ['en', 'es', 'fr'],
    },
    slug: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },
    category: {
      type: String,
      required: true,
      trim: true,
    },
    content: {
      type: String,
      required: true,
      trim: true,
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
    status: {
      type: String,
      required: true,
      enum: ['publish', 'unpublish'],
      default: 'unpublish',
    },
    lastUpdatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: false,
    },
  },
  { timestamps: true }
);

// ✅ Prevent OverwriteModelError in Next.js dev environment
module.exports = mongoose.models.BlogList || mongoose.model('BlogList', blogListSchema);
