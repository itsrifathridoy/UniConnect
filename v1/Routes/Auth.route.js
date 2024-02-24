const express = require('express');
const AuthController = require('../Controllers/Auth.Controller')
const { encryptPassword,validateLogin } = require('../Middleware/Auth.middleware');
const {onlyAdminAccess} = require('../Middleware/Admin.middleware')
const { signAccessToken,verifyAccessToken,signRefreshToken, verifyRefreshToken } = require('../util/jwt');
const router = express.Router();

router.use(express.json());

router.post('/register',encryptPassword, AuthController.register);

router.post('/login',validateLogin,AuthController.login );

router.post('/refresh-token',verifyRefreshToken,AuthController.refreshToken);

router.delete('/logout',verifyRefreshToken,AuthController.logout );

router.get('/test',verifyAccessToken,onlyAdminAccess,(req,res,next)=>{
    res.json({msg:"test"});
})



module.exports = router;