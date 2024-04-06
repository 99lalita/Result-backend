const asyncHandler = require("express-async-handler")
const StudentAuthModel = require("../../../models/studentAuthModel")
const FirstYearModel = require("../../../models/studentSchemaModel/firstYearModel")
const SecondYearModel = require("../../../models/studentSchemaModel/secondYearModel")
const ThirdYearModel = require("../../../models/studentSchemaModel/thirdYearModel")
const FourthYearModel = require("../../../models/studentSchemaModel/fourthYearModel")
const { ApiError } = require("../../../utils/ApiErrors")
const { ApiResponse } = require("../../../utils/ApiResponse")
const fs = require("fs")
const path = require("path")

const jsonDataPath = __dirname + "/../../../public/temp/data_output.json"

const loadJsonData = async () => {
  try {
    const jsonData = await fs.promises.readFile(jsonDataPath, "utf-8")
    return JSON.parse(jsonData)
  } catch (error) {
    console.error("Error loading JSON data:", error)
    return null
  }
}

function compareFields(obj1, obj2) {
  const fields = [
    "StudentID",
    "Marks_Obtained",
    "CGPA",
    "percentage",
    "resultStatus",
  ]
  return fields.every((key) => {
    if (obj1.hasOwnProperty(key) && obj2.hasOwnProperty(key)) {
      return obj1[key] === obj2[key]
    } else {
      return false
    }
  })
}

const deleteFilesInDirectory = async () => {
  // Get the directory path
  const directoryPath = path.join(__dirname, "../../../public/temp")

  // Read all files in the directory
  fs.readdir(directoryPath, (err, files) => {
    if (err) {
      console.error("Error reading directory:", err)
      return
    }

    // Delete each file in the directory
    files.forEach((file) => {
      fs.unlink(path.join(directoryPath, file), (err) => {
        if (err) {
          console.error("Error deleting file:", err)
          return
        }
        console.log("File deleted successfully:", file)
      })
    })
  })
}

const retrieve = asyncHandler(async (req, res) => {
  const { StudentID, Graduation_Year } = req.body
  let studentData = {} // Initialize an empty object to store the user data for all years

  try {
    const [firstYearUser] = await FirstYearModel.findStudentFirstYear(
      StudentID,
      Graduation_Year
    )

    if (firstYearUser.length != 0) {
      studentData = { ...studentData, firstYear: firstYearUser[0] }

      const [secondYearUser] = await SecondYearModel.findStudentSecondYear(
        StudentID,
        Graduation_Year
      )

      if (secondYearUser.length != 0) {
        studentData = { ...studentData, secondYear: secondYearUser[0] }
        const [thirdYearUser] = await ThirdYearModel.findStudentThirdYear(
          StudentID,
          Graduation_Year
        )

        if (thirdYearUser.length != 0) {
          studentData = { ...studentData, thirdYear: thirdYearUser[0] }
          const [fourthYearUser] = await FourthYearModel.findStudentFourthYear(
            StudentID,
            Graduation_Year
          )

          if (fourthYearUser.length != 0) {
            studentData = { ...studentData, fourthYear: fourthYearUser[0] }

            res.json({
              status: 200,
              message: "Student exists with all year data",
              user: studentData,
            })
          } else {
            console.log("Student Entry does not exist for fourth year")
            res.json({
              status: 200,
              message: "Student exists with data up to third year only",
              user: studentData,
            })
          }
        } else {
          console.log("Student Entry does not exist for third year")
          res.json({
            status: 200,
            message: "Student exists with data up to second year only",
            user: studentData,
          })
        }
      } else {
        console.log("Student Entry does not exist for second year")
        res.json({
          status: 200,
          message: "Student exists with data up to first year only",
          user: studentData,
        })
      }
    } else {
      console.log("Student does not exist in the first year")
      res.json({
        status: 200,
        message: "Student does not exist in the database",
        user: studentData,
      })
    }
  } catch (error) {
    console.error("Error:", error)
    res.status(500).json({
      status: 500,
      message: "Internal Server Error",
    })
  }
})

const firstYearResult = asyncHandler(async (req, res) => {
  const {
    StudentID,
    Graduation_Year,
    Marks_Obtained,
    CGPA,
    percentage,
    resultStatus,
    resultPDF,
  } = req.body

  if (
    [Graduation_Year, Marks_Obtained, CGPA, percentage, resultStatus].some(
      (field) => field?.trim() === ""
    )
  ) {
    throw new ApiError(400, "All fields are required")
  }

  // Load JSON data
  const jsonData = await loadJsonData()

  // Check if JSON data loaded successfully
  if (!jsonData) {
    deleteFilesInDirectory()

    res.json({
      message: "Failed to load JSON data",
    })
    // throw new ApiError(500, "Failed to load JSON data");
  }

  const fieldsMatch = compareFields(req.body, jsonData)

  if (!fieldsMatch) {
    deleteFilesInDirectory()

    res.json({
      message: "Field values do not match with JSON data",
    })
    throw new ApiError(400, "Field values do not match with JSON data")
  }
  deleteFilesInDirectory()
  const newEntry = new FirstYearModel(
    StudentID,
    Graduation_Year,
    resultPDF,
    Marks_Obtained,
    CGPA,
    percentage,
    resultStatus
  )
  console.log(newEntry)

  try {
    newEntry.insertInFirstYear().then((result) => {
      res.json({
        status: 200,
        message: "Entry Created successfully!",
        result: result[0],
      })
    })
  } catch (error) {
    deleteFilesInDirectory()

    res.status(500).json({
      message: "Some error occurred",
    })
  }
})
const secondYearResult = asyncHandler(async (req, res) => {
  const {
    StudentID,
    Graduation_Year,
    Marks_Obtained,
    CGPA,
    percentage,
    resultStatus,
    resultPDF,
  } = req.body

  if (
    [Graduation_Year, Marks_Obtained, CGPA, percentage, resultStatus].some(
      (field) => field?.trim() === ""
    )
  ) {
    throw new ApiError(400, "All fields are required")
  }

  // Load JSON data
  const jsonData = await loadJsonData()

  // Check if JSON data loaded successfully
  if (!jsonData) {
    res.json({
      message: "Failed to load JSON data",
    })
    // throw new ApiError(500, "Failed to load JSON data");
  }

  const fieldsMatch = Object.keys(jsonData).every(
    (key) => req.body[key] === jsonData[key]
  )

  if (!fieldsMatch) {
    res.json({
      message: "Field values do not match with JSON data",
    })
    throw new ApiError(400, "Field values do not match with JSON data")
  }

  const newEntry = new SecondYearModel(
    StudentID,
    Graduation_Year,
    resultPDF,
    Marks_Obtained,
    CGPA,
    percentage,
    resultStatus
  )
  console.log(newEntry)

  try {
    newEntry.insertInSecondYear().then((result) => {
      // Get the directory path
      const directoryPath = path.join(__dirname, "../../../public/temp")

      // Read all files in the directory
      fs.readdir(directoryPath, (err, files) => {
        if (err) {
          console.error("Error reading directory:", err)
          return
        }

        // Delete each file in the directory
        files.forEach((file) => {
          fs.unlink(path.join(directoryPath, file), (err) => {
            if (err) {
              console.error("Error deleting file:", err)
              return
            }
            console.log("File deleted successfully:", file)
          })
        })
      })

      res.json({
        status: 200,
        message: "Entry Created successfully!",
        result: result[0],
      })
    })
  } catch (error) {
    res.status(500).json({
      message: "Some error occurred",
    })
  }
})
const thirdYearResult = asyncHandler(async (req, res) => {
  const {
    StudentID,
    Graduation_Year,
    Marks_Obtained,
    CGPA,
    percentage,
    resultStatus,
    resultPDF,
  } = req.body

  if (
    [Graduation_Year, Marks_Obtained, CGPA, percentage, resultStatus].some(
      (field) => field?.trim() === ""
    )
  ) {
    throw new ApiError(400, "All fields are required")
  }

  // Load JSON data
  const jsonData = await loadJsonData()

  // Check if JSON data loaded successfully
  if (!jsonData) {
    res.json({
      message: "Failed to load JSON data",
    })
    // throw new ApiError(500, "Failed to load JSON data");
  }

  // // Compare fields with JSON data
  // const fieldsMatch = Object.keys(jsonData).every((key) => {
  //   // Check if the key exists in both req.body and jsonData
  //   if (req.body.hasOwnProperty(key) && jsonData.hasOwnProperty(key)) {
  //     // Compare the values of the corresponding keys
  //     return req.body[key] === jsonData[key]
  //   } else {
  //     // If the key doesn't exist in one of the objects, return true to ignore it
  //     return true
  //   }
  // })
  // const fieldsMatch = Object.keys(jsonData).every(
  //   (key) => req.body[key] === jsonData[key]
  // )

  // if (!fieldsMatch) {
  //   res.json({
  //     message: "Field values do not match with JSON data",
  //   })
  // throw new ApiError(400, "Field values do not match with JSON data");
  // }

  const newEntry = new ThirdYearModel(
    StudentID,
    Graduation_Year,
    resultPDF,
    Marks_Obtained,
    CGPA,
    percentage,
    resultStatus
  )
  console.log(newEntry)

  try {
    newEntry.insertInThirdYear().then((result) => {
      // Get the directory path
      const directoryPath = path.join(__dirname, "../../../public/temp")

      // Read all files in the directory
      fs.readdir(directoryPath, (err, files) => {
        if (err) {
          console.error("Error reading directory:", err)
          return
        }

        // Delete each file in the directory
        files.forEach((file) => {
          fs.unlink(path.join(directoryPath, file), (err) => {
            if (err) {
              console.error("Error deleting file:", err)
              return
            }
            console.log("File deleted successfully:", file)
          })
        })
      })

      res.json({
        status: 200,
        message: "Entry Created successfully!",
        result: result[0],
      })
    })
  } catch (error) {
    res.status(500).json({
      message: "Some error occurred",
    })
  }
})
const fourthYearResult = asyncHandler(async (req, res) => {
  const {
    StudentID,
    Graduation_Year,
    Marks_Obtained,
    CGPA,
    percentage,
    resultStatus,
    resultPDF,
  } = req.body

  if (
    [Graduation_Year, Marks_Obtained, CGPA, percentage, resultStatus].some(
      (field) => field?.trim() === ""
    )
  ) {
    throw new ApiError(400, "All fields are required")
  }

  // Load JSON data
  const jsonData = await loadJsonData()

  // Check if JSON data loaded successfully
  if (!jsonData) {
    res.json({
      message: "Failed to load JSON data",
    })
    // throw new ApiError(500, "Failed to load JSON data");
  }

  // // Compare fields with JSON data
  // const fieldsMatch = Object.keys(jsonData).every((key) => {
  //   // Check if the key exists in both req.body and jsonData
  //   if (req.body.hasOwnProperty(key) && jsonData.hasOwnProperty(key)) {
  //     // Compare the values of the corresponding keys
  //     return req.body[key] === jsonData[key]
  //   } else {
  //     // If the key doesn't exist in one of the objects, return true to ignore it
  //     return true
  //   }
  // })
  // const fieldsMatch = Object.keys(jsonData).every(
  //   (key) => req.body[key] === jsonData[key]
  // )

  // if (!fieldsMatch) {
  //   res.json({
  //     message: "Field values do not match with JSON data",
  //   })
  // throw new ApiError(400, "Field values do not match with JSON data");
  // }

  const newEntry = new FourthYearModel(
    StudentID,
    Graduation_Year,
    resultPDF,
    Marks_Obtained,
    CGPA,
    percentage,
    resultStatus
  )
  console.log(newEntry)

  try {
    newEntry.insertInFourthYear().then((result) => {
      // Get the directory path
      const directoryPath = path.join(__dirname, "../../../public/temp")

      // Read all files in the directory
      fs.readdir(directoryPath, (err, files) => {
        if (err) {
          console.error("Error reading directory:", err)
          return
        }

        // Delete each file in the directory
        files.forEach((file) => {
          fs.unlink(path.join(directoryPath, file), (err) => {
            if (err) {
              console.error("Error deleting file:", err)
              return
            }
            console.log("File deleted successfully:", file)
          })
        })
      })

      res.json({
        status: 200,
        message: "Entry Created successfully!",
        result: result[0],
      })
    })
  } catch (error) {
    res.status(500).json({
      message: "Some error occurred",
    })
  }
})

module.exports = {
  firstYearResult,
  secondYearResult,
  thirdYearResult,
  fourthYearResult,
  retrieve,
}
