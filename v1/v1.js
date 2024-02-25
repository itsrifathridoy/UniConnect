const express = require('express');
const AuthRoute = require('./Routes/Auth.route');
const UsersRoute = require('./Routes/Users.route');
const UniversityRoute = require('./Routes/University.route')
const OrganizationRoute = require('./Routes/Organization.route');
const ClubRoute = require('./Routes/Club.route');
const StudentRoute = require('./Routes/Student.route');
const QuestionRoute = require('./Routes/Question.route');
const router = express.Router();

//User Role Specific Routes
router.use('/auth', AuthRoute);
router.use('/university', UniversityRoute);
router.use('/club', ClubRoute);
router.use('/student',StudentRoute);
router.use('/org', OrganizationRoute);
router.use('/users', UsersRoute);

//Feature Specific Routes
router.use('/question', QuestionRoute);

module.exports = router;