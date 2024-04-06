const dbPoolConnection = require("../../config/dbConnect")

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
    this.StudentID = StudentID
    this.Graduation_Year = Graduation_Year
    this.ResultPDF = ResultPDF
    this.Marks_Obtained = Marks_Obtained
    this.CGPA = CGPA
    this.percentage = percentage
    this.resultStatus = resultStatus
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
    )
  }

  static findStudentFourthYear(StudentID, Graduation_Year) {
    return dbPoolConnection.execute(
      `SELECT * FROM fourthyearresult WHERE StudentID = ? AND Graduation_Year = ?`,
      [StudentID, Graduation_Year]
    )
  }
}

module.exports = FourthYearModel
