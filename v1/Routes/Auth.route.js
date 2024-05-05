const express = require('express');
const AuthController = require('../Controllers/Auth.Controller')
const { encryptPassword,validateLogin } = require('../Middleware/Auth.middleware');
const {onlyAdminAccess} = require('../Middleware/Admin.middleware')
const { signAccessToken,verifyAccessToken,signRefreshToken, verifyRefreshToken } = require('../util/jwt');
const User = require('../Models/User.model');
const router = express.Router();


// used for parsing application/json data from body, api request body
// contains json data which is parsed by this middleware

router.use(express.json());


router.post('/register',encryptPassword, AuthController.register);

router.post('/login',validateLogin,AuthController.login );

// accessToken is expired after 15 minutes
// refreshToken is expired after 30 days
// accessToken is used to access protected routes
// refreshToken is used to get new accessToken after accessToken is expired

router.post('/refresh-token',verifyRefreshToken,AuthController.refreshToken);

router.delete('/logout',verifyRefreshToken,AuthController.logout );

router.put('/change-email',verifyAccessToken,AuthController.changeEmail);





router.post('/google', async(req, res) => {
    // check if user already exists
    //{email: req.body.email} is the filter
    // it works like where clause in sql like 
    // select * from user where email = req.body.email
    const doesExist = await User.getWithFilter({ email: req.body.email });
    if(doesExist){
        const accessToken = await signAccessToken(doesExist.data[0].userID);
        const refreshToken = await signRefreshToken(doesExist.data[0].userID);
        res.json({ accessToken, refreshToken, user: doesExist.data[0] });
    }
    else{
        const username = req.body.email.split('@')[0];
        const user = new User(req.body.id,username,req.body.email,req.body.name,'','user');
        await user.create();
        delete user.password;
        const accessToken = await signAccessToken(user.userID);
        const refreshToken = await signRefreshToken(user.userID);
        res.json({ accessToken, refreshToken, user });
    }
});

router.post('/github',async(req,res)=>{
    const doesExist = await User.getWithFilter({ email: req.body.email });
    if(doesExist){
        const accessToken = await signAccessToken(doesExist.data[0].userID);
        const refreshToken = await signRefreshToken(doesExist.data[0].userID);
        res.json({ accessToken, refreshToken, user: doesExist.data[0] });
    }
    else{
        const username = req.body.email.split('@')[0];
        const user = new User(req.body.id,username,req.body.email,req.body.name,'','user');
        await user.create();
        delete user.password;
        const accessToken = await signAccessToken(user.userID);
        const refreshToken = await signRefreshToken(user.userID);
        res.json({ accessToken, refreshToken, user });
    }
});




module.exports = router;