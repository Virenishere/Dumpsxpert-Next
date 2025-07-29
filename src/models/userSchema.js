import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true, index: true },
  password: { type: String, select: false },
  name: { type: String, required: true },
  provider: { 
    type: String, 
    default: "credentials",
    enum: ["credentials", "email", "google", "facebook"]
  },
  providerId: { type: String },
  isVerified: { type: Boolean, default: false },
  role: { type: String, default: "guest" },
  subscription: { type: String, default: "no" },
  phone: { type: String, default: "" },
  address: { type: String, default: "" },
  dob: { type: Date },
  gender: { type: String },
  bio: { type: String, default: "" },
  profileImage: { type: String, default: "" },
  createdAt: { type: Date, default: Date.now },
});

// Hash password before saving
userSchema.pre("save", async function (next) {
  if (this.isModified("password") && this.password) {
    this.password = await bcrypt.hash(this.password, 10);
  }
  next();
});

// Method to compare passwords
userSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

export default mongoose.models.User || mongoose.model("User", userSchema);