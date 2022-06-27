// # PLEASE READ THE README FILE FIRST AND THIS IS NOT THE FINAL BRANCH, PLEASE DO TESTING ON FINAL BRANCH "project/blog"
const mongoose = require("mongoose");
const Object_id = mongoose.Schema.type.Object_id;

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
      required: [true, "author_id is required"],
      ref: "Author",
    },
    tags: [String],
    category: {
      type: String,
      required: [true, "category is required"],
    },
    examples: [String],

    subcategory: [String],

    isDeleted: {
      type: Boolean,
      default: false,
    },
    isPublished: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Blog", blogSchema);
