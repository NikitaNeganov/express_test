const jwt = require("jsonwebtoken");

const createAccess = (id) => {
  return jwt.sign({ id }, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: process.env.ACCESS_TOKEN_LIFE,
  });
};

const createRefresh = (id) => {
  return jwt.sign({ id }, process.env.REFRESH_TOKEN_SECRET, {
    expiresIn: process.env.REFRESH_TOKEN_LIFE,
  });
};

const getTokenFromHeaders = (req) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  return token;
};

module.exports.createAccess = createAccess;
module.exports.createRefresh = createRefresh;
module.exports.getTokenFromHeaders = getTokenFromHeaders;
