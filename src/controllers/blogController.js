const { default: mongoose } = require("mongoose");
const blogModel = require("../models/blogModel");
const authorModel = require("../models/authorModel");
const checkId = mongoose.isValidObjectId;

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
      return res
        .status(400)
        .send({
          status: false,
          msg: "Invalid author id or author is not recognized",
        });
    }
    let result = await blogModel.create(data);
    res.status(201).send(result);
  } catch (err) {
    console.log(err.message);
    res.status(500).send({ status: false, msg: err.message });
  }
}

const deleteBlog = async function (req, res) {
  try {
    let id = req.params.blogId;
    if (!(id && checkId(id)))
      return res
        .status(400)
        .send({
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
};
