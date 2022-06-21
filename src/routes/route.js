const express = require('express')
const authors = require('../controllers/authorController')
const blogs = require('../controllers/blogController')
const router = express.Router()

//POST APIS TO ADD BLOGS AND AUTHORS
router.post("/authors", authors.create)
router.post("/blogs", blogs.create)
router.delete("/blogs/:blogId", blogs.delete)

module.exports = router