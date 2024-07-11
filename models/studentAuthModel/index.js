const dbPoolConnection = require("../../config/dbConnect");

class StudentAuthModel {
  constructor(
    enrollment_id,
    first_name,
    last_name,
    admission_year,
    current_year,
    graduation_year,
    isDSY,
    email,
    account_password,
    profileImageURI
  ) {
    this.enrollment_id = enrollment_id;
    this.first_name = first_name;
    this.last_name = last_name;
    this.admission_year = admission_year;
    this.current_year = current_year;
    this.account_password = account_password;
    this.email = email;
    this.graduation_year = graduation_year;
    this.isDSY = isDSY;
    this.profileImageURI = profileImageURI;
  }

  signupAndSaveStudent() {
    if (this.profileImageURI) {
      return dbPoolConnection.execute(
        `insert into student (enrollment_id,first_name,last_name,admission_year,current_year,account_password,email,graduation_year,isDSY,profileImageURI) VALUES(?,?,?,?,?,?,?,?,?,?)`,
        [
          this.enrollment_id,
          this.first_name,
          this.last_name,
          this.admission_year,
          this.current_year,
          this.account_password,
          this.email,
          this.graduation_year,
          this.isDSY,
          this.profileImageURI,
        ]
      );
    } else {
      return dbPoolConnection.execute(
        `insert into student (enrollment_id,first_name,last_name,admission_year,current_year,account_password,email,graduation_year,isDSY) VALUES(?,?,?,?,?,?,?,?,?)`,
        [
          this.enrollment_id,
          this.first_name,
          this.last_name,
          this.admission_year,
          this.current_year,
          this.account_password,
          this.email,
          this.graduation_year,
          this.isDSY,
        ]
      );
    }
  }

  static updateStudentPassword(email, password) {
    return dbPoolConnectionCompanion.execute(
      `UPDATE student SET account_password = ? WHERE email = ?`,
      [password, email]
    );
  }

  static findStudentByEmail(email) {
    return dbPoolConnection.execute(`SELECT * FROM student WHERE email = ?`, [
      email,
    ]);
  }

  static verifyStudentByCode(studentEmail) {
    return dbPoolConnection.execute(
      `UPDATE student SET verify_status = 'YES' WHERE email = ?`,
      [studentEmail]
    );
  }

  static async totalStudents(batchYear) {
    try {
      const [rows, fields] = await dbPoolConnection.execute(
        `SELECT COUNT(*) AS total_students FROM student WHERE graduation_year = ?`,
        [batchYear]
      );

      return rows[0].total_students; // Access 'total_students' instead of 'totalStudents'
    } catch (error) {
      console.error("Error fetching total students for batch:", error);
      throw error;
    }
  }
}

module.exports = StudentAuthModel;
