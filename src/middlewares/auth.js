// # PLEASE READ THE README FILE FIRST AND THIS IS NOT THE FINAL BRANCH, PLEASE DO TESTING ON FINAL BRANCH "project/blog" 
const jwt = require("jsonwebtoken");
const authorModel = require("../models/authorModel");
const blogModel = require("../models/blogModel");
const mongoose = require("mongoose");
require("dotenv").config();
const checkId = mongoose.isValidObjectId;

const auth = async (req, res, next) => {
  try {
    let token = req.headers["x-auth-token"] || req.headers["X-Auth-Token"];
    if (!token)
      return res.status(400).send({ status: false, msg: "Token is Missing" });

    let query = Object.keys(req.query);
    let filter = req.query;
    let blogId = req.params.blogId;
    jwt.verify(token, process.env.JWT_SECRET, async (err, payload) => {
      if (err) {
        return res.status(403).send({ status: false, msg: err.message });
      }
      if (query.length) {
        if (!(filter.authorId && checkId(filter.authorId))) {
          return res.status(400).send({
            status: false,
            mssg: "Please provide valid authorId in query params",
          });
        }
        if (filter.authorId != payload.authorId) {
          return res.status(403).send({
            status: false,
            mssg: "Not authorized to perform this action",
          });
        }
        return next();
      }
      if (blogId && checkId(blogId)) {
        let data = await blogModel.findById(blogId);
        if (!data)
          return res
            .status(404)
            .send({ status: false, mssg: "No blog with this id" });
        if (data.authorId != payload.authorId) {
          return res.status(403).send({
            status: false,
            mssg: "Not authorized to perform this action",
          });
        }
        next();
      } else
        return res
          .status(400)
          .send({ status: false, mssg: "Please check Id in params" });
    });
  } catch (err) {
    console.log(err.message);
    res.status(500).send(err.message);
  }
};

const authLoggedIn = async (req,res,next) => {
  try{
    let query = Object.keys(req.query)
    if(query.length){
      return auth(req,res,next)
    }
    let token = req.headers["x-auth-token"] || req.headers["X-Auth-Token"];
    if (!token)
      return res.status(400).send({ status: false, msg: "Token is Missing" });

    jwt.verify(token, process.env.JWT_SECRET, async (err, payload) => {
      if (err) {
        return res.status(403).send({ status: false, msg: err.message });
      }
      return next()
    })
  }catch(err){
    console.log(err.message);
    res.status(500).send(err.message);
  }
}


module.exports.auth = auth;
module.exports.authLoggedIn = authLoggedIn;
