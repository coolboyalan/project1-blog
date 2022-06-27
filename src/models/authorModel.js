// # PLEASE READ THE README FILE FIRST AND THIS IS NOT THE FINAL BRANCH, PLEASE DO TESTING ON FINAL BRANCH "project/blog" 
const mongoose = require("mongoose");

const authorSchema = new mongoose.Schema(
  {
    fname: {
      type: String,
      required: [true, "First name is required"],
    },
    lname: {
      type: String,
      required: [true, "Last name is required"],
    },
    title: {
      type: String,
      required: [true, "Title is required"],
      enum: {
        values: ["Mr", "Mrs", "Miss"],
        message: `Title could be only 'Mr, 'Mrs', or 'Miss'`,
      },
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
    },
    password: {
      type: String,
      required: [true, "Password is required"],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Author", authorSchema);
