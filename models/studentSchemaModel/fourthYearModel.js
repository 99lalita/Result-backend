const dbPoolConnection = require("../../config/dbConnect");

class FourthYearModel {
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

  insertInFourthYear() {
    return dbPoolConnection.execute(
      `INSERT INTO fourthyearresult (StudentID, Graduation_Year, ResultPDF, Marks_Obtained, CGPA, percentage, resultStatus) VALUES (?, ?, ?, ?, ?, ?, ?)`,
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

  static async findStudentFourthYear(StudentID, Graduation_Year) {
    try {
      const [rows] = await dbPoolConnection.execute(
        `SELECT * FROM fourthyearresult WHERE StudentID = ?`,
        [StudentID]
      );
      return rows;
    } catch (error) {
      console.error("Error retrieving fourth year data:", error);
      throw error;
    }
  }

  static async findFourthYearResultDataForBatch(batchYear) {
    try {
      const [rows, fields] = await dbPoolConnection.execute(
        `SELECT 
    s.enrollment_id AS student_id,
    s.first_name As First_Name,
    s.last_name As Last_Name,
    s.isDSY As isDSY,
    f.percentage AS first_year_percentage,
    f.CGPA AS first_year_cgpa,
    f.resultStatus AS first_year_resultStatus,
    s2.percentage AS second_year_percentage,
    s2.CGPA AS second_year_cgpa,
    s2.resultStatus AS second_year_resultStatus,
    t.percentage AS third_year_percentage,
    t.CGPA AS third_year_cgpa,
    t.resultStatus AS third_year_resultStatus,
    fr.percentage AS fourth_year_percentage,
    fr.CGPA AS fourth_year_cgpa,
    fr.resultStatus AS fourth_year_resultStatus
FROM 
    student s
LEFT JOIN 
    FirstYearResult f ON s.enrollment_id = f.StudentID AND s.graduation_year = f.Graduation_Year
LEFT JOIN 
    SecondYearResult s2 ON s.enrollment_id = s2.StudentID AND s.graduation_year = s2.Graduation_Year
LEFT JOIN 
    ThirdYearResult t ON s.enrollment_id = t.StudentID AND s.graduation_year = t.Graduation_Year
LEFT JOIN 
    FourthYearResult fr ON s.enrollment_id = fr.StudentID AND s.graduation_year = fr.Graduation_Year
WHERE 
    (s.graduation_year = ? OR f.Graduation_Year = ?)`,
        [batchYear, batchYear]
      );

      // Convert buffer objects to strings
      const formattedResults = rows.map((result) => ({
        student_id: result.student_id,
        First_Name: result.First_Name,
        Last_Name: result.Last_Name,
        isDSY: result.isDSY,
        first_year_percentage: result.first_year_percentage,
        first_year_cgpa: result.first_year_cgpa,
        first_year_resultStatus: result.first_year_resultStatus,
        second_year_percentage: result.second_year_percentage,
        second_year_cgpa: result.second_year_cgpa,
        second_year_resultStatus: result.second_year_resultStatus,
        third_year_percentage: result.third_year_percentage,
        third_year_cgpa: result.third_year_cgpa,
        third_year_resultStatus: result.third_year_resultStatus,
        fourth_year_percentage: result.fourth_year_percentage,
        fourth_year_cgpa: result.fourth_year_cgpa,
        fourth_year_resultStatus: result.fourth_year_resultStatus,
      }));
      return formattedResults;
    } catch (error) {
      console.error("Error fetching first year result data:", error);
      throw error;
    }
  }

  static async successfullyPassedWithoutAnyBacklog(batchYear) {
    try {
      const [rows, fields] = await dbPoolConnection.execute(
        `SELECT COUNT(*) AS successful_students
            FROM student s
            WHERE s.graduation_year = ? 
            AND NOT EXISTS (
                SELECT 1 FROM firstYearResult WHERE StudentID = s.enrollment_id AND resultStatus IN ('atkt', 'fail')
            )
            AND NOT EXISTS (
                SELECT 1 FROM secondYearResult WHERE StudentID = s.enrollment_id AND resultStatus IN ('atkt', 'fail')
            )
            AND NOT EXISTS (
                SELECT 1 FROM thirdYearResult WHERE StudentID = s.enrollment_id AND resultStatus IN ('atkt', 'fail')
            )
            AND NOT EXISTS (
                SELECT 1 FROM fourthYearResult WHERE StudentID = s.enrollment_id AND resultStatus IN ('atkt', 'fail')
            )`,
        [batchYear]
      );

      // Extracting the count of successful students
      const successfulStudentsCount = rows[0].successful_students;

      return successfulStudentsCount;
    } catch (error) {
      console.error(
        "Error fetching count of successful students without any backlog:",
        error
      );
      throw error;
    }
  }

  static async findStudentsWithBacklog(batchYear) {
    try {
      const [rows, fields] = await dbPoolConnection.execute(
        `SELECT COUNT(*) AS studentsWithBacklog FROM fourthYearResult WHERE Graduation_Year = ? AND resultStatus = 'atkt'`,
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
        `SELECT COUNT(*) AS failstudents FROM fourthYearResult WHERE Graduation_Year = ? AND resultStatus = 'fail'`,
        [batchYear]
      );

      return rows[0].failstudents;
    } catch (error) {
      console.error("Error fetching number of fail students:", error);
      throw error;
    }
  }
}

module.exports = FourthYearModel;
