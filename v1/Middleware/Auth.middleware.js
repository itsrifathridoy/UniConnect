const bcrypt = require('bcrypt');
const createError = require('http-errors');
const db = require('../services/db');
const helper = require('../util/helper')
const { registerSchema, loginSchema } = require('../util/validation_schema');


async function encryptPassword(request, response, next) {
  try {
    // schema validation for register
    // await used to wait for the promise to resolve
    // ValidateAsync is return a promise
    // async function always return a promise ValidateAsync
    // is async function of joi library. so we need to add await
    // before calling it. And if we are using await then we need to
    // use async function. so we add asycn before the function name.
    const validate = await registerSchema.validateAsync(request.body);
    // generate salt for hashing password. 10 is the number of rounds
    // to generate the salt. The more the rounds the more secure the
    // password will be but it will take more time to generate the hash
    // password.
    const salt = await bcrypt.genSalt(10);
    // hash the password with the generated salt. 
    // request.body.password is the password that we get from the user
    // and salt is the generated salt.
    // brycrpt.hash function hash the password with the salt.
    const hashPassword = await bcrypt.hash(request.body.password, salt);
    // replace the password with the hash password, so that we can store
    // the hash password in the database. we replace the password with the
    // request.body.password because we are using the same object in the
    // controller to get the password. 
    request.body.password = hashPassword;
    // call the next middleware. next is a function that is passed to the
    // middleware function. It is used to call the next middleware function
    next();
  } catch (error) {
    // if the error is of type joi then set the status to 422.
    // 422 is the status code for unprocessable entity. It means that
    // the server understands the content of the request but it was
    // unable to process the contained instructions. mainly used for
    // validation errors.
    if(error.isJoi === true) error.status = 422;
    // call the next middleware with the error. next is a function that
    // is passed to the middleware function. It is used to call the next
    // middleware function
    next(error);
  }
}


async function validateLogin(req,res,next)
{
  try {
    // schema validation for login
    const result = await loginSchema.validateAsync(req.body);
    // get the email and password from the request body
    const email = result.email;
   const password = result.password;
   // query to get the user with the email
  const query = `SELECT userID,password FROM users WHERE email = '${email}'`;
  // execute the query to get the user with the email
  // db.query function is used to execute the query
  // we write query function so that we can use the same
  // function to execute the query.
    const rows = await db.query(query);
    // helper function to check if the rows is empty or not
    // if the rows is empty then return an empty array
    // otherwise return the rows.
    const data = helper.emptyOrRows(rows);
    // if the data is empty then return an error
    // email & password not match
    // unauthorized error is used to indicate that the request
    // has not been applied because it lacks valid authentication
    // credentials for the target resource. 
    if(data.length === 0) 
    {
      // createError is used to create an error using http-errors
      // library. unauthorized function is used to create an
      // unauthorized error. It takes a message as a parameter
      // and return an error with status code 401 and message
      next(createError.Unauthorized("email & password not match"))
    }
    // compare the password with the hash password
    // data[0].password is the hash password that we get from the
    // database. password is the password that we get from the user.
    // bcrypt.compare function is used to compare the password with the
    // hash password.
    const isMatch = await bcrypt.compare(password,data[0].password)
    if(!isMatch) 
    {
      next(createError.Unauthorized("email & password not match"))
    }
    // set the userID in the request object. we set the userID in the
    // request object so that we can use the userID in the controller
    // to get the user details.
    req.userID = data[0].userID;
    next()
  } catch (error) {
    if(error.isJoi === true) error.status = 422;
    next(error)
  }
  
}
module.exports = {
  encryptPassword,
  validateLogin
};
