const asyncHandler = require("express-async-handler");
const firstYearModel = require("../../models/studentSchemaModel/firstYearModel");
const SecondYearModel = require("../../models/studentSchemaModel/secondYearModel");
const ThirdYearModel = require("../../models/studentSchemaModel/thirdYearModel");
const FourthYearModel = require("../../models/studentSchemaModel/fourthYearModel");
const StudentAuthModel = require("../../models/studentAuthModel");

const getResultData = asyncHandler(async (req, res, next) => {
  try {
    // fetch the batchYear and resultYear from params
    const { batchYear, resultYear } = req.params;

    let results = [];
    let numberOfStudents = {};
    let totalStudents;
    let withBacklog;
    let withoutBacklog;
    let failStudents;
    let mean;
    let sucessfullyPassedStudents;
    let API;

    // Convert resultYear to integer
    const resultYearInt = parseInt(resultYear);

    // fetching the result from respective models
    switch (resultYearInt) {
      case 0:
        results = await firstYearModel.findFirstYearResultDataForBatch(
          batchYear
        );

        // Calculate total students, withBacklog, failStudents, mean, and API
        totalStudents = await firstYearModel.findTotalStudentsForBatch(
          batchYear
        );
        withBacklog = await firstYearModel.findStudentsWithBacklog(batchYear);
        withoutBacklog = totalStudents - withBacklog;
        failStudents = await firstYearModel.findNumberOfFailStudents(batchYear);
        mean = await firstYearModel.findMean(batchYear);
        sucessfullyPassedStudents = totalStudents - failStudents;
        API = mean * (sucessfullyPassedStudents / totalStudents);

        // Construct numberOfStudents object
        numberOfStudents = {
          totalStudents,
          mean,
          withBacklog,
          withoutBacklog,
          failStudents,
          API,
        };
        break;

      case 1:
        // Fetch results for second year
        results = await SecondYearModel.findSecondYearResultDataForBatch(
          batchYear
        );

        // Calculate total students, withBacklog, failStudents, mean, and API
        totalStudents = await SecondYearModel.findTotalStudentsForBatch(
          batchYear
        );
        withBacklog = await SecondYearModel.findStudentsWithBacklog(batchYear);
        withoutBacklog = totalStudents - withBacklog;
        failStudents = await SecondYearModel.findNumberOfFailStudents(
          batchYear
        );
        mean = await SecondYearModel.findMean(batchYear);
        sucessfullyPassedStudents = totalStudents - failStudents;
        API = mean * (sucessfullyPassedStudents / totalStudents);

        // Construct numberOfStudents object
        numberOfStudents = {
          totalStudents,
          mean,
          withBacklog,
          withoutBacklog,
          failStudents,
          API,
        };

        break;

      case 2:
        // Fetch results for third year
        results = await ThirdYearModel.findThirdYearResultDataForBatch(
          batchYear
        );
        // Calculate total students, withBacklog, failStudents, mean, and API
        totalStudents = await ThirdYearModel.findTotalStudentsForBatch(
          batchYear
        );
        withBacklog = await ThirdYearModel.findStudentsWithBacklog(batchYear);
        withoutBacklog = totalStudents - withBacklog;
        failStudents = await ThirdYearModel.findNumberOfFailStudents(batchYear);
        mean = await ThirdYearModel.findMean(batchYear);
        sucessfullyPassedStudents = totalStudents - failStudents;
        API = mean * (sucessfullyPassedStudents / totalStudents);

        // Construct numberOfStudents object
        numberOfStudents = {
          totalStudents,
          mean,
          withBacklog,
          withoutBacklog,
          failStudents,
          API,
        };
        break;

      case 3:
        // Fetch results for fourth year
        results = await FourthYearModel.findFourthYearResultDataForBatch(
          batchYear
        );

        // Finding total students in 4 years for any batch
        totalStudents = await StudentAuthModel.totalStudents(batchYear);

        // finding out total students successfully passed without any backlog
        firstYearWithBacklog = await firstYearModel.findStudentsWithBacklog(
          batchYear
        );
        firstYearFailStudents = await firstYearModel.findNumberOfFailStudents(
          batchYear
        );

        secondYearWithBacklog = await SecondYearModel.findStudentsWithBacklog(
          batchYear
        );
        secondYearFailStudents = await SecondYearModel.findNumberOfFailStudents(
          batchYear
        );

        thirdYearWithBacklog = await ThirdYearModel.findStudentsWithBacklog(
          batchYear
        );
        thirdYearFailStudents = await ThirdYearModel.findNumberOfFailStudents(
          batchYear
        );

        fourthYearWithBacklog = await FourthYearModel.findStudentsWithBacklog(
          batchYear
        );
        fourthYearFailStudents = await FourthYearModel.findNumberOfFailStudents(
          batchYear
        );

        let sucessfullyNotPassedStudents =
          firstYearFailStudents +
          firstYearWithBacklog +
          secondYearFailStudents +
          secondYearWithBacklog +
          thirdYearFailStudents +
          thirdYearWithBacklog +
          fourthYearFailStudents +
          fourthYearWithBacklog;
        sucessfullyPassedStudents =
          totalStudents - sucessfullyNotPassedStudents;

        failStudents =
          firstYearFailStudents +
          secondYearFailStudents +
          thirdYearFailStudents +
          fourthYearFailStudents;

        // Construct numberOfStudents object
        numberOfStudents = {
          totalStudents,
          sucessfullyPassedStudents,
          failStudents,
        };
        break;

      default:
        return res
          .status(404)
          .json({ success: false, error: "Invalid result year" });
    }

    // Check if any data was fetched
    if (!results || results.length === 0) {
      return res.status(200).json({
        success: false,
        message: "No student data available for this year",
      });
    }

    // Construct the final response object
    const responseData = {
      results,
      numberOfStudents,
    };

    // Send the result data to the frontend
    res.status(200).json({ success: true, data: responseData });
  } catch (error) {
    // Handle errors
    console.error("Error fetching result data:", error);
    res.status(500).json({ success: false, error: "Internal server error" });
  }
});

module.exports = { getResultData };
