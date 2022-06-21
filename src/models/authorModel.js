const mongoose = require("mongoose");

const authorSchema = new mongoose.Schema(
  {
    FirstName: {
      type: String,
      required: [true, "First name is required"],
    },
    LastName: {
      type: String,
      require: [true, "Last name is required"],
    },
    title: {
      type: String,
      required: [true, "Title is required"],
      enum: ["Mr", "Mrs", "Miss"],
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
