-- Create users table
CREATE TABLE users (
    userID VARCHAR(255) PRIMARY KEY,
    username VARCHAR(100) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    name VARCHAR(100) NOT NULL,
    password VARCHAR(100) NOT NULL,
    role VARCHAR(50) NOT NULL
);

-- Create university table
CREATE TABLE university (
    uniID VARCHAR(255) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    website VARCHAR(255),
    allowedEmails VARCHAR(255),
    approval BOOLEAN DEFAULT FALSE,
    FOREIGN KEY (uniID) REFERENCES users(userID) ON DELETE CASCADE
);

-- Create students table
CREATE TABLE students (
    stuID VARCHAR(255) PRIMARY KEY,
    eduMail VARCHAR(255) UNIQUE NOT NULL,
    uniID VARCHAR(255) NOT NULL,
    department VARCHAR(255),
    enrollmentDate DATE,
    graduationDate DATE,
    FOREIGN KEY (stuID) REFERENCES users(userID) ON DELETE CASCADE,
    FOREIGN KEY (uniID) REFERENCES university(uniID) ON DELETE CASCADE
);

-- Create organization table
CREATE TABLE organization (
    orgID VARCHAR(255) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    website VARCHAR(255),
    approval BOOLEAN DEFAULT FALSE,
    FOREIGN KEY (orgID) REFERENCES users(userID) ON DELETE CASCADE
);

-- Create clubs table
CREATE TABLE clubs (
    clubID VARCHAR(255) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    uniID VARCHAR(255) NOT NULL,
    FOREIGN KEY (uniID) REFERENCES university(uniID) ON DELETE CASCADE,
    FOREIGN KEY (clubID) REFERENCES users(userID) ON DELETE CASCADE
);

-- Create refreshtoken table
CREATE TABLE refreshtoken (
    userID VARCHAR(255),
    token VARCHAR(500) PRIMARY KEY,
    expire_at TIMESTAMP,
    FOREIGN KEY (userID) REFERENCES users(userID) ON DELETE CASCADE
);

CREATE TABLE questions (
    quesID INT PRIMARY KEY AUTO_INCREMENT,
    userID VARCHAR(255),
    quesText TEXT NOT NULL,
    status ENUM('Pending','AI Answered','Answered', 'Closed') NOT NULL DEFAULT 'Pending',
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (userID) REFERENCES users(userID)
);

CREATE TABLE answers (
    ansID INT PRIMARY KEY AUTO_INCREMENT,
    quesID INT,
    userID VARCHAR(255),
    ansText TEXT NOT NULL,
    timestamp TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (quesID) REFERENCES questions(quesID),
    FOREIGN KEY (userID) REFERENCES users(userID)
);

CREATE TABLE feedback (
    feedbackID INT PRIMARY KEY AUTO_INCREMENT,
    ansID INT,
    userID VARCHAR(255),
    rating ENUM('Positive', 'Negative') NOT NULL,
    comment TEXT NOT NULL,
    timestamp TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (ansID) REFERENCES answers(ansID),
    FOREIGN KEY (userID) REFERENCES users(userID)
);



CREATE TABLE education_levels (
    educationLevelID INT PRIMARY KEY AUTO_INCREMENT,
    degreeName VARCHAR(255) NOT NULL,
    program VARCHAR(255) NOT NULL,
    UNIQUE (degreeName, program)
);
CREATE TABLE jobs (
    jobID INT PRIMARY KEY AUTO_INCREMENT,
    jobTitle VARCHAR(255) NOT NULL,
    orgID VARCHAR(50),
    jobLocation VARCHAR(255),
    description TEXT,
    responsibilities TEXT,
    qualifications TEXT,
    experience TEXT,
    jobType VARCHAR(50),
    salary DECIMAL(10, 2),
    lastApplyDate DATE,
    jobPostTime TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    experienceCategory VARCHAR(50),
    educationLevelID INT NOT NULL DEFAULT 0,
    FOREIGN KEY (orgID) REFERENCES organization(orgID),
    FOREIGN KEY (educationLevelID) REFERENCES education_levels(educationLevelID)
);

CREATE TABLE skills (
    skillID INT PRIMARY KEY AUTO_INCREMENT,
    skillName VARCHAR(255) NOT NULL
);

CREATE TABLE job_skills (
    jobID INT,
    skillID INT,
    skillLevel VARCHAR(50),
    PRIMARY KEY (jobID, skillID, skillLevel),
    FOREIGN KEY (jobID) REFERENCES jobs(jobID),
    FOREIGN KEY (skillID) REFERENCES skills(skillID)
);
CREATE TABLE job_applications (
    appID INT PRIMARY KEY AUTO_INCREMENT,
    jobID INT,
    stuID VARCHAR(255),
    appStatus ENUM('Pending', 'Accepted', 'Rejected') NOT NULL DEFAULT 'Pending',
    appTime TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (jobID) REFERENCES jobs(jobID),
    FOREIGN KEY (stuID) REFERENCES students(stuID)
);
CREATE TABLE students_skills (
    stuID VARCHAR(255),
    skillID INT,
    skillLevel VARCHAR(50),
    PRIMARY KEY (stuID, skillID, skillLevel),
    FOREIGN KEY (stuID) REFERENCES students(stuID),
    FOREIGN KEY (skillID) REFERENCES skills(skillID)
);
CREATE TABLE student_education (
    studentEducationID INT PRIMARY KEY AUTO_INCREMENT,
    stuID VARCHAR(255),
    educationLevelID INT,
    major VARCHAR(255),
    graduationDate DATE,
    currentYear INT,
    uniID VARCHAR(255),
    FOREIGN KEY (stuID) REFERENCES students(stuID),
    FOREIGN KEY (uniID) REFERENCES university(uniID),
    FOREIGN KEY (educationLevelID) REFERENCES education_levels(educationLevelID)
);
