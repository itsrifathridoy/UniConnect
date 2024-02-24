const db = require('../services/db');
const helper = require('../util/helper');
const createError = require('http-errors');
const bcrypt = require('bcrypt');
class StudentModel{
    constructor(stuID,eduMail,uniID,department,enrollmentDate,graduationDate)
    {
        this.stuID = stuID;
        this.eduMail = eduMail;
        this.uniID = uniID;
        this.department = department;
        this.enrollmentDate = enrollmentDate;
        this.graduationDate = graduationDate;
    }
    async create()
    {
        try {
            const result = await db.query(`INSERT INTO students (stuID, eduMail, uniID, department, enrollmentDate, graduationDate) VALUES (?,?,?,?,?,?)`,[this.stuID,this.eduMail,this.uniID,this.department,this.enrollmentDate,this.graduationDate]);

            return {
                success: true,
                message: `${this.name} , Your Account Created Successfully`,
              };
          } catch (error) {
            return createError.InternalServerError(error);
          }
    }
    static async update(fields,stuID) {
        try {
          const updateFields = Object.keys(fields).map(key => `${key} = ?`).join(', ');
          const values = Object.values(fields);
          const query = `UPDATE students SET ${updateFields} WHERE stuID = ?`;
          const result = await db.query(query, [...values, stuID]);
    
          return {
            success: true,
            message: `Student with ID ${stuID} updated successfully.`,
          };
        } catch (error) {
          console.error('Error in updateUser:', error);
          return {
            success: false,
            error: 'An error occurred while updating the user.',
          };
        }
      }
      
      
  static async get(stuID,field = 'stuID') {
    const query = `SELECT * FROM students WHERE ${field} = ?`;
    const rows = await db.query(query, [stuID]);
    const data = helper.emptyOrRows(rows);
    if(!data.length) return null;
    return data;
  }

  static async getWithFilter(filters) {
    try {
      const filterClauses = Object.keys(filters).map(key => `${key} = ?`);
      const whereClause = filterClauses.length > 0 ? `WHERE ${filterClauses.join(' AND ')}` : '';

      const query = `SELECT * FROM students ${whereClause}`;
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

      const query = `SELECT * FROM students ${whereClause}`;
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
    StudentModel
}