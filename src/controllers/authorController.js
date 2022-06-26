// # PLEASE READ THE README FILE FIRST AND THIS IS NOT THE FINAL BRANCH, PLEASE DO TESTING ON FINAL BRANCH "project/blog" 
const authorModel = require("../models/authorModel");
const validator = require("validator");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const isValid = require("../validators/dataValidator");


const createAuthor = async (req, res) => {
  try {
    let data = req.body;

    if (!(isValid.check(data.fname) && isValid.check(data.lname)))
      return res
        .status(400)
        .send({ status: false, msg: "Please check the name fields" });

    let arr = ["Mr", "Mrs", "Miss"];

    if (!arr.includes(data.title))
      return res.status(400).send({ status: false, msg: "Please check the title" });

    if (!(data.email && validator.isEmail(data.email)))
      return res
        .status(400)
        .send({ status: false, msg: "Please enter a valid email" });

    if (!isValid.check(data.password))
      return res
        .status(400)
        .send({ status: false, msg: "Please enter a strong password" });

    if (await authorModel.findOne({ email: data.email }))
      return res
        .status(409)
        .send({ status: false, msg: "Email already exists" });

    let result = await authorModel.create(data);
    res.status(201).send({status:true,data:result});
  } catch (err) {
    console.log(err.message);
    res.status(500).send({ status:false,msg: err.message });
  }
};

const login = async (req, res) => {
  try {
    let email = req.body.email;
    let password = req.body.password;

    if (!(isValid.check(email) && isValid.check(password)))
      return res
        .status(400)
        .send({ status: false, msg: "Please check the email/password fields" });

    if (!validator.isEmail(email)) {
      return res.status(400).send({ status: false, msg: "Invalid email" });
    }
    let author = await authorModel.findOne({
      email: email,
      password: password,
    });

    if (!author)
      return res.status(401).send({
        status: false,
        msg: "email or password is not correct",
      });

    let id = author["_id"].toString();
    let token = jwt.sign({ authorId: id }, process.env.JWT_SECRET);
    res.setHeader("x-api-key", token);
    res.status(200).send({ status: true, data: token });
  } catch (err) {
    console.log(err.message);
    res.status(500).send(err.message);
  }
};

module.exports = {
  create: createAuthor,
  login: login,
};
