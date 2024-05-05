const jwt  = require('jsonwebtoken');
const createError = require('http-errors');
const db = require('../services/db');
const moment = require('moment');
const User = require('../Models/User.model');
const { re } = require('mathjs');

function generateExpireAt(expiration) {

const currentDate = new Date();
    currentDate.setDate(currentDate.getDate() + expiration);
    const formattedDate = moment(currentDate).format('YYYY-MM-DD HH:mm:ss');
    return formattedDate; // Format: 'YYYY-MM-DD HH:mm:ss'
  }
  

module.exports =  {
    signAccessToken: (userID)=>{
        return new Promise((resolve,reject)=>{
            const payload = {
    
            }
            const secret = process.env.ACCESS_TOKEN_SECRET;
            const option = {
                expiresIn: '15m',
                issuer: "uniconnect.com",
                audience:userID,
            }
            jwt.sign(payload,secret,option,(err,token)=>{
                if(err) return reject(err)
                resolve(token);
            })
        })
    },
    verifyAccessToken: async(req,res,next)=>{
        if(!req.headers['authorization']) return next(createError.Unauthorized());
        const authHeader = req.headers['authorization']
        const bearerToken = authHeader.split(' ');
        const token = bearerToken[1];
        jwt.verify(token,process.env.ACCESS_TOKEN_SECRET,async(err,payload)=>{
            if(err){
                if(err.name === "JsonWebTokenError")
                    return next(createError.Unauthorized());
                return next(createError.Unauthorized(err.message))
            }
            const result = await db.query(`SELECT userID,username,email,name,role FROM users WHERE userID = '${payload.aud}';`);
            if(result.length===0) 
                 next(createError.Unauthorized("Invalid Access Token"));
            req.payload = payload;
            req.user  = result[0];
            next();
        });
    },
    signRefreshToken: async(userID)=>{
        return new Promise((resolve,reject)=>{
            const payload = {
                
            }
            const secret = process.env.REFRESH_TOKEN_SECRET;
            const option = {
                expiresIn: '30d',
                issuer: "uniconnect.com",
                audience:userID,
            }
            jwt.sign(payload,secret,option,async(err,token)=>{
                if(err) return reject(err)
                try {
                    const result = await db.query(`INSERT INTO refreshtoken VALUES('${userID}','${token}','${generateExpireAt(30)}');`);
                } catch (error) {
                    reject(error)
                }
                resolve(token);
            })
        })
    },
    verifyRefreshToken: async(req,res,next)=>{
        // request header should contain authorization
        // if not return unauthorized error
        if(!req.headers['authorization']) return next(createError.Unauthorized());
        // get the authorization header
        const authHeader = req.headers['authorization']
        // split the authorization header by space because it contains
        // bearer token like 'Bearer e545fdffgadgfdgfsdgdsg' so we split it by space
        const bearerToken = authHeader.split(' ');
        //after split the bearerToken contains ['Bearer','e545fdffgadgfdgfsdgdsg']
        // so we get the token from the bearer token
        // bearerToken[0] contains 'Bearer' and bearerToken[1] contains the token
        const token = bearerToken[1];
        // verify the token with the refresh token secret
        //process.env.REFRESH_TOKEN_SECRET is the secret key for the refresh token
        //we can find the secret key in the .env file
        jwt.verify(token,process.env.REFRESH_TOKEN_SECRET,async(err,payload)=>{
            if(err){
                // if the error name is JsonWebTokenError then return unauthorized error
                if(err.name === "JsonWebTokenError")
                    return next(createError.Unauthorized());
                // otherwise return unauthorized error with the error message
                return next(createError.Unauthorized(err.message))
            }
            // query to get the refresh token from the database
            // we get the refresh token from the database to check if the token
            // is valid or not
            const result = await db.query(`SELECT * FROM refreshtoken WHERE token = '${token}';`);
            // getWithFilter is a helper function that we create in the user model
            // to get the user with the filter.
            // we update req.user with the user because we need the user details
            // in the controller to get the user details.
            req.user =  await User.getWithFilter({userID: payload.aud}); 
            // if the result is empty then return unauthorized error
            if(result.length===0)
            next(createError.Unauthorized("Invalid Refresh Token"));
            req.payload = payload;
            req.refreshToken = token;
            next();
        });
    },
}