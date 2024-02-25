const express = require('express');
const { encryptPassword,validateLogin } = require('../Middleware/Auth.middleware');
const { questionAccess,studentAndAdminAccess,onlyStudentAccess } = require('../Middleware/Permission.middleware');
const { verifyAccessToken } = require('../util/jwt');
const QuestionController = require('../Controllers/Question.Controller');
const { onlyAdminAccess } = require('../Middleware/Admin.middleware');
const { spamProtection,ownQuestionAccess } = require('../Middleware/Question.middleware');
const router = express.Router();

router.post('/create',verifyAccessToken,questionAccess,spamProtection,QuestionController.create);
router.put('/update',verifyAccessToken,questionAccess,ownQuestionAccess,QuestionController.update);
router.delete('/delete',verifyAccessToken,studentAndAdminAccess,ownQuestionAccess,QuestionController.delete);
router.get('/get',verifyAccessToken,QuestionController.getAll);
router.get('/get/:id',verifyAccessToken,QuestionController.get);
router.get('/own',verifyAccessToken,onlyStudentAccess,QuestionController.getOwnQuestions);
router.get('/get/user/:id',verifyAccessToken,QuestionController.getUsersQuestions);

module.exports = router;