const db = require('../services/db');
const helper = require('../util/helper');
const createError = require('http-errors');
const bcrypt = require('bcrypt');
class UniversityModel{
    constructor(uniID,name,type,email,website,approval,description)
    {
        this.uniID = uniID;
        this.name = name;
        this.type = type;
        this.email = email;
        this.website = website;
        this.approval = approval;
        this.description = description;
    }
    async create()
    {
        try {
            const result = await db.query(
              `INSERT INTO university 
              (uniID, name,type, email,website,description) 
              VALUES 
              ('${this.uniID}', '${this.name}','${this.type}', '${this.email}', '${this.website}','${this.description}')`
            );

            return {
              success: true,
              message: `Approval request send for ${this.name}. We'll contract with you within 24h via email.`,
            };
              
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
      
      
  static async get(fieldValue,field = 'uniID') {
    const query = `SELECT * FROM university WHERE ${field} = '${fieldValue}'`;
    console.log(query)
    const rows = await db.query(query);
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