const db = require('../services/db');
const helper = require('../util/helper');
const createError = require('http-errors');
const bcrypt = require('bcrypt');
class User {
  constructor(userID, username, email,name, password, role) {
    this.userID = userID;
    this.username = username;
    this.email = email;
    this.name = name;
    this.password = password;
    this.role = role;
  }
  async create() {
    try {
      const sql = `INSERT INTO users 
      (userID, username, email,name, password, role) 
      VALUES 
      ('${this.userID}', '${this.username}', '${this.email}', '${this.name}', '${this.password}', '${this.role}')`
      const result = await db.query(sql);

      return result;
    } catch (error) {
      return createError.InternalServerError();
    }
  }

  async update() {
    try {
      const updateFields = Object.keys(this).map(key => `${key} = ?`).join(', ');
      const values = Object.values(this);
      const query = `UPDATE users SET ${updateFields} WHERE userID = ?`;
      const result = await db.query(query, [...values.slice(1), this.userID]);

      return {
        success: true,
        message: `User with ID ${this.userID} updated successfully.`,
      };
    } catch (error) {
      console.error('Error in updateUser:', error);
      return {
        success: false,
        error: 'An error occurred while updating the user.',
      };
    }
  }

  async deleteUser() {
    try {
      const query = 'DELETE FROM users WHERE userID = ?';
      const result = await db.query(query, [this.userID]);

      if (result.affectedRows > 0) {
        return {
          success: true,
          message: `User with ID ${this.userID} deleted successfully.`,
        };
      } else {
        return {
          success: false,
          message: `User with ID ${this.userID} not found or not deleted.`,
        };
      }
    } catch (error) {
      console.error('Error in deleteUser:', error);
      return {
        success: false,
        error: 'An error occurred while deleting the user.',
      };
    }
  }

  async get(field = 'userID') {
    const query = `SELECT userID, username, email, role FROM users WHERE ${field} = ?`;
    const rows = await db.query(query, [this[field]]);
    const data = helper.emptyOrRows(rows);
    if(!data.length) return null;
    return {
      data,
    };
  }
  static async getWithFilter(filters) {
    try {
      const filterClauses = Object.keys(filters).map(key => `${key} = ?`);
      const whereClause = filterClauses.length > 0 ? `WHERE ${filterClauses.join(' AND ')}` : '';

      const query = `SELECT userID, username, email, role FROM users ${whereClause}`;
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

  async getMultiple(page = 1, listPerPage = 10) {
    const offset = helper.getOffset(page, listPerPage);
    const rows = await db.query(
      `SELECT userID, username, email, role FROM users LIMIT ${offset},${listPerPage}`
    );
    const data = helper.emptyOrRows(rows);
    const meta = { page };
    return {
      data,
      meta,
    };
  }
}

module.exports = User;
