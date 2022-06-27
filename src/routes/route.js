// # PLEASE READ THE README FILE FIRST AND THIS IS NOT THE FINAL BRANCH, PLEASE DO TESTING ON FINAL BRANCH "project/blog" 
const express = require("express");
const authors = require("../controllers/authorController");
const blogs = require("../controllers/blogController");
const mid = require("../middlewares/auth");
const router = express.Router();

//POST API TO LOGIN
router.post("/login", authors.login);

//POST APIS TO ADD BLOGS AND AUTHORS
router.post("/authors", authors.create);
router.post("/blogs", mid.auth, blogs.create);

//GET APIS TO FETCH BLOGS WITH DIFFERENT FILTERS
router.get("/blogs", mid.authLoggedIn, blogs.getBlogs);

//PUT APIS TO UPDATE BLOGS
router.put("/blogs/:blogId", mid.auth, blogs.updateBlog);

//DELETE APIS TO DISABLE BLOG ACCESSIBILITY
router.delete("/blogs", mid.auth, blogs.deleteBlogByQuery);
router.delete("/blogs/:blogId", mid.auth, blogs.delete);

module.exports = router;
