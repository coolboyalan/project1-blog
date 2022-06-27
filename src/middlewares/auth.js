// # PLEASE READ THE README FILE FIRST AND THIS IS NOT THE FINAL BRANCH, PLEASE DO TESTING ON FINAL BRANCH "project/blog" 
const jwt = require("jsonwebtoken");
const authorModel = require("../models/authorModel");
const blogModel = require("../models/blogModel");
const mongoose = require("mongoose");
require("dotenv").config();
const checkId = mongoose.isValidObjectId;

const auth = async (req, res, next) => {
  try {
    let query = Object.keys(req.query);
    let filter = req.query;
    let blogId = req.params.blogId;
    let data = req.body;
    let token = req.headers["x-api-key"] || req.headers["X-Api-Key"];
    if (!token)
      return res.status(400).send({ status: false, msg: "Token is Missing" });

    jwt.verify(token, process.env.JWT_SECRET, async (err, payload) => {
      if (err) {
        return res.status(401).send({ status: false, msg: err.message });
      }
      req["x-api-key"] = payload.authorId;
      if (req.method == "POST") {
        if (data.authorId != payload.authorId) {
          return res.status(403).send({
            status: false,
            msg: "Not authorized, Please enter your authorId",
          });
        }
        return next();
      }
      if (req.method == "GET") {
        return next();
      }
      if (req.method == "PUT") {
        if (blogId && checkId(blogId)) {
          let data = await blogModel.findById(blogId);
          if (!data)
            return res
              .status(404)
              .send({ status: false, msg: "No blog with this id" });
          data.authorId = data.authorId.toString();
          if (data.authorId != payload.authorId) {
            return res.status(403).send({
              status: false,
              msg: "Not authorized, You can only update your blogs.",
            });
          }
          return next();
        } else
          return res
            .status(400)
            .send({ status: false, msg: "Please check Id in params" });
      }
      if (req.method == "DELETE") {
        if (query.length) {
          if(filter.authorId && (filter.authorId!=payload.authorId)){
            return res.status(403).send({
              status: false,
              msg: "Not authorized, You can only delete your blogs",
            });
          }
          return next();
        }
        if (blogId && checkId(blogId)) {
          let data = await blogModel.findById(blogId);
          if (!data)
            return res
              .status(404)
              .send({ status: false, msg: "No blog with this id" });
          if (data.authorId != payload.authorId) {
            return res.status(403).send({
              status: false,
              msg: "Not authorized, You can only delete your blogs",
            });
          }
          next();
        } else {
          return res
            .status(400)
            .send({ status: false, msg: "Please check Id in params" });
        }
      }
    });
  } catch (err) {
    console.log(err.message);
    res.status(500).send(err.message);
  }
};

module.exports.auth = auth;
