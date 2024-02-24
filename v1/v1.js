const express = require('express');
const AuthRoute = require('./Routes/Auth.route');
const UsersRoute = require('./Routes/Users.route');
const UniversityRoute = require('./Routes/University.route')
const OrganizationRoute = require('./Routes/Organization.route');
const ClubRoute = require('./Routes/Club.route');
const StudentRoute = require('./Routes/Student.route');
const router = express.Router();

router.use('/auth', AuthRoute);
router.use('/university', UniversityRoute);
router.use('/club', ClubRoute);
router.use('/student',StudentRoute);
router.use('/org', OrganizationRoute);
router.use('/users', UsersRoute);
module.exports = router;