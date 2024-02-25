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


