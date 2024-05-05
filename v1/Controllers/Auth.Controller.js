const createError = require('http-errors');
const UserModel = require('../Models/User.model');
const helper = require('../util/helper');
const crypto = require('crypto'); 
const db = require('../services/db');
const { registerSchema, loginSchema } = require('../util/validation_schema');
const { encryptPassword,validateLogin } = require('../Middleware/Auth.middleware');
const { signAccessToken,verifyAccessToken,signRefreshToken, verifyRefreshToken } = require('../util/jwt');
const User = require('../Models/User.model');
const { re } = require('mathjs');


module.exports = {
    register: async (req, res, next) => {  
        try{
            const {name,email,password}  = req.body;
            //rifat@mmmfd
            const username = email.split("@")[0];
            //create user
            const user = new UserModel(crypto.randomUUID(),username.toLowerCase(),email.toLowerCase(),name,password,"user");
            const doesExist = await user.get("email")
            if(doesExist) throw createError.Conflict(`${email} already been register`);
    
            const result = await user.create();
            const accessToken = await signAccessToken(user.userID); 
            const refreshToken = await signRefreshToken(user.userID);
            res.send({accessToken,refreshToken,user:
                {
                    userID: user.userID,
                    name: user.name,
                    username: user.username,
                    email: user.email,
                    role: user.role,
                    avatar: ""
                }}
                );
        }
        catch(err)
        {
            if(err.isJoi === true) err.status = 422;
            next(err);
        }
    },
    login: async (req, res, next) => {  
        try {
            const accessToken = await signAccessToken(req.userID); 
            const refreshToken = await signRefreshToken(req.userID);
            const user  = (await UserModel.getWithFilter({userID: req.userID})).data[0];
    
            res.send({
                user,
                accessToken,
                refreshToken
            });
        } catch (error) {
            next(error)
        }
        
    },
    refreshToken:  async (req, res, next) => {  
        try {
            // generate new access token and refresh token
            // req.payload.aud is the userID
            const accessToken = await signAccessToken(req.payload.aud);
             const refreshToken = await signRefreshToken(req.payload.aud);
        try {
            // delete the old refresh token
            // ${} is used to interpolate the value of the variable it's
            // kind of like string concatenation in javascript
            //delete the old refresh token from the database so that the old refresh token
            // can't be used to generate new access token
            await db.query(`DELETE FROM refreshtoken WHERE userID = '${req.payload.aud}' && token = '${req.refreshToken}';`);
        } catch (error) {
            next(error);
        }
        const user = req.user.data[0];
        // send the new access token and refresh token, and the user details
        // as a response
        res.send({accessToken,refreshToken,user})
        } catch (error) {
            next(error);
        }
        
    },
    logout: async (req, res, next) => {  
        try {
            // delete the refresh token so that the refresh token can't be used
            // to generate new access token
            await db.query(`DELETE FROM refreshtoken WHERE userID = '${req.payload.aud}' && token = '${req.refreshToken}';`);
        } catch (error) {
            next(error);
        }
        // send the message that the user has been logout successfully
        res.send({message: "logout successfully"});
    },
    changeEmail: async (req, res, next) => {
        try {
            const {email} = req.body;
            // update the email of the user
            // {email: email} is the filter to update the email of the user
            // this filter works like WHERE email = email in the query
            await UserModel.updateUser({email: email},req.user.userID);
            res.send({message: "email updated successfully"});
        } catch (error) {
            next(error);
        }
    }
}