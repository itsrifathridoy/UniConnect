const db = require('../services/db');
const helper = require('../util/helper');
const createError = require('http-errors');
const bcrypt = require('bcrypt');
class QuestionModel{
    constructor(quesID,userID,quesText,imgPath)
    {
        this.quesID = quesID;
        this.userID = userID;
        this.quesText = quesText;
        this.imgPath = imgPath;
    }
    async create()
    {
        try {
            const result = await db.query(`INSERT INTO questions (quesID,userID,quesText,imgPath) VALUES (?,?,?,?)`,[this.quesID,this.userID,this.quesText,this.imgPath]);
            return {
                success: true,
                message: `Question Created Successfully`,
              };
          } catch (error) {
            return createError.InternalServerError(error);
          }
    }
    static async update(fields,quesID) {
        try {
          const updateFields = Object.keys(fields).map(key => `${key} = ?`).join(', ');
          const values = Object.values(fields);
          const query = `UPDATE questions SET ${updateFields} WHERE quesID = ?`;
          const result = await db.query(query, [...values, quesID]);
    
          return {
            success: true,
            message: `${quesID} updated successfully.`,
          };
        } catch (error) {
          console.error('Error in update question:', error);
          return {
            success: false,
            error: 'An error occurred while updating the question.',
          };
        }
      }

    static async delete(quesID) {
        try {
          const query = `DELETE FROM questions WHERE quesID = ?`;
          const result = await db.query(query, [quesID]);
          return {
            success: true,
            message: `${quesID} deleted successfully.`,
          };
        } catch (error) {
          console.error('Error in delete question:', error);
          return {
            success: false,
            error: 'An error occurred while deleting the question.',
          };
        }
      }
      
      
  static async get(quesID,field = 'quesID') {
    const query = `SELECT * FROM questions WHERE ${field} = ?`;
    const rows = await db.query(query, [quesID]);
    const data = helper.emptyOrRows(rows);
    if(!data.length) return null;
    return data;
  }

  static async getMultiple(page = 1, listPerPage = 10) {
    const offset = helper.getOffset(page, listPerPage);
    const rows = await db.query(
      `SELECT
      questions.quesID,
      questions.quesText,
      questions.imgPath,
      questions.status,
      questions.timestamp,
      questions.userID AS stuID,
      users.name AS studentName,
      users.username AS studentUsername,
      university.uniID,
      university.name AS universityName,
      (SELECT username FROM users WHERE userID = university.uniID) AS universityUsername
  FROM
      questions
  JOIN
      users ON questions.userID = users.userID
  JOIN
      students ON users.userID = students.stuID
  JOIN
      university ON students.uniID = university.uniID
  ORDER BY questions.timestamp DESC    
   LIMIT ${offset},${listPerPage+1}`
    );
    const data = helper.emptyOrRows(rows.slice(0, listPerPage));
    const organizedData = data.map(ques => ({
        quesID: ques.quesID,
        quesText: ques.quesText,
        imgPath: ques.imgPath,
        status: ques.status,
        timestamp: ques.timestamp,
        student: {
            stuID: ques.stuID,
            name: ques.studentName,
            username: ques.studentUsername,
        },
        university: {
            uniID: ques.uniID,
            name: ques.universityName,
            username: ques.universityUsername,
        },
    }));
    const hasNextPage = rows.length > listPerPage;

    const meta = { page, hasNextPage };
    return {
      data:organizedData,
      meta,
    };
  }

  static async getWithFilter(filters) {
    try {
      const filterClauses = Object.keys(filters).map(key => `${key} = ?`);
      const whereClause = filterClauses.length > 0 ? `WHERE ${filterClauses.join(' AND ')}` : '';

      const query = `SELECT * FROM questions ${whereClause}`;
      const values = Object.values(filters);

      const rows = await db.query(query, values);
      const data = helper.emptyOrRows(rows);
      if(!data.length) return null;
      return {
        data,
      };
    } catch (error) {
      return createError.InternalServerError();
    }
  } 
  static async getWithFilterOR(filters) {
    try {
      const filterClauses = Object.keys(filters).map(key => `${key} = ?`);
      const whereClause = filterClauses.length > 0 ? `WHERE ${filterClauses.join(' OR ')}` : '';

      const query = `SELECT * FROM questions ${whereClause}`;
      const values = Object.values(filters);

      const rows = await db.query(query, values);
      const data = helper.emptyOrRows(rows);
      if(!data.length) return null;
      return {
        data,
      };
    } catch (error) {
      return createError.InternalServerError();
    }
  }

}
module.exports = {
    QuestionModel
}