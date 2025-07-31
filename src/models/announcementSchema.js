import mongoose from "mongoose";

const announcementSchema = new mongoose.Schema(
  {
    active: {
      type: Boolean,
      default: false,
    },
    imageUrl: {
      type: String,
      required: true,
    },
    imagePublicId: {
      type: String,
      required: true,
    },
    delay: {
      type: Number,
      default: 2.0,
    },
  },
  { timestamps: true }
);

export default mongoose.models.AnnouncementSetting || mongoose.model("AnnouncementSetting", announcementSchema);