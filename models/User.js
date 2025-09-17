import mongoose from "mongoose";
import noteSchema from "./Notes.js";

const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: [true, "Please fill out this part"],
  },
  lastName: {
    type: String,
    required: [true, "Please fill out this part"],
  },
  email: {
    type: String,
    required: [true, "Please fill out this part"],
    unique : true
  },
  password: {
    type: String,
    required: [true, "Please fill out this part"],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  notes: [noteSchema]
});

const User = mongoose.model("User", userSchema);

export default User;
