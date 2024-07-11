const asyncHandler = require("express-async-handler");
const bcrypt = require("bcryptjs");
const { validationResult } = require("express-validator");
const NodeCache = require("node-cache");
const AdminAuthModel = require("../../../models/adminAuthModel/index");
const jwt = require("jsonwebtoken");
const refreshTokensCache = new NodeCache();

// endpoint => /api/v1/auth/admin/signup
const registerAdmin = asyncHandler(async (req, res, next) => {
  // express validator sending result array here as validation result array
  const err0 = validationResult(req);
  if (err0.isEmpty()) {
    // fetch admin credentials from req.body
    const {
      admin_id,
      first_name,
      last_name,
      account_password,
      email,
      profileImageURI,
      isHOD,
    } = req.body;

    //   check if admin already exist in the database
    AdminAuthModel.findAdminByEmail(email)

      .then(([user]) => {
        if (user.length != 0) {
          res.json({
            status: 401,
            message: "Signup Failed ! User already exists",
          });
        } else {
          bcrypt
            .hash(account_password, 12)
            .then((hashPassword) => {
              const newUser = new AdminAuthModel(
                admin_id,
                first_name,
                last_name,
                hashPassword,
                email,
                profileImageURI,
                isHOD
              );
              newUser
                .signupAndSaveAdmin()
                .then((result) => {
                  console.log(result);
                  const userData = {
                    admin_id,
                    first_name,
                    last_name,
                    email,
                    isHOD,
                    profileImageURI,
                  };
                  const payload = {};
                  payload.email = result.email;
                  payload.account_password = result.account_password;
                  const loginAuthToken = jwt.sign(
                    payload,
                    process.env.PRIVATE_AUTH_BACKEND_TOKEN,
                    { expiresIn: "15h" }
                  );
                  const refreshAuthToken = jwt.sign(
                    payload,
                    process.env.PRIVATE_AUTH_BACKEND_REFRESH_TOKEN,
                    { expiresIn: "5h" }
                  );

                  refreshTokensCache.set(refreshAuthToken, refreshAuthToken);
                  res.json({
                    status: 201,
                    message: "Account created successfully !",
                    user: userData,
                    loginAuthToken: loginAuthToken,
                    refreshAuthToken: refreshAuthToken,
                  });
                })
                .catch((err0) => {
                  res.json({
                    status: 500,
                    message: "Signup failed",
                    result: err0,
                  });
                });
            })
            .catch((err0) => console.log(err0));
        }
      })
      .catch((err0) => console.log(err0));
  } else {
    res.json({ error: err0.array() });
  }
});

// endpoint => /api/v1/auth/admin/login
const loginAdmin = asyncHandler(async (req, res, next) => {
  const err0 = validationResult(req);
  if (err0.isEmpty()) {
    let email = req.body.email;
    let password = req.body.account_password;
    AdminAuthModel.findAdminByEmail(email).then(([user]) => {
      if (user.length != 0) {
        bcrypt
          .compare(password, user[0].account_password)
          .then((isEqual) => {
            //console.log(isEqual);
            if (isEqual) {
              const payload = {};
              payload.email = user[0].email;
              payload.password = user[0].account_password;

              const loginAuthToken = jwt.sign(
                payload,
                process.env.PRIVATE_AUTH_BACKEND_TOKEN,
                { expiresIn: "20h" }
              );
              const refreshAuthToken = jwt.sign(
                payload,
                process.env.PRIVATE_AUTH_BACKEND_REFRESH_TOKEN,
                { expiresIn: "5h" }
              );

              refreshTokensCache.set(refreshAuthToken, refreshAuthToken);
              res.json({
                status: 200,
                message: "Login successful",
                result: user[0],
                loginAuthToken: loginAuthToken,
                refreshAuthToken: refreshAuthToken,
              });
            } else {
              res.json({
                status: 401,
                message: "Invalid Email or Password",
                result: [],
              });
            }
          })
          .catch((err0) => {
            console.log(err0);
          });
      } else {
        res.json({
          status: 401,
          message: "User does not exists or account might not be verified !",
          result: -1,
        });
      }
    });
  } else {
    res.json({ error: err0.array() });
  }
});

// endpoint => /api/v1/auth/admin/logout
const logoutAdmin = asyncHandler(async (req, res, next) => {
  let token = req.body.token;
  refreshTokensCache.del(token);
  return res.json({ message: "Logged out" });
});

// endpoint => /api/v1/auth/admin/refresh
const refreshAuthenticationToken = asyncHandler((req, res, next) => {
  const refreshToken = req.body.token;

  if (!refreshToken || !refreshTokensCache.has(refreshToken)) {
    return res.json({ message: "Refresh token not found, login again" });
  }
  // If the refresh token is valid, create a new accessToken and return it.
  jwt.verify(
    refreshToken,
    process.env.PRIVATE_AUTH_BACKEND_REFRESH_TOKEN,
    (err, user) => {
      if (!err) {
        const payload = {};
        payload.email = user.email;
        payload.csrId = user.csrId;
        const accessToken = jwt.sign(
          payload,
          process.env.PRIVATE_AUTH_BACKEND_TOKEN,
          { expiresIn: "20s" }
        );
        return res.json({ success: true, accessToken });
      } else {
        return res.json({
          success: false,
          message: "Invalid refresh token",
        });
      }
    }
  );
});

// endpoint => /api/v1/auth/admin/super-admin
const loginSuperAdmin = asyncHandler(async (req, res, next) => {
  AdminAuthModel.getSuperAdminCredentails()
    .then(([user]) => {
      if (user.length != 0) {
        res.json({
          status: 200,
          message: "Super Admin credentials fetched Successfully!",
          result: user[0],
        });
      } else {
        res.json({
          status: 204,
          message: "Super Admin doesn't exist",
        });
      }
    })
    .catch((err0) => console.log(err0));
});

module.exports = {
  registerAdmin,
  loginAdmin,
  logoutAdmin,
  refreshAuthenticationToken,
  loginSuperAdmin,
};
