const dbPoolConnection = require("../../config/dbConnect");

class SecondYearModel {
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

  insertInSecondYear() {
    return dbPoolConnection.execute(
      `INSERT INTO secondyearresult (StudentID, Graduation_Year, ResultPDF, Marks_Obtained, CGPA, percentage, resultStatus) VALUES (?, ?, ?, ?, ?, ?, ?)`,
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
  static async findStudentSecondYear(StudentID, Graduation_Year) {
    try {
      const [rows] = await dbPoolConnection.execute(
        `SELECT * FROM secondyearresult WHERE StudentID = ?`,
        [StudentID]
      );
      return rows;
    } catch (error) {
      console.error("Error retrieving second year data:", error);
      throw error;
    }
  }

  static async findSecondYearResultDataForBatch(batchYear) {
    try {
      // // Fetch results from the database using parameterized query
      // const [rows, fields] = await dbPoolConnection.execute(
      //   "SELECT * FROM secondyearresult WHERE Graduation_Year = ?",
      //   [batchYear]
      // );

      // // Convert buffer objects to strings
      // const formattedResults = rows.map((result) => ({
      //   ...result,
      //   ResultPDF: result.ResultPDF ? result.ResultPDF.toString("utf-8") : null,
      //   // Add more properties as needed
      // }));

      // return formattedResults;

      const [rows, fields] = await dbPoolConnection.execute(
        `SELECT 
        s.first_name As First_Name,
        s.last_name As Last_Name,
        s.enrollment_id AS student_id,
        s.isDSY As isDSY,
    f.percentage AS first_year_percentage,
    f.CGPA AS first_year_cgpa,
    f.resultStatus AS first_year_resultStatus,
    s2.percentage AS second_year_percentage,
    s2.CGPA AS second_year_cgpa,
    s2.resultStatus AS second_year_resultStatus

FROM 
    student as s
LEFT JOIN 
    FirstYearResult as f ON s.enrollment_id = f.StudentID 
LEFT JOIN 
    SecondYearResult as s2 ON s.enrollment_id = s2.StudentID 
WHERE 
    (s.graduation_year = ? OR f.Graduation_Year = ?)`,
        [batchYear, batchYear]
      );

      // Convert buffer objects to strings
      const formattedResults = rows.map((result) => ({
        First_Name: result.First_Name,
        Last_Name: result.Last_Name,
        student_id: result.student_id,
        isDSY: result.isDSY,
        first_year_percentage: result.first_year_percentage,
        first_year_cgpa: result.first_year_cgpa,
        first_year_resultStatus: result.first_year_resultStatus,
        second_year_percentage: result.second_year_percentage,
        second_year_cgpa: result.second_year_cgpa,
        second_year_resultStatus: result.second_year_resultStatus,
      }));
      return formattedResults;
    } catch (error) {
      console.error("Error fetching Second year result data:", error);
      throw error;
    }
  }

  static async findTotalStudentsForBatch(batchYear) {
    try {
      const [rows, fields] = await dbPoolConnection.execute(
        `SELECT COUNT(*) AS totalStudents FROM secondyearresult WHERE Graduation_Year = ?`,
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
        `SELECT COUNT(*) AS studentsWithBacklog FROM secondyearresult WHERE Graduation_Year = ? AND resultStatus IN ('atkt (1)', 'atkt (2)', 'atkt (3)')`,
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
        `SELECT COUNT(*) AS failstudents FROM secondyearresult WHERE Graduation_Year = ? AND resultStatus = 'atkt (3)'`,
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
        `SELECT AVG(CGPA) AS mean FROM secondyearresult WHERE Graduation_Year = ?`,
        [batchYear]
      );

      return rows[0].mean;
    } catch (error) {
      console.error("Error fetching mean:", error);
      throw error;
    }
  }
}

module.exports = SecondYearModel;
