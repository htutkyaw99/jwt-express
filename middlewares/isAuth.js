const jwt = require("jsonwebtoken");

const isAuthorize = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (authHeader) {
    const token = authHeader.split(" ")[1];

    jwt.verify(token, "naychi", (err, user) => {
      if (err) {
        return res.status(403).json({ message: "Your token is not valid" });
      }
      req.user = user;
      next();
    });
  } else {
    return res.status(401).json({ message: "You are not authenticated" });
  }
};

module.exports = isAuthorize;
