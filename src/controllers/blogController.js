const { default: mongoose } = require("mongoose");
const blogModel = require("../models/blogModel");
const authorModel = require("../models/authorModel");
const checkId = mongoose.isValidObjectId;

const createBlog = async (req, res) => {
  try {
    let data = req.body;
    let id = data.authorId;
    if (!(data.category && data.body && data.title)) {
      return res.status(400).send({ "Error": "Please fill all the fields" });
    }
    if (!(checkId(id) && authorModel.findById(data.authorId))) {
      return res
        .status(400)
        .send({ Error: "Invalid author id or author is not recognized" });
    }
    let result = await blogModel.create(data);
    res.status(201).send(result);
  } catch (err) {
    console.log(err.message);
    res.status(500).send({ Error: err.message });
  }
};

module.exports = {
  create: createBlog,
};
