import mongoose from "mongoose";

const announcementSchema = new mongoose.Schema(
  {
    active: {
      type: Boolean,
      default: false,
    },
    delay: {
      type: Number,
      default: 2.0,
      min: 0,
    },
    imageUrl: {
      type: String,
      required: true,
      trim: true,
      validate: {
        validator: (v) => /^https?:\/\/.+\.(jpg|jpeg|png|gif)$/.test(v),
        message: "Invalid image URL",
      },
    },
    imagePublicId: {
      type: String,
      required: false,
    },
    lastUpdatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: false,
    },
  },
  { timestamps: true }
);

export default mongoose.models.AnnouncementSetting || mongoose.model("AnnouncementSetting", announcementSchema);