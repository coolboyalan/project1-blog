// # PLEASE READ THE README FILE FIRST AND THIS IS NOT THE FINAL BRANCH, PLEASE DO TESTING ON FINAL BRANCH "project/blog"
const express = require("express");
const authors = require("../controllers/authorController");
const blogs = require("../controllers/blogController");
const router = express.Router();

//POST APIS TO ADD BLOGS AND AUTHORS
router.post("/authors", authors.create);
router.post("/blogs", blogs.create);

//GET APIS TO FETCH BLOGS WITH DIFFERENT FILTERS
router.get("/blogs", blogs.getBlogs);

//PUT APIS TO UPDATE BLOGS
router.put("/blogs/:blogId", blogs.updateBlog);

//DELETE APIS TO DISABLE BLOG ACCESSIBILITY
router.delete("/blogs", blogs.deleteBlogByQuery);
router.delete("/blogs/:blogId", blogs.delete);

module.exports = router;
