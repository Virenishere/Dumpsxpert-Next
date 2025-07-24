const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema({
  name: { type: String, default: null },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  password: { type: String },
  provider: { type: String, enum: ["email", "google", "facebook"], default: "email" },
  providerId: { type: String },
  phone: { type: String, default: "" },
  address: { type: String, default: "" },
  dob: { type: Date },
  gender: { type: String, enum: ["Male", "Female", "Other"] },
  bio: { type: String, default: "" },
  profileImage: { type: String, default: "" },
  role: { type: String, enum: ["guest", "student", "admin"], default: "guest" },
  isVerified: { type: Boolean, default: false },
  subscription: { type: String, enum: ["yes", "no"], default: "no" },
  createdAt: { type: Date, default: Date.now },
});

// Hash password before save (for credentials-based users)
userSchema.pre("save", async function (next) {
  if (this.isModified("password") && this.password) {
    this.password = await bcrypt.hash(this.password, 10);
  }
  next();
});

// Compare password method (used in CredentialsProvider)
userSchema.methods.comparePassword = async function (plainPassword) {
  return await bcrypt.compare(plainPassword, this.password);
};

module.exports = mongoose.models.User || mongoose.model("User", userSchema);
