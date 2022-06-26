const mongoose = require("mongoose");

const checkId = (ele) => {
    if (mongoose.isValidObjectId(ele) && ele.length == 24) return true;
    return false;
  }

const check = (ele) => {
    if (typeof ele == "string" && ele != "" && ele.length >= 2) return true;
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

  module.exports = {
    checkId:checkId,
    check:check,
    checkArr:checkArr
  }