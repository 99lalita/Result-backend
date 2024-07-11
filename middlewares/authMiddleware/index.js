const jwt = require("jsonwebtoken");
require("dotenv").config();

module.exports = (req, res, next) => {
  const authToken = req.get("Authorization").split(" ")[1] || undefined;

  // console.log("inside auth function");

  jwt.verify(
    authToken,
    process.env.PRIVATE_AUTH_BACKEND_TOKEN,
    async (err, user) => {
      if (user) {
        req.email = user.email;
        console.log("user authenticated");
        next();
      } else if (err.message === "jwt expired") {
        return res.json({
          success: false,
          message: "Access token expired",
        });
      } else {
        return res.status(403).json({ err, message: "User not authenticated" });
      }
    }
  );
};
