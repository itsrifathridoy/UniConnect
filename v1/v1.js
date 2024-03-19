const express = require('express');
const AuthRoute = require('./Routes/Auth.route');
const UsersRoute = require('./Routes/Users.route');
const UniversityRoute = require('./Routes/University.route')
const OrganizationRoute = require('./Routes/Organization.route');
const ClubRoute = require('./Routes/Club.route');
const StudentRoute = require('./Routes/Student.route');
const QuestionRoute = require('./Routes/Question.route');
const { EducationBoardResult } = require('../Extra/result');
var fs = require('fs');

const { re } = require('mathjs');
const cli = require('child_process');
const { verifyAccessToken } = require('./util/jwt');
const { generateDockerComposeFile } = require('./util/docker');
const ProjectController = require('./Controllers/Project.Controller');
const ProjectRoute = require('./Routes/Project.route');
require('./util/event')
const router = express.Router();

//User Role Specific Routes
router.use('/auth', AuthRoute);
router.use('/university', UniversityRoute);
router.use('/club', ClubRoute);
router.use('/student', StudentRoute);
router.use('/org', OrganizationRoute);
router.use('/users', UsersRoute);

router.get('/result', async (req, res) => {
    const result = await EducationBoardResult(req.query.exam, req.query.year, req.query.board, req.query.roll, req.query.reg);
    res.send(result);
});

//Feature Specific Routes
router.use('/question', QuestionRoute);

router.use('/project',ProjectRoute)
    // cli.exec('node --version', (err, stdout, stderr) => {
    //     if (err) throw err;
    //     // const dir = `./projects/${req.user.username}/${projectName}}`;
    //     // if (!fs.existsSync(dir)) {
    //     //     fs.mkdirSync(dir);
    //     // }
    //     res.send(stdout);
    // })



module.exports = router;