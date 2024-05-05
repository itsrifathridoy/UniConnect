const { UniversityModel } = require("../Models/University.model")
const UserModel = require('../Models/User.model');
const crypto = require('crypto');
const { universityRegSchema,universityAddEmailsSchema,verifyUniversitySchema,universityApproveSchema } = require('../util/validation_schema');
const createError = require('http-errors');
const { sendMail } = require('../services/email')
const { } = require('../Models/University.model');
const generator = require('generate-password');
const { generateDomainRegex,isEmailMatchingDomain } = require('../util/helper');
const { signAccessToken,verifyAccessToken,signRefreshToken, verifyRefreshToken } = require('../util/jwt');
const bcrypt = require('bcrypt');
const jwt  = require('jsonwebtoken');
const { access } = require("fs");
const db = require('../services/db');
const { query } = require("express");
function generateShortName(longName) {
    const words = longName.split(' ');
    const shortName = words.map(word => word.charAt(0).toLowerCase()).join('');
    return shortName;
}

module.exports = {
    register: async (req, res, next) => {
        try {
            const validate = await universityRegSchema.validateAsync(req.body);
            // get function is used to get the user with the email
            //it works like  select * from users where email = req.body.email
            const doesExist = await UserModel.getWithFilterOR({
                email: validate.email,
                website: validate.website
            });
            //if the user already exists then throw an error
            if(doesExist) throw createError.Conflict("University already has been registered");

            // generate a random unique id using crypto library
            const uniID = crypto.randomUUID();

            const salt = await bcrypt.genSalt(10);

            // validate.password is the password that we get from the user
            // validate object and req.body object are same.
            const hashPassword = await bcrypt.hash(validate.password, salt);

            // get the username from the website
            // split the website by '.' and get the first element
            // for example if the website is "uniconnect.com"
            // then the username will be "uniconnect"
            const username = validate.website.split(".")[0];

            // create a new user object with guestUniversity role
            const user  = new UserModel(uniID,username,validate.email,validate.name,hashPassword,"guestUniversity");
            // create the user in the database
            const resp = await user.create();

            // create a new university object
            const uni = new UniversityModel(uniID,validate.name,validate.type,validate.email,validate.website,0,validate.description);
            // create the university in the database
            const result = await uni.create();
            // we create user first becasue every university is also a user
            // so we need to create the user first and then the university
            // if we do reverse then we will get an error because foreign key
            // constraint will fail


        
            res.status(201).send(result);
        }
        catch (err) {
            if (err.isJoi === true) err.status = 422;
            next(err);
        }
    },
    verify: async (req, res, next) => {
        try {
            // get the token from the query parameter
            // query parameter is the parameter that is passed in the url
            // like http://localhost:2000/v1/university/verify?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhdWQiOiJ1bmljb25uZWN0IiwiaWF0IjoxNjI5MjQwNjQzLCJleHAiOjE2MjkyNDA2NjN9.7
            // in this url token is the query parameter
            // so we get the token from the query parameter

            // create a object with the token because we need to validate the token
            // with the schema.
            const reqToken = {accessToken: req.query.token}
            const validate = await verifyUniversitySchema.validateAsync(reqToken);
            // verify the token with the access token secret
            // this is followed form documentation of jwt library
            await jwt.verify(validate.accessToken,process.env.ACCESS_TOKEN_SECRET,async(err,payload)=>{
                if(err){
                    if(err.name === "JsonWebTokenError")
                        return next(createError.Unauthorized());
                    return next(createError.Unauthorized(err.message))
                }
                // get the user with the userID to check if the user exists or not
                const result = await db.query(`SELECT userID,username,email,name,role FROM users WHERE userID = '${payload.aud}';`);
                // if the user does not exists then return unauthorized error
                if(result.length===0) 
                     next(createError.Unauthorized("Invalid Verify Token"));
                
                const user  = result[0];
                // only guestUniversity can verify the account
                //so we check if the user role is guestUniversity or not
                // if not then return unauthorized error
                if(user.role !== "guestUniversity") 
                    next(createError.Unauthorized("Invalid Verify Token"));
                
                // if the user is guestUniversity then update the role to university
                await db.query(`UPDATE users SET role = 'university' WHERE userID = '${user.userID}';`);
                //send the email to the user that the account is verified
                await sendMail(user.email, "University Account Verified", `<p>Your account has been verified</p>`);
                const accessToken = await signAccessToken(user.userID);
                const refreshToken = await signRefreshToken(user.userID);
                user.role = "university";
                res.send({accessToken,refreshToken,user});
            });
        }
        catch (err) {
            next(err);
        }
    },
    approve: async (req, res, next) => {
        try {
            // validate the request body
            //approveSchema contains only uniID
            const validate = await universityApproveSchema.validateAsync(req.body);
            // get the university with the uniID
            const result = await UniversityModel.get(validate.uniID);
            // if the university does not exists then return not found error
            if (!result) throw createError.NotFound("University Not Found");
            // set the university in the request object
            // so that we can use the university in the controller
            req.uni = {
                uniID: result[0].uniID,
                name: result[0].name,
                email: result[0].email,
                website: result[0].website,
            };
            // if the university is already approved then return conflict error
            if (result[0].approval == 1)
                throw createError.Conflict(`${result[0].name} is already approved. Please check your official email`);

            // if the university is not approved then update the university
            await UniversityModel.update({ approval: 1 }, req.body.uniID);
            const accessToken = await signAccessToken(req.uni.uniID);
            const refreshToken = await signRefreshToken(req.uni.uniID);

            // HOSTNAME and PORT are the environment variables
            // which is fetched from the .env file
            // || is the logical OR operator
            // if the HOSTNAME is not present then use localhost
            const hostname = process.env.HOSTNAME || 'localhost';
            const port = process.env.PORT || 2000;
            // makeing the email verification url with the token
            // using string concatenation
            const emailURL = `http://${hostname}:${port}/v1/university/verify?token=${accessToken}`;
            // send the email to the university email
            await sendMail(req.uni.email, "University Account Approved", `<p>Click <a href="${emailURL}">here</a> to verify your account</p>`);
            res.send({ accessToken, refreshToken });
        }
        catch (err) {
            next(err);
        }
    },
    pendingApproval: async (req, res, next) => {
        try {
            const result = await UniversityModel.getPendingApproval();
            if (!result) throw createError.NotFound("No University Found");
            res.send(result);
        }
        catch (err) {
            next(err);
        }
    },
    addEmailRegex: async (req, res, next) => {
        try {
        
            const validate = await universityAddEmailsSchema.validateAsync(req.body);
            const result = await UniversityModel.getRegex(req.user.userID);
            let emailsArr = validate.emails;
            if(result) {
                emailsArr = [...new Set(result.concat(validate.emails))];            
            }
            const emails = JSON.stringify(emailsArr);            
            await UniversityModel.update({ allowedEmails: emails }, req.user.userID);
            res.send({
                status: "success",
                message: "Emails added successfully",
                emalils: JSON.parse(emails)
            })
        }
        catch (err) {
            if (err.isJoi === true) err.status = 422;
            next(err);
        }
    },
    getUniversity: async (req, res, next) => {
        try {
            const result = await UniversityModel.getAll();
            if (!result) throw createError.NotFound("No University Found");
            res.send(result);
        }
        catch (err) {
            next(err);
        }
    },
    
}