const db = require('../services/db');
const helper = require('../util/helper');
const createError = require('http-errors');
const bcrypt = require('bcrypt');
class UniversityModel{
    constructor(uniID,name,email,website,approval)
    {
        this.uniID = uniID;
        this.name = name;
        this.email = email;
        this.website = website;
        this.approval = approval;
    }
    async create()
    {
        try {
            const result = await db.query(
              `INSERT INTO university 
              (uniID, name, email,website) 
              VALUES 
              ('${this.uniID}', '${this.name}', '${this.email}', '${this.website}')`
            );
      
            return result;
          } catch (error) {
            return createError.InternalServerError(error);
          }
    }
    static async update(fields,uniID) {
        try {
          const updateFields = Object.keys(fields).map(key => `${key} = ?`).join(', ');
          const values = Object.values(fields);
          const query = `UPDATE university SET ${updateFields} WHERE uniID = ?`;
          const result = await db.query(query, [...values, uniID]);
    
          return {
            success: true,
            message: `User with ID ${uniID} updated successfully.`,
          };
        } catch (error) {
          console.error('Error in updateUser:', error);
          return {
            success: false,
            error: 'An error occurred while updating the user.',
          };
        }
      }
      
      
  static async get(uniID,field = 'uniID') {
    const query = `SELECT * FROM university WHERE ${field} = ?`;
    const rows = await db.query(query, [uniID]);
    const data = helper.emptyOrRows(rows);
    if(!data.length) return null;
    return data;
  }
  static async getRegex(uniID,field = 'uniID') {
    const query = `SELECT allowedEmails	FROM university WHERE ${field} = ?`;
    const rows = await db.query(query, [uniID]);
    const data = helper.emptyOrRows(rows);
    if(!data.length) return null;
    return data[0].allowedEmails;
  }

}
module.exports = {
    UniversityModel
}