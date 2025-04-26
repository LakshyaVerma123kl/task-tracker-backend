const jwt = require("jsonwebtoken");

const authMiddleware = async (req, res, next) => {
  const tokenFromHeader =
    req.header("Authorization")?.replace("Bearer ", "") || null;
  const tokenFromCookie = req.cookies ? req.cookies.token : null;
  const token = tokenFromHeader || tokenFromCookie;
  if (!token) {
    return res.status(401).json({ message: "No token, authorization denied" });
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = { id: decoded.userId };
    next();
  } catch (err) {
    res.status(401).json({ message: "Token is invalid" });
  }
};

module.exports = authMiddleware;
