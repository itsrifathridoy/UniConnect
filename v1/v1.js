const express = require('express');
const AuthRoute = require('./Routes/Auth.route');
const UsersRoute = require('./Routes/Users.route');
const UniversityRoute = require('./Routes/University.route')
const OrganizationRoute = require('./Routes/Organization.route');
const ClubRoute = require('./Routes/Club.route');
const StudentRoute = require('./Routes/Student.route');
const QuestionRoute = require('./Routes/Question.route');
const EventRoute = require('./Routes/Event.route');

const ProjectRoute = require('./Routes/Project.route');
const { eventSchema } = require('./util/validation_schema');
require('./util/event')


const router = express.Router();




//User Role Specific Routes
router.use('/auth', AuthRoute);
router.use('/university', UniversityRoute);
router.use('/org', OrganizationRoute);

router.use('/student', StudentRoute);


// router.use('/club', ClubRoute);

router.use('/user', UsersRoute);



//Feature Specific Routes


router.use('/question', QuestionRoute);

router.use('/project',ProjectRoute)

router.use('/event',EventRoute)


module.exports = router;