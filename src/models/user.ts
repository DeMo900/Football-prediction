//hs2ue7Ce8RiGmNWv
import mongoose from "mongoose";

const userSChema = new mongoose.Schema({
  googleId: { type: String, unique: true, sparse: true },
  username: {
    type: String,
    required: true,
    minlength: 3,
    maxlength: 20,
    unique: true,
  },
  email: { type: String, required: true, maxlength: 50, unique: true },
  password: { type: String, minlength: 6 },
  ip: { type: Array, required: true },
  coins: { type: Number, default: 1000 },
  wins: { type: Number, default: 0 },
  lastClaim: { type: Number, default: 0 },
});

const User = mongoose.model("User", userSChema);

export default User;
