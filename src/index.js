// # PLEASE READ THE README FILE FIRST AND THIS IS NOT THE FINAL BRANCH, PLEASE DO TESTING ON FINAL BRANCH "project/blog" 
const express = require("express");
const mongoose = require("mongoose");
const route = require("./routes/route.js");
const bodyParser = require("body-parser");

const app = express();

app.use(bodyParser.json());

mongoose
  .connect(
    "mongodb+srv://adiyadav0:907440Adi@cluster0.icqnexr.mongodb.net/blog?retryWrites=true&w=majority",
    {
      useNewUrlParser: true,
    }
  )
  .then(() => console.log("Connected"))
  .catch((err) => console.log(err));

app.use("/", route);
app.listen(process.env.PORT || 3000, function () {
  console.log("Express app running on port " + (process.env.PORT || 3000));
});
