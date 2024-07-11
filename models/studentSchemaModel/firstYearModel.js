const dbPoolConnection = require("../../config/dbConnect");

class FirstYearModel {
  constructor(
    StudentID,
    Graduation_Year,
    ResultPDF,
    Marks_Obtained,
    CGPA,
    percentage,
    resultStatus
  ) {
    this.StudentID = StudentID;
    this.Graduation_Year = Graduation_Year;
    this.ResultPDF = ResultPDF;
    this.Marks_Obtained = Marks_Obtained;
    this.CGPA = CGPA;
    this.percentage = percentage;
    this.resultStatus = resultStatus;
  }

  insertInFirstYear() {
    return dbPoolConnection.execute(
      `INSERT INTO firstyearresult (StudentID, Graduation_Year, ResultPDF, Marks_Obtained, CGPA, percentage, resultStatus) VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [
        this.StudentID,
        this.Graduation_Year,
        this.ResultPDF,
        this.Marks_Obtained,
        this.CGPA,
        this.percentage,
        this.resultStatus,
      ]
    );
  }

  static async findStudentFirstYear(StudentID) {
    try {
      const [rows] = await dbPoolConnection.execute(
        `SELECT * FROM firstyearresult WHERE StudentID = ?`,
        [StudentID]
      );
      return rows;
    } catch (error) {
      console.error("Error retrieving first year data:", error);
      throw error;
    }
  }

  static async findFirstYearResultDataForBatch(batchYear) {
    try {
      // Fetch results from the database using parameterized query
      const [rows, fields] = await dbPoolConnection.execute(
        "SELECT s.first_name,s.last_name,s.enrollment_id,s.isDSY,fy.CGPA,fy.Marks_Obtained,fy.percentage,fy.resultStatus,fy.ResultPDF FROM student as s LEFT JOIN firstyearresult as fy on s.enrollment_id = fy.studentID WHERE s.Graduation_Year = ?",
        [batchYear]
      );

      // Convert buffer objects to strings
      const formattedResults = rows.map((result) => ({
        ...result,
        ResultPDF: result.ResultPDF ? result.ResultPDF.toString("utf-8") : null,
        // Add more properties as needed
      }));

      return formattedResults;
    } catch (error) {
      console.error("Error fetching first year result data:", error);
      throw error;
    }
  }

  static async findTotalStudentsForBatch(batchYear) {
    try {
      const [rows, fields] = await dbPoolConnection.execute(
        `SELECT COUNT(*) AS totalStudents FROM firstYearResult WHERE Graduation_Year = ?`,
        [batchYear]
      );

      return rows[0].totalStudents;
    } catch (error) {
      console.error("Error fetching total students for batch:", error);
      throw error;
    }
  }

  static async findStudentsWithBacklog(batchYear) {
    try {
      const [rows, fields] = await dbPoolConnection.execute(
        `SELECT COUNT(*) AS studentsWithBacklog FROM firstYearResult WHERE Graduation_Year = ? AND resultStatus = 'atkt'`,
        [batchYear]
      );

      return rows[0].studentsWithBacklog;
    } catch (error) {
      console.error("Error fetching students with backlog:", error);
      throw error;
    }
  }

  static async findNumberOfFailStudents(batchYear) {
    try {
      const [rows, fields] = await dbPoolConnection.execute(
        `SELECT COUNT(*) AS failstudents FROM firstYearResult WHERE Graduation_Year = ? AND resultStatus = 'fail'`,
        [batchYear]
      );

      return rows[0].failstudents;
    } catch (error) {
      console.error("Error fetching number of fail students:", error);
      throw error;
    }
  }

  static async findMean(batchYear) {
    try {
      const [rows, fields] = await dbPoolConnection.execute(
        `SELECT AVG(CGPA) AS mean FROM firstYearResult WHERE Graduation_Year = ?`,
        [batchYear]
      );

      return rows[0].mean;
    } catch (error) {
      console.error("Error fetching mean:", error);
      throw error;
    }
  }
}

module.exports = FirstYearModel;
