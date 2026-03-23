const jwt = require("jsonwebtoken");


function identifyUser(req, res, next) {
  const omnitoken = req.cookies.omnitoken;

  if (!omnitoken) {
    return res.status(401).json({
      message: "Unauthorized: Token not provided",
    });
  }

  try {
    const decoded = jwt.verify(omnitoken, process.env.JWT_SECRET);
    req.user = decoded;
    next();

  } catch (error) {
    return res.status(401).json({
      message: "Unauthorized: Invalid or expired token",
    });
  }
}


module.exports = identifyUser