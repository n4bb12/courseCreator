const express = require('express');
const router = express.Router();
const enrollService = require('../services/courseCreate');


router.post('/enrollcourse', (req, res) => {
    enrollService.enrollCourse(req, res);
});


router.post('/fetchenrollcourses', (req, res) => {
    enrollService.fetchEnrollCourses(req, res);
});

module.exports = router;