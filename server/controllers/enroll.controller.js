const express = require('express');
const router = express.Router();
const enrollService = require('../services/enroll.service');


router.post('/enrollcourse', (req, res) => {
    enrollService.enrollCourse(req, res);
});


router.post('/fetchenrollcourses', (req, res) => {
    enrollService.fetchEnrollCourses(req, res);
});

module.exports = router;