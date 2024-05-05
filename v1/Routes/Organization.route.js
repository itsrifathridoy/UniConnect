const express = require('express');
const { onlyAdminAccess } = require('../Middleware/Admin.middleware');
const { signAccessToken,verifyAccessToken,signRefreshToken, verifyRefreshToken } = require('../util/jwt');
const OrganizationController = require('../Controllers/Organization.Controller');
const router = express.Router();



router.post('/register', OrganizationController.register);
router.post('/approve',verifyAccessToken,onlyAdminAccess,OrganizationController.approve);
router.get('/verify', OrganizationController.verify);




module.exports = router;