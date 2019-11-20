
const express = require('express');

const router = express.Router();

const chapterService = require('../services/chapter.service');


router.post('/fetchchapters', (req, res) => {
    chapterService.fetchChapters(req, res);
 });
 
router.post('/addchapter', (req, res) => {
    chapterService.addChapter(req, res);
});

router.put('/updatechapter', (req, res) => {
    chapterService.updateChapter(req, res);
});

module.exports = router;