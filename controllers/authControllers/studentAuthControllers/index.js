const asyncHandler = require("express-async-handler");
const StudentAuthModel = require("../../../models/studentAuthModel");
const bcrypt = require("bcryptjs");
const { validationResult } = require("express-validator");
const dotenv = require("dotenv");
dotenv.config();
const jwt = require("jsonwebtoken");
const NodeCache = require("node-cache");

const refreshTokensCache = new NodeCache();

// endpoint => /api/v1/auth/student/signup
const registerStudent = asyncHandler(async (req, res, next) => {
  // express validator sending result array here as validation result array
  const err0 = validationResult(req);
  if (err0.isEmpty()) {
    // fetch student credentials from req.body
    const {
      enrollment_id,
      first_name,
      last_name,
      email,
      admission_year,
      current_year,
      account_password,
      graduation_year,
      isDSY,
      profileImageURI,
    } = req.body;

    //   check if student already exist in the database
    StudentAuthModel.findStudentByEmail(email)

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
              const newUser = new StudentAuthModel(
                enrollment_id,
                first_name,
                last_name,
                admission_year,
                current_year,
                graduation_year,
                isDSY,
                email,
                hashPassword,
                profileImageURI
              );
              newUser
                .signupAndSaveStudent()
                .then((result) => {
                  console.log(result);
                  const userData = {
                    enrollment_id,
                    first_name,
                    last_name,
                    email,
                    admission_year,
                    current_year,
                    graduation_year,
                    isDSY,
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

// endpoint => /api/v1/auth/student/login
const loginStudent = asyncHandler(async (req, res, next) => {
  const err0 = validationResult(req);
  if (err0.isEmpty()) {
    let email = req.body.email;
    let password = req.body.account_password;
    StudentAuthModel.findStudentByEmail(email).then(([user]) => {
      if (user.length != 0) {
        bcrypt
          .compare(password, user[0].account_password)
          .then((isEqual) => {
            // console.log(isEqual);
            if (isEqual) {
              const payload = {};
              payload.email = user[0].email;
              payload.password = user[0].account_password;

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
                status: 200,
                message: "Login successful",
                user: user[0],
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

// enpoint => /api/v1/auth/student/logout
const logoutStudent = asyncHandler(async (req, res, next) => {
  let token = req.body.token;
  refreshTokensCache.del(token);
  return res.json({ message: "Logged out" });
});

// endpoint => /api/v1/auth/student/refresh
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

// endpoint => /api/v1/auth/student/send-code
const sendVerificationCode = asyncHandler(async (req, res, next) => {
  let code = Math.floor(Math.random() * 1000000);
  let userEmail = req.body.email;

  StudentAuthModel.findStudentByEmail(userEmail)
    .then(([user]) => {
      if (user.length != 0) {
        if (user[0].verify_status === "NO") {
          var transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
              user: "",
              pass: "",
            },
          });

          var mailOptions = {
            from: "llalitalondhe21@gmail.com",
            to: userEmail,
            subject: "Verification code for Result Analysis Application",
            text: `${code}`,
          };

          transporter.sendMail(mailOptions, function (error, info) {
            if (error) {
              res.json({ message: "Unable to send code !" });
            } else {
              res.json({ userData: user, vrCode: code, message: "OK" });
            }
          });
        } else {
          res.json({ message: "User is already verified !" });
        }
      } else {
        res.json({ message: "User doesn't exits !" });
      }
    })
    .catch((err0) => {
      res.json({ error: err0 });
    });
});

// endpoint => /api/v1/student/verify-user
const getStudentVerified = asyncHandler(async (req, res, next) => {
  let studentEmail = req.body.email;
  let enrollment_id = req.body.enrollment_id;

  StudentAuthModel.verifyStudentByCode(studentEmail)
    .then((result) => {
      const payload = {};
      payload.email = studentEmail;
      payload.enrollment_id = enrollment_id;

      const loginAuthToken = jwt.sign(
        payload,
        process.env.PRIVATE_AUTH_BACKEND_TOKEN,
        { expiresIn: "5s" }
      );
      const refreshAuthToken = jwt.sign(
        payload,
        process.env.PRIVATE_AUTH_BACKEND_REFRESH_TOKEN,
        { expiresIn: "1h" }
      );

      refreshTokensCache.set(refreshAuthToken, refreshAuthToken);
      res.json({
        status: 200,
        result: result,
        loginAuthToken: loginAuthToken,
        refreshAuthToken,
      });
    })
    .catch((err0) => {
      res.json({ error: err0 });
    });
});

module.exports = {
  registerStudent,
  loginStudent,
  logoutStudent,
  refreshAuthenticationToken,
  sendVerificationCode,
  getStudentVerified,
};
