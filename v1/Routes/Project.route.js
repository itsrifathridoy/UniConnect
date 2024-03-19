const express = require('express');
const AuthController = require('../Controllers/Auth.Controller')
const { encryptPassword,validateLogin } = require('../Middleware/Auth.middleware');
const { onlyUniversityAccess,universityAndStudentAccess } = require('../Middleware/Permission.middleware');
const { signAccessToken,verifyAccessToken,signRefreshToken, verifyRefreshToken } = require('../util/jwt');
const ClubController = require('../Controllers/Club.Controller');
const { onlyAdminAccess } = require('../Middleware/Admin.middleware');
const ProjectController = require('../Controllers/Project.Controller');
const router = express.Router();

router.post('/create/git',verifyAccessToken,ProjectController.projectFromGit);


module.exports = router;