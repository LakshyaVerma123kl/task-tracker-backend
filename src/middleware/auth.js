const jwt = require("jsonwebtoken");

const authMiddleware = async (req, res, next) => {
  // Safely extract token from header
  const tokenFromHeader =
    req.header("Authorization")?.replace("Bearer ", "") || null;
  // Safely extract token from cookies, assuming cookie-parser is used
  const tokenFromCookie = req.cookies ? req.cookies.token : null;
  console.log(
    `[${req.method} ${req.path}] Received token from header:`,
    tokenFromHeader
  );
  console.log(
    `[${req.method} ${req.path}] Received token from cookie:`,
    tokenFromCookie
  );
  const token = tokenFromHeader || tokenFromCookie;
  if (!token) {
    console.log(`[${req.method} ${req.path}] No token found, denying access`);
    return res.status(401).json({ message: "No token, authorization denied" });
  }
  try {
    console.log(`[${req.method} ${req.path}] Verifying token:`, token);
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log(`[${req.method} ${req.path}] Token decoded:`, decoded);
    req.user = { id: decoded.userId };
    next();
  } catch (err) {
    console.error(
      `[${req.method} ${req.path}] Token verification error:`,
      err.message
    );
    res.status(401).json({ message: "Token is invalid" });
  }
};

module.exports = authMiddleware;
