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
      
        if(!req.baseUrl.startsWith('/v1') && !req.cookies.accessToken) return res.redirect('/login');
        if(req.baseUrl.startsWith('/v1') && !req.headers['authorization']) return next(createError.Unauthorized());
        let authHeader;
        let token;
        if(req.baseUrl.startsWith('/v1')) 
        {
            authHeader =  req.headers['authorization']
            const bearerToken = authHeader.split(' ');
            token = bearerToken[1];
        } 
        if(req.cookies.accessToken) token = req.cookies.accessToken;
        jwt.verify(token,process.env.ACCESS_TOKEN_SECRET,async(err,payload)=>{
            if(err){
                if(!req.baseUrl.startsWith('/v1'))
                {
                    res.clearCookie('accessToken');
                    res.clearCookie('refreshToken');
                    res.clearCookie('user');
                    const regenerate = await fetch('http://localhost:2000/v1/auth/refresh-token',{
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${req.cookies.refreshToken}`
                        }
                    });
                    if(!regenerate.ok) return res.redirect('/login');
                    const result = await regenerate.json();
                    console.log(result)
                    res.cookie('accessToken',result.accessToken);
                    res.cookie('refreshToken',result.refreshToken);
                    res.cookie('user',JSON.stringify(result.user));
                    return next();
                } 
                if(err.name === "JsonWebTokenError")
                    return next(createError.Unauthorized());
                return next(createError.Unauthorized(err.message))
            }
            const result = await db.query(`SELECT userID,name,username,email,name,role,avatar FROM users WHERE userID = '${payload.aud}';`);
            if(result.length===0) 
                 next(createError.Unauthorized("Invalid Access Token"));
            req.payload = payload;
            req.user  = result[0];
            console.log(req.user)
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
        if(!req.headers['authorization']) return next(createError.Unauthorized());
        const authHeader = req.headers['authorization']
        const bearerToken = authHeader.split(' ');
        const token = bearerToken[1];
        jwt.verify(token,process.env.REFRESH_TOKEN_SECRET,async(err,payload)=>{
            if(err){
                if(err.name === "JsonWebTokenError")
                    return next(createError.Unauthorized());
                return next(createError.Unauthorized(err.message))
            }
            const result = await db.query(`SELECT * FROM refreshtoken WHERE token = '${token}';`);
            req.user =  await User.getWithFilter({userID: payload.aud}); 
            if(result.length===0) 
            next(createError.Unauthorized("Invalid Refresh Token"));
            req.payload = payload;
            req.refreshToken = token;
            next();
        });
    },
}