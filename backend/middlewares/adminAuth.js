const jwt = require("jsonwebtoken");
const config = require("config");

module.exports = function (req, res, next) {
  // Get token from header
  const authHeader = req.header("Authorization");
  console.log(authHeader);
  if (!authHeader) {
    return res.status(401).json({ msg: "No token, authorization denied" });
  }

  // Verify token
  try {
    const token = authHeader.split(" ")[0]; // Assumes token is directly provided, without "Bearer" prefix
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || config.get("jwtSecret")
    );
    req.user = decoded.user;

    // Check if user is admin
    if (!req.user.isAdmin) {
      return res.status(403).json({ msg: "Access denied" });
    }

    next();
  } catch (err) {
    res.status(401).json({ msg: "Token is not valid" });
  }
};
