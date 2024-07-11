const asyncHandler = require("express-async-handler");
const StudentAuthModel = require("../../../models/studentAuthModel");
const FirstYearModel = require("../../../models/studentSchemaModel/firstYearModel");
const SecondYearModel = require("../../../models/studentSchemaModel/secondYearModel");
const ThirdYearModel = require("../../../models/studentSchemaModel/thirdYearModel");
const FourthYearModel = require("../../../models/studentSchemaModel/fourthYearModel");
const { ApiError } = require("../../../utils/ApiErrors");
const { ApiResponse } = require("../../../utils/ApiResponse");
const fs = require("fs");
const path = require("path");

const jsonDataPath = __dirname + "/../../../public/temp/data_output.json";

const loadJsonData = async () => {
  try {
    const jsonData = await fs.promises.readFile(jsonDataPath, "utf-8");
    return JSON.parse(jsonData);
  } catch (error) {
    console.error("Error loading JSON data:", error);
    return null;
  }
};

function compareFields(obj1, obj2) {
  const fields = [
    "StudentID",
    "Marks_Obtained",
    "CGPA",
    "percentage",
    "resultStatus",
  ];

  const match = fields.every((key) => {
    if (obj1.hasOwnProperty(key) && obj2.hasOwnProperty(key)) {
      const value1 = obj1[key].toString().trim();
      const value2 = obj2[key].toString().trim();
      console.log(`Comparing ${key}: '${value1}' === '${value2}'`);
      return value1 === value2;
    } else {
      console.log(`Field missing in one of the objects: ${key}`);
      return false;
    }
  });

  console.log("Comparison Result:", match);
  return match;
}
const deleteFilesInDirectory = async () => {
  // Get the directory path
  const directoryPath = path.join(__dirname, "../../../public/temp");

  // Read all files in the directory
  fs.readdir(directoryPath, (err, files) => {
    if (err) {
      console.error("Error reading directory:", err);
      return;
    }

    // Delete each file in the directory
    files.forEach((file) => {
      fs.unlink(path.join(directoryPath, file), (err) => {
        if (err) {
          console.error("Error deleting file:", err);
          return;
        }
        console.log("File deleted successfully:", file);
      });
    });
  });
};

// const retrieve = asyncHandler(async (req, res) => {
//   const { StudentID, Graduation_Year } = req.body;

//   let studentData = {};

//   try {
//     const [firstYearUser] = await FirstYearModel.findStudentFirstYear(
//       StudentID,
//       Graduation_Year
//     );

//     if (firstYearUser.length != 0) {
//       studentData = { ...studentData, firstYear: firstYearUser[0] };

//       const [secondYearUser] = await SecondYearModel.findStudentSecondYear(
//         StudentID,
//         Graduation_Year
//       );

//       if (secondYearUser.length != 0) {
//         studentData = { ...studentData, secondYear: secondYearUser[0] };
//         const [thirdYearUser] = await ThirdYearModel.findStudentThirdYear(
//           StudentID,
//           Graduation_Year
//         );

//         if (thirdYearUser.length != 0) {
//           studentData = { ...studentData, thirdYear: thirdYearUser[0] };
//           const [fourthYearUser] = await FourthYearModel.findStudentFourthYear(
//             StudentID,
//             Graduation_Year
//           );

//           if (fourthYearUser.length != 0) {
//             studentData = { ...studentData, fourthYear: fourthYearUser[0] };

//             res.json({
//               status: 200,
//               message: "Student exists with all year data",
//               user: studentData,
//             });
//           } else {
//             console.log("Student Entry does not exist for fourth year");
//             res.json({
//               status: 200,
//               message: "Student exists with data up to third year only",
//               user: studentData,
//             });
//           }
//         } else {
//           console.log("Student Entry does not exist for third year");
//           res.json({
//             status: 200,
//             message: "Student exists with data up to second year only",
//             user: studentData,
//           });
//         }
//       } else {
//         console.log("Student Entry does not exist for second year");
//         res.json({
//           status: 200,
//           message: "Student exists with data up to first year only",
//           user: studentData,
//         });
//       }
//     } else {
//       console.log("Student does not exist in the first year");
//       res.json({
//         status: 200,
//         message: "Student does not exist in the database",
//         user: studentData,
//       });
//     }
//   } catch (error) {
//     console.error("Error:", error);
//     res.status(500).json({
//       status: 500,
//       message: "Internal Server Error",
//     });
//   }
// });

// const retrieve = asyncHandler(async (req, res) => {
//   const { StudentID } = req.query;

//   let studentData = {};

//   try {
//     const firstYearUser = await FirstYearModel.findStudentFirstYear(StudentID);
//     const secondYearUser = await SecondYearModel.findStudentSecondYear(
//       StudentID
//     );
//     const thirdYearUser = await ThirdYearModel.findStudentThirdYear(StudentID);
//     const fourthYearUser = await FourthYearModel.findStudentFourthYear(
//       StudentID
//     );

//     studentData = {
//       firstYear: firstYearUser,
//       secondYear: secondYearUser,
//       thirdYear: thirdYearUser,
//       fourthYear: fourthYearUser,
//     };

//     res.json({
//       status: 200,
//       message: "Student data retrieved successfully",
//       user: studentData,
//     });
//   } catch (error) {
//     console.error("Error:", error);
//     res.status(500).json({
//       status: 500,
//       message: "Internal Server Error",
//     });
//   }
// });

const retrieve = asyncHandler(async (req, res) => {
  const { enrollment_id, graduation_year } = req.body;
  const result_year = req.params.year;

  try {
    let yearResult = null;

    switch (result_year) {
      case "1":
        yearResult = await FirstYearModel.findStudentFirstYear(enrollment_id);
        break;
      case "2":
        yearResult = await SecondYearModel.findStudentSecondYear(enrollment_id);
        break;
      case "3":
        yearResult = await ThirdYearModel.findStudentThirdYear(enrollment_id);
        break;
      case "4":
        yearResult = await FourthYearModel.findStudentFourthYear(enrollment_id);
        break;
      default:
        return res.status(400).json({
          status: 400,
          message: "Invalid year",
        });
    }

    // console.log(yearResult);

    res.json({
      status: 200,
      message: `Student ${result_year} year data retrieved successfully`,
      result: yearResult.length ? yearResult : null,
    });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({
      status: 500,
      message: "Internal Server Error",
    });
  }
});

const firstYearResult = asyncHandler(async (req, res) => {
  const {
    StudentID,
    Graduation_Year,
    Marks_Obtained,
    CGPA,
    percentage,
    resultStatus,
    resultPDF,
  } = req.body;

  console.log("Received Data:", req.body);

  // Load JSON data
  const jsonData = await loadJsonData();
  console.log("Loaded JSON Data:", jsonData);

  // Check if JSON data loaded successfully
  if (!jsonData) {
    deleteFilesInDirectory();
    return res.status(500).json({
      message: "Failed to load JSON data",
    });
  }

  const fieldsMatch = compareFields(req.body, jsonData);
  console.log("Fields Match:", fieldsMatch);

  if (!fieldsMatch) {
    deleteFilesInDirectory();
    return res.status(400).json({
      message: "Field values do not match with JSON data",
    });
  }

  const newEntry = new FirstYearModel(
    StudentID,
    Graduation_Year,
    resultPDF,
    Marks_Obtained,
    CGPA,
    percentage,
    resultStatus
  );

  console.log("New Entry:", newEntry);

  try {
    const result = await newEntry.insertInFirstYear();
    deleteFilesInDirectory();
    return res.status(200).json({
      message: "Entry Created successfully!",
      result: result[0],
    });
  } catch (error) {
    console.error("Insert error:", error);
    deleteFilesInDirectory();
    return res.status(500).json({
      message: "Some error occurred",
    });
  }
});

const secondYearResult = asyncHandler(async (req, res) => {
  const {
    StudentID,
    Graduation_Year,
    Marks_Obtained,
    CGPA,
    percentage,
    resultStatus,
    resultPDF,
  } = req.body;

  // Load JSON data
  const jsonData = await loadJsonData();

  // Check if JSON data loaded successfully
  if (!jsonData) {
    deleteFilesInDirectory();
    return res.status(500).json({
      message: "Failed to load JSON data",
    });
  }

  const fieldsMatch = compareFields(req.body, jsonData);
  console.log("Fields Match:", fieldsMatch);

  if (!fieldsMatch) {
    deleteFilesInDirectory();
    return res.status(400).json({
      message: "Field values do not match with JSON data",
    });
  }

  const newEntry = new SecondYearModel(
    StudentID,
    Graduation_Year,
    resultPDF,
    Marks_Obtained,
    CGPA,
    percentage,
    resultStatus
  );
  console.log(newEntry);

  try {
    const result = await newEntry.insertInSecondYear();
    deleteFilesInDirectory(); // Ensure files are deleted after successful operation

    return res.status(200).json({
      message: "Entry Created successfully!",
      result: result[0],
    });
  } catch (error) {
    console.error("Insert error:", error);
    deleteFilesInDirectory(); // Ensure files are deleted on error

    return res.status(500).json({
      message: "Some error occurred",
    });
  }
});

const thirdYearResult = asyncHandler(async (req, res) => {
  const {
    StudentID,
    Graduation_Year,
    Marks_Obtained,
    CGPA,
    percentage,
    resultStatus,
    resultPDF,
  } = req.body;

  console.log("Received Data:", req.body);

  // Load JSON data
  const jsonData = await loadJsonData();
  console.log("Loaded JSON Data:", jsonData);

  // Check if JSON data loaded successfully
  if (!jsonData) {
    deleteFilesInDirectory();
    return res.status(500).json({
      message: "Failed to load JSON data",
    });
  }

  const fieldsMatch = compareFields(req.body, jsonData);
  console.log("Fields Match:", fieldsMatch);

  if (!fieldsMatch) {
    deleteFilesInDirectory();
    return res.status(400).json({
      message: "Field values do not match with JSON data",
    });
  }

  const newEntry = new ThirdYearModel(
    StudentID,
    Graduation_Year,
    resultPDF,
    Marks_Obtained,
    CGPA,
    percentage,
    resultStatus
  );

  console.log("New Entry:", newEntry);

  try {
    const result = await newEntry.insertInThirdYear();
    deleteFilesInDirectory();
    return res.status(200).json({
      message: "Entry Created successfully!",
      result: result[0],
    });
  } catch (error) {
    console.error("Insert error:", error);
    deleteFilesInDirectory();
    return res.status(500).json({
      message: "Some error occurred",
    });
  }
});
const fourthYearResult = asyncHandler(async (req, res) => {
  const {
    StudentID,
    Graduation_Year,
    Marks_Obtained,
    CGPA,
    percentage,
    resultStatus,
    resultPDF,
  } = req.body;

  console.log("Received Data:", req.body);

  // Load JSON data
  const jsonData = await loadJsonData();
  console.log("Loaded JSON Data:", jsonData);

  // Check if JSON data loaded successfully
  if (!jsonData) {
    deleteFilesInDirectory();
    return res.status(500).json({
      message: "Failed to load JSON data",
    });
  }

  const fieldsMatch = compareFields(req.body, jsonData);
  console.log("Fields Match:", fieldsMatch);

  if (!fieldsMatch) {
    deleteFilesInDirectory();
    return res.status(400).json({
      message: "Field values do not match with JSON data",
    });
  }

  const newEntry = new FourthYearModel(
    StudentID,
    Graduation_Year,
    resultPDF,
    Marks_Obtained,
    CGPA,
    percentage,
    resultStatus
  );

  console.log("New Entry:", newEntry);

  try {
    const result = await newEntry.insertInFourthYear();
    deleteFilesInDirectory();
    return res.status(200).json({
      message: "Entry Created successfully!",
      result: result[0],
    });
  } catch (error) {
    console.error("Insert error:", error);
    deleteFilesInDirectory();
    return res.status(500).json({
      message: "Some error occurred",
    });
  }
});

const updateStudentPassword = asyncHandler(async (req, res, next) => {
  let currPassword = req.body.currPassword;
  let newPassword = req.body.newPassword || "";
  let cnfNewPassword = req.body.cnfNewPassword;
  let userEmail = req.email;

  if (
    newPassword.trim().length >= 5 &&
    newPassword.trim().length <= 15 &&
    newPassword.trim().length != 0
  ) {
    StudentAuthModel.findStudentByEmail(userEmail).then(([user]) => {
      bcrypt.compare(currPassword, user[0].account_password).then((isEqual) => {
        if (isEqual) {
          if (newPassword != cnfNewPassword) {
            res.json({
              message: "OK",
              matchFlag: false,
              is_password: true,
              validationFlag: true,
            });
          } else {
            bcrypt.hash(newPassword, 12).then((hashedPassword) => {
              StudentAuthModel.updateStudentPassword(
                userEmail,
                hashedPassword
              ).then((result) => {
                res.json({
                  message: "OK",
                  matchFlag: true,
                  is_password: true,
                  validationFlag: true,
                });
              });
            });
          }
        } else {
          res.json({
            message: "OK",
            is_password: false,
            validationFlag: true,
          });
        }
      });
    });
  } else {
    res.json({ message: "OK", validationFlag: false });
  }
});
module.exports = {
  firstYearResult,
  secondYearResult,
  thirdYearResult,
  fourthYearResult,
  retrieve,
  updateStudentPassword,
};
