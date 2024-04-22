const express = require('express');
const AuthRoute = require('./Routes/Auth.route');
const UsersRoute = require('./Routes/Users.route');
const UniversityRoute = require('./Routes/University.route')
const OrganizationRoute = require('./Routes/Organization.route');
const ClubRoute = require('./Routes/Club.route');
const StudentRoute = require('./Routes/Student.route');
const QuestionRoute = require('./Routes/Question.route');
const EventRoute = require('./Routes/Event.route');
const { EducationBoardResult } = require('../Extra/result');
const path = require('path');
var fs = require('fs');

const { re } = require('mathjs');
const cli = require('child_process');
const { verifyAccessToken } = require('./util/jwt');
const { generateDockerComposeFile } = require('./util/docker');
const ProjectController = require('./Controllers/Project.Controller');
const ProjectRoute = require('./Routes/Project.route');
const multer = require('multer');
const EventModel = require('./Models/Event.model');
const { eventSchema } = require('./util/validation_schema');
require('./util/event')
const router = express.Router();




//User Role Specific Routes
router.use('/auth', AuthRoute);

router.use('/university', UniversityRoute);
router.use('/org', OrganizationRoute);



// router.use('/club', ClubRoute);
router.use('/student', StudentRoute);

router.use('/user', UsersRoute);

// router.get('/result', async (req, res) => {
//     const result = await EducationBoardResult(req.query.exam, req.query.year, req.query.board, req.query.roll, req.query.reg);
//     res.send(result);
// });

//Feature Specific Routes


router.use('/question', QuestionRoute);

router.use('/project',ProjectRoute)

router.use('/event',EventRoute)





router.post('/test', async (req, res,next) => {
    try {
        const data = req.body;
        const validate = await eventSchema.validateAsync(data)
        console.log(validate);
        res.send(data);
    } catch (error) {
        next(error)
    }
    
})
module.exports = router;