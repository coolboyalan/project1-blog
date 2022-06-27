// # PLEASE READ THE README FILE FIRST AND THIS IS NOT THE FINAL BRANCH, PLEASE DO TESTING ON FINAL BRANCH "project/blog" 
const mongoose = require("mongoose");
const Object_id = mongoose.Schema.Types.ObjectId;

const blogSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "title is required"],
    },
    body: {
      type: String,
      required: [true, "body is required"],
    },
    authorId: {
      type: Object_id,
      required: [true, "authorId is required"],
      ref: "Author",
    },
    tags: [String],
    category: {
      type: String,
      required: [true, "category is required"],
    },

    subCategory: [String],

    isDeleted: {
      type: Boolean,
      default: false,
    },
    isPublished: {
      type: Boolean,
      default: false,
    },
  },
  { strict: false },
  { timestamps: true }
);

module.exports = mongoose.model("Blog", blogSchema);
