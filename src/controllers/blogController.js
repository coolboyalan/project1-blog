// # PLEASE READ THE README FILE FIRST AND THIS IS NOT THE FINAL BRANCH, PLEASE DO TESTING ON FINAL BRANCH "project/blog" 
const { default: mongoose } = require("mongoose");
const blogModel = require("../models/blogModel");
const authorModel = require("../models/authorModel");
const checkId = mongoose.isValidObjectId;
const moment = require("moment");

const check = (ele) => {
  if (typeof ele == "string" && ele != "" && ele.length > 2) return true;
  return false;
};

const checkArr = (val) => {
  let arrCheck = Array.isArray(val) && val.length;
  if (arrCheck) {
    val.forEach((x) => {
      if (typeof x != "string") arrCheck = false;
    });
  }
  if (!(typeof val == "string" || arrCheck)) {
    return false;
  }
  return true;
};


const createBlog = async (req, res) => {
  try {
    let data = req.body;
    let id = data.authorId;
    if (!check(data.title)) {
      return res
        .status(400)
        .send({ status: false, msg: "Please enter a valid Title" });
    }
    if (!check(data.category)) {
      return res
        .status(400)
        .send({ status: false, msg: "Please enter a valid category" });
    }
    if (!check(data.body)) {
      return res.status(400).send({
        status: false,
        msg: "Please provide valid content in the body",
      });
    }
    if (!checkArr(data.tags)){
      return res.status(400).send({
        status: false,
        msg: "Please check the tags",
      });
    }
    if (!checkArr(data.subcategory)) {
      return res.status(400).send({
        status: false,
        msg: "Please check the subcategory",
      });
    }
    let valid = check(id) && checkId(id); //mongoose.isValidObjectId has some issues

    if (!(valid && (await authorModel.findById(data.authorId)))) {
      return res.status(404).send({
        status: false,
        msg: "Invalid author id or author doesn't exist",
      });
    }
    let result = await blogModel.create(data);
    res.status(201).send({ status: true, data: result });
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

      if (Array.isArray(filter.tags)) filter.tags = { $all: filter.tags };
      if (Array.isArray(filter.subcategory)) {
        filter.subcategory = { $all: filter.subcategory };
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
    let docs = req.body;
    if (docs.tags) {
      if (!checkArr(docs.tags))
        return res
          .status(500)
          .send({ status: false, msg: "Please check the tags field" });
    }

    if (docs.subcategory) {
      if (!checkArr(docs.subcategory))
        return res
          .status(500)
          .send({ status: false, msg: "Please check the subcategory field" });
    }

    let published = await blogModel.findById(id);
    if (!published.publishedAt) docs.publishedAt = now;

    let data = await blogModel.findOneAndUpdate(
      { _id: id, isDeleted: false },
      { $set: docs, isPublished: true },
      { new: true }
    );
    if (!data)
      return res.status(404).send({
        status: false,
        msg: "No blog with such id or already deleted",
      });
    res.status(200).send({ status: true, data: data });
  } catch (err) {
    console.log(err.message);
    res.status(500).send({ status: false, msg: err.message });
  }
};

const deleteBlogByQuery = async (req, res) => {
  try {
    const today = moment();
    let now = today.format("YYYY-MM-DD hh-mm-ss");
    let query = Object.keys(req.query);
    if (!query.length)
      return res.status(400).send({
        status: false,
        msg: "Please provide valid query params or a valid authorId in path params",
      });
    let filter = req.query;
    filter.isDeleted = false;

    if (Array.isArray(filter.tags)) filter.tags = { $all: filter.tags };
    if (Array.isArray(filter.subcategory)) {
      filter.subcategory = { $all: filter.subcategory };
    }
    if (!filter.authorId) filter.authorId = req["x-api-key"];
    let result = await blogModel.updateMany(filter, {
      $set: { isDeleted: true, deletedAt: now },
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
    const today = moment();
    let now = today.format("YYYY-MM-DD hh-mm-ss");
    let id = req.params.blogId;
    if (!(id && checkId(id)))
      return res.status(400).send({
        status: false,
        msg: "Please provide the valid blogId in params",
      });

    let result = await blogModel.findOneAndUpdate(
      { _id: id, isDeleted: false },
      { isDeleted: true, deletedAt: now }
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
