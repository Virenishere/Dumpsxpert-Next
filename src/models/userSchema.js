const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  password: { type: String },
  providerId: { type: String, unique: true, sparse: true },
  provider: { type: String, enum: ["email", "google"], default: "email" },
  phone: { type: String, default: "" },
  address: { type: String, default: "" },
  dob: { type: Date },
  gender: { type: String, enum: ["Male", "Female", "Other"], default: null },
  bio: { type: String, default: "" },
  profileImage: { type: String, default: "" },
  role: { type: String, enum: ["guest", "student", "admin"], default: "guest" },
  isVerified: { type: Boolean, default: false },
  subscription: { type: String, enum: ["yes", "no"], default: "no" },
  createdAt: { type: Date, default: Date.now },
});

userSchema.pre("save", async function (next) {
  if (this.isModified("password") && this.password) {
    this.password = await bcrypt.hash(this.password, 10);
  }
  if (this.isModified("subscription") && this.subscription === "yes" && this.role !== "admin") {
    this.role = "student";
  }
  next();
});

userSchema.methods.comparePassword = async function (plainPassword) {
  return await bcrypt.compare(plainPassword, this.password);
};

module.exports = mongoose.models.User || mongoose.model("User", userSchema);