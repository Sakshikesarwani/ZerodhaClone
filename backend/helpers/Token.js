const jwt = require("jsonwebtoken");
require("dotenv").config();

exports.createSecretToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: "3d",
  });
};
