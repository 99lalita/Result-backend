const express = require("express");
const router = express.Router();
const {
  registerAdmin,
  loginAdmin,
  logoutAdmin,
  refreshAuthenticationToken,
  loginSuperAdmin,
} = require("../../../controllers/authControllers/adminAuthControlles/index");
const { body } = require("express-validator");

/* /api/v1/auth/admin */

// complete endpoint /api/v1/auth/admin/signup
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
  registerAdmin
);

// complete endpoint /api/v1/auth/admin/login
router.post(
  "/login",
  [
    body("email")
      .isEmail()
      .normalizeEmail()
      .trim()
      .withMessage("Invalid Email"),
    body("account_password")
      .trim()
      .not()
      .isEmpty()
      .isLength({ min: 5, max: 15 })
      .withMessage("Invalid Password"),
  ],
  loginAdmin
);

// complete endpoint /api/v1/auth/admin/logout
router.post("/logout", logoutAdmin);

// complete endpoint /api/v1/auth/admin/refresh
router.post("/refresh", refreshAuthenticationToken);

// complete endpoint /api/v1/auth/admin/super-admin
router.get("/super-admin", loginSuperAdmin);

module.exports = router;
