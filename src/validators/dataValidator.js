const mongoose = require("mongoose");

const checkId = (ele) => {
  if (mongoose.isValidObjectId(ele) && ele.length == 24) return true;
  return false;
};

const check = (ele) => {
  if (typeof ele == "string" && ele.trim().length) return true;
  return false;
};

const checkArr = (val) => {
  if ((typeof val == "string") && val.trim().length) {
    return true;
  }
  if (Array.isArray(val) && val.length) {
    let arrCheck = true;
    val.forEach((x) => {
      if (typeof x != "string") arrCheck = false;
    });
    if(arrCheck) return true
  }
  return false;
};

module.exports = {
  checkId: checkId,
  check: check,
  checkArr: checkArr,
};
