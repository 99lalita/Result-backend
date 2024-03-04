const express = require("express");
const router = express.Router();
const {
  registerStudent,
  loginStudent,
  logoutStudent,
  refreshAuthenticationToken,
  sendVerificationCode,
  getStudentVerified,
} = require("../../../controllers/authControllers/studentAuthControllers/index");
const { body } = require("express-validator");

// complete endpoint /api/v1/auth/student/signup
router.post(
  "/signup",
  [
    body("email")
      .trim()
      .isEmail()
      .normalizeEmail()
      .withMessage("Invalid Email"),
    body("account_password")
      .trim()
      .isLength({ min: 5, max: 15 })
      .not()
      .isEmpty()
      .withMessage("Invalid Password"),
  ],
  registerStudent
);

// complete endpoint for login student => /api/v1/auth/student/login
router.post(
  "/login",
  [
    body("email")
      .trim()
      .isEmail()
      .normalizeEmail()
      .withMessage("Invalid Email"),
    body("account_password")
      .trim()
      .isLength({ min: 5, max: 15 })
      .not()
      .isEmpty()
      .withMessage("Invalid Password"),
  ],
  loginStudent
);

// complete endpoint /api/v1/auth/astudent/logout
router.post("/logout", logoutStudent);

// complete endpoint /api/v1/auth/student/refresh
router.post("/refresh", refreshAuthenticationToken);

// complete endpoint /api/v1/auth/student/send-code
router.post("/send-code", sendVerificationCode);

// complete endpoint /api/v1/auth/student/verify-user
router.post("/verify-user", getStudentVerified);

module.exports = router;
