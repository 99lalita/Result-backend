const dbPoolConnection = require("../../config/dbConnect")

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
    this.StudentID = StudentID
    this.Graduation_Year = Graduation_Year
    this.ResultPDF = ResultPDF
    this.Marks_Obtained = Marks_Obtained
    this.CGPA = CGPA
    this.percentage = percentage
    this.resultStatus = resultStatus
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
    )
  }
  static findStudentSecondYear(StudentID, Graduation_Year) {
    return dbPoolConnection.execute(
      `SELECT * FROM secondyearresult WHERE StudentID = ? AND Graduation_Year = ?`,
      [StudentID, Graduation_Year]
    )
  }
}

module.exports = SecondYearModel
