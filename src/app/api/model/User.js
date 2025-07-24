// models/User.js
import mongoose from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const UserSchema = new mongoose.Schema({
  name: { type: String, default: null },
  email: { type: String, required: true, unique: true, lowercase: true },
  password: { type: String },
  provider: { type: String, enum: ["email", "google", "facebook"], default: "email" },
  providerId: { type: String },
  role: { type: String, enum: ["guest", "student", "admin"], default: "guest" },
  isVerified: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
});

UserSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    this.password = await bcrypt.hash(this.password, 10);
  }
  next();
});

UserSchema.methods.comparePassword = function (password) {
  return bcrypt.compare(password, this.password);
};

export default mongoose.models.User || mongoose.model("User", UserSchema);
