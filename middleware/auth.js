const jwt = require("jsonwebtoken");
const { getTokenFromHeaders } = require("../utils/auth");

const verifyToken = (req, res, next) => {
  const token = getTokenFromHeaders(req);

  if (!token) {
    return res
      .status(401)
      .json({ error: { message: "No auth credentials provided" } });
  }

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (error, decoded) => {
    if (error) {
      return res.status(500).json({ error });
    }

    req.userId = decoded.id;
    next();
  });
};

module.exports.verifyToken = verifyToken;
