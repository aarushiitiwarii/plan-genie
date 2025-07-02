import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: { type: String },
  email: { type: String },
  bio: { type: String, default: "" },
  location: { type: String, default: "" },
  avatar: { type: String, default: "" },
  github: { type: String, default: "" },
  linkedin: { type: String, default: "" },
}, { timestamps: true });

export default mongoose.model("User", userSchema);
