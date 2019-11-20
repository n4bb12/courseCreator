

const express = require('express');

const router = express.Router();

const courseService = require('../services/courseCreate');


router.post('/addContent', (req, res) => {
    courseService.addContent(req, res);
});

router.post('/getcontent', (req, res) => {
  courseService.getContent(req, res);
});

router.put('/updatecontent', (req, res) => {
  courseService.updatecontent(req, res);
});

module.exports = router;