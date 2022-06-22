const authorModel = require("../models/authorModel");
const validator = require("validator");

const createAuthor = async (req, res) => {
  try {
    let data = req.body;

    if (!(data.firstName && data.lastName))
      return res
        .status(400)
        .send({ status: false, msg: "Please check the name fields" });

    if (!data.title)
      return res.status(400).send({ status: false, msg: "Title is mandatory" });

    if (!data.password)
      return res
        .status(400)
        .send({ status: false, msg: "Please enter a password" });

    if (!(data.email && validator.isEmail(data.email)))
      return res
        .status(400)
        .send({ status: false, msg: "Please enter a valid email" });

    if (await authorModel.findOne({ email: data.email }))
      return res
        .status(400)
        .send({ status: false, msg: "Email already exists" });

    let result = await authorModel.create(data);
    res.status(201).send(result);
  } catch (err) {
    console.log(err.message);
    res.status(500).send({ Error: err.message });
  }
};

module.exports.create = createAuthor;
