// # PLEASE READ THE README FILE FIRST AND THIS IS NOT THE FINAL BRANCH, PLEASE DO TESTING ON FINAL BRANCH "project/blog" 
const { default: mongoose } = require("mongoose");
const blogModel = require("../models/blogModel");
const authorModel = require("../models/authorModel");
const checkId = mongoose.isValidObjectId;
const moment = require("moment");

const createBlog = async (req, res) => {
  try {
    let data = req.body;
    let id = data.authorId;
    if (!(data.category && data.body && data.title)) {
      return res
        .status(400)
        .send({ status: false, msg: "Please fill all the fields" });
    }
    if (!(checkId(id) && authorModel.findById(data.authorId))) {
      return res.status(400).send({
        status: false,
        msg: "Invalid author id or author is not recognized",
      });
    }
    let result = await blogModel.create(data);
    res.status(201).send({ status: true, data: result.authorId });
  } catch (err) {
    console.log(err.message);
    res.status(500).send({ status: false, msg: err.message });
  }
};

const getBlogs = async (req, res) => {
  try {
    let query = Object.keys(req.query);
    if (query.length) {
      let filter = req.query;

      if (filter.tags && filter.tags.match(/,/g)) {
        filter.tags = filter.tags.split(",");
      }

      if (filter.subCategory && filter.subCategory.match(/,/g)) {
        filter.subCategory = filter.subCategory.split(",");
      }

      filter.isDeleted = false;
      filter.isPublished = true;
      let data = await blogModel.find(filter);
      if (!data.length) {
        return res.status(404).send({ status: false, msg: "No blogs found" });
      }
      return res.status(200).send({ status: true, data: data });
    }
    let data = await blogModel.find({ isDeleted: false, isPublished: true });

    if (!data.length)
      return res.status(404).send({ status: false, msg: "No blogs found" });

    res.status(200).send({ status: true, data: { data } });
  } catch (err) {
    console.log(err.message);
    res.status(500).send({ status: false, msg: err.message });
  }
};

const updateBlog = async function (req, res) {
  try {
    const today = moment();
    let now = today.format("YYYY-MM-DD hh-mm-ss");
    let id = req.params.blogId;
    if (!checkId(id))
      return res.status(400).send({ status: false, msg: "Invalid Blog-Id" });
    let updatedDocs = req.body;
    updatedDocs.publishedAt = now;
    if (!(await blogModel.findOne({ _id: id, isDeleted: false }))) {
      return res
        .status(404)
        .send({ status: false, msg: "No blog with such id" });
    }
    let data = await blogModel.findOneAndUpdate(
      { _id: id, isDeleted: false },
      { $set: updatedDocs, isPublished: true },
      { new: true, upsert: true }
    );
    if (!data)
      return res
        .status(404)
        .send({ status: false, msg: "No blog with such id" });
    res.status(200).send({ status: true, data: data });
  } catch (err) {
    console.log(err.message);
    res.status(500).send({ status: false, msg: err.message });
  }
};

const deleteBlogByQuery = async (req, res) => {
  try {
    let query = Object.keys(req.query);
    if (!query.length)
      return res.status(400).send({
        status: false,
        msg: "Please provide valid query params or a valid authorId in path params",
      });
    let filter = req.query;
    filter.isDeleted = false;

    if (filter.tags && filter.tags.match(/,/g)) {
      filter.tags = filter.tags.split(",");
    }

    if (filter.subCategory && filter.subCategory.match(/,/g)) {
      filter.subCategory = filter.subCategory.split(",");
    }

    let result = await blogModel.updateMany(filter, {
      $set: { isDeleted: true },
    });
    if (!result.modifiedCount)
      return res
        .status(404)
        .send({ status: false, msg: "No such blogs or already deleted" });
    res.status(200).send({ status: true, data: result });
  } catch (err) {
    console.log(err.message);
    res.status(500).send({ status: false, msg: err.message });
  }
};

const deleteBlog = async function (req, res) {
  try {
    let id = req.params.blogId;
    if (!(id && checkId(id)))
      return res.status(400).send({
        status: false,
        msg: "Please provide the valid blogId in params",
      });

    let result = await blogModel.findOneAndUpdate(
      { _id: id, isDeleted: false },
      { isDeleted: true }
    );
    if (!result)
      return res
        .status(404)
        .send({ status: false, msg: "Blog not present or already deleted" });
    res.status(200).send();
  } catch (err) {
    console.log(err.message);
    res.status(500).send(err.message);
  }
};

module.exports = {
  create: createBlog,
  delete: deleteBlog,
  deleteBlogByQuery: deleteBlogByQuery,
  getBlogs: getBlogs,
  updateBlog: updateBlog,
};
