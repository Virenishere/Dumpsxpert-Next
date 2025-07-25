import mongoose from "mongoose";
import bcrypt from "bcrypt";

const userSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  password: { type: String }, // Optional for OAuth users
  providerId: { type: String, unique: true, sparse: true }, // OAuth provider ID
  provider: { type: String, enum: ["email", "google", "facebook"], default: "email" }, // e.g., "google"
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

// Hash password before save (for credentials-based users)
userSchema.pre("save", async function (next) {
  if (this.isModified("password") && this.password) {
    this.password = await bcrypt.hash(this.password, 10);
  }
  next();
});

// Compare password method (for CredentialsProvider)
userSchema.methods.comparePassword = async function (plainPassword) {
  return await bcrypt.compare(plainPassword, this.password);
};

export default mongoose.models.User || mongoose.model("User", userSchema);