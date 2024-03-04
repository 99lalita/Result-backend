const dbPoolConnection = require("../../config/dbConnect");

// class for admin auth model
class AdminAuthModel {
  constructor(
    admin_id,
    first_name,
    last_name,
    account_password,
    email,
    profileImageURI,
    isHOD
  ) {
    this.admin_id = admin_id;
    this.first_name = first_name;
    this.last_name = last_name;
    this.account_password = account_password;
    this.email = email;
    this.profileImageURI = profileImageURI;
    this.isHOD = isHOD;
  }

  signupAndSaveAdmin() {
    if (this.profileImageURI) {
      return dbPoolConnection.execute(
        `insert into admin (admin_id,first_name,last_name,account_password,email,profileImageURI,isHOD) VALUES(?,?,?,?,?,?,?)`,
        [
          this.admin_id,
          this.first_name,
          this.last_name,
          this.account_password,
          this.email,
          this.profileImageURI,
          this.isHOD,
        ]
      );
    } else {
      return dbPoolConnection.execute(
        `insert into admin (admin_id,first_name,last_name,account_password,email,isHOD) VALUES(?,?,?,?,?,?)`,
        [
          this.admin_id,
          this.first_name,
          this.last_name,
          this.account_password,
          this.email,
          this.isHOD,
        ]
      );
    }
  }

  static findAdminByEmail(email) {
    return dbPoolConnection.execute(`SELECT * FROM admin WHERE email = ?`, [
      email,
    ]);
  }

  static getSuperAdminCredentails() {
    return dbPoolConnection.execute(`SELECT * FROM admin WHERE isHOD = 1`);
  }
}

module.exports = AdminAuthModel;
