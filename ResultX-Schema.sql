CREATE DATABASE resultDb;

USE resultDb;

CREATE TABLE student (
	enrollment_id BIGINT NOT NULL PRIMARY KEY,
    first_name varchar(20),
    last_name varchar(30),
    admission_year YEAR(4),
    current_year YEAR(4),
    account_password varchar(30),
    email varchar(40) unique,
    graduation_year YEAR(4),
    isDSY boolean,
    profileImageURI varchar(500) DEFAULT 'https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg'
    
);

CREATE TABLE admin (
	admin_id INT NOT NULL PRIMARY KEY,
    first_name varchar(20),
    last_name varchar(30),
    account_password varchar(30),
    email varchar(40) unique,
    profileImageURI varchar(500) DEFAULT 'https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg',
    isHOD boolean
);

CREATE TABLE FirstYearResult (
    ResultID INT PRIMARY KEY AUTO_INCREMENT,
    StudentID INT,
    Graduation_Year YEAR(4),
    ResultPDF VARCHAR(500),
    Marks_Obtained DECIMAL(5,2),
    CGPA DECIMAL(5,2),
    percentage DECIMAL(5,2),
    resultStatus ENUM('pass', 'atkt', 'fail'),
    FOREIGN KEY (StudentID) REFERENCES Student(enrollment_id)
);

CREATE TABLE SecondYearResult (
    ResultID INT PRIMARY KEY AUTO_INCREMENT,
    StudentID INT,
    Graduation_Year YEAR, 
    ResultPDF VARCHAR(500),
    Marks_Obtained DECIMAL(5,2),
    CGPA DECIMAL(5,2),
    percentage DECIMAL(5,2),
    resultStatus ENUM('pass', 'atkt', 'fail'),
    FOREIGN KEY (StudentID) REFERENCES Student(enrollment_id)
);

CREATE TABLE ThirdYearResult (
    ResultID INT PRIMARY KEY AUTO_INCREMENT,
    StudentID INT,
    Graduation_Year YEAR, 
    ResultPDF VARCHAR(500),
    Marks_Obtained DECIMAL(5,2),
    CGPA DECIMAL(5,2),
    percentage DECIMAL(5,2),
    resultStatus ENUM('pass', 'atkt', 'fail'),
    FOREIGN KEY (StudentID) REFERENCES Student(enrollment_id)
);

CREATE TABLE FourthYearResult (
    ResultID INT PRIMARY KEY AUTO_INCREMENT,
    StudentID INT,
    Graduation_Year YEAR, 
    ResultPDF VARCHAR(500),
    Marks_Obtained DECIMAL(5,2),
    CGPA DECIMAL(5,2),
    percentage DECIMAL(5,2),
    resultStatus ENUM('pass', 'atkt', 'fail'),
    FOREIGN KEY (StudentID) REFERENCES Student(enrollment_id)
);
